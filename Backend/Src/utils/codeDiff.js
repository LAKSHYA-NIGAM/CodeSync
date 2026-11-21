/**
 * Collaborative Code Diff & Patch Engine
 * Computes line-level diffs and applies collaborative patches.
 */

function computeLineDiff(oldText, newText) {
  const s1 = typeof oldText === 'string' ? oldText : '';
  const s2 = typeof newText === 'string' ? newText : '';

  if (s1 === s2) {
    return {
      hasChanges: false,
      changeCount: 0,
      changes: []
    };
  }

  const oldLines = s1.length > 0 ? s1.split('\n') : [];
  const newLines = s2.length > 0 ? s2.split('\n') : [];

  const changes = [];
  const maxLen = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === undefined) {
      changes.push({ type: 'ADD', lineIndex: i, content: newLine });
    } else if (newLine === undefined) {
      changes.push({ type: 'REMOVE', lineIndex: i, originalContent: oldLine });
    } else if (oldLine !== newLine) {
      changes.push({ type: 'MODIFY', lineIndex: i, from: oldLine, to: newLine });
    }
  }

  return {
    hasChanges: changes.length > 0,
    changeCount: changes.length,
    changes
  };
}

function applyPatch(originalText, diffResult) {
  if (!diffResult || !Array.isArray(diffResult.changes)) {
    return originalText;
  }

  const str = typeof originalText === 'string' ? originalText : '';
  const lines = str.length > 0 ? str.split('\n') : [];

  for (const change of diffResult.changes) {
    if (change.type === 'MODIFY') {
      lines[change.lineIndex] = change.to;
    } else if (change.type === 'ADD') {
      lines[change.lineIndex] = change.content;
    } else if (change.type === 'REMOVE') {
      lines.splice(change.lineIndex, 1);
    }
  }

  return lines.join('\n');
}

module.exports = {
  computeLineDiff,
  applyPatch
};
