<template>
    <div class="about">
        <header>
            <span class="title">个人中心</span>
        </header>
        <div class="user-container">
            <div class="user-info">
                <img src="@/images/about/header.png" class="headImage" alt="">
                <div class="account-info on-line" v-if="phoneNumber">
                    <p class="phone-number">{{phoneNumber}}</p>
                    <p class="vip">
                        <!-- <span class="vip-icon" >VIP</span> -->
                        <img :src="vipIcon" class="vip-icon" alt="">
                        <span class="vip-text" :class="{gray: !isVip}">{{vipText}}</span>
                    </p>
                </div>
                <div class="account-info off-line" v-tap="{methods: login}" v-else>
                    <p class="loginText">登录即送
                        <span class="vipText">VIP</span>
                    </p>
                </div>
                <span class="vip-controll" v-if="phoneNumber" v-tap="{methods: openVip}">{{isVip?'立即续费':'立即开通'}}</span>
            </div>
            <div class="other-type">
                <div class="other-type-group other-vip" v-tap="{methods: goVipDetail}">
                    <img src="@/images/about/vip.png" class="other-type-image" alt="">
                    <p class="other-label">我的VIP</p>
                </div>
                <div class="other-type-group other-disciple" v-tap="{methods: toApprentice}">
                    <img src="@/images/about/ore.png" class="other-type-image" alt="">
                    <p class="other-label">收徒挖矿</p>
                </div>
                <div class="other-type-group invite-number" v-tap="{methods: goInviteCode}">
                    <img src="@/images/about/invite.png" class="other-type-image" alt="">
                    <p class="other-label">邀请码</p>
                </div>
            </div>
            <main>
                <!-- <div @click="clickmy(0)" class="myAuthorization">
                    <img src="../../../static/images/ellipse.png" alt="">
                    <span>我的授权</span>
                    <i><img src="../../../static/images/right-arrow.png" alt=""></i>
                </div> -->
                <div @click="clickmy(1)" class="Settings">
                    <img src="../../../static/images/safeCenter.png" alt="">
                    <span>安全中心</span>
                    <i><img src="../../../static/images/right-arrow.png" alt=""></i>
                </div>
                <div @click="clickmy(2)" class="Settings">
                    <img src="@/images/about/setting.png" alt="">
                    <span>系统设置</span>
                    <i><img src="../../../static/images/right-arrow.png" alt=""></i>
                </div>
                <div @click="clickmy(3)" class="aboutUs">
                    <img src="../../../static/images/aboutUs.png" alt="">
                    <span>关于我们</span>
                    <i><img src="../../../static/images/right-arrow.png" alt=""></i>
                </div>
            </main>
        </div>
        <div class="aboutfooter">
            <div @click="diajji(1)" class="one">
                <div :class="{dianji:isjiaji==1}"></div>
                <span :class="{dianji1:isjiaji==1}">行情</span>
            </div>
            <div @click="diajji(2)" class="two">
                <div :class="{dianji:isjiaji==2}"></div>
                <span :class="{dianji1:isjiaji==2}">预警</span>
            </div>
            <div @click="diajji(3)" class="three">
                <div :class="{dianji:isjiaji==3}"></div>
                <span :class="{dianji1:isjiaji==3}">授权</span>
            </div>
            <div @click="diajji(4)" class="four">
                <div :class="{dianji:isjiaji==4}"></div>
                <span :class="{dianji1:isjiaji==4}">我的</span>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderItem from "./../../commons/components/HeaderItem.vue";
import { MessageBox, Cell } from "mint-ui";
import remote from "./../../lib/js/remote.js";
import { formatDate } from "./../../lib/js/tools.js";
// 用户头像
import userImage from "../../../static/images/icon/1.png";

// import ListItem from '../../../commons/components/ListItem.vue'
// import HeaderItem from '../../../commons/components/HeaderItem.vue'

