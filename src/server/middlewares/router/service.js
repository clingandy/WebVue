const Router = require('koa-router')();
const config = require('../../config/config.js');
var controller_path = '../../controller/';
var mockData = require('../../mock');
var http = require('../http/http');
const fs = require('fs');

const myHttp = new http();


let processFunction = async function (ctx, next) {

	let _path = ctx.path;
    console.log('_path: ' + _path);
	if(ctx.path.indexOf('api') > 0) {
		_path = ctx.path.split('api')[1];
	}
	let serverController;

	console.log(`body: ${JSON.stringify(ctx.request.body)}`);
	console.log(`content-type: ${ctx.request.type}`);

	// 获取地址
	let service_path = `${config.Service}${_path}`;

	if(ctx.querystring) {
		service_path += '?' + ctx.querystring;
	}

	// 内容
	let options = {};

	let isMultipart = ctx.request.type === 'multipart/form-data';

	if(isMultipart) {
		options = {
		 	'service' : service_path,
		 	'para' : ctx.request.body
		}
	} else {

		let __body = '';
		if(ctx.request.type == 'application/x-www-form-urlencoded') {
			Object.keys(ctx.request.body).forEach(item  => {
				__body += `&${item}=${ctx.request.body[item]}`;
			});

			__body = __body.substr(1);
		} else {
			__body = JSON.stringify(ctx.request.body);
		}

		options = {
		 	'service' : service_path,
		 	'para' : __body,
		 	'method' : ctx.request.method,
		 	'headers' : true,
			'contentType' : ctx.request.type ? ctx.request.type : 'application/json',
			'cookie' : 'JSESSIONID=D148F9EAEB76AE001D33060FA9BAC8A5'		// 这里可以置换成token
		 	// 'cookie' : `JSESSIONID=${ctx.session.SESSION}`
		}
	}

	// 是否是本地环境
	if (config.ENV === 'Local') {

		let _pathArray = _path.split('/');
		let _body = mockData.getData(_pathArray, JSON.stringify(ctx.request.body), ctx.querystring);
		if(typeof _body === 'undefined' || _body === undefined) {
			ctx.body = await myHttp.porxy(options, isMultipart);
		}else{
			ctx.body = _body;
		}
	} else {
		ctx.body = await myHttp.porxy(options, isMultipart);
	}

	ctx.set('Cache-Control', 'no-cache');
	ctx.set('Connection', 'keep-alive');
	await next();
}

config.ServiceRouter.forEach(d => {
	let strRegex = `^\/${d}(?:\/|$)`;
	let urlRegex = new RegExp(strRegex);
	// service router resend
	Router.all(urlRegex, processFunction);
});

module.exports = Router;
