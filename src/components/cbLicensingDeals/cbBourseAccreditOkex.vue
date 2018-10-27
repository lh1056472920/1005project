<template>
    <div class="cbBourseAccreditOkex">
        <!-- 各交易所手动输入授权 -->
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">OKEx授权</span>
        </header>
        <div class="maiico">
            <div class="ico">
                OKEx提供的apiKey和secretKey非常重要，请小心保管，不要外泄，确保资金安全！建议您通过QQ，微信等较为安全的工具发送Key，防止泄露。
            </div>
            <div class="icoremind">请输入您的apiKey和secretKey</div>
            <!-- <input type="text"> -->
            <div class="input">
                <input class="copy" placeholder="apiKey" ref="input1">
                <input class="handcopy" placeholder="secretKey" ref="input2">
            </div>
            <div @click="accredit" class="accredit">
                授权交易
            </div>
            <div class="remind">
                <p>用户秘钥经过多重加密且仅存储在本地设备内，请放心使用！如有疑问，请查看
                    <router-link to="/safetyAnalysis">“交易安全分析”</router-link>
                </p>
            </div>
            <div class="statement">
                声明：点击“授权交易”即代表你授权本App通过API访问OKEx进行相关交易操作。除技术支持之外，我们不提供交易所其他服务，不承担任何资产风险如果怀疑授权存在问题，请登录OKEx网站移除相关Key。
            </div>
            <div class="course" @click='toCourse'>授权教程</div>
        </div>
    </div>
</template>
<script>
import { encryptKey, MD5, decryptByKey } from "../../lib/js/crypto.js";
import { MessageBox } from "mint-ui";
import axios from "axios";
import { urljm } from "../../lib/js/jsmi.js";
export default {
    name: "cbBourseAccreditOkex",
    data() {
        return {};
    },

    methods: {
        goback() {
            this.$router.go(-1);
        },
        accredit() {
            if (
                this.$refs.input1.value == "" ||
                this.$refs.input2.value == ""
            ) {
                MessageBox("温馨提示", "apikey或secretkey不能为空");
                return;
            }
            //加密存本地
            var Okexkey = {
                userName: JSON.parse(localStorage.getItem('user')).phone, //用户名
                apikey: this.$refs.input1.value
                    .split("")
                    .reverse()
                    .join(""),
                secretkey: this.$refs.input2.value
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
                // console.log(JSON.parse(res.data.list));
                if (JSON.parse(res.data.list).error_code) {
                    MessageBox("温馨提示", "apikey或secretkey输入错误");
                } else {
                    localStorage.setItem(
                        "Okexkey",
                        encryptKey(JSON.stringify(Okexkey))
                    );
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
            function RndNum(n) {
                var rnd = "";
                for (var i = 0; i < n; i++)
                    rnd += Math.floor(Math.random() * 10);
                return rnd;
            }
        },
        toCourse() {
            this.$toStatistic("cbBourseAccreditokex", "点击阅读okex授权教程");
            this.$router.push({
                path: "/cbCourse",
                query: { bi: "ok" }
            });
        }
    }
};
</script>
<style>
.cbBourseAccreditOkex .head {
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.6rem;
    line-height: 1.6rem;
    text-align: center;
    z-index: 99;
    background-color: #fff;
}
.cbBourseAccreditOkex .head .iconfont {
    display: block;
    height: 1.6rem;
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.cbBourseAccreditOkex .head .dealContent {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
}
.cbBourseAccreditOkex .maiico {
    padding: 1.8rem 0 0 0;
    width: 100%;
    position: relative;
}
.cbBourseAccreditOkex .maiico .ico {
    width: 100%;
    color: #374452;
    padding: 0.4rem 0.4rem;
    box-sizing: border-box;
}
.cbBourseAccreditOkex .maiico .icoremind {
    padding-left: 0.4rem;
    color: #a6afba;
}
.cbBourseAccreditOkex .maiico .input {
    width: 100%;
    padding: 0 0.4rem;
    box-sizing: border-box;
}
input::-webkit-input-placeholder {
    color: #a6afba;
}
.cbBourseAccreditOkex .maiico .input input {
    display: block;
    width: 100%;
    padding: 0 0.8rem;
    box-sizing: border-box;
    margin-top: 0.33rem;
    height: 1.3rem;
    border: 1px solid #a6afba;
}
.cbBourseAccreditOkex .maiico .accredit {
    margin: 0.8rem auto 0.33rem;
    width: 66%;
    height: 1.4rem;
    border-radius: 1.4rem;
    text-align: center;
    line-height: 1.4rem;
    font-size: 0.48rem;
    color: #fff;
    background-color: #48c122;
}
.cbBourseAccreditOkex .maiico .remind p {
    padding: 0 0.4rem;
    line-height: 0.6rem;
    font-size: 0.4rem;
}
.cbBourseAccreditOkex .maiico .remind p a {
    color: #48c122;
}
.cbBourseAccreditOkex .maiico .statement {
    padding: 0 0.4rem;
    line-height: 0.6rem;
    font-size: 0.38rem;
    margin-top: 0.8rem;
    color: #a6afba;
}
.cbBourseAccreditOkex .maiico .course {
    width: 20%;
    font-size: 0.48rem;
    text-align: center;
    margin: 0.8rem auto 0;
    color: #48c122;
}
</style>


