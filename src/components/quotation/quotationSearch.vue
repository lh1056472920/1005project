<template>
    <div class="quotation-search">
        <header>
            <span class="back" v-tap="{ methods: goBack }"></span>
            <div class="search-form">
                <span class="search-icon"></span>
                <input class="search-input" type="text" name="search-input" v-model.trim="searchText" placeholder="请输入搜索内容">
                <span class="search-clear" v-tap="{ methods: clearInput }"></span>
            </div>
            <button class="btn-search" v-tap="{ methods: search }">{{btnText}}</button>
        </header>
        <hr />
        <div class="hotSearch" v-show="!showSearchList">
            <p class="search-title">热门搜索</p>
            <ul class="search-list">
                <li class="search-item" v-for="(item,i) in list" :key="i" v-text="item" v-tap="{ methods: toSearch, params: item }"></li>
                <!-- <li class="search-item" v-for="(item,i) in list" :key="i" v-text="item.name" v-tap="{ methods: toSearch, text: item.name }"></li> -->
            </ul>
        </div>
        <div class="historySearch" v-show="!showSearchList">
            <p class="historySearch-title">搜索历史</p>
            <p class="emptyRecord" v-tap='{methods:emptyRecord}'><img src="../../../static/images/empty.png" alt=""> 清除历史</p>
            <ul>
                <li class="history-item" v-for="(item,i) in historyList" :key="i" v-tap="{ methods: toSearch, params: item }">{{item}}</li>
            </ul>
        </div>
        <ul class="quotation-list" v-show="showSearchList">
            <li v-for="(item,i) in searchList" :key="i" v-tap="{methods:quotationDetail,query:{symbol:item.marketName,coin:item.coin,counterparty:item.counterparty,marketName:item.type}}">
                <span class="market">{{item.coin}}
                    <i>{{item.counterparty}}</i>
                </span>
                <span class="type">{{item.type}}</span>
                <hr />
            </li>
            <li v-for="(item,i) in currentSearchList" :key="i" v-tap="{methods:quotationDetail,query:{symbol:item.marketName,coin:item.coin,counterparty:item.counterparty,marketName:item.type}}">
                <p v-html="item.marketName&&item.marketName.replace(new RegExp(searchText,'igm'), `<span style=\'color: #f25a36;\'>${(item.marketName.indexOf(searchText)==0)?searchText:(searchText.toUpperCase())}</span>`)">{{item.marketName}}</p>
                <hr />
                <span class="type">{{item.type}}</span>
            </li>
        </ul>
        <p v-show="showSearchList&&searchList.length===0&&currentSearchList.length==0" class="no-result">无搜索结果</p>
    </div>
</template>

