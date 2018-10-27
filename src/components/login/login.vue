<template lang="html">
    <div class="page">
        <HeaderItem title="登录"></HeaderItem>
        <div class="main">
            <img src="@/images/cblogin.png" class="login-img" alt="">
            <div class="input-box">
                <input type="tel" maxlength="11" id="phone" class="text phone" @keyup="keyup($event)" v-model="phone" placeholder="请输入手机号码">
            </div>
            <div class="input-box">
                <input type="text" class="text code" @keyup="keyup($event)" @focus="onfocus($event)" v-model="verify" placeholder="请输入验证码">
                <span id="getCode" class="getCode" :class="{gray: gettingCode}" v-tap="{methods: getCode}">{{intervalText}}</span>
            </div>
            <div class="input-box nput-box-invite">
                <input type="text" id="invite-input" @keyup="keyup($event)" @focus="onfocus($event)" class="text invite" v-model="inviteCode" placeholder="请输入邀请码（选填）">
            </div>
            <div id="login-btn" class="login-btn" v-tap="{methods: login}">
                登录
            </div>
        </div>
    </div>
</template>

<script>
import HeaderItem from './../../commons/components/HeaderItem.vue'
import remote from './../../lib/js/remote.js'
import { MessageBox, Toast } from 'mint-ui'

export default {
    components: {
        HeaderItem
    },
    data(){
        return {
            intervalText: '获取验证码',
            gettingCode: false,
            phone: '',
            setTime: 60,
            verify: '',
            inviteCode: '' 
        }
    },
    methods: {
        getCode() {
            this.$toStatistic('getCode', '获取手机验证码');
            document.activeElement.blur();
            if (this.gettingCode) {
                return;
            }
            if (!this.phone) {
                this.$plusReady(() => {
                    window.plus.nativeUI.alert('请输入手机号码')
                })
                return;
            }
            if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone)) {
                this.$plusReady(() => {
                    window.plus.nativeUI.alert('非法的手机号码')
                })
                return;
            }
            this.gettingCode = true;
            remote.send_sms({
                data: this.phone,
                type: 2,
                code: 1
            }).then((res) => {
                console.log(res);
                
                if (res.status === 200 && res.data.status === 0) {
                    Toast({
                        message: '验证码已发送到您的手机',
                        position: 'top',
                        duration: 3000
                    });
                    this.getIntervalText();
                } else if (res.data.status === 503) {
                    Toast({
                        message: '获取验证码过于频繁，请稍候再试！',
                        position: 'top',
                        duration: 3000
                    });
                    this.gettingCode = false;
                } else {
                    Toast({
                        message: '获取验证码失败',
                        position: 'top',
                        duration: 3000
                    });
                    this.gettingCode = false;
                }
            }).catch((err) => {
                this.gettingCode = false;
            })
        },
        getIntervalText() {
            var timer = setInterval(() => {
                if (this.setTime > 0) {
                    this.intervalText = this.setTime + 's 重新获取';
                    this.setTime -= 1;
                } else {
                    this.gettingCode = false;
                    this.intervalText = '获取验证码';
                    clearInterval(timer);
                    this.setTime = 60;
                }
            },1000)
        },
        login() {
            this.$toStatistic('login', '登陆');
            document.activeElement.blur();
            if (!this.phone) {
                this.$plusReady(() => {
                    window.plus.nativeUI.alert('请输入手机号码')
                })
                return;
            }
            if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone)) {
                this.$plusReady(() => {
                    window.plus.nativeUI.alert('请输入正确的手机号码')
                })
                return;
            }
            if (!this.verify) {
                this.$plusReady(() => {
                    window.plus.nativeUI.alert('请输入验证码')
                })
                return;
            }
            remote.login({
                phone: this.phone,
                fid: this.inviteCode,
                code: this.verify
            }).then((res) => {
                if (res.data.code === 200) {
                    if (localStorage.getItem('user')&&JSON.parse(localStorage.getItem('user')).phone!=this.phone) {
                        localStorage.removeItem("userkey");
                        localStorage.removeItem("biankey");
                        localStorage.removeItem("Okexkey");
                        localStorage.removeItem("ZBkey");
                    }
                    window.localStorage.setItem('token', res.data.result)
                    this.getUserInfo(res.data.result)
                } else {
                    Toast({
                        message: res.data.result,
                        className: 'toast-class'
                    })
                }
            }).catch((err) => {
                Toast({
                    message: '登陆失败',
                    className: 'toast-class'
                })
            })
        },
        getUserInfo(ticket) {
            remote.getUserInfo({
                ticket: ticket
            }).then((response) => {
                sessionStorage.setItem("userId", response.data.uid);
                let user = {
                    username: response.data.username,
                    phone: response.data.phone,
                    uid: response.data.uid,
                    fid: response.data.fid,
                    ticket: ticket
                };
                // this.$store.commit('setUsername', user.username)
                this.$store.commit('setUserInfo', user)
                this.$router.replace({ path: "/about" });

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
            }).catch((err) => {
                Toast({
                    message: '登陆失败',
                    className: 'toast-class'
                })
            })
        },
        onfocus(event){
            setTimeout(() => {
                event.target.scrollIntoView();
            },300)
        },
        keyup(event) {
            if (event.keyCode === 13) {
                this.login();
            }
        }
    }
}
</script>

<style lang="less" scoped>
.page{
    width: 10.8rem;
    height: 100vh;
}
.main{
    height: calc(100vh - 2.98rem);
    overflow: auto;
    background: #fff;
    margin-top: 0.1rem;
    text-align: center;
    padding-top: 1.44rem;
    .input-box{
        width: 7.5rem;
        height:1.2rem;
        line-height: 1.2rem;
        border-radius: 0.1rem;
        margin: 0 auto;
        background-color: rgba(88,104,209,0.08);
        font-size: .4rem;
        vertical-align: middle;
        margin-bottom: 0.8rem;
    }
    .text{
        width: 4.18rem;
        height: 100%;
        padding-left: 0.5rem;
        background-color: transparent;
        border: none;
        outline: none;
        float: left;
    }
    .text::-webkit-input-placeholder {
        color:rgba(88,104,209,0.5);
    }
    .text.invite{
        float: none;
        width: 6.9rem;
    }
    .text.phone{
        width: 6.8rem;
    }
    .input-box.nput-box-invite{
        text-align: left;
    }
    .invite-text{
        padding-left: 0.5rem;
        color:rgba(88,104,209,1)
    }
    .getCode{
        color: #1dd024;
    }
    .getCode.gray{
        color: #d5d5d5;
    }
}
.login-btn{
    width: 7.5rem;
    height: 1.15rem;
    line-height: 1.15rem;
    background:#5868D1;
    border-radius:0.1rem;
    color: #FEFEFE;
    font-size: .42rem;
    text-align: center;
    margin: 0 auto 0.8rem;
}
.login-img{
    width: 2.5rem;
    min-width: 2.5rem;
    min-height: 2.5rem;
    margin-bottom: 1.15rem;
}
</style>
