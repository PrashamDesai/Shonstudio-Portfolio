# Token Usage Tracking System

A lightweight, production-ready token usage tracking system for the Anthropic Claude API. Automatically logs and monitors token consumption per request with cost estimation.

## Features

- **Automatic Token Logging** - Every API request is logged with usage data
- **Per-Request Tracking** - Capture model, input tokens, output tokens, timestamp
- **Cost Estimation** - Calculate estimated costs based on current pricing
- **Statistics & Analytics** - Aggregate data by model and day
- **CLI Tools** - View stats and manage logs from command line
- **Zero Overhead** - Minimal performance impact
- **Production-Ready** - Handles concurrency, errors, and edge cases

## File Structure

```
utils/
├── claudeClient.js      # Wrapped Anthropic client with auto-tracking
├── tokenLogger.js       # Core logging and statistics engine
└── tokenStats.js        # CLI utility for viewing stats

logs/
└── token-usage.json     # Append-only log file (auto-created)

examples/
└── tokenTrackingExample.js  # Usage examples

docs/
└── TOKEN_TRACKING.md    # This file
```

## Quick Start

### 1. Basic Usage

```javascript
import ClaudeClient from './utils/claudeClient.js';

const claude = new ClaudeClient({
  apiKey: process.env.ANTHROPIC_API_KEY,
  verbose: true, // Print token feedback after each request
});

const response = await claude.createMessage({
  model: 'claude-opus-4-6',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Your prompt here' },
  ],
});

// Token usage is automatically logged
// response._tokenLog contains the log entry
console.log(response._tokenLog);
```

### 2. View Statistics

```bash
# Overall stats
node utils/tokenStats.js stats

# Daily breakdown
node utils/tokenStats.js daily

# Log file path
node utils/tokenStats.js path
```

### 3. Programmatic Access

```javascript
import { getStats, getDailyStats, calculateCost } from './utils/tokenLogger.js';

// Get overall statistics
const stats = getStats();
console.log(stats.total_tokens);

// Get daily breakdown
const daily = getDailyStats();
console.log(daily['2026-03-27']);

// Calculate cost
const cost = calculateCost('claude-opus-4-6', 1000, 500);
console.log(cost.totalCost);
```

## API Reference

### ClaudeClient

Main wrapper around Anthropic's official SDK.

#### Constructor

```javascript
new ClaudeClient(options)
```

**Options:**
- `apiKey` (string, optional) - ANTHROPIC_API_KEY from env
- `verbose` (boolean, default: true) - Print token feedback to console

#### Methods

##### `createMessage(params)`

Create a single message request.

```javascript
const response = await claude.createMessage({
  model: 'claude-opus-4-6',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Hello' },
  ],
});

// response._tokenLog contains:
// {
//   timestamp: "2026-03-27T...",
//   model: "claude-opus-4-6",
//   input_tokens: 10,
//   output_tokens: 50,
//   total_tokens: 60
// }
```

**Returns:** API response with `_tokenLog` field attached

##### `createMessageStream(params, onChunk)`

Stream a message (for real-time output).

```javascript
const response = await claude.createMessageStream(
  {
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [...],
  },
  (chunk) => {
    process.stdout.write(chunk); // Handle each chunk
  }
);

// Token usage still logged after stream completes
console.log(response._tokenLog);
```

**Returns:** Final message with `_tokenLog`

##### `createMessagesBatch(paramsList)`

Execute multiple requests sequentially.

```javascript
const results = await claude.createMessagesBatch([
  { model: 'claude-opus-4-6', max_tokens: 100, messages: [...] },
  { model: 'claude-sonnet-4-6', max_tokens: 100, messages: [...] },
]);

results.forEach(result => {
  if (result.success) {
    console.log(result.response._tokenLog);
  } else {
    console.log(result.error);
  }
});
```

**Returns:** Array of results with `success` and `response`/`error` fields

##### `getClient()`

Access the underlying Anthropic client directly.

```javascript
const client = claude.getClient();
// Use for features not wrapped by ClaudeClient
```

---

### tokenLogger

Core logging and statistics engine.

#### Functions

##### `logTokenUsage(model, inputTokens, outputTokens, requestId)`

Log a single request's token usage.

```javascript
import { logTokenUsage } from './utils/tokenLogger.js';

const entry = logTokenUsage('claude-opus-4-6', 100, 50);
// {
//   timestamp: "2026-03-27T10:00:00.000Z",
//   model: "claude-opus-4-6",
//   input_tokens: 100,
//   output_tokens: 50,
//   total_tokens: 150
// }
```

**Parameters:**
- `model` (string) - Model name
- `inputTokens` (number) - Input token count
- `outputTokens` (number) - Output token count
- `requestId` (string, optional) - Request identifier

**Returns:** Log entry object

##### `getStats()`

Get aggregated statistics across all requests.

```javascript
const stats = getStats();
// {
//   total_requests: 42,
//   total_input_tokens: 5000,
//   total_output_tokens: 2500,
//   total_tokens: 7500,
//   by_model: {
//     "claude-opus-4-6": {
//       requests: 10,
//       input_tokens: 2000,
//       output_tokens: 1500,
//       total_tokens: 3500
//     },
//     ...
//   }
// }
```

**Returns:** Statistics object

##### `getDailyStats()`

Get token usage aggregated by date.