<script>
import remote from "../../lib/js/remote";
import { MessageBox } from "mint-ui";
export default {
    name: "quotationSearch",
    data() {
        return {
            searchText: "",
            list: ["BCC", "EOS", "ETH", "LTC", "ETC", "QTUM", "BTC"],
            showSearchList: false,
            searchList: [],
            currentSearchList: [],
            btnText: "搜索",
            historyList: [],
            exchangeRateList: "",
            exchangeRate: 0,
            daoToYuan: 0
        };
    },
    created() {
        this.exchangeRateList = JSON.parse(
            sessionStorage.getItem("exchangeList")
        );
        this.daoToYuan = JSON.parse(sessionStorage.getItem("daoToYuan"));
    },
    mounted() {
        this.historyList =
            JSON.parse(localStorage.getItem("historyList")) || [];
    },
    activated() {},
    deactivated() {
        this.showSearchList = false;
        this.searchText = "";
    },
    watch: {
        searchText() {
            this.getSearchRes();
        }
    },
    methods: {
        goBack() {
            this.$router.goBack();
        },
        clearInput() {
            this.searchText = "";
        },
        toSearch(data) {
            if (data) {
                this.searchText = data.params;
            }
        },
        quotationDetail(data) {
            console.log(this.exchangeRateList);
            let counterparty = data.query.counterparty;
            console.log(counterparty);
            if (counterparty.toUpperCase() == "USDT") {
                this.exchangeRate = 1 * this.daoToYuan;
            } else if (counterparty.toUpperCase() == "BTC") {
                this.exchangeRate =
                    Number(this.exchangeRateList["BTCUSDT"].lastPrice) *
                    this.daoToYuan;
            } else if (counterparty.toUpperCase() == "BNB") {
                this.exchangeRate =
                    Number(this.exchangeRateList["BNBUSDT"].lastPrice) *
                    this.daoToYuan;
            } else if (counterparty.toUpperCase() == "ETH") {
                this.exchangeRate =
                    Number(this.exchangeRateList["ETHUSDT"].lastPrice) *
                    this.daoToYuan;
            } else if (counterparty.toUpperCase() == "HT") {
                this.exchangeRate =
                    Number(this.exchangeRateList["htusdt"].tick.close) *
                    this.daoToYuan;
            } else if (counterparty.toUpperCase() == "OKB") {
                this.exchangeRate =
                    Number(this.exchangeRateList["okb_usdt"].ticker.last) *
                    this.daoToYuan;
            } else if (counterparty.toUpperCase() == "QTUM") {
                this.exchangeRate =
                    Number(this.exchangeRateList["qutm_usdt"].last) *
                    this.daoToYuan;
            } else if (counterparty.toUpperCase() == "ZB") {
                this.exchangeRate =
                    Number(this.exchangeRateList["zb_usdt"].ticker.last) *
                    this.daoToYuan;
            } else if (counterparty.toUpperCase() == "QC") {
                this.exchangeRate =
                    Number(this.exchangeRateList["usdt_qc"].ticker.last) /
                    this.daoToYuan;
            }
            // 跳转至详情页面
            this.$router.push({
                path: "/quotationDet",
                query: {
                    symbol: data.query.symbol,
                    coin: data.query.coin,
                    counterparty: data.query.counterparty,
                    marketName: data.query.marketName,
                    exchangeRate: this.exchangeRate
                }
            });
        },
        search() {
            document.activeElement.blur();
            this.searchList = [];
            if (this.btnText === "搜索") {
                if (!this.searchText) {
                    MessageBox.close();
                    MessageBox.alert("", {
                        title: this.$t("m.tips"),
                        message: "搜索内容不能为空"
                    });
                    return;
                }
                let flag = true;
                this.historyList.forEach((item, i) => {
                    if (item == this.searchText) {
                        this.historyList.splice(i, 1);
                        this.historyList.unshift(item);
                        flag = false;
                    }
                });
                if (flag == true) {
                    this.historyList.unshift(this.searchText);
                }
                localStorage.setItem(
                    "historyList",
                    JSON.stringify(this.historyList)
                );
                this.btnText = "取消";
                // let url = `https://www.blockgdex.com/kpl/wallert/search?name=${
                //     this.searchText
                // }`;
                let url = `http://192.168.1.225:5656/kpl/wallert/search?name=${
                    this.searchText
                }`;
                this.$axios.get(url).then(res => {
                    this.searchList = res.data.wallertMarketsResultTypeList;
                    this.showSearchList = true;
                    let arr = [];
                    this.searchList.forEach(item => {
                        var counterparty = "";
                        var coin = "";
                        if (item.type == "币安") {
                            if (item.marketName.lastIndexOf("BTC") > 0) {
                                counterparty = "BTC";
                                coin = item.marketName.split("BTC")[0];
                            } else if (item.marketName.lastIndexOf("ETH") > 0) {
                                counterparty = "ETH";
                                coin = item.marketName.split("ETH")[0];
                            } else if (item.marketName.lastIndexOf("BNB") > 0) {
                                counterparty = "BNB";
                                coin = item.marketName.split("BNB")[0];
                            } else if (
                                item.marketName.lastIndexOf("USDT") > 0
                            ) {
                                counterparty = "USDT";
                                coin = item.marketName.split("USDT")[0];
                            }
                        } else if (item.type == "火币") {
                            if (item.marketName.lastIndexOf("btc") > 0) {
                                counterparty = "btc";
                                coin = item.marketName.split("btc")[0];
                            } else if (item.marketName.lastIndexOf("eth") > 0) {
                                counterparty = "eth";
                                coin = item.marketName.split("eth")[0];
                            } else if (item.marketName.lastIndexOf("ht") > 0) {
                                counterparty = "ht";
                                coin = item.marketName.split("ht")[0];
                            } else if (
                                item.marketName.lastIndexOf("usdt") > 0
                            ) {
                                counterparty = "usdt";
                                coin = item.marketName.split("usdt")[0];
                            }
                        } else if (item.type == "Gate" || "OKEx" || "zb") {
                            coin = item.marketName.split("_")[0];
                            counterparty = item.marketName.split("_")[1];
                        }

                        arr.push({
                            counterparty: counterparty,
                            coin: coin,
                            type: item.type,
                            marketName: item.marketName
                        });
                    });
                    this.searchList = arr;
                });

                this.currentSearchList = [];
            } else {
                this.showSearchList = false;
                this.searchText = "";
                this.btnText = "搜索";
            }
        },
        emptyRecord() {
            // 清除历史
            this.historyList = [];
            localStorage.removeItem("historyList");
        },
        getSearchRes() {
            if (this.searchText != "") {
                // let url = `https://www.blockgdex.com/kpl/wallert/search?name=${
                //     this.searchText
                // }`;
                let url = `http://192.168.1.225:5656/kpl/wallert/search?name=${
                    this.searchText
                }`;
                this.$axios.get(url).then(res => {
                    this.currentSearchList =
                        res.data.wallertMarketsResultTypeList;
                    this.showSearchList = true;
                    console.log(this.currentSearchList);
                    
                    let arr = [];
                    this.currentSearchList.forEach(item => {
                        var counterparty = "";
                        var coin = "";
                        if (item.type == "币安") {
                            if (item.marketName.lastIndexOf("BTC") > 0) {
                                counterparty = "BTC";
                                coin = item.marketName.split("BTC")[0];
                            } else if (item.marketName.lastIndexOf("ETH") > 0) {
                                counterparty = "ETH";
                                coin = item.marketName.split("ETH")[0];
                            } else if (item.marketName.lastIndexOf("BNB") > 0) {
                                counterparty = "BNB";
                                coin = item.marketName.split("BNB")[0];
                            } else if (
                                item.marketName.lastIndexOf("USDT") > 0
                            ) {
                                counterparty = "USDT";
                                coin = item.marketName.split("USDT")[0];
                            }
                        } else if (item.type == "火币") {
                            if (item.marketName.lastIndexOf("btc") > 0) {
                                counterparty = "btc";
                                coin = item.marketName.split("btc")[0];
                            } else if (item.marketName.lastIndexOf("eth") > 0) {
                                counterparty = "eth";
                                coin = item.marketName.split("eth")[0];
                            } else if (item.marketName.lastIndexOf("ht") > 0) {
                                counterparty = "ht";
                                coin = item.marketName.split("ht")[0];
                            } else if (
                                item.marketName.lastIndexOf("usdt") > 0
                            ) {
                                counterparty = "usdt";
                                coin = item.marketName.split("usdt")[0];
                            }
                        } else if (item.type == "Gate" || "OKEx" || "zb") {
                            coin = item.marketName.split("_")[0];
                            counterparty = item.marketName.split("_")[1];
                        }

                        arr.push({
                            counterparty: counterparty,
                            coin: coin,
                            type: item.type,
                            marketName: item.marketName
                        });
                    });
                    this.currentSearchList = arr;
                });
            } else if (this.searchText == "") {
                this.currentSearchList = [];
                this.showSearchList = false;
            }
            this.searchList = [];
            this.btnText = "搜索";
        }
    }
};
</script>

