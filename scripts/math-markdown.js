'use strict';

// Consume math before Markdown interprets underscores, backslashes, or HTML.
// Code fences and inline code remain handled by Marked's code tokenizers.
const escapeHTML = text => text.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

hexo.extend.filter.register('marked:extensions', function(extensions) {
  if (!this.theme.config.plugins?.mathjax) return;

  extensions.push({
    name: 'displayMath',
    level: 'block',
    start(src) {
      return src.match(/^ {0,3}\$\$/m)?.index;
    },
    tokenizer(src) {
      const match = /^ {0,3}\$\$([^$]*(?:\$(?!\$)[^$]*)*)\$\$(?:[ \t]*(?:\n|$))/.exec(src);
      if (match) return { type: 'displayMath', raw: match[0], math: match[1] };
    },
    renderer(token) {
      return `<div class="math-display">$$${escapeHTML(token.math)}$$</div>\n`;
    }
  }, {
    name: 'inlineDisplayMath',
    level: 'inline',
    start(src) {
      return src.indexOf('$$');
    },
    tokenizer(src) {
      const match = /^\$\$([^$]*(?:\$(?!\$)[^$]*)*)\$\$/.exec(src);
      if (match) return { type: 'inlineDisplayMath', raw: match[0], math: match[1] };
    },
    renderer(token) {
      return `<span class="math-display">$$${escapeHTML(token.math)}$$</span>`;
    }
  });
});
