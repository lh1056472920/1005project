<template>
    <div class="code">
        <header @click="back">
            <span class="iconfont icon-fanhui"></span>
            <span class="qccode">二维码扫描</span>
        </header>
        <div id="bcid">
        </div>
    </div>
</template>
<style scoped>
body {
    width: 100%;
    height: 100%;
    background: "rgba(0,0,0,.9)";
}
.code {
    width: 100%;
    height: 100%;
}
.code header {
    width: 100%;
    position: fixed;
    top: 0;
    height: 1.6rem;
    font-size: 0;
    z-index: 9999999;
    background-color: #fff;
}
.code header .iconfont {
    display: inline-block;
    margin-left: 0.4rem;
    height: 100%;
    line-height: 1.6rem;
    font-size: 16px;
}
.code header .qccode {
    display: inline-block;
    height: 100%;
    width: 80%;
    font-weight: 600;
    font-size: 0.46rem;
    line-height: 1.6rem;
    text-align: center;
}
.code #bcid {
    position: absolute;
    top: 1.6rem;
    width: 100%;
    height: 80%;
}
</style>
<script>
import { plusReady } from "../../lib/js/plusReady.js";
import { Toast, MessageBox } from "mint-ui";
import { encryptKey, MD5, decryptByKey } from "../../lib/js/crypto.js";
import axios from "axios";
import { urljm } from "../../lib/js/jsmi.js";
export default {
    name: "QR",
    data() {
        return {
            scan: null,
            apikey: "",
            secretKey: ""
        };
    },
    created() {
        console.log(this.$route.query.id);

        plusReady(() => {
            let ws = null,
                wo = null;
            // 获取窗口对象
            ws = window.plus.webview.currentWebview();
            wo = ws.opener();

            let filters = [plus.barcode.QR];
            let BarcodeStyles = {
                frameColor: "#42BDFE",
                scanbarColor: "#42BDFE",
                background: "rgba(0,0,0,.7)",
                width: "50%",
                width: "40%"
            };
            // 开始扫描
            window.setTimeout(() => {
                this.scan =
                    this.scan ||
                    new window.plus.barcode.Barcode(
                        "bcid",
                        filters,
                        BarcodeStyles
                    );
                this.scan.onmarked = (type, result) => {
                    // alert(result);
                    if (!result.match(RegExp(/ey"/))) {
                        MessageBox("温馨提示", "授权失败");
                        this.scan.close();
                        this.scan.cancel();
                        this.$router.goBack();
                    }
                    let obj = JSON.parse(result);

                    if (this.$route.query.id == "okex") {
                        for (const key in obj) {
                            if (key == "apiKey") {
                                this.apikey = obj[key];
                            } else if (key == "secretKey") {
                                this.secretKey = obj[key];
                            }
                        }
                        //加密存本地
                        var Okexkey = {
                            userName: JSON.parse(localStorage.getItem('user')).phone, //用户名
                            apikey: this.apikey
                                .split("")
                                .reverse()
                                .join(""),
                            secretkey: this.secretKey
                                .split("")
                                .reverse()
                                .join(""),
                            num: RndNum(16)
                        };
                        // //先将两个秘钥保存在本地和账号名密码相连
                        let url = `http://chaobi.lian2345.com/api/chaobi/deal/oken/userinfo/${
                            Okexkey.num
                        }?apikey=${urljm(Okexkey.apikey)}&secret=${
                            urljm(Okexkey.secretkey)
                        }&method=getAccountInfo`;

                        axios.post(url).then(res => {
                            console.log(JSON.parse(res.data.list));
                            if (JSON.parse(res.data.list).error_code) {
                                MessageBox("温馨提示", "授权失败");
                                this.scan.close();
                                this.scan.cancel();
                                this.$router.goBack();
                            } else {
                                MessageBox("温馨提示", "授权成功");
                                localStorage.setItem(
                                    "Okexkey",
                                    encryptKey(JSON.stringify(Okexkey))
                                );
                                this.scan.close();
                                this.scan.cancel();
                                if (localStorage.getItem("sign") == 1) {
                                    this.$router.push({
                                        path: "/cbDealBuy"
                                    });
                                } else if (localStorage.getItem("sign") == 2) {
                                    this.$router.push({
                                        path: "/authorize"
                                    });
                                }
                            }
                        });
                    } else if (this.$route.query.id == "zb") {
                        for (const key in obj) {
                            if (key == "access_key") {
                                this.apikey = obj[key];
                            } else if (key == "secret_key") {
                                this.secretKey = obj[key];
                            }
                        }
                        //加密存本地
                        var ZBkey = {
                            userName: JSON.parse(localStorage.getItem('user')).phone, //用户名
                            apikey: this.apikey
                                .split("")
                                .reverse()
                                .join(""),
                            secretkey: this.secretKey
                                .split("")
                                .reverse()
                                .join(""),
                            num: RndNum(16)
                        };
                        let url = `http://chaobi.lian2345.com/api/chaobi/deal/zb/getAccountInfo/${
                            ZBkey.num
                        }?apikey=${urljm(ZBkey.secretkey)}&secret=${
                            urljm(ZBkey.secretkey)
                        }&method=getAccountInfo`;
                        axios.post(url).then(res => {
                            let list = JSON.parse(res.data.list);
                            if (list.code) {
                                MessageBox("温馨提示", "授权失败");
                                this.scan.close();
                                this.scan.cancel();
                                this.$router.goBack();
                            } else {
                                MessageBox("温馨提示", "授权成功");
                                localStorage.setItem(
                                    "ZBkey",
                                    encryptKey(JSON.stringify(ZBkey))
                                );
                                this.scan.close();
                                this.scan.cancel();
                                if (localStorage.getItem("sign") == 1) {
                                    this.$router.push({
                                        path: "/cbDealBuy"
                                    });
                                } else if (localStorage.getItem("sign") == 2) {
                                    this.$router.push({
                                        path: "/authorize"
                                    });
                                }
                            }
                        });
                    } else if (this.$route.query.id == "bian") {
                        for (const key in obj) {
                            if (key == "apiKey") {
                                this.apikey = obj[key];
                            } else if (key == "secretKey") {
                                this.secretKey = obj[key];
                            }
                        }
                        var biankey = {
                            userName: JSON.parse(localStorage.getItem('user')).phone, //用户名
                            apikey: this.apikey
                                .split("")
                                .reverse()
                                .join(""),
                            secretkey: this.secretKey
                                .split("")
                                .reverse()
                                .join("")
                        };
                        axios
                            .post(
                                `http://chaobi.lian2345.com/api/chaobi/deal/binance/balances/dfdsafadf?apikey=${
                                    urljm(biankey.apikey)
                                }&secret=${urljm(biankey.secretkey)}`
                            )
                            .then(res => {
                                console.log(JSON.parse(res.data.list.data));

                                if (res.data.list.data == null) {
                                    MessageBox("温馨提示", "授权失败");
                                    this.$router.goBack();
                                } else {
                                    MessageBox("温馨提示", "授权成功");
                                    localStorage.setItem(
                                        "biankey",
                                        encryptKey(JSON.stringify(biankey))
                                    );
                                    this.scan.close();
                                    this.scan.cancel();
                                    if (localStorage.getItem("sign") == 1) {
                                        this.$router.push({
                                            path: "/cbDealBuy"
                                        });
                                    } else if (
                                        localStorage.getItem("sign") == 2
                                    ) {
                                        this.$router.push({
                                            path: "/authorize"
                                        });
                                    }
                                }
                            });
                    }
                    function RndNum(n) {
                        var rnd = "";
                        for (var i = 0; i < n; i++)
                            rnd += Math.floor(Math.random() * 10);
                        return rnd;
                    }
                    this.scan.close();
                    this.scan.cancel();
                };
                this.scan.start();
            }, 100);
        });
    },
    methods: {
        back() {
            this.scan.cancel();
            this.scan.close();
            this.$router.go(-1);
        }
    },
    beforeRouteLeave(to, from, next) {
        this.scan.cancel();
        this.scan.close();
        next();
    }
};
</script>


