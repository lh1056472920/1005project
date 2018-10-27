var crypto = require('crypto');
var querystring = require('querystring');
var config = require('./gateconfig.js')

exports.gateSignUrl = function(str,callback) {
	str = querystring.stringify(str)
    let unescapeStr = querystring.unescape(str);
    var signs = crypto.createHmac('sha512', config.Secret).update(unescapeStr).digest('hex').toString();
	callback(signs)
}

