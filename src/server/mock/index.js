const login = require('./login');
const user = require('./user');
const menu = require('./menu');
const transaction = require('./transaction');

const mockList = {
	'login': login,
	'user' : user,
	'transaction' : transaction,
	'menu': menu
}

class MockData {
	static getData(pathArray, body, queryString) {
		let context = pathArray[1]; // 获取上下文
		let _result = undefined;

		try{
			// 是否存在于mock列表中
			if(mockList[context]) {
				pathArray.forEach((item, idx) => {
					if(idx > 1) {
						let _tmp = mockList[context][item];
						if(_tmp) {
							if(typeof _tmp === 'function') {
								_result = mockList[context][item].call(this, body, queryString);
							}
						}
					}
				});
			}
		} catch(ex) {
			console.error(ex);
		}

		return _result;
	}
}


module.exports = MockData;