export default {
    name: "About",
    components: {
        // Cell,
        // ListItem,
        HeaderItem
    },
    data() {
        return {
            isjiaji: 4,
            phoneNumber: "",
            userIcon: userImage,
            vipIcon: require("@/images/about/vip_gray.png"),
            userInfo: {},
            isVip: false,
            vipDate: 0,
            vipText: "您还不是vip会员",
            limitTime: 0
        };
    },
    created() {
        this.getname();
        this.checkVip();
    },
    mounted() {
        let username = (this.userInfo && this.userInfo.username) || "";
        if (/^[1][3,4,5,7,8][0-9]{9}$/.test(username)) {
            this.phoneNumber = username.replace(
                /^(\d{3}).*(.{4})/g,
                "$1****$2"
            );
        } else {
            this.phoneNumber = username;
        }
    },
    methods: {
        diajji(res) {
            if (res == 1) {
                this.isjiaji = 1;
                this.$router.push({
                    path: "/QuotationIndex"
                });
            } else if (res == 2) {
                this.isjiaji = 2;
                this.$router.push({
                    path: "/remind"
                });
            } else if (res == 3) {
                this.isjiaji = 3;
                this.$router.push({
                    path: "/myAuthorization"
                });
            } else if (res == 4) {
                this.isjiaji = 4;
                this.$router.push({
                    path: "/about"
                });
            }
        },
        getname() {
            this.userInfo = this.$store.state.userInfo || {};
            this.phoneNumber = this.userInfo.phone;
        },
        clickUser() {
            this.$router.goBack();
        },
        clickmy(data) {
            if (data == 0) {
                this.$router.push({
                    path: "/myAuthorization"
                });
            } else if (data == 1) {
                this.$toStatistic('safeCenter', '点击安全中心');
                this.$router.push({
                    path: "/safeCenter"
                });
            } else if (data == 2) {
                this.$toStatistic('setting', '点击系统设置');
                MessageBox.alert('该功能正在火热开发中,敬请期待！');
                return;
                this.$router.push({
                    path: "/setting"
                });
            } else if (data == 3) {
                this.$toStatistic('aboutUs', '点击关于我们');
                this.$router.push({
                    path: "/aboutUs"
                });
            }
        },
        toProfitDetail() {
            this.$router.push({
                path: "/profitDetail"
            });
        },
        goVipDetail() {
            if (this.isVip) {
                this.$toStatistic("myVip_1", "点击我的vip_会员");
                this.$router.push({
                    name: "vipDetail",
                    query: {
                        limitTimeText: formatDate(
                            new Date(
                                new Date().getTime() + this.limitTime * 1000
                            ),
                            "yyyy-MM-dd"
                        )
                    }
                });
            } else {
                this.$toStatistic("myVip_2", "点击我的vip_非会员");
                this.$vipBox().then(event => {
                    this.$toStatistic("openVipButton", "点击马上开通vip");
                    this.$router.push({
                        path: "/openVip"
                    });
                });
            }
        },
        toApprentice() {
            this.$toStatistic("apprentice", "点击收徒挖矿");
            this.$router.push({
                path: "/apprentice"
            });
        },
        goInviteCode() {
            this.$toStatistic("inviteCode", "点击邀请码");
            this.$router.push({
                name: "inviteCode"
            });
        },
        login() {
            this.$router.push({
                path: "/login"
            });
        },
        checkVip() {
            if (!this.userInfo.phone) {
                return;
            }
            remote
                .checkVip({
                    phone: this.userInfo.phone
                })
                .then(res => {
                    if (res.status === 200) {
                        if (
                            typeof res.data.result.limitTime === "number" &&
                            res.data.result.limitTime > 0
                        ) {
                            let userInfo = this.$store.state.userInfo;
                            userInfo.isVip = true;
                            this.$store.commit('setUserInfo', userInfo)
                            this.isVip = true;
                            this.limitTime = res.data.result.limitTime;
                            this.vipDate = Math.floor(
                                this.limitTime / (24 * 60 * 60)
                            );
                            this.vipText = `会员剩余${this.vipDate}天`;
                            this.vipIcon = require("@/images/about/vip_light.png");
                        }
                    }
                });
        },
        openVip() {
            if (this.isVip) {
                this.$toStatistic("openVip_1", "点击续费会员");
            } else {
                this.$toStatistic("openVip_2", "点击开通会员");
            }
            this.$router.push({
                path: "/openVip"
            });
        }
    }
};
</script>

