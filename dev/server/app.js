const Koa = require('koa');
const app = new Koa();
const path = require('path');
const static = require("koa-static");

const Router = require('koa-router');
const router = new Router();

app.use(static(`${__dirname}/assets`));

require('./controllers')(app);


router.get('/', async function(ctx, next) {
  console.log(ctx, 'before')
  ctx.body = ctx.render(path.join(__dirname, 'templates/mainPage.pug'), {
    user: 'Unknown guest'
  });
  console.log(ctx, 'after')
  await next();
});

router.get('/:user', async function(ctx, next) {
  let name = ctx.params.user;
  ctx.body = ctx.render(path.join(__dirname, 'templates/test.pug'), {
    user: name
  });
  
  await next();
});


app.use(router.routes());
app.listen(3000);