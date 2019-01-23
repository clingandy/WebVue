class utils {
	static param2Obj(query) {
		if(!query) return {};
		query = query.includes('?') ? query.split('?')[1] : query;
		return JSON.parse('{"' + decodeURIComponent(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
	}
}


module.exports = utils;
