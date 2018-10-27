var CryptoJS = require('crypto-js');
var HmacSHA256 = require('crypto-js/hmac-sha256')
var moment = require('moment');
var config = require('./zbconfig.js');

exports.signZbArgs = function (args,callback){
	//先将secretkey加密
     var hash = CryptoJS.SHA1(config.SECRET_KEY).toString()
     //请求参数
	  args['accesskey'] = config.ACCESS_KEY;
	 var pars = [];
    for (let item in args) {
        pars.push(item + "=" + encodeURIComponent(args[item]));
    }
	var p = pars.sort().join("&");
	var hmacMD5 = CryptoJS.HmacMD5(p,hash ).toString(CryptoJS.enc.Hex);
	callback(hmacMD5);
}