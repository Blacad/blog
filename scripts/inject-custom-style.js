'use strict';

const root = (hexo.config.root || '/').replace(/\/?$/, '/');

hexo.extend.injector.register(
  'head_end',
  `<link rel="stylesheet" href="${root}css/custom.css">`,
  'default'
);
