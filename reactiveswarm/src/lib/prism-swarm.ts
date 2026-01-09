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
  'control': {
    pattern: /<(alt|random|fromto(?:\[[^\]]+\])?|repeat|cycle):[^>]+>/,
    inside: {
      'punctuation': /^<(?:alt|random|fromto(?:\[[^\]]+\])?|repeat|cycle):|>$|:/,
      'keyword': /^(?:alt|random|fromto|repeat|cycle)/,
      'number': /\[[0-9.]+\]/
    }
  },
  'region': {
    pattern: /<region:[^>]+>/,
    inside: {
      'punctuation': /^<region:|>$|:/,
      'number': /[0-9.]+/
    }
  },
  'segment': {
    pattern: /<segment:[^>]+>/,
    inside: {
      'punctuation': /^<segment:|>$|:/,
      'string': /[^<>]+/
    }
  },
  'variable': {
    pattern: /<(?:set)?var(?:\[[^\]]+\])?:[^>]+>/,
    inside: {
      'punctuation': /^<(?:set)?var(?:\[[^\]]+\])?:|>$|:/,
      'keyword': /^(?:set)?var/,
      'string': /[^<>]+/
    }
  },
  'wildcard': {
    pattern: /<wildcard:[^>]+>|<[^:>]+>/,
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
