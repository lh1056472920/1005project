<template>
    <div class="cbBourseAccreditBian">
        <!-- 各交易所手动输入授权 -->
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">币安授权</span>
        </header>
        <div class="maiico">
            <div class="ico">
                币安提供的API Key和Secret非常重要，请小心保管，不要外泄，确保资金安全！建议您通过QQ，微信等较为安全的工具发送Key，防止泄露。
            </div>
            <div class="icoremind">请输入您的API Key和secret</div>
            <!-- <input type="text"> -->
            <div class="input">
                <input class="copy" placeholder="API Key" ref="input1">
                <input class="handcopy" placeholder="secret" ref="input2">
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
                声明：点击“授权交易”即代表你授权本App通过API访问币安进行相关交易操作。除技术支持之外，我们不提供交易所其他服务，不承担任何资产风险如果怀疑授权存在问题，请登录币安网站移除相关Key。
            </div>
            <div class="course" @click='toCourse'>授权教程</div>
        </div>
    </div>
</template>
<script>
import { encryptKey, MD5, decryptByKey } from "../../lib/js/crypto.js";
import { MessageBox } from "mint-ui";
import axios from "axios";
import {urljm} from  '../../lib/js/jsmi.js'
export default {
    name: "cbBourseAccreditBian",
    data() {
        return {
            symbol: "BTCUSDT"
        };
    },
    sockets: {
        connect() {
            // this.sendDetail();
        }
    },

    activated() {},
    created() {},
    mounted() {},
    methods: {
        goback() {
            this.$router.go(-1);
        },
        accredit() {
            if (
                this.$refs.input1.value == " " ||
                this.$refs.input2.value == " "
            ) {
                MessageBox("温馨提示", "API Key或secret不能为空");
                return;
            }
            this.$toStatistic("cbBourseAccreditBian", "授权登录币安");
            
            var biankey = {
                userName: JSON.parse(localStorage.getItem('user')).phone, //用户名
                apikey: this.$refs.input1.value
                    .split("")
                    .reverse()
                    .join(""),
                secretkey: this.$refs.input2.value
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
                    if (res.data.list.data == null) {
                        MessageBox("温馨提示", "API Key或secret输入错误");
                    } else {
                        //将币安的key加密存到本地
                        localStorage.setItem(
                            "biankey",
                            encryptKey(JSON.stringify(biankey))
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
        },
        toCourse() {
            this.$toStatistic("点击阅读币安授权教程");
            this.$router.push({
                path: "/cbCourse",
                query: { bi: "ba" }
            });
        }
    }
};
</script>
<style >
@import '../../lib/css/accredit.css';
</style>


