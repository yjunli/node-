router
  .post('/page', function* (next) {
    // 创建页面
  })
  .get('/page/:id', function* (next) {
    // 渲染页面
  })
  .put('/page-update','/page/:id', function* (next) {
    // 渲染页面
  });