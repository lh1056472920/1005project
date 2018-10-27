let publickey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDqRvU2oDGF25lNvUo/wKhljQxPUZpCsZEzMY3cu5YMWB3qDMbMIDa36gnw4MP7kAWPGp+l5YVW8goY1LueyY0rof6tCeYbj41vWuDCBuDKSqMd3omf2BbjalaZyHxju8JOC0msqoKfDfHi7f8o3crBaM8PgZrhx6LncO8ka57PwIDAQAB';
let signpublickey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjt5vAxR3pjhxaMyO73Vv2mqbuFOPUurKP3rXD+P8i7i6sqdvU1IT+SfSvnqpAN3YxJ5ODlQ20VQtAacAxQ6AsJnT5mc7o8u2NQbD2QEKi4G7Tvuzr/jgf0zXe07S/2GipZH6evGOjLTvv2kBZwK2F7iVmWake95X4/fT7t+AmTwIDAQAB';

function enabledata(key, datas) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(key);
    var encrypted = encodeURIComponent(encrypt.encrypt(datas));
    //  console.log(encrypted);
    return encrypted;
}

function createParams(params,_publickey) {
    let obj = {};
    for (let i in params) {
        if (params.hasOwnProperty(i)) {
            obj[i] = enabledata(_publickey || publickey,params[i]);
        }
    }
    return obj;
}

export {
    createParams
}