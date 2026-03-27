/**
 * Example: Token Usage Tracking with Claude API
 *
 * This example demonstrates how to use the ClaudeClient wrapper
 * to automatically track and log token usage for all API requests.
 *
 * Run with: node examples/tokenTrackingExample.js
 */

import ClaudeClient from '../utils/claudeClient.js';
import { getStats, getDailyStats, calculateCost } from '../utils/tokenLogger.js';

// Initialize the wrapped Claude client
// The client automatically logs token usage for every request
const claude = new ClaudeClient({
  apiKey: process.env.ANTHROPIC_API_KEY,
  verbose: true, // Print token feedback after each request
});

/**
 * Example 1: Basic message request
 */
async function exampleBasicRequest() {
  console.log('\n--- Example 1: Basic Request ---\n');

  const response = await claude.createMessage({
    model: 'claude-opus-4-6',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: 'Explain quantum computing in 100 words.',
      },
    ],
  });

  console.log('Response:', response.content[0].text);
  console.log('Logged data:', response._tokenLog);
}

/**
 * Example 2: Streaming request
 */
async function exampleStreamingRequest() {
  console.log('\n--- Example 2: Streaming Request ---\n');

  let fullText = '';

  const response = await claude.createMessageStream(
    {
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: 'Write a short poem about code.',
        },
      ],
    },
    (chunk) => {
      process.stdout.write(chunk); // Print each chunk as it arrives
      fullText += chunk;
    }
  );

  console.log('\n\nLogged data:', response._tokenLog);
}

/**
 * Example 3: Batch requests
 */
async function exampleBatchRequests() {
  console.log('\n--- Example 3: Batch Requests ---\n');

  const requests = [
    {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'What is 2+2?' }],
    },
    {
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{ role: 'user', content: 'Explain photosynthesis.' }],
    },
    {
      model: 'claude-opus-4-6',
      max_tokens: 300,
      messages: [{ role: 'user', content: 'Write a haiku about rain.' }],
    },
  ];

  const results = await claude.createMessagesBatch(requests);

  results.forEach((result, index) => {
    if (result.success) {
      console.log(`Request ${index + 1}: Success`);
      console.log(`  Tokens: ${result.response._tokenLog.total_tokens}`);
    } else {
      console.log(`Request ${index + 1}: Failed - ${result.error}`);
    }
  });
}

/**
 * Example 4: View statistics
 */
function exampleViewStats() {
  console.log('\n--- Example 4: Aggregated Statistics ---\n');

  const stats = getStats();
  console.log('Overall Stats:', stats);

  const daily = getDailyStats();
  console.log('\nDaily Breakdown:', daily);
}

/**
 * Example 5: Cost estimation
 */
function exampleCostCalculation() {
  console.log('\n--- Example 5: Cost Estimation ---\n');

  const models = ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'];

  models.forEach((model) => {
    const cost = calculateCost(model, 1000, 500);
    console.log(
      `${model}: Input cost $${cost.inputCost}, Output cost $${cost.outputCost}, Total: $${cost.totalCost}`
    );
  });
}

/**
 * Run examples (comment out as needed)
 */
async function main() {
  try {
    // Uncomment the examples you want to run:

    // await exampleBasicRequest();
    // await exampleStreamingRequest();
    // await exampleBatchRequests();
    exampleViewStats();
    exampleCostCalculation();

    console.log('\n✅ Examples completed. Check logs/token-usage.json for full history.\n');
  } catch (error) {
    console.error('Example error:', error);
  }
}

main();
