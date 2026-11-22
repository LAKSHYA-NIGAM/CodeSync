/**
 * CodeSync Syntax Tokenizer & Code Metrics Analyzer
 * Tokenizes source code, counts language keywords, identifiers, and calculates line statistics.
 */

const KEYWORDS = {
  javascript: new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await', 'try', 'catch']),
  python: new Set(['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'as', 'try', 'except', 'with', 'lambda', 'yield']),
  java: new Set(['public', 'private', 'protected', 'class', 'interface', 'static', 'final', 'void', 'int', 'return', 'if', 'else', 'for', 'while', 'new', 'import']),
};

export function analyzeCodeMetrics(code, language = 'javascript') {
  if (typeof code !== 'string') {
    return { lineCount: 0, nonBlankLines: 0, tokenCount: 0, keywords: {}, characters: 0 };
  }

  const lines = code.split('\n');
  const lineCount = lines.length;
  const nonBlankLines = lines.filter((line) => line.trim().length > 0).length;
  const characters = code.length;

  const targetKeywords = KEYWORDS[language.toLowerCase()] || KEYWORDS.javascript;
  // Match word tokens or identifier symbols
  const words = code.match(/[a-zA-Z_$][a-zA-Z0-9_$]*/g) || [];
  const keywordFrequency = {};
  let keywordMatchCount = 0;

  for (const word of words) {
    if (targetKeywords.has(word)) {
      keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
      keywordMatchCount++;
    }
  }

  return {
    lineCount,
    nonBlankLines,
    totalTokens: words.length,
    keywordCount: keywordMatchCount,
    keywords: keywordFrequency,
    characters,
    blankLines: lineCount - nonBlankLines,
  };
}
