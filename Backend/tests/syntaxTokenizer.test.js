import assert from 'node:assert';
import test from 'node:test';
import { analyzeCodeMetrics } from '../Src/utils/syntaxTokenizer.js';

test('analyzeCodeMetrics: javascript keyword counting and lines', () => {
  const code = `
    import express from 'express';
    const app = express();
    const port = 3000;
    
    function start() {
      return app.listen(port);
    }
  `;
  const metrics = analyzeCodeMetrics(code, 'javascript');
  assert.strictEqual(metrics.lineCount, 9);
  assert.strictEqual(metrics.nonBlankLines, 6);
  assert.strictEqual(metrics.blankLines, 3);
  assert.strictEqual(metrics.keywords['const'], 2);
  assert.strictEqual(metrics.keywords['function'], 1);
  assert.strictEqual(metrics.keywords['return'], 1);
  assert.strictEqual(metrics.keywords['import'], 1);
});

test('analyzeCodeMetrics: python keywords', () => {
  const code = `def calculate(val):\n    if val > 0:\n        return val * 2\n    else:\n        return 0`;
  const metrics = analyzeCodeMetrics(code, 'python');
  assert.strictEqual(metrics.keywords['def'], 1);
  assert.strictEqual(metrics.keywords['if'], 1);
  assert.strictEqual(metrics.keywords['else'], 1);
  assert.strictEqual(metrics.keywords['return'], 2);
});

test('analyzeCodeMetrics: empty and non-string inputs', () => {
  const metrics = analyzeCodeMetrics(null);
  assert.strictEqual(metrics.lineCount, 0);
  assert.strictEqual(metrics.characters, 0);
  assert.deepStrictEqual(metrics.keywords, {});
});