```javascript
const daily = getDailyStats();
// {
//   "2026-03-27": {
//     requests: 5,
//     input_tokens: 500,
//     output_tokens: 250,
//     total_tokens: 750
//   },
//   "2026-03-28": {
//     requests: 3,
//     input_tokens: 300,
//     output_tokens: 200,
//     total_tokens: 500
//   }
// }
```

**Returns:** Daily breakdown object

##### `calculateCost(model, inputTokens, outputTokens)`

Estimate cost for a given token usage.

```javascript
const cost = calculateCost('claude-opus-4-6', 1000, 500);
// {
//   model: "claude-opus-4-6",
//   inputCost: "0.015000",
//   outputCost: "0.037500",
//   totalCost: "0.052500"
// }
```

**Returns:** Cost breakdown in USD

##### `clearLogs()`

Delete all token logs (use with caution).

```javascript
clearLogs();
```

---

## Log File Format

Logs are stored in `logs/token-usage.json` as a JSON array:

```json
[
  {
    "timestamp": "2026-03-27T10:00:00.000Z",
    "model": "claude-opus-4-6",
    "input_tokens": 120,
    "output_tokens": 45,
    "total_tokens": 165
  },
  {
    "timestamp": "2026-03-27T10:05:30.000Z",
    "model": "claude-sonnet-4-6",
    "input_tokens": 200,
    "output_tokens": 150,
    "total_tokens": 350,
    "request_id": "req-12345"
  }
]
```

## Pricing Reference

Current pricing per 1M tokens (March 2026):

| Model | Input | Output |
|-------|-------|--------|
| Claude Opus 4.6 | $15 | $75 |
| Claude Sonnet 4.6 | $3 | $15 |
| Claude Haiku 4.5 | $0.80 | $4 |

Pricing is defined in `tokenLogger.js` and can be updated as rates change.

## Integration Examples

### Express Middleware

```javascript
import ClaudeClient from './utils/claudeClient.js';

const claude = new ClaudeClient({ verbose: false });

app.post('/api/generate', async (req, res) => {
  try {
    const response = await claude.createMessage({
      model: req.body.model || 'claude-opus-4-6',
      max_tokens: req.body.max_tokens || 1024,
      messages: req.body.messages,
    });

    res.json({
      content: response.content[0].text,
      tokens: response._tokenLog.total_tokens,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### VS Code Extension

```javascript
// In extension context
import ClaudeClient from '../utils/claudeClient.js';

const claude = new ClaudeClient({ verbose: false });

export async function generateCodeCompletion(prompt) {
  const response = await claude.createMessage({
    model: 'claude-opus-4-6',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  // Show token usage in status bar
  vscode.window.showInformationMessage(
    `Tokens used: ${response._tokenLog.total_tokens}`
  );

  return response.content[0].text;
}
```

### Background Job

```javascript
import ClaudeClient from './utils/claudeClient.js';
import { getStats } from './utils/tokenLogger.js';

const claude = new ClaudeClient({ verbose: false });

// Process queue
async function processQueue(items) {
  for (const item of items) {
    await claude.createMessage({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: item.prompt }],
    });
  }

  // Log daily summary
  const stats = getStats();
  console.log(`Processed ${stats.total_requests} requests, ${stats.total_tokens} tokens`);
}
```

## CLI Commands

### View Overall Statistics

```bash
node utils/tokenStats.js stats
```

Output:
```
=== Token Usage Statistics ===

Total Requests: 42
Total Input Tokens: 5,000
Total Output Tokens: 2,500
Total Tokens: 7,500

--- By Model ---

claude-opus-4-6
  Requests: 10
  Input: 2,000 | Output: 1,500
  Total: 3,500

claude-sonnet-4-6
  Requests: 32
  Input: 3,000 | Output: 1,000
  Total: 4,000
```

### View Daily Breakdown

```bash
node utils/tokenStats.js daily
```

Output:
```
=== Daily Token Usage Breakdown ===

2026-03-27
  Requests: 5
  Tokens: 750 (input: 500, output: 250)

2026-03-28
  Requests: 3
  Tokens: 500 (input: 300, output: 200)
```

### Get Log File Path

```bash
node utils/tokenStats.js path
```

### Clear All Logs

```bash
node utils/tokenStats.js clear --confirm
```

## Performance Considerations

- **Logging Overhead** - Minimal. Token logging happens after API response is received.
- **File I/O** - Synchronous writes. Safe for concurrent requests but not optimized for extreme scale.
- **Memory** - Logs are read entirely when accessing stats. For massive log files (100k+ entries), consider archiving old logs.

## Error Handling

The system gracefully handles:
- Missing API keys (delegates to Anthropic SDK)
- Network failures (thrown as expected)
- Missing/corrupted log files (recreates as needed)
- Concurrent file access (uses atomic writes)

Example:

```javascript
try {
  const response = await claude.createMessage({...});
} catch (error) {
  // API errors are thrown normally
  // Token logging does not suppress or catch errors
  console.error('API Error:', error.message);
}
```

## Troubleshooting

### Logs not being created

1. Check that `logs/` directory is writable
2. Verify ANTHROPIC_API_KEY is set
3. Ensure messages are being created successfully

### Missing token data

1. Check API response includes `usage` field
2. Verify model name is correct
3. Inspect `logs/token-usage.json` for entries

### Stats showing zero

1. Run a test request: `node examples/tokenTrackingExample.js`
2. Check `node utils/tokenStats.js path` to verify log location
3. Inspect log file directly

## License

Part of the ShonStudio Portfolio project.
