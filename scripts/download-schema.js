#!/usr/bin/env node

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql';

const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

async function downloadSchema() {
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getIntrospectionQuery(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: HTTP error with status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`Error: ${JSON.stringify(result.errors)}`);
    }

    // Save schema.json for Relay
    const schemaPath = path.join(process.cwd(), 'schema.json');
    fs.writeFileSync(schemaPath, JSON.stringify(result, null, 2));

    // Convert to SDL format for schema.graphql
    const schema = buildClientSchema(result.data);
    const sdl = printSchema(schema);
    
    const schemaGraphqlPath = path.join(process.cwd(), 'schema.graphql');
    fs.writeFileSync(schemaGraphqlPath, sdl);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

downloadSchema();
