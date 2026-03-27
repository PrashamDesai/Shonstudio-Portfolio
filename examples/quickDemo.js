#!/usr/bin/env node

/**
 * Quick Demo: Token Tracking System
 *
 * This demo shows the token tracking system in action without requiring
 * actual API calls. It simulates token logging and displays statistics.
 *
 * Run with: node examples/quickDemo.js
 */

import { logTokenUsage, getStats, getDailyStats, calculateCost, clearLogs } from '../utils/tokenLogger.js';

console.log('🚀 Token Tracking System - Quick Demo\n');

// Simulate some API requests
console.log('📝 Simulating API requests...\n');

// Request 1: Opus model
logTokenUsage('claude-opus-4-6', 150, 80);
console.log('✓ Logged request 1: claude-opus-4-6 (150 input, 80 output)');

// Request 2: Sonnet model
logTokenUsage('claude-sonnet-4-6', 200, 120);
console.log('✓ Logged request 2: claude-sonnet-4-6 (200 input, 120 output)');

// Request 3: Haiku model
logTokenUsage('claude-haiku-4-5-20251001', 80, 40);
console.log('✓ Logged request 3: claude-haiku-4-5-20251001 (80 input, 40 output)');

// Request 4: Another Opus request
logTokenUsage('claude-opus-4-6', 250, 150);
console.log('✓ Logged request 4: claude-opus-4-6 (250 input, 150 output)');

// Request 5: Sonnet request with request ID
logTokenUsage('claude-sonnet-4-6', 100, 60, 'req-demo-12345');
console.log('✓ Logged request 5: claude-sonnet-4-6 (100 input, 60 output) [ID: req-demo-12345]\n');

// Display statistics
console.log('=== Overall Statistics ===\n');
const stats = getStats();

console.log(`Total Requests: ${stats.total_requests}`);
console.log(`Total Input Tokens: ${stats.total_input_tokens.toLocaleString()}`);
console.log(`Total Output Tokens: ${stats.total_output_tokens.toLocaleString()}`);
console.log(`Total Tokens: ${stats.total_tokens.toLocaleString()}\n`);

console.log('--- By Model ---\n');
Object.entries(stats.by_model).forEach(([model, data]) => {
  console.log(`${model}`);
  console.log(`  Requests: ${data.requests}`);
  console.log(`  Input: ${data.input_tokens.toLocaleString()} | Output: ${data.output_tokens.toLocaleString()}`);
  console.log(`  Total: ${data.total_tokens.toLocaleString()}\n`);
});

// Daily statistics
console.log('=== Daily Breakdown ===\n');
const daily = getDailyStats();
Object.entries(daily).forEach(([date, data]) => {
  console.log(`${date}`);
  console.log(`  Requests: ${data.requests}`);
  console.log(`  Total Tokens: ${data.total_tokens.toLocaleString()}\n`);
});

// Cost estimation
console.log('=== Cost Estimation ===\n');
const models = ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'];

models.forEach((model) => {
  const cost = calculateCost(model, 1000, 500);
  console.log(`${model}`);
  console.log(`  1000 input + 500 output tokens = $${cost.totalCost}`);
  console.log(`  (Input: $${cost.inputCost}, Output: $${cost.outputCost})\n`);
});

// Actual cost for the demo
console.log('=== Actual Cost for This Demo ===\n');
let totalDemoCost = 0;

stats.by_model &&
  Object.entries(stats.by_model).forEach(([model, data]) => {
    const cost = calculateCost(model, data.input_tokens, data.output_tokens);
    totalDemoCost += parseFloat(cost.totalCost);
    console.log(`${model}: $${cost.totalCost}`);
  });

console.log(`\nTotal Demo Cost: $${totalDemoCost.toFixed(6)}\n`);

console.log('✅ Demo completed successfully!\n');
console.log('💡 Next steps:');
console.log('   1. Check logs/token-usage.json to see the logged data');
console.log('   2. Run: node utils/tokenStats.js stats');
console.log('   3. Run: node utils/tokenStats.js daily');
console.log('   4. See docs/TOKEN_TRACKING.md for full documentation\n');
