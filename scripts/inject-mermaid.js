'use strict';

hexo.extend.filter.register('before_generate', () => {
  if (!hexo.theme.config.mermaid?.enable) return;
  const root = (hexo.config.root || '/').replace(/\/?$/, '/');
  hexo.extend.injector.register('body_end',
    `<script type="module" src="${root}js/mermaid.js"></script>`, 'default');
});
