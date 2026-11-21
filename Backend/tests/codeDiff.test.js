const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { computeLineDiff, applyPatch } = require('../Src/utils/codeDiff');

describe('Collaborative Code Diff Engine Tests', () => {
  test('detects identical code with no changes', () => {
    const code = 'function hello() {\n  return "world";\n}';
    const diff = computeLineDiff(code, code);
    assert.equal(diff.hasChanges, false);
    assert.equal(diff.changeCount, 0);
  });

  test('detects line modification correctly', () => {
    const v1 = 'let x = 10;\nconsole.log(x);';
    const v2 = 'let x = 20;\nconsole.log(x);';
    const diff = computeLineDiff(v1, v2);

    assert.equal(diff.hasChanges, true);
    assert.equal(diff.changeCount, 1);
    assert.equal(diff.changes[0].type, 'MODIFY');
    assert.equal(diff.changes[0].lineIndex, 0);
    assert.equal(diff.changes[0].to, 'let x = 20;');
  });

  test('applies modification patch accurately', () => {
    const v1 = 'let x = 10;\nconsole.log(x);';
    const v2 = 'let x = 20;\nconsole.log(x);';
    const diff = computeLineDiff(v1, v2);
    const patched = applyPatch(v1, diff);

    assert.equal(patched, v2);
  });

  test('detects line additions and applies patch', () => {
    const v1 = 'const a = 1;';
    const v2 = 'const a = 1;\nconst b = 2;';
    const diff = computeLineDiff(v1, v2);

    assert.equal(diff.changeCount, 1);
    assert.equal(diff.changes[0].type, 'ADD');
    assert.equal(diff.changes[0].content, 'const b = 2;');

    const patched = applyPatch(v1, diff);
    assert.equal(patched, v2);
  });

  test('handles null or empty strings safely', () => {
    const diff = computeLineDiff(null, '');
    assert.equal(diff.hasChanges, false);
  });
});
