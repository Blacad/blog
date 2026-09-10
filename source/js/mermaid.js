// Keep the original code visible if the CDN is unavailable or a diagram is invalid.
const blocks = document.querySelectorAll(
  '.article .content pre > code.mermaid, .article .content pre > code.language-mermaid'
);

if (blocks.length) {
  try {
    const { default: mermaid } = await import(
      'https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs'
    );
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#e8eee5',
        primaryTextColor: '#26352b',
        primaryBorderColor: '#60785d',
        lineColor: '#60785d',
        secondaryColor: '#f4f5ef',
        tertiaryColor: '#fffaf0',
        fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif'
      }
    });

    for (const [index, code] of [...blocks].entries()) {
      try {
        const { svg } = await mermaid.render(`blog-mermaid-${index}`, code.textContent);
        const diagram = document.createElement('div');
        diagram.className = 'mermaid-diagram';
        diagram.innerHTML = svg;
        code.parentElement.replaceWith(diagram);
      } catch (error) {
        const notice = document.createElement('p');
        notice.className = 'mermaid-error';
        notice.textContent = '图表渲染失败，请检查 Mermaid 语法。原始代码如下：';
        code.parentElement.before(notice);
        console.warn('Mermaid diagram could not be rendered.', error);
      }
    }
  } catch (error) {
    console.warn('Mermaid could not be loaded; showing the original code.', error);
  }
}
