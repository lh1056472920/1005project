<template>
    <div class="page">
        <!-- 导航页 -->
        <wizard-sheet :flag="flag" v-on:setflag="changeflag"></wizard-sheet>
        <div v-show="flag==false">
            <div class="logo"><img :src="logo"></div>
            <p>{{msg}}</p>
            <input-light class="username" clear color="#374452" placeholder="请输入账号" v-model="username" :maxlength="50"></input-light>
            <input-light class="password" clear color="#374452" placeholder="请输入密码" v-model="password" :maxlength="50" type="password"></input-light>
            <button-item class="login" title="登录" bg="#29DC54" v-tap="{methods:login}"></button-item>
            <ul class="btns">
                <li>
                    <a class="register" v-tap="{methods:toRegister}">注册</a>
                </li>
                <li>
                    <a class="forget" v-tap="{methods:toForget}">忘记密码</a>
                </li>
            </ul>
            <div class="bottom"><img :src="bottomImg"></div>

            <mt-popup v-model="popupRegister" popup-transition="popup-fade" style="border-radius: .1rem;">
                <register @registered="registered" :popup-register="popupRegister"></register>
            </mt-popup>
        </div>
    </div>
</template>
<script>
// import passwordHideImg from "../../../static/images/passwordHide.png";
// import passwordOpenImg from "../../../static/images/passwordOpen.png";
import verificationCode from "../../commons/components/VerificationCode.vue";
import inputLight from "../../commons/components/InputLight.vue";
import ButtonItem from "../../commons/components/ButtonItem.vue";
import WizardSheet from "../../commons/components/wizardSheet.vue";
import register from "./register.vue";
import remote from "../../lib/js/remote";
import { MessageBox, Toast } from "mint-ui";
import { getLanguage } from "../../lib/js/storage";
import { plusReady } from "../../lib/js/plusReady";
import { encryptKey } from "../../lib/js/crypto";
export default {
    name: "login",
    components: {
        verificationCode,
        inputLight,
        ButtonItem,
        WizardSheet,
        register
    },
    data() {
        return {
            logo: require("../../../static/images/LOGO.png"),
            msg: "炒币工具",
            bottomImg: require("../../../static/images/loginBak.png"),
            popupRegister: false,
            username: "",
            password: "",
            flag: true
        };
    },
    beforeMount() {
        let isOnceMoreEnter = window.localStorage.getItem("isOnceMoreEnter");
        if (isOnceMoreEnter) {
            this.flag = false;
        } else {
            this.flag = true;
            window.localStorage.setItem("isOnceMoreEnter", true);
        }
    },
    mounted() {
        this.$socket.close();
        // 获取行情
        /*remote
            .markets()
            .then(response => {
                let market = {};
                let tokenspace = {};
                let data = response.data.data || [];
                data.forEach((item, index) => {
                    let price = item.marketPrice.replace(/[¥,]/g, "") - 0;
                    market[item.marketDetail] = isNaN(price) ? 0 : price;
                    tokenspace[item.marketDetail] = item.marketId;
                });
                window.sessionStorage.setItem(
                    "tokenspace",
                    JSON.stringify(tokenspace)
                );
                window.sessionStorage.setItem("market", JSON.stringify(market));
            })
            .catch(error => {
                console.log(error);
            });*/

        if (this.$store.state.registerState) {
            this.popupRegister = true;
        }
        // 设置语言
        /*let language = getLanguage() || "CHINESE";
        this.$store.commit("setLanguage", language);*/
        this.$el.style.height = window.innerHeight + "px";
    },
    methods: {
        //注册框弹出
        toRegister() {
            //this.popupRegister = true;
            this.$router.push({
                name: "cbRegister"
            });
        },
        // 注册完成
        registered() {
            this.popupRegister = false;
        },
        //忘记密码页跳转
        toForget() {
            this.$router.push({
                path: "/forget",
                query: {
                    pageName: "forgetPassword"
                }
            });
        },
        //登陆逻辑
        login() {
            document.activeElement.blur();
            if (!this.username) {
                MessageBox.close();
                // MessageBox(this.$t('m.tips'), this.$t('m.usernamePlaceholder'))
                MessageBox("温馨提示", "请输入账号");
                return;
            }
            if (!this.password) {
                MessageBox.close();
                // MessageBox(this.$t('m.tips'), this.$t('m.passwordPlaceholder'))
                MessageBox("温馨提示", "请输入密码");

                return;
            }
            let param = {
                username: this.username,
                password: encodeURIComponent(encryptKey(this.password)),
                device: ""
            };
            if (window.plus) {
                param.device = encodeURIComponent(
                    encryptKey(window.plus.device.uuid)
                );
                let networkinfo = window.plus.networkinfo.getCurrentType();
                if (networkinfo === window.plus.networkinfo.CONNECTION_NONE) {
                    // Toast(this.$t('m.networkAnomaly'))
                    Toast("网络异常");
                    return false;
                }
            } else {
                param.device = 1;
            }
            plusReady(() => {
                window.plus.nativeUI.showWaiting("正在登录...");
            });
            remote
                .login(param)
                .then(response => {
                    if (response.data === -1) {
                        plusReady(() => {
                            window.plus.nativeUI.closeWaiting();
                        });
                        MessageBox.close();
                        // MessageBox(this.$t('m.tips'), this.$t('m.loginFailed'))
                        MessageBox("温馨提示", "登录失败");

                        return;
                    }
                    if (response.data === -2) {
                        plusReady(() => {
                            window.plus.nativeUI.closeWaiting();
                        });
                        MessageBox.close();
                        // MessageBox(this.$t('m.tips'), this.$t('m.loginFailed'))
                        MessageBox("温馨提示", "登录失败");

                        return;
                    }
                    if (response.data === -3) {
                        plusReady(() => {
                            window.plus.nativeUI.closeWaiting();
                        });
                        MessageBox.close();
                        // MessageBox(this.$t("m.tips"), this.$t("m.loginError"));
                        MessageBox("温馨提示", "账号或密码错误");
                        return;
                    }
                    window.sessionStorage.setItem("token", response.data);
                    remote
                        .check_login({ ticket: response.data })
                        .then(response => {
                            console.log(response);
                            sessionStorage.setItem("userId", response.data.uid);
                            let user = {
                                username: response.data.username,
                                phone: response.data.phone,
                                email: response.data.email
                            };
                            window.sessionStorage.setItem(
                                "user",
                                JSON.stringify(user)
                            );
                            // this.$store.commit('setUsername', user.username)
                            this.$router.replace({ path: "/QuotationIndex" });

                            // 获取自选项
                            let url2 = `http://www.blockgdex.com/kpl/wallert/coll/select?userName=${
                                response.data.username
                            }`;
                            this.$axios.get(url2).then(res => {
                                if (res.status == 200) {
                                    // console.log(res.data);
                                    let optionalList = res.data;
                                    window.sessionStorage.setItem(
                                        "optionalList",
                                        JSON.stringify(optionalList)
                                    );
                                    this.$store.commit(
                                        "setOptionalList",
                                        optionalList
                                    );
                                }
                            });
                        });
                    this.$store.commit("setToken", response.data);
                })
                .catch(error => {
                    plusReady(() => {
                        window.plus.nativeUI.closeWaiting();
                    });
                    console.log(error);
                    MessageBox.close();
                    // MessageBox(this.$t('m.tips'), this.$t('m.loginFailed'))
                    MessageBox("温馨提示", "登录失败");
                });
        },
        changeflag(e) {
            // 接收子组件传来的数据
            this.flag = e;
        }
    },
    beforeDestroy() {
        plusReady(() => {
            window.plus.nativeUI.closeWaiting();
        });
    }
};
</script>
<style scoped>
.page {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #e3ebee;
    background-image: linear-gradient(135deg, #f4f7f9, #e2eaee);
}
.logo {
    width: 2rem;
    height: 2rem;
    margin: 0 auto;
    padding-top: 2.04rem;
}
.logo img {
    width: 100%;
    height: 100%;
}
.logo ~ p {
    height: 0.34rem;
    line-height: 0.34rem;
    margin: 0.47rem auto 0.96rem;
    font-size: 0.36rem;
    text-align: center;
    color: #374452;
}
.username {
    width: 8.29rem;
    height: 1.43rem;
    border-width: 0 !important;
    border-radius: 0.2rem;
    background-color: #e2eaee;
}
.password {
    width: 8.29rem;
    height: 1.43rem;
    border-width: 0 !important;
    border-radius: 0.2rem;
    margin-top: 0.37rem;
    background-color: #e2eaee;
}
.login {
    display: block;
    margin: 0.61rem auto 0.6rem;
}
.btns {
    font-size: 0.4rem;
    color: #42c300;
    display: flex;
    justify-content: space-around;
}
.btns li {
    color: #42c300;
}
.bottom {
    position: absolute;
    bottom: 0;
}
</style>