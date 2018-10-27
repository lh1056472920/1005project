<template>
    <div class="market">
        <main>
            <header>
                <span class="back"></span>
                <span class="title">行情提醒</span>
            </header>
            <!-- <marquee id="affiche" align="left" behavior="scroll" bgcolor="#FF0000" direction="left" height="300" width="200" hspace="50" vspace="20" loop="-1" scrollamount="10" scrolldelay="100" onMouseOut="this.start()" onMouseOver="this.stop()">
这里可以放文字、图片、表格等都可以跑马灯滚动展示
</marquee> -->
            <scrollBeam></scrollBeam>
            <div class="main-box">
                <p class="setRemind">提醒设置</p>
                <div class="setRemindChild">
                    <router-link to="/priceRemind" tag="div">
                        <img src="../../../static/images/drawable-xxhdpi/price.png" alt="">
                        <p v-if="priceNum">价格提醒 ( {{priceNum}} 个 )</p>
                        <p v-else>价格提醒</p>
                    </router-link>
                    <router-link to="/bigUnit" tag="div">
                        <img src="../../../static/images/drawable-xxhdpi/dadan.png" alt="">
                        <p v-if="bigDealNum">大单买卖提醒 ( {{bigDealNum}} 个 )</p>
                        <p v-else>大单买卖提醒</p>
                    </router-link>
                    <router-link to="/anomaly" tag="div">
                        <img src="../../../static/images/drawable-xxhdpi/bodong (2).png" alt="">
                        <p>短线异常波动</p>
                    </router-link>
                    <router-link to="/boomOrSlump" tag="div">
                        <img src="../../../static/images/drawable-xxhdpi/baozhang.png" alt="">
                        <p v-if="boomNum">暴涨暴跌提醒 ( {{boomNum}} 个 ) </p>
                        <p v-else>暴涨暴跌提醒</p>
                    </router-link>
                </div>
                <p class="setStub">特色买卖</p>
                <div class="setStubChild">
                    <router-link to="/chalk" tag="div">
                        <img src="../../../static/images/drawable-xxhdpi/fenbi.png" alt="">
                        <p>分笔委托(vip)</p>
                        <img class="vip" src="../../../static/images/drawable-xxhdpi/VIP.png" alt="">
                    </router-link>
                        <router-link to="/plan" tag="div">
                            <img src="../../../static/images/drawable-xxhdpi/jihua.png" alt="">
                            <p>云委托(vip)</p>
                            <img class="vip" src="../../../static/images/drawable-xxhdpi/VIP.png" alt="">
                    </router-link>
                            <router-link to="/straddle" tag="div">
                                <img src="../../../static/images/drawable-xxhdpi/taoli.png" alt="">
                                <p>套利模式(限时/限量)</p>
                                <img class="vip" src="../../../static/images/drawable-xxhdpi/VIP.png" alt="">
                    </router-link>
                </div>
                <p class="setStub">短线精灵</p>
                <div class="setStubChild">
                    <router-link to="/queryToken" tag="div">
                        <img src="../../../static/images/drawable-xxhdpi/chicang (2).png" alt="">
                        <p>代币持仓查询</p>
                    </router-link>
                    <router-link to="/githubList" tag="div">
                        <img src="../../../static/images/drawable-xxhdpi/chicang (2).png" alt="">
                        <p>Github代码榜</p>
                    </router-link>
                </div>

            </div>
        </main>
        <div class="aboutfooter">
            <div @click="diajji(1)" class="one">
                <div :class="{dianji:isjiaji==1}"></div><span :class="{dianji1:isjiaji==1}">行情</span>
            </div>
            <div @click="diajji(2)" class="two">
                <div :class="{dianji:isjiaji==2}"></div><span :class="{dianji1:isjiaji==2}">预警</span>
            </div>
            <div @click="diajji(3)" class="three">
                <div :class="{dianji:isjiaji==3}"></div><span :class="{dianji1:isjiaji==3}">授权</span>
            </div>
            <div @click="diajji(4)" class="four">
                <div :class="{dianji:isjiaji==4}"></div><span :class="{dianji1:isjiaji==4}">我的</span>
            </div>
        </div>
    </div>
</template>
<script>
import scrollBeam from "../../commons/components/srcollBeam";
export default {
    data() {
        return {
            isjiaji: 2,
            priceNum: "",
            bigDealNum: "",
            boomNum: ""
        };
    },
    components: {
        scrollBeam
    },
    created() {
        this.getRemindData();
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
        getRemindData() {
            this.userId = this.$store.state.userInfo.uid;
            let url =
                "http://chaobi.lian2345.com/kpl/wallert/remind/selectCount";
            this.$axios
                .get(url, {
                    params: {
                        uid: this.userId
                    }
                })
                .then(res => {
                    console.log(res);
                    if (res.data.wallertMarketReminds!=null) {
                        
                        this.priceNum = res.data.wallertMarketReminds.price;
                        this.bigDealNum = res.data.wallertMarketReminds.big;
                        this.boomNum = res.data.wallertMarketReminds.baozhang;
                    }
                });
        },
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>

<style>
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
    display: flex;
    justify-content: center;
    width: 25%;
    height: 1.6rem;
    line-height: 1.6rem;
    color: #999;
    font-size: 0.38rem;
    text-align: center;
    position: relative;
}
.aboutfooter > div > div {
    width: 0.6rem;
    height: 0.6rem;
    margin-top: 0.3rem;
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
    position: absolute;
    top: 0.4rem;
}
.market header {
    width: 100%;
    height: 1.44rem;
    text-align: center;
    top: 0;
    left: 0;
    z-index: 999;
}
.market .back {
    width: 0.8rem;
    height: 1.44rem;
    background-image: url("../../../static/images/back.png");
    background-position: 0.27rem center;
    background-size: 0.32rem 0.6rem;
    background-repeat: no-repeat;
}

.market .title {
    width: 8.14rem;
    height: 1.44rem;
    line-height: 1.44rem;
    text-align: center;
    font-size: 0.54rem;
    color: #404040;
    font-size: 18px;
    font-weight: 700;
    color: #374452;
}

.market main {
    margin-bottom: 2rem;
    z-index: 999;
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    background-color: #e3ebee;
    background-image: linear-gradient(135deg, #f4f7f9, #e2eaee);
}
.market main .main-box {
    padding: 0 0.42rem;
}

.market main .setRemind,
.market main .setStub {
    font-size: 0.42rem;
    font-weight: bold;
    padding: 0.37rem 0;
}

.market main .setRemindChild,
.market main .setStubChild {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

.market main .setRemindChild > div,
.market main .setStubChild > div {
    padding: 0 0.2rem;
    box-sizing: border-box;
    height: 2.8rem;
    width: 4.8rem;
    text-align: center;
    background-color: #fff;
    margin-bottom: 13px;
    border-radius: 0.2rem;
}
.market main .setRemindChild img,
.market main .setStubChild img {
    padding-top: 0.6rem;
    padding-bottom: 0.3rem;
    width: 0.88rem;
}

.market main .setRemindChild > div p {
    font-size: 0.4rem;
    color: #374452;
}
.market main .setRemindChild > div span {
    color: #a6afba;
    font-size: 0.36rem;
    float: right;
    line-height: 1.8rem;
}
.market main .setRemindChild > div:first-child i {
    font-size: 0.4rem;
    color: #1fa7f2;
}
.market main .setRemindChild > div:nth-child(2) i {
    font-size: 0.4rem;
    color: #35d7b7;
}

.market main .setStubChild > div p {
    color: #374452;
    font-size: 0.4rem;
}
.market main .setStubChild > div {
    position: relative;
}
.market main .setStubChild > div .vip {
    position: absolute;
    padding: 0;
    top: 0;
    right: 0;
    width: 0.66rem;
}

.market main .setStubChild > div:first-child i {
    color: #663399;
}
</style>
