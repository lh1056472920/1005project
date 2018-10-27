import remote from './../../lib/js/remote.js'
var publickey ='MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDqRvU2oDGF25lNvUo/wKhljQxPUZpCsZEzMY3cu5YMWB3qDMbMIDa36gnw4MP7kAWPGp+l5YVW8goY1LueyY0rof6tCeYbj41vWuDCBuDKSqMd3omf2BbjalaZyHxju8JOC0msqoKfDfHi7f8o3crBaM8PgZrhx6LncO8ka57PwIDAQAB';

var signpublickey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjt5vAxR3pjhxaMyO73Vv2mqbuFOPUurKP3rXD+P8i7i6sqdvU1IT+SfSvnqpAN3YxJ5ODlQ20VQtAacAxQ6AsJnT5mc7o8u2NQbD2QEKi4G7Tvuzr/jgf0zXe07S/2GipZH6evGOjLTvv2kBZwK2F7iVmWake95X4/fT7t+AmTwIDAQAB';

async function getURL(params) {
    let masterid = enabledata(publickey, params.masteridData.trim());
    let masterTypeName = enabledata(publickey, params.masterTypeNameData.trim());
    let price = enabledata(publickey, params.price);
    let telephone = enabledata(publickey, params.telephone);
    let remark = enabledata(publickey, params.remark);
    let signkey = signkeydata(signpublickey, params.masteridData, params.masterTypeNameData, params.price, params.telephone, params.remark)
    let times = enabledata(publickey, params.times);
    let userid = enabledata(publickey, params.userid);
    let type = enabledata(publickey, params.type);
    let arbitrage = enabledata(publickey, params.arbitrage);
    let {data} = await remote.get_payurl({
            telephone:telephone,
            price:price,
            remark:remark,
            masterid:masterid,
            masterTypeName:masterTypeName,
            signkey:signkey,
            times: times,
            userid: userid,
            type: type,
            arbitrage:arbitrage
    })
    return data;
}

function enabledata(key, datas) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(key);
    var encrypted = encodeURIComponent(encrypt.encrypt(datas));
    return encrypted;
}

function signkeydata(key,masterid,masterTypeName,price,telephone,remark){
    return enabledata(key,(masterid+masterTypeName+price+telephone+remark));
}

async function getPayURL(params) {
    let masteridData = ''
    let masterTypeNameData = ''
    let {data} = await remote.get_goods();
    let lists = data.list;
    if(Array.isArray(lists)){
       masteridData = lists[0].goodsId + '';
       masterTypeNameData = lists[0].goodsName + '';
       let urlInfo = await getURL({
           masteridData: masteridData, 
           masterTypeNameData: masterTypeNameData,
           price: params.price,
           times: params.times,
           remark: '',
           telephone: params.telephone,
           userid: params.userid,
           type: params.type,
           arbitrage: params.arbitrage
       });
       return urlInfo;
    }
}
export {
    getPayURL
}