<style scoped>
.quotation-search {
}
header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top: 0.72rem;
}
.back {
    display: inline-block;
    width: 0.8rem;
    height: 1.44rem;
    background-image: url("../../../static/images/back.png");
    background-position: 0.27rem center;
    background-size: 0.32rem 0.6rem;
    background-repeat: no-repeat;
}
.search-form {
    display: inline-flex;
    align-items: center;
    width: 8.14rem;
    height: 0.8rem;
    border-bottom: #29dc54 solid 1px;
}
.search-icon {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    background-image: url("../../../static/images/search-gray.png");
    background-size: 0.4rem 0.44rem;
    background-position: center;
    background-repeat: no-repeat;
}
.search-input {
    font-size: 0.36rem;
    display: inline-block;
    width: 7rem;
    height: 0.6rem;
    border: 0;
    color: #374452;
    outline: none;
    background-color: transparent;
}
::-webkit-input-placeholder {
    color: #a6afba;
}
.search-clear {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    background-image: url("../../../static/images/clear.png");
    background-size: 0.48rem;
    background-position: center;
    background-repeat: no-repeat;
}
.btn-search {
    font-size: 0.42rem;
    padding: 0;
    border: 0;
    color: #42c300;
    background-color: transparent;
    outline: none;
}

.hotSearch {
    margin-top: 0.12rem;
    background-color: #f4f7f9;
}
.search-title {
    font-size: 0.48rem;
    padding: 0.47rem 0.45rem;
    color: #374452;
}
.search-list {
    margin: 0 0.22rem;
}
.search-item {
    font-size: 0.38rem;
    display: inline-block;
    /* width: 2.35rem; */
    padding: 0 0.5rem;
    height: 0.73rem;
    line-height: 0.73rem;
    border-radius: 0.37rem;
    margin: 0 0 0.24rem 0.24rem;
    color: #374452;
    background-color: #e8eef2;
    text-align: center;
}

.historySearch {
    margin-top: 0.12rem;
    background-color: #f4f7f9;
}
.historySearch p {
    display: inline-block;
}

.historySearch-title {
    margin: 0.47rem 0.45rem;
    font-size: 0.48rem;
    color: #374452;
}

.emptyRecord {
    height: 1.6rem;
    font-size: 0.38rem;
    line-height: 1.6rem;
    color: #f25a36;
    float: right;
    margin-right: 0.41rem;
}

.emptyRecord img {
    width: 0.36rem;
    height: 0.36rem;
    vertical-align: baseline;
}

.history-item {
    height: 1.5rem;
    display: flex;
    align-items: center;
    padding-left: 0.45rem;
    font-size: 0.42rem;
    color: #374452;
}

.no-result {
    font-size: 0.42rem;
    margin-top: 1rem;
    text-align: center;
    color: #a6afba;
}

.quotation-list {
    background-color: #f4f7f9;
}

.quotation-list li {
    height: 1.5rem;
    padding-left: 0.42rem;
    padding-right: 0.48rem;
    line-height: 1.5rem;
}

.quotation-list li p {
    float: left;
    width: 60%;
    color: #374452;
    font-size: 0.42rem;
}

.quotation-list span {
    color: #374452;
    font-size: 0.42rem;
}

.quotation-list .type {
    float: right;
}

.quotation-list .market i {
    color: #a6afba;
    font-size: 0.3rem;
}
</style>