const Koa = require('koa');
const app = new Koa();
const path = require('path');
const static = require("koa-static");

const Router = require('koa-router');
const router = new Router();

app.use(static(`${__dirname}/assets`));

require('./controllers')(app);


router.get('/', async function(ctx, next) {
  ctx.body = ctx.render(path.join(__dirname, 'templates/mainPage.pug'), {
    clans: ['Destiny', 'Clan-name1', 'Clan-name2']
  });
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
app.listen(process.env.PORT || 3000);