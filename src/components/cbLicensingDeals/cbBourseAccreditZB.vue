<template>
    <div class="cbBourseAccreditZB">
        <!-- 各交易所手动输入授权 -->
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">ZB授权</span>
        </header>
        <div class="maiico">
            <div class="ico">
                ZB提供的访问密钥(Access Key)和私有密钥(Secret Key)非常重要，请小心保管，不要外泄，确保资金安全！建议您通过QQ，微信等较为安全的工具发送Key，防止泄露。
            </div>
            <div class="icoremind">请输入您的访问密钥(Access Key)和私有密钥(Secret Key)</div>
            <!-- <input type="text"> -->
            <div class="input">
                <input class="copy" placeholder="访问密钥(Access Key)" ref="input1">
                <input class="handcopy" placeholder="私有密钥(Secret Key)" ref="input2">
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
                声明：点击“授权交易”即代表你授权本App通过API访问ZB进行相关交易操作。除技术支持之外，我们不提供交易所其他服务，不承担任何资产风险如果怀疑授权存在问题，请登录ZB网站移除相关Key。
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
    name: "cbBourseAccreditZB",
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
                MessageBox("温馨提示", "Access Key或Secret Key不能为空");
                return;
            }
            this.$toStatistic("cbBourseAccreditloginzb", "授权登录zb");

            //加密存本地
            var ZBkey = {
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
            let url = `http://chaobi.lian2345.com/api/chaobi/deal/zb/getAccountInfo/${
                ZBkey.num
            }?apikey=${urljm(ZBkey.apikey)}&secret=${
                urljm(ZBkey.secretkey)
            }&method=getAccountInfo`;

            axios.post(url).then(res => {
                let list = JSON.parse(res.data.list);
                if (list.code) {
                    MessageBox(
                        "验证不通过",
                        "您的Access Key或Secret Key输入不正确"
                    );
                } else {
                    localStorage.setItem(
                        "ZBkey",
                        encryptKey(JSON.stringify(ZBkey))
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
            this.$toStatistic("cbBourseAccreditzb1", "阅读zb授权教程");

            this.$router.push({
                path: "/cbCourse",
                query: { bi: "zb" }
            });
        }
    }
};
</script>
<style>
@import '../../lib/css/accredit.css';
</style>


