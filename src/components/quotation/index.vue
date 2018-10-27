<template>
    <div class="cbIndex">
        <header @touchmove.prevent>
                <span class="back" ></span>
                <span class="title">币种详情</span>
            <div class="search-box" @click="cbsearch">
                <i class="iconfont icon-sousuo"></i>
            </div>
        </header>
        <div class="sub">
            <div class="quotation" v-if="activeIndex==1">
                <ul class="nav" @touchmove.prevent>
                    <li :class="{active:active==='自选'}">
                        <div v-tap="{methods: select,type: '自选'}">自选</div>
                    </li>
                    <li :class="{active:active==='币安'}">
                        <div v-tap="{methods: select,type: '币安'}">币安</div>
                    </li>
                    <li :class="{active:active==='火币'}">
                        <div v-tap="{methods: select,type: '火币'}">火币</div>
                    </li>
                    <li :class="{active:active==='OKEx'}">
                        <div v-tap="{methods: select,type: 'OKEx'}">OKEx</div>
                    </li>
                    <li :class="{active:active==='ZB'}">
                        <div v-tap="{methods: select,type: 'ZB'}">ZB</div>
                    </li>
                </ul>
                <div class="quotation-content">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </div>
            </div>
        </div>
        <div class="aboutfooter">
            <div v-tap="{methods: diajji, index: 1}" class="one">
                <div :class="{dianji:isjiaji==1}"></div>
                <span :class="{dianji1:isjiaji==1}">行情</span>
            </div>
            <div v-tap="{methods: diajji, index: 2}" class="two">
                <div :class="{dianji:isjiaji==2}"></div>
                <span :class="{dianji1:isjiaji==2}">预警</span>
            </div>
            <div v-tap="{methods: diajji, index: 3}" class="three">
                <div :class="{dianji:isjiaji==3}"></div>
                <span :class="{dianji1:isjiaji==3}">授权</span>
            </div>
            <div v-tap="{methods: diajji, index: 4}" class="four">
                <div :class="{dianji:isjiaji==4}"></div>
                <span :class="{dianji1:isjiaji==4}">我的</span>
            </div>
        </div>
    </div>
</template>
<script>
import scrollBeam from "../../commons/components/srcollBeam";
import { plusReady } from "../../lib/js/plusReady";
import { createParams } from './../../commons/js/dsParams.js'
import { getPayURL } from './../../commons/js/pay.js'

export default {
    name: "cbIndex",
    data() {
        return {
            isjiaji:1,
            scrollNum: 0,
            activeIndex: 1,
            active: "币安", // 交易所名称
            priceNum: 0,
            bigDealNum: 0,
            stubNum: 0,
            userId: "888806"
        };
    },
    created() {
        this.timer = null;
        this.userInfo = this.$store.state.userInfo || {};
        this.active = localStorage.getItem("active") || '币安';
        this.activeIndex = JSON.parse(localStorage.getItem("activeIndex")) || 1;
        this.getRemindData();
    },
    components: {
        scrollBeam
    },
    mounted() {
        this.timer = setTimeout(() => {
            this.showDashang();
        },3000)
        plusReady(() => {
            // 添加返回事件
            /*this.$backbuttonEvent.push(() => {
                if (this.$route.meta.isQuit) {
                    MessageBox.close()
                    MessageBox.confirm(this.$t('m.isLogout')).then(action => {
                        window.plus.runtime.quit()
                    }).catch(cancel => {
                        console.log(cancel)
                    })
                } else {
                    router.goBack()
                }
            })*/
        });
    },
    methods: {
         diajji(params){
            let res = params.index;
            if (res==1) {
                this.isjiaji=1
                this.$router.push({
                    path:'/QuotationIndex'
                })
            }else if (res==2) {
                this.isjiaji=2
                this.$router.push({
                    path:'/remind'
                })
            }else if (res==3) {
                this.isjiaji=3
                this.$router.push({
                    path:'/myAuthorization'
                })
            }else if (res==4) {
                this.isjiaji=4
                this.$router.push({
                    path:'/about'
                })
            }
        },
        checkindex(active) {
            // this.activeIndex = active;
            // if (this.activeIndex == 1) {
            //     // this.$router.push({
            //     //     path: "/Quotation"
            //     // });
            // } else if (this.activeIndex == 2) {
            //     // this.$router.push({
            //     //     path: "/market"
            //     // });
            // }
            sessionStorage.setItem("activeIndex", active);
        },
        cbsearch() {
            this.$router.push({
                path: "/quotationSearch"
            });
        },
        clickUser() {
            this.$router.push({
                path: "/about"
            });
        },
        toSearch() {
            this.$router.push({
                path: "/quotationSearch"
            });
        },
        select(params) {
            this.active = params.type;
            localStorage.setItem("active", this.active);
            if (this.active == "自选") {
                this.$router.push({
                    path: "/optional"
                });
            } else if (this.active == "币安") {
                this.$router.push({
                    path: "/bian"
                });
            } else if (this.active == "火币") {
                this.$router.push({
                    path: "/huobi"
                });
            } else if (this.active == "OKEx") {
                this.$router.push({
                    path: "/okex"
                });
            } else if (this.active == "ZB") {
                this.$router.push({
                    path: "/ZB"
                });
            }
        },
        getRemindData() {
            this.userId = this.$store.state.userInfo.uid;
            let url =
                "http://192.168.1.225:5656/kpl/wallert/remind/selectCount";
            this.$axios
                .get(url, {
                    params: {
                        uid: this.userId
                    }
                })
                .then(res => {
                    this.priceNum = res.data.wallertMarketReminds.price;
                    this.bigDealNum = res.data.wallertMarketReminds.big;
                });
        },
        showDashang() {
            //加密参数
            let data = createParams({
                userid: this.userInfo.uid,
                username: this.userInfo.username
            });
            data.type = '5';
            //检查用户是否达到打赏条件
            this.$remote.check_user_profit(data).then((res) => {
                let profit = res.data.list;
                if (profit.shared && profit.shared.length > 0) {
                    this.$dsMessageBox({
                        list: profit
                    }).then(data => {
                        if (data && data.amount) {
                            this.getPayUrl(data.amount)
                        }
                    });
                }
            })
        },
        //获取打赏地址并打开
        async getPayUrl(amount) {
            this.$plusReady(() => {
                window.plus.nativeUI.showWaiting( "正在加载..." );
            })
            let urlInfo = await getPayURL({
                price: String(amount),
                telephone: this.userInfo.phone,
                userid: this.userInfo.uid,
                type: 'ds'
            });
            
            if (urlInfo && urlInfo.status === 0 && urlInfo.list) {
                this.$plusReady(() => {
                    window.plus.nativeUI.closeWaiting();
                    window.plus.runtime.openWeb(urlInfo.list);
                })
            } else {
                this.$plusReady(() => {
                    window.plus.nativeUI.closeWaiting();
                    window.plus.nativeUI.toast( "获取支付地址失败，请重试!");
                })
            }
        }
    },
    beforeDestroy() {
        localStorage.setItem("activeIndex", JSON.stringify(this.activeIndex));
        clearTimeout(this.timer)
    }
};
</script>
<style>
.cbIndex .title {
    margin-left: 0.8rem;
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
.aboutfooter >div {
    width: 25%;
    height: 1.6rem;
    color: #999;
    font-size: 0.38rem;
    text-align: center;
    position: relative;
}
.aboutfooter >div >div {
    width: 0.6rem;
    height: 0.6rem;
    margin:0.3rem auto 0.1rem;
}
.aboutfooter >div.one >div{
    background-image: url(../../../static/images/hq1.png);
    background-size: 0.6rem 0.6rem;
}
.aboutfooter >div.two >div{
    background-image: url(../../../static/images/tx1.png);
    background-size: 0.6rem 0.6rem;
    
}
.aboutfooter >div.three >div{
    background-image: url(../../../static/images/sq1.png);
    background-size: 0.6rem 0.6rem;
    
}
.aboutfooter >div.four >div{
    background-image: url(../../../static/images/wd1.png);
    background-size: 0.6rem 0.6rem;
    
}
.aboutfooter >div.one >div.dianji{
    background-image: url(../../../static/images/hq2.png);
    background-size: 0.6rem 0.6rem;
}
.aboutfooter >div.two >div.dianji{
    background-image: url(../../../static/images/tx2.png);
    background-size: 0.6rem 0.6rem;
    
}
.aboutfooter >div.three >div.dianji{
    background-image: url(../../../static/images/sq2.png);
    background-size: 0.6rem 0.6rem;
    
}
.aboutfooter >div.four >div.dianji{
    background-image: url(../../../static/images/wd2.png);
    background-size: 0.6rem 0.6rem;
    
}
.aboutfooter >div span.dianji1 {
    color: #5868D1;
}
.aboutfooter >div span {
    display: block;
}
.cbIndex {
    width: 100%;
    height: calc(100vh);
    overflow-y: auto;
}

.cbIndex header {
    text-align: center;
    /* padding-top: 0.72rem; */
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 1.6rem;
    background-color: #f4f7f9;
    margin-bottom: 3px;
    z-index: 88;
}

.cbIndex .sub {
    width: 100%;
    /* height:100%; */
    padding-top: 1.6rem;
}
.cbIndex .user {
    display: inline-block;
    height: 100%;
    text-align: center;
    line-height: 1.6rem;
    margin-left: 0.42rem;
}
.cbIndex .user span {
    font-size: 18px;
    /* background-color: #42c300; */
    color: #42c300;
}
.cbIndex .pricenav {
    position: absolute;
    background-color: #e2eaee;
    display: inline-block;
    box-sizing: border-box;
    vertical-align: top;
    width: 30%;
    height: 35px;
    text-align: center;
    line-height: 35px;
    top: 0.3rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0;
    padding: 2px;
    border-radius: 3px;
}
.cbIndex .pricenav span {
    display: inline-block;
    width: 100%;
    font-size: 0.4rem;
    /* background-color: pink; */
    height: 31px;
    line-height: 31px;
    color: #a6afba;
    text-align: center;
    border-radius: 3px;
}
.cbIndex .pricenav .activeClass {
    background-color: #fff;
    color: #42c300;
}
.cbIndex .search-box {
    float: right;
    height: 100%;
    line-height: 1.6rem;
    margin-right: 4%;
}
.cbIndex .search-box i {
    font-size: 20px;
    color: #999;
}

.quotation .nav {
    position: fixed;
    top: 1.6rem;
    height: 1.4rem;
    background-color: #f4f7f9;
    width: 100%;
    z-index: 88;
}

.quotation .nav li {
    font-size: 0.46rem;
    height: 1.4rem;
    line-height: 1.4rem;
    margin: auto 0.5rem;
    color: #374452;
    text-align: center;
    display: inline-block;
}

.quotation .nav li.active {
    color: #42c300;
    border-bottom: 1px solid #42c300;
    box-sizing: border-box;
}

.quotation .nav li a {
    color: #374452;
}
.quotation .nav li.active a {
    color: #42c300;
}

.quotation-content {
    padding-top: 1.4rem;
}

</style>


