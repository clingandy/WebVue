const request = require('request');
const fs = require('fs');
const FormData = require('form-data');


class http {
	constructor(service) {
		this.serviceName = service;
		this.error = function() {};
		this.success = function() {};
	}

	/**
	 * [porxy 代理请求]
	 * @param  {[type]} para [description]
	 * @return {[type]}      [description]
	 */
	porxy(para, isMultipart){

		let that = this;
		let promise = new Promise((resolve, reject) => {
			let _data;

			if(isMultipart) {
				resolve(that.postForm(para));
			} else {
				let options = {
					url: para.service,
					body: para.para,
					method : para.method
				};

				if(para.headers) {
					options.headers = {
						'Content-Type' : para.contentType,
						'Cookie' : para.cookie
					}
				}
				console.log(JSON.stringify(options));
				resolve(request(options));
			}
		});
		return promise;
	}
	/*
	表单 请求
	 */
	postForm(para) {

		let service_name = this.serviceName;
		if (para.service) {
			service_name = para.service;
		}

		var formData = {
  			my_file: fs.createReadStream(para.para.files.file.path)
		};

		var form = new FormData();

	  	form.append('file', fs.createReadStream(para.para.files.file.path), {
		    filename: para.para.files.file.name,
		    contentType: para.para.files.file.type
	  	});

		let promise = new Promise((resolve, reject) => {

			form.submit(service_name, function(err, res) {
		    	if (err) throw err;
		    	resolve(res);
		  	});
		});

		return promise;
	}
}

module.exports = http;
