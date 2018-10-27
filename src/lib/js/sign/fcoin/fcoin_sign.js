var config = require('./fcoin_config.js')
const crypto = require('crypto');

function tob64(str) {
     return new Buffer(str).toString('base64')
}

function secret(str) {
      str = tob64(str);
     str = crypto.createHmac('sha1', config.Secret).update(str).digest().toString('base64');  
      return str;
}



exports.signFcoinUrl = function(method,url,args,timestamp,callback){
	
	
	
	 var pars = [];
		for (let item in args) {
			pars.push(item + "=" + args[item]);
		}
		var p = pars.sort().join("&");
		
    var strs = method + url + timestamp + p;
	console.log(strs)
	callback(secret(strs))
	
}



 


//secret()