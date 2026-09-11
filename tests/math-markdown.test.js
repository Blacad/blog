'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const Hexo = require('hexo');

test('LaTeX survives Markdown without changing code blocks or Mermaid', async () => {
  const hexo = new Hexo(process.cwd(), { silent: true });
  await hexo.init();
  await hexo.load();
  try {
    const render = async content => (await hexo.post.render('math-check.md', { content })).content;
    const formula = String.raw`\begin{aligned}
a_i &= b_i + \frac{1}{2} \\
c_j &< d_j
\end{aligned}`;
    const html = await render(`正文\n\n$$\n${formula}\n$$\n\n后文`);
    assert.ok(html.includes(`<div class="math-display">$$\n${formula.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}\n$$</div>`));
    assert.ok(!html.includes('<em>'));
    assert.ok(html.includes('<p>后文</p>'));

    assert.match(await render('$$E = mc^2$$'), /class="math-display"/);
    assert.match(await render('公式 $$a_i + b_i$$。'), /<span class="math-display">\$\$a_i \+ b_i\$\$<\/span>/);
    assert.match(await render('> $$\n> x_i + y_i\n> $$'), /<blockquote>[\s\S]*class="math-display"/);
    assert.ok(!(await render('`$$a_i$$`\n\n```text\n$$b_i$$\n```')).includes('class="math-display"'));
    assert.ok(!(await render('    $$a_i$$')).includes('class="math-display"'));
    assert.ok(!(await render('未闭合 $$a_i')).includes('class="math-display"'));
    assert.match(await render('$$<img src=x onerror=alert(1)>$$'), /&lt;img/);
    assert.match(await render('```mermaid\ngraph LR\n A --> B\n```'), /<code class="hljs mermaid">/);
    assert.match(await render('[链接](https://example.com/)'), /href="https:\/\/example.com\/"/);

    const mathjax = hexo.theme.config.plugins.mathjax;
    hexo.theme.config.plugins.mathjax = false;
    assert.ok(!(await render('$$a_i$$')).includes('class="math-display"'));
    hexo.theme.config.plugins.mathjax = mathjax;
  } finally {
    await hexo.exit();
  }
});
