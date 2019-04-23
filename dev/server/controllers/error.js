const path = require('path');
exports.init = app => app.use(async (ctx, next) => {
    try {
        await next();
        const status = ctx.status || 404
        if (status === 404) {
            ctx.throw(404) 
        }
    } catch (error) {
      if (error.status) {
        ctx.body = ctx.render(path.join(__dirname, '../templates/404.pug'));
        ctx.status = error.status;
      } else {
        ctx.body = 'Error 500';
        ctx.status = 500;
        console.error(error.message, error.stack);
      }
  
    }
  });