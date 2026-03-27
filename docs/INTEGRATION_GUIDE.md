# Integration Guide - Token Tracking System

This guide shows how to integrate the token tracking system into different project contexts.

## Backend (Express Server)

### Setup

```javascript
// server.js
import express from 'express';
import ClaudeClient from '../utils/claudeClient.js';
import { getStats } from '../utils/tokenLogger.js';

const app = express();
const claude = new ClaudeClient({ verbose: false });

app.use(express.json());
```

### API Endpoint for Claude Requests

```javascript
app.post('/api/claude/generate', async (req, res) => {
  try {
    const { prompt, model = 'claude-opus-4-6', maxTokens = 1024 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await claude.createMessage({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({
      content: response.content[0].text,
      tokens_used: response._tokenLog.total_tokens,
      model: response._tokenLog.model,
    });
  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Stats Endpoint

```javascript
app.get('/api/claude/stats', (req, res) => {
  const stats = getStats();
  res.json(stats);
});
```

### Streaming Endpoint

```javascript
app.post('/api/claude/stream', async (req, res) => {
  try {
    const { prompt, model = 'claude-opus-4-6' } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await claude.createMessageStream(
      {
        model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      },
      (chunk) => {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }
    );

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Stream error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});
```

## VS Code Extension

### Setup in Extension

```javascript
// src/claudeClient.js
import ClaudeClient from '../../utils/claudeClient.js';

const claude = new ClaudeClient({ verbose: false });

export async function generateCode(prompt, model = 'claude-opus-4-6') {
  try {
    const response = await claude.createMessage({
      model,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    return {
      text: response.content[0].text,
      tokens: response._tokenLog.total_tokens,
    };
  } catch (error) {
    console.error('Claude error:', error);
    throw error;
  }
}
```

### Show Token Usage in UI

```javascript
// src/extension.ts
import * as vscode from 'vscode';
import { generateCode } from './claudeClient';

export function activate(context: vscode.ExtensionContext) {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.text = '$(pulse) Claude';
  statusBar.show();

  vscode.commands.registerCommand('claude.generate', async () => {
    const prompt = await vscode.window.showInputBox({
      prompt: 'Enter your prompt:',
    });

    if (!prompt) return;

    try {
      statusBar.text = '$(loading) Claude...';

      const { text, tokens } = await generateCode(prompt);

      // Show in editor
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit((editBuilder) => {
          editBuilder.insert(editor.selection.active, text);
        });
      }

      // Show token usage in status bar
      statusBar.text = `$(pulse) Claude - ${tokens} tokens`;

      // Show notification
      vscode.window.showInformationMessage(
        `Generated response using ${tokens} tokens`
      );
    } catch (error) {
      statusBar.text = '$(error) Claude Error';
      vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
  });

  context.subscriptions.push(statusBar);
}
```

## CLI Tool

### Interactive CLI

```javascript
// cli/askClaude.js
import ClaudeClient from '../utils/claudeClient.js';
import { getStats } from '../utils/tokenLogger.js';
import readline from 'readline';

const claude = new ClaudeClient({ verbose: true });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('Claude AI CLI - Type "exit" to quit, "stats" to see usage\n');

  while (true) {
    const input = await prompt('> ');

    if (input.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      break;
    }

    if (input.toLowerCase() === 'stats') {
      const stats = getStats();
      console.log('\n--- Token Usage Stats ---');
      console.log(`Total requests: ${stats.total_requests}`);
      console.log(`Total tokens: ${stats.total_tokens.toLocaleString()}\n`);
      continue;
    }

    try {
      const response = await claude.createMessage({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: input }],
      });

      console.log(`\n${response.content[0].text}\n`);
    } catch (error) {
      console.error(`Error: ${error.message}\n`);
    }
  }
}

main();
```

### Batch Processing

```javascript
// batch/processBatch.js
import ClaudeClient from '../utils/claudeClient.js';
import fs from 'fs';

const claude = new ClaudeClient({ verbose: false });

async function processBatch(inputFile, outputFile) {
  const prompts = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const results = [];

  console.log(`Processing ${prompts.length} prompts...`);

  const responses = await claude.createMessagesBatch(
    prompts.map((p) => ({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: p }],
    }))
  );

  responses.forEach((result, index) => {
    if (result.success) {
      results.push({
        prompt: prompts[index],
        response: result.response.content[0].text,
        tokens: result.response._tokenLog.total_tokens,
      });
    } else {
      results.push({
        prompt: prompts[index],
        error: result.error,
      });
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`Completed. Results saved to ${outputFile}`);
}

processBatch('input.json', 'output.json');
```

## NextJS Application

### API Route

```javascript
// pages/api/claude.js
import ClaudeClient from '../../utils/claudeClient.js';

const claude = new ClaudeClient({ verbose: false });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, model = 'claude-opus-4-6' } = req.body;

    const response = await claude.createMessage({
      model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    res.status(200).json({
      text: response.content[0].text,
      tokens: response._tokenLog.total_tokens,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Client Component

```javascript
// components/ClaudeChat.jsx
'use client';

import { useState } from 'react';

export default function ClaudeChat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.text);
      setTokens(data.tokens);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="mb-2">{response}</p>
          <p className="text-sm text-gray-600">Tokens used: {tokens}</p>
        </div>
      )}
    </div>
  );
}
```

## Testing & Monitoring

### Unit Tests

```javascript
// tests/claudeClient.test.js
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import ClaudeClient from '../utils/claudeClient.js';
import { clearLogs, getStats } from '../utils/tokenLogger.js';

describe('ClaudeClient', () => {
  let claude;

  beforeAll(() => {
    claude = new ClaudeClient({ verbose: false });
    clearLogs();
  });

  afterAll(() => {
    clearLogs();
  });

  it('should create a message and log tokens', async () => {
    const response = await claude.createMessage({
      model: 'claude-opus-4-6',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Say hello' }],
    });

    expect(response.content).toBeDefined();
    expect(response._tokenLog).toBeDefined();
    expect(response._tokenLog.total_tokens).toBeGreaterThan(0);
  });

  it('should aggregate statistics', async () => {
    await claude.createMessage({
      model: 'claude-opus-4-6',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Test 1' }],
    });

    await claude.createMessage({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Test 2' }],
    });

    const stats = getStats();
    expect(stats.total_requests).toBe(2);
    expect(Object.keys(stats.by_model).length).toBe(2);
  });
});
```

## Best Practices

1. **Always use `verbose: false` in production** to avoid cluttering logs
2. **Store ANTHROPIC_API_KEY securely** - never commit to git
3. **Monitor token costs** - check stats regularly to catch unexpected usage
4. **Handle errors gracefully** - wrap Claude calls in try-catch
5. **Archive old logs** - for long-running applications, periodically backup logs
6. **Cache responses** - avoid repeated requests for the same prompt
7. **Set max_tokens appropriately** - balance quality with cost

## Troubleshooting

### Logs not showing in Express

Check that the logs directory is writable and the path is correct.

### VS Code extension showing wrong token count

Ensure the token tracking system is using the same Claude client instance throughout the extension.

### Batch processing is slow

Batch requests run sequentially by design. For parallel requests, use Promise.all():

```javascript
const promises = requests.map((req) => claude.createMessage(req));
const results = await Promise.all(promises);
```

### Cost calculations seem off

Verify the pricing in `tokenLogger.js` matches current Anthropic rates. Update manually if rates change.