<style lang="less" scoped>
.aboutfooter {
    width: 100%;
    height: 1.6rem;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 999;
    background-color: #fff;
    display: flex;
}
.aboutfooter > div {
    // display: flex;
    // justify-content: center;
    width: 25%;
    height: 1.6rem;
    // line-height: 1.6rem;
    color: #999;
    font-size: 0.38rem;
    text-align: center;
    position: relative;
}
.aboutfooter > div > div {
    width: 0.6rem;
    height: 0.6rem;
    margin-top: 0.3rem auto 0.1rem;
}
.aboutfooter > div.one > div {
    background-image: url(../../../static/images/hq1.png);
    background-size: 0.6rem 0.6rem;
}
.aboutfooter > div.two > div {
    background-image: url(../../../static/images/tx1.png);
    background-size: 0.6rem 0.6rem;
}
.aboutfooter > div.three > div {
    background-image: url(../../../static/images/sq1.png);
    background-size: 0.6rem 0.6rem;
}
.aboutfooter > div.four > div {
    background-image: url(../../../static/images/wd1.png);
    background-size: 0.6rem 0.6rem;
}
.aboutfooter > div.one > div.dianji {
    background-image: url(../../../static/images/hq2.png);
    background-size: 0.6rem 0.6rem;
}
.aboutfooter > div.two > div.dianji {
    background-image: url(../../../static/images/tx2.png);
    background-size: 0.6rem 0.6rem;
}
.aboutfooter > div.three > div.dianji {
    background-image: url(../../../static/images/sq2.png);
    background-size: 0.6rem 0.6rem;
}
.aboutfooter > div.four > div.dianji {
    background-image: url(../../../static/images/wd2.png);
    background-size: 0.6rem 0.6rem;
}
.aboutfooter > div span.dianji1 {
    color: #5868d1;
}
.aboutfooter > div span {
    display: block;
    // position: absolute;
    // top: 0.4rem;
}
.about {
    background-color: #edf2f5;
}
.about header {
    text-align: center;
    width: 100%;
    height: 1.44rem;
    line-height: 1.44rem;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 3px #ddd;
}
.about header > span {
    text-align: center;
    font-weight: bold;
    font-size: 0.52rem;
}
.about .user {
    margin-left: 4%;
}
.about .user span {
    font-size: 18px;
    color: #42c300;
}

