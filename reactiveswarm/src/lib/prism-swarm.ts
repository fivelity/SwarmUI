import Prism from 'prismjs';

// Define SwarmUI Prompt Syntax Grammar
Prism.languages.swarm = {
  'comment': {
    pattern: /\/\/.*/,
    greedy: true
  },
  'lora': {
    pattern: /<lora:[^>]+>/,
    inside: {
      'punctuation': /^<lora:|>$|:/,
      'variable': {
        pattern: /:[0-9.]+$/,
        lookbehind: true
      }
    }
  },
  'wildcard': {
    pattern: /<wildcard:[^>]+>|<random:[^>]+>|<alt:[^>]+>|<[^:>]+>/,
    inside: {
        'punctuation': /^<[^:]+:|>$|:/,
        'string': /[^<>]+/
    }
  },
  'param': {
    pattern: /<param:[^>]+>/,
    inside: {
        'punctuation': /^<param:|>$|:/,
        'keyword': /^[a-zA-Z0-9_]+(?=:)/,
        'number': /[0-9.]+$/
    }
  },
  'emphasis': {
    pattern: /(\()[^)]+(\)|:[0-9.]+\))|(\[)[^\]]+(\])/,
    inside: {
        'punctuation': /^\(|^\[|\)$|\]$|:[0-9.]+\)$/,
        'number': {
            pattern: /[0-9.]+/,
            lookbehind: true
        }
    }
  },
  'break': {
    pattern: /\bBREAK\b/,
    alias: 'important'
  }
};

export { Prism };
