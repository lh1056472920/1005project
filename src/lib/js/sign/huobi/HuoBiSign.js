var HmacSHA256 = require('crypto-js/hmac-sha256')
var CryptoJS = require('crypto-js');
var moment = require('moment');
var config = require('./huobiconfig.js')



function sign_sha(method, baseurl, path, data) {
    var pars = [];
    for (let item in data) {
        pars.push(item + "=" + encodeURIComponent(data[item]));
    }
	var p = pars.sort().join("&");
	
	
    
    var meta = [method, baseurl, path, p].join('\n');
    // console.log(meta);
    var hash = HmacSHA256(meta, config.huobi_secretkey);
    var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
    // console.log(`Signature: ${Signature}`);
    p += `&Signature=${Signature}`;
    // console.log(p);
    return p;
}


function get_body() {
    return {
        AccessKeyId: config.huobi_access_key,
        SignatureMethod: "HmacSHA256",
        SignatureVersion: 2,
        Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    };
}


exports.signShaHuoBiUrl = function (pathurl,method,args,callback){
	  
        var body = get_body();
		 for (let item in args) {
            body[item] = args[item];
        }  
		
		console.log(body)
		
        var payload = sign_sha(method, config.huobi_pro, pathurl, body);
		callback(payload);
}