.about .search-box {
    margin-right: 4%;
}
.about .search-box i {
    font-size: 20px;
    color: #42c300;
}
.about main > div {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    height: 1.6rem;
    background-color: #fff;
    border-bottom: 1px solid #e6eef2;
}
.about main > div img {
    margin-left: 0.4rem;
    /* width: 0.6rem; */
    height: 0.6rem;
}
.about main > div span {
    position: absolute;
    left: 1.6rem;
    color: #374452;
    font-size: 0.46rem;
}
.about main > div i {
    position: absolute;
    right: 0.4rem;
}
.about main > div.Settings {
    //border-bottom: none;
}
.mint-header-title {
    font-family: PingFangSC-Light;
}
.round {
    position: absolute;
}
.round-1 {
    top: 2.38rem;
    left: 1rem;
    width: 0.47rem;
    height: 0.47rem;
    background-color: #5fe57f;
    border-radius: 100%;
}
.round-2 {
    top: 0.4rem;
    left: 2.3rem;
    width: 0.23rem;
    height: 0.23rem;
    background-color: #5fe57f;
    border-radius: 100%;
}
.round-3 {
    top: 1.25rem;
    left: 3.13rem;
    width: 0.74rem;
    height: 0.74rem;
    border: #5fe57f solid 0.04rem;
    border-radius: 100%;
}
.round-4 {
    top: 0.69rem;
    left: 6.92rem;
    width: 0.7rem;
    height: 0.7rem;
    background-color: #5fe57f;
    border-radius: 100%;
}
.round-5 {
    top: 2.47rem;
    left: 9.7rem;
    width: 0.3rem;
    height: 0.3rem;
    background-color: #5fe57f;
    border-radius: 100%;
}
.user-icon {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    position: absolute;
    top: 0.92rem;
    left: 50%;
    transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0); /* IE 9 */
    -moz-transform: translate(-50%, 0); /* Firefox */
    -webkit-transform: translate(-50%, 0); /* Safari 和 Chrome */
    -o-transform: translate(-50%, 0); /* Opera */
}
.user-phone-number {
    font-size: 0.42rem;
    font-family: PingFangSC-Light;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    position: absolute;
    bottom: -0.58rem;
    left: 50%;
    transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0); /* IE 9 */
    -moz-transform: translate(-50%, 0); /* Firefox */
    -webkit-transform: translate(-50%, 0); /* Safari 和 Chrome */
    -o-transform: translate(-50%, 0); /* Opera */
}
.user-container {
    width: 10.8rem;
    height: calc(100vh - 1.44rem);
    overflow: auto;
}
.user-info {
    display: flex;
    align-items: center;
    width: 9.8rem;
    height: 3rem;
    padding: 0 0.5rem;
    margin: 0.1rem 0;
    background-color: rgba(255, 255, 255, 1);
}
.account-info {
    min-width: 6.05rem;
    &.off-line {
        font-size: 0.48rem;
        font-weight: bold;
        .loginText {
            color: rgba(88, 104, 209, 1);
        }
        .vipText {
            color: #ffb400;
        }
    }
}
.headImage {
    width: 1.58rem;
    height: 1.58rem;
    min-width: 1.58rem;
    min-height: 1.58rem;
    border-radius: 50%;
    background: gray;
    margin-right: 0.5rem;
}
.phone-number{
    //display: inline-block;
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.48rem;
    font-weight: bold;
    color: rgba(88, 104, 209, 1);
}
.vip{
    //display: inline-block;
}
.vip-icon {
    width: 0.6rem;
    height: 0.5rem;
    min-width: 0.6rem;
}
.vip-text {
    font-size: 0.36rem;
    color: #1a1a1a;
}
.vip-text.gray {
    color: #d3d3d3;
}
.vip-controll {
    display: inline-block;
    width: 1.88rem;
    font-size: 0.36rem;
    color: #5868d1;
    height: 0.79rem;
    line-height: 0.79rem;
    text-align: center;
    background: rgba(40, 104, 240, 0.1);
    border-radius: 0.05rem;
}
.profit-container {
    background-color: #fff;
    margin: 0.1rem 0;
    .more-profit {
        padding: 0 0.5rem;
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: right;
        border-bottom: 1px solid rgba(217, 217, 217, 1);
        .right-icon {
            width: 0.14rem;
            height: 0.24rem;
            margin-left: 0.1rem;
            vertical-align: baseline;
        }
    }
}
.profit-type {
    display: flex;
    padding: 0.5rem 0;
    font-size: 0.54rem;
    font-weight: bold;
    color: rgba(255, 150, 2, 1);
    text-align: center;
    .profit-type-group {
        flex: 1;
        &.profit-bch {
            .amount {
                color: rgba(255, 150, 2, 1);
            }
            .profit-origin {
                font-size: 0.36rem;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
            }
        }
        &.profit-disciple {
            .amount {
                color: rgba(88, 104, 209, 1);
            }
            .profit-origin {
                font-size: 0.36rem;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
                border-left: 1px solid rgba(217, 217, 217, 1);
                border-right: 1px solid rgba(217, 217, 217, 1);
            }
        }
        &.profit-share {
            .amount {
                color: rgba(88, 104, 209, 1);
            }
            .profit-origin {
                font-size: 0.36rem;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
            }
        }
    }
}
.profit-type .profit-origin {
    text-align: center;
}
.other-type {
    display: flex;
    text-align: center;
    background-color: #fff;
    padding: 0.5rem 0;
    margin: 0.1rem 0;
    .other-type-group {
        flex: 1;
        .other-type-image {
            width: 1.2rem;
            min-width: 1.2rem;
            margin-bottom: 0.2rem;
        }
        &.other-disciple {
            .other-label {
                border-left: 1px solid rgba(217, 217, 217, 1);
                border-right: 1px solid rgba(217, 217, 217, 1);
            }
        }
    }
}
.other-type div {
    flex: 1;
}
.center-other .amount {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: gray;
    margin: 0 auto;
}
</style>