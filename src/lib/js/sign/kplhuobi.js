// export function huiobi(apikey, secretkey, url,args) {
    const kplsign = require("./KplSign.js");
    var http = require("http");
    var querystring = require("querystring");
    exports.sign_huobi(apikey, secretkey, url, 'GET', args, function (sgingdadd) {
        var shu
        var options = {
            host: "chaobi.lian2345.com",
            hostname: "chaobi.lian2345.com",
            port: 80,
            path: "/https/get" + url + "?" + sgingdadd + "&kplkpl=api.huobipro.com",
            method: "get"
        };
        var req = http.get(options, function (res) {
            res.setEncoding("utf-8");
            res.on("data", function (chun) {
                // console.log("body分隔线---------------------------------\r\n");
                console.info(chun);
                shu = chun;
            });
            res.on("end", function () {
                // console.log("No more data in response.********");
            });
        });
        req.on("error", function (err) {
            console.error(err);
        });
        req.end();
        return shu
    });
// }
// export{
//     huiobi
// }