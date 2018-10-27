
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var config = require('./okcoinconfig.js');

exports.signOkcoinUrl = function (args,callback) {
    var pars = [];
    for (let item in args) {
        pars.push(item + "=" +args[item]);
    }
    var p = pars.sort().join("&");
    
    p += `&secret_key=` +config.secretkey ;
//签名md5
   
	var signs = md5.update(p,'utf-8').digest('hex').toString();
	 
   callback(signs.toUpperCase())
}
