const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const util = require('./path')
const path = require('path')
app.use(json())
app.use(koaBody({ multipart: true }))
app.use(logger())
app.use(require('koa-static')(__dirname + '/upload'))
app.use(views(__dirname + '/views', {
    extension: 'html'
}))
util.injectMiddleware(app)
util.injectRouter(app)
app.use(async(ctx, next) => {
    if (ctx.status == 404 && !(ctx.request.url.match(/api/))) {
        await ctx.render('index', {
            title: 'Hello Koa 2!'
        })
    }
    await next()
})
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
    ctx.body = err
});
module.exports = app