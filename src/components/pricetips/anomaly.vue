<template>
    <div class="anomaly">
        <header>
            <i class="iconfont icon-fanhui" @click="goback"></i>
            <span @click="explain">短线异常波动</span>
            <i class="iconfont icon-sousuo" @click="goSearch"></i>
        </header>
             <div v-if="allDataArr.length ===0" @click="goSearch" class="addRemind">
                <i class="iconfont icon-tianjia" @click='goSearch'></i>
                <p>
                    您还没有添加提醒，马上添加吧 ~
                </p>
            </div>
        <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <li v-for="(item,i) in allDataArr" :key="i">
                <div class="data-box">
                    <div class="time-box">
                        <span class="wave-time">{{item.date | formatDate}}</span>
                    </div>
                    <div class="symbol-box">
                        <p>
                            <i class="currency">{{item.coin}}</i>
                            <i class="contrast">/{{item.counterparty}}</i>
                        </p>
                        <p>{{item.marketName}}网</p>
                    </div>
                    <div class="type-box">
                        <span class="changeUp" :class="{changeDown: item.hortType ==='盘中大跌' || item.hortType ==='大单卖出'|| item.hortType ==='猛烈打压'|| item.hortType ==='高台跳水'}">{{item.hortType}}</span>
                    </div>
                    <div class="amount-box">
                        <span v-if="item.hortType === '大单卖出' || item.hortType === '大单买入'" class="changeUp" :class="{changeDown: item.hortType ==='盘中大跌' || item.hortType ==='大单卖出'|| item.hortType ==='猛烈打压'|| item.hortType ==='高台跳水'}">{{(item.value).toFixed(2)}}万</span>
                        <span v-else class="changeUp" :class="{changeDown: item.hortType ==='盘中大跌' || item.hortType ==='大单卖出'|| item.hortType ==='猛烈打压'|| item.hortType ==='高台跳水'}">{{(item.value).toFixed(2)}}%</span>
                    </div>
                </div>
            </li>
            <mt-spinner type="fading-circle" color="#26a2ff" v-show="showIcon"></mt-spinner>
            <p v-show="showdata">
                {{loadingType}}
            </p>
        </ul>
    </div>
</template>
<script>
import remote from "../../lib/js/remote.js";
import { InfiniteScroll } from "mint-ui";
import { formatDate } from "../../lib/js/date.js";
export default {
    data() {
        return {
            allDataArr: [],
            showdata: false,
            showIcon: false,
            loadingType: "已完全加载",
            loading: false,
            page: 1
        };
    },
    created() {
        // this.getInitializeData();
        this.$toStatistic('anomaly');
    },
    mounted() {
        // this.$socket.open();
    },
    methods: {
        //初始化数据
        getInitializeData() {
            if (this.page !== 1) {
                this.showIcon = true;
            }
            let params = {
                pageIndex: this.page
            };
            let data = [];
            remote.select_fluctuate(params).then(res => {
                console.log(res);
                if (
                    res.data.code === "200" &&
                    res.data.shortPageInfo.list.length == 0
                ) {
                    this.showIcon = false;
                    this.showdata = true;
                    this.loading = true;
                } else if (
                    res.data.code === "200" &&
                    res.data.shortPageInfo.list.length > 0
                ) {
                    this.showdata = false;
                    data = res.data.shortPageInfo.list;
                    data.forEach(item => {
                        this.getSymbol(item);
                        this.allDataArr.push(item);
                    });
                    this.loading = false;
                    if (this.allDataArr) {
                        data = null;
                    }
                }
            });
        },
        loadMore() {
            this.loading = true;
            this.getInitializeData();
            console.log(this.page);
            this.page++;
        },
        goback() {
            this.$router.go(-1);
        },
        explain() {
            this.$router.push({ path: "/explain" });
        },
        goSearch() {
            this.$router.push({
                path: "/quotationSearch"
            });
        },
        //切割交易对
        getSymbol(data) {
            if (data.marketName === "币安") {
                if (data.marketToken.lastIndexOf("BTC") > 0) {
                    data.counterparty = "btc";
                    data.coin = data.marketToken.split("BTC")[0];
                } else if (data.marketToken.lastIndexOf("ETH") > 0) {
                    data.counterparty = "eth";
                    data.coin = data.marketToken.split("ETH")[0];
                } else if (data.marketToken.lastIndexOf("BNB") > 0) {
                    data.counterparty = "bnb";
                    data.coin = data.marketToken.split("BNB")[0];
                } else if (data.marketToken.lastIndexOf("USDT") > 0) {
                    data.counterparty = "usdt";
                    data.coin = data.marketToken.split("USDT")[0];
                }
            } else if (data.marketName === "火币") {
                if (data.marketToken.lastIndexOf("btc") > 0) {
                    data.counterparty = "btc";
                    data.coin = data.marketToken
                        .split("btc")[0]
                        .toLocaleUpperCase();
                } else if (data.marketToken.lastIndexOf("eth") > 0) {
                    data.counterparty = "eth";
                    data.coin = data.marketToken
                        .split("eth")[0]
                        .toLocaleUpperCase();
                } else if (data.marketToken.lastIndexOf("usdt") > 0) {
                    data.counterparty = "usdt";
                    data.coin = data.marketToken
                        .split("usdt")[0]
                        .toLocaleUpperCase();
                } else if (data.marketToken.lastIndexOf("ht") > 0) {
                    data.counterparty = "ht";
                    data.coin = data.marketToken
                        .split("ht")[0]
                        .toLocaleUpperCase();
                } else if (data.marketToken.lastIndexOf("okb") > 0) {
                    data.counterparty = "okb";
                    data.coin = data.marketToken
                        .split("okb")[0]
                        .toLocaleUpperCase();
                } else if (data.marketToken.lastIndexOf("zb") > 0) {
                    data.counterparty = "zb";
                    data.coin = data.marketToken
                        .split("zb")[0]
                        .toLocaleUpperCase();
                } else if (data.marketToken.lastIndexOf("qc") > 0) {
                    data.counterparty = "qc";
                    data.coin = data.marketToken
                        .split("qc")[0]
                        .toLocaleUpperCase();
                }
            } else if (data.marketName === "OKEx" || data.marketName === "ZB") {
                data.counterparty = data.marketToken.split("_")[1];
                data.coin = data.marketToken.split("_")[0].toLocaleUpperCase();
            }
        }
    },
    beforeDestroy() {
        this.$socket.close();
    },
    filters: {
        formatDate(time) {
            var date = new Date(time * 1000);
            return formatDate(date, "hh:mm:ss");
        }
    }
};
</script>

<style scoped>
.anomaly  .addRemind {
    box-sizing: border-box;
    padding-top: 155px;
    text-align: center;
}
.anomaly  .addRemind i {
    font-size: 50px;
    color: #42c300;
    background-color: #cbe9c4;
    border-radius: 8px;
}
.anomaly  .addRemind p {
    color: #42c300;
    margin-top: 15px;
}
.anomaly header {
    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
    height: 1.6rem;
    background-color: #f4f7f9;
    line-height: 1.6rem;
    box-shadow: 0px 2px 2px 0px rgba(230, 238, 242, 1);
    margin-bottom: 8px;
    position: fixed;
}
.anomaly header i {
    font-size: 18px;
}
.anomaly header span {
    font-size: 18px;
    font-weight: 700;
    color: #374452;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}
.anomaly header i:last-child {
    float: right;
    font-size: 20px;
    color: #48c122;
}
.anomaly ul {
    box-sizing: border-box;
    padding-top: 1.8rem;
    
    box-shadow: 2px 2px 2px rgba(230, 238, 242, 1);
    text-align: center;
}
.anomaly li {
    background-color: rgba(244, 247, 249, 1);
    box-sizing: border-box;
    height: 2rem;
    font-size: 0;
    border-bottom: 1px solid #e2eaee;
}
.anomaly li:last-child {
    border: none;
}
.anomaly li .data-box {
    height: 100%;
}
.anomaly li .data-box > div {
    width: 25%;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    color: #a6afba;
}
.anomaly li .data-box .time-box {
    box-sizing: border-box;
    /* padding-top: 0.4rem; */
    line-height: 1.6rem;
    text-align: center;
    font-size: 13px;
}
.anomaly li .data-box .symbol-box {
    box-sizing: border-box;
    padding-left: 0.2rem;
    font-size: 12px;
}
.anomaly li .data-box .symbol-box p {
    line-height: 0.8rem;
    height: 50%;
}
.anomaly li .data-box .symbol-box .currency {
    font-size: 15px;
    color: #374452;
}
.anomaly li .data-box .symbol-box p:first-child {
    line-height: 1.3rem;
}
.anomaly li .data-box .type-box {
    box-sizing: border-box;
    padding-left: 0.3rem;
    font-size: 15px;
    line-height: 1.5rem;
}
.anomaly li .data-box .amount-box {
    text-align: right;
    box-sizing: border-box;
    padding-right: 0.35rem;
    font-size: 15px;
    line-height: 1.5rem;
}
.anomaly li .changeUp {
    color: #48c122;
}
.anomaly li .changeDown {
    color: red;
}
</style>

