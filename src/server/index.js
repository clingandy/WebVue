const Koa = require('koa'),
	app = new Koa(),
	koaBody = require('koa-body'),
	Compress = require('koa-compress'),
	ServiceRouter = require('./middlewares/router/service'),
	Config = require('./config/config'),
	Cors = require('kcors'),
	path = require('path'),
	Session = require('koa-generic-session');

/* middlewares */
app.use(koaBody({
	multipart: true,
	strict: false,
	formidable: {
		uploadDir: path.join(__dirname, 'uploads')
	}
}));

app.use(async(ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.warn(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 启用gzip
app.use(Compress());

// 启用跨域
app.use(Cors());


app.use(ServiceRouter.routes(), ServiceRouter.allowedMethods());

/******************/

module.exports = app;
