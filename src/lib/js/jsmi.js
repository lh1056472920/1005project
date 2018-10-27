import {
    JSEncrypt
} from './jsencrypt'
export const urljm = function (data) {
    var publickey =
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDqRvU2oDGF25lNvUo/wKhljQxPUZpCsZEzMY3cu5YMWB3qDMbMIDa36gnw4MP7kAWPGp+l5YVW8goY1LueyY0rof6tCeYbj41vWuDCBuDKSqMd3omf2BbjalaZyHxju8JOC0msqoKfDfHi7f8o3crBaM8PgZrhx6LncO8ka57PwIDAQAB";
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publickey);
    const key = encodeURIComponent(encrypt.encrypt(data)); //这个是加密后的
    // const key = (encrypt.encrypt(data)); //这个是加密后的
    return key
    // export const secretkey = encodeURIComponent(encrypt.encrypt(secretkey)); //这个是加密后的

}