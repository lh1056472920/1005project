var CryptoJS = require('crypto-js');
var HmacSHA256 = require('crypto-js/hmac-sha256')
var moment = require('moment');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var querystring = require('querystring');


//biance的签名     
// argsString   'symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559';
exports.sign_biance = function (biance_secretkey, argsString, callback) {
    const signature = crypto
        .createHmac('sha256', biance_secretkey)
        .update(argsString)
        .digest('hex')
    callback(signature)
}



//fcoin的签名     fcoin_secret
exports.sign_fcoin = function (fcoin_secret, method, url, args, timestamp, callback) {



    var pars = [];
    for (let item in args) {
        pars.push(item + "=" + args[item]);
    }
    var p = pars.sort().join("&");

    var strs = method + url + timestamp + p;
    callback(secret(strs, fcoin_secret))

}

//-------------------------------------------------------------------------------------------------------------



//gate的签名   gate_Secret
exports.sign_gate = function (gate_Secret, str, callback) {
    str = querystring.stringify(str)
    let unescapeStr = querystring.unescape(str);
    var signs = crypto.createHmac('sha512', gate_Secret).update(unescapeStr).digest('hex').toString();
    callback(signs)
}


//-------------------------------------------------------------------------------------------------------------


//火币的签名   huobi_access_key       huobi_secretkey

exports.sign_huobi = function (huobi_access_key, huobi_secretkey, pathurl, method, args, callback) {
    
    var body = get_body(huobi_access_key);
    for (let item in args) {
        body[item] = args[item];
    }
    var payload = sign_sha(method, 'api.huobipro.com', pathurl, body, huobi_secretkey);
    callback(payload);
}
//-------------------------------------------------------------------------------------------------------------

//okcoin的签名   okcoin_secretkey
exports.sign_okcoin = function (okcoin_secretkey, args, callback) {
    var pars = [];
    for (let item in args) {
        pars.push(item + "=" + args[item]);
    }
    var p = pars.sort().join("&");

    p += `&secret_key=` + okcoin_secretkey;
    //签名md5

    var signs = md5.update(p, 'utf-8').digest('hex').toString();

    callback(signs.toUpperCase())
}

//-------------------------------------------------------------------------------------------------------------

//zb的签名   因为是每一个用户提供的  zb_SECRET_KEY   zb_ACCESS_KEY 都不一样,需要传进来
exports.sign_zb = function (zb_SECRET_KEY, zb_ACCESS_KEY, args, callback) {
    //先将secretkey加密
    var hash = CryptoJS.SHA1(zb_SECRET_KEY).toString()
    //请求参数
    args['accesskey'] = zb_ACCESS_KEY;
    var pars = [];
    for (let item in args) {
        pars.push(item + "=" + encodeURIComponent(args[item]));
    }
    var p = pars.sort().join("&");
    var hmacMD5 = CryptoJS.HmacMD5(p, hash).toString(CryptoJS.enc.Hex);
    callback(hmacMD5);
}



//-------------------------------------------------------------------------------------------------------------


function sign_sha(method, baseurl, path, data, huobi_secretkey) {
    var pars = [];
    for (let item in data) {
        pars.push(item + "=" + encodeURIComponent(data[item]));
    }
    var p = pars.sort().join("&");



    var meta = [method, baseurl, path, p].join('\n');
    // console.log(meta);
    var hash = HmacSHA256(meta, huobi_secretkey);
    var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
    // console.log(`Signature: ${Signature}`);
    p += `&Signature=${Signature}`;
    // console.log(p);
    return p;
}


function get_body(huobi_access_key) {
    return {
        AccessKeyId: huobi_access_key,
        SignatureMethod: "HmacSHA256",
        SignatureVersion: 2,
        Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    };
}


function tob64(str) {
    return new Buffer(str).toString('base64')
}

function secret(str, fcoin_secret) {
    str = tob64(str);
    str = crypto.createHmac('sha1', fcoin_secret).update(str).digest().toString('base64');
    return str;
}