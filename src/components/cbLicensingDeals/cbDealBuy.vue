
<template>
    <div class="cbDealbuy">
        <!-- 交易买入页面 -->
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">{{coin}} / {{counterparty}}&nbsp;
                <i>（{{marketName}}）</i>
            </span>
        </header>
        <div class="onehead" @click="clickone"></div>
        <div class="main">
            <div class="mainNav">
                <div @click="mianDeal('mainBuy')" :class="{active:active=='mainBuy'}">买入</div>
                <div @click="mianDeal('mainSale')" :class="{active:active=='mainSale'}">卖出</div>
                <div @click="mianDeal('mainunsettled')" :class="{active:active=='mainunsettled'}">未成交</div>
                <div @click="mianDeal('mainhistory')" :class="{active:active=='mainhistory'}">历史委托</div>
            </div>
            <div v-if="isShow==1&&isShow1==0" class="ktu1" @click='touch(1)'><img src="../../../static/images/ktu.png" alt="">K线图</div>
            <div v-if="isShow==0&&isShow1==0" class="ktu" @click='touch(2)'><img src="../../../static/images/ktu.png" alt="">K线图</div>
            <div id="chartBoxCB" :style="isFalse">
                <div class="selectTime">
                    <ul class="timeBucket">
                        <li>分时</li>
                        <li :class="{timeActive:timeActive===item}" v-tap="{methods:checkTime,params:item}" v-for="(item,i) in timeList" :key="i">{{item}}</li>
                        <li :class="{moreActive:moreActive!='更多'}" class="more" v-tap="{methods:checkmore,params:ischeckmore}">{{moreActive}}
                            <i class="triangle" v-show="!ischeckmore"></i>
                        </li>

                    </ul>
                    <ul class="drawdown" v-show="ischeckmore">
                        <li :class="{timeActive:timeActive===item}" v-tap="{methods:checkTime,params:item}" v-for="(item,i) in timeList1" :key="i">{{item}}</li>
                        <li v-show="marketName=='币安'||marketName=='火币'" :class="{timeActive:timeActive==='1月'}" v-tap="{methods:checkTime,params:'1月'}">1月</li>
                    </ul>
                    <p class="timeBucketInfo">
                        <span class="openTime">{{currentTime}}</span>
                        <span>开:{{latestInfo[1]}}</span>
                        <span>收:{{latestInfo[0]}}</span>
                        <span>高:{{latestInfo[2]}}</span>
                        <span>低:{{latestInfo[3]}}</span>
                    </p>
                </div>
                <div id="chartCBIdData" style="height:8.68rem;"></div>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import { plusReady } from "../../lib/js/plusReady.js";
import echarts from "echarts";
import axios from "axios";

export default {
    name: "cbDealbuy",
    data() {
        return {
            isFalse: { display: "none"},
            isShow: 0,
            isShow1: 0,
            coin: "",
            counterparty: "",
            active: "mainBuy",
            marketName: "",
            num: -1,
            //k
            isConnect: false,
            symbol: "",
            username: "",
            uuid: "",
            ischeckmore: false,
            timeActive: "15分",
            selectTime: "15m",
            moreActive: "更多",
            timeList: ["15分", "1小时", "4小时", "1天"],
            timeList1: ["1分", "5分", "30分", "1周"],
            KData: [],
            timeId: "",
            timeId1: "",
            start: 95,
            end: 100,
            timeTicket: "",
            latestInfo: [],
            currentTime: "",
            isFull: false,
            isfullscreen: "全屏",
            content: ""
        }
    },
    watch: {
        $route(to, from) {
            console.log(to.path);
            if (
                to.path == "/cbhistory" ||
                to.path == "/cbUnsettled" ||
                to.path == "/cbhistoryBian" ||
                to.path == "/cbUnsettledBian" ||
                to.path == "/cbhistoryZB" ||
                to.path == "/cbUnsettledZB" ||
                to.path == "/cbhistoryOkex" ||
                to.path == "/cbUnsettledOkex"
            ) {
                this.isShow1 = 1;
                this.isShow = 0;
                this.isFalse = { display: "none" };
            } else if (
                to.path == "/cbDealBuyone" ||
                to.path == "/cbDealBuyoneBian" ||
                to.path == "/cbDealBuyoneOkex" ||
                to.path == "/cbDealBuyoneZB"
            ) {
                this.isShow1 = 0;
            }
        }
    },
    created() {
        this.depth();
        this.mianDeal("mainBuy");
        let user = this.$store.state.userInfo;
        this.username = user.username;
    },
    sockets: {
        connect: function() {
            clearInterval(this.timeId);
            clearInterval(this.timeId1);
            if (this.marketName == "币安") {
                this.selectTime = "15m";
                this.sendDetail();
                this.sendK();
                this.timeId = setInterval(() => {
                    if (this.coinInfo == {}) {
                        this.sendDetail();
                    }
                    let sockets = this.$options["sockets"];
                    if (sockets) {
                        Object.keys(sockets).forEach(key => {
                            delete this.$options.sockets[key];
                        });
                    }
                    this.sendK();
                }, 2000);
            } else if (this.marketName == "火币") {
                this.selectTime = "15min";
                this.sendHbDetail();
                this.sendHbK();
                this.timeId1 = setInterval(() => {
                    let sockets = this.$options["sockets"];
                    if (sockets) {
                        Object.keys(sockets).forEach(key => {
                            delete this.$options.sockets[key];
                        });
                    }
                    this.sendHbDetail();
                    this.sendHbK();
                }, 1000);
                // this.timeId = setInterval(()=>{
                // },1000)
            } else if (this.marketName == "Okex") {
                this.selectTime = "15min";
                this.sendOKDetail();
                this.sendOkK();
                this.timeId1 = setInterval(() => {
                    let sockets = this.$options["sockets"];
                    if (sockets) {
                        Object.keys(sockets).forEach(key => {
                            delete this.$options.sockets[key];
                        });
                    }
                    this.sendOKDetail();
                    this.sendOkK();
                }, 1000);
                // this.timeId = setInterval(()=>{
                // },1000)
            } else if (this.marketName == "ZB") {
                this.selectTime = "15min";
                this.sendZBDetail();
                this.sendZBK();
                this.timeId = setInterval(() => {
                    let sockets = this.$options["sockets"];
                    if (sockets) {
                        Object.keys(sockets).forEach(key => {
                            delete this.$options.sockets[key];
                        });
                    }
                    this.sendZBDetail();
                    this.sendZBK();
                }, 1000);
                // this.timeId1 = setInterval(()=>{
                // },1000)
            } else if (this.marketName == "Gate") {
                this.selectTime = "15min";
                this.sendGateDetail();
                this.timeId1 = setInterval(() => {
                    let sockets = this.$options["sockets"];
                    if (sockets) {
                        Object.keys(sockets).forEach(key => {
                            delete this.$options.sockets[key];
                        });
                    }
                    this.sendGateDetail();
                }, 1000);
                this.sendGateK();
            }
            // this.allOptionals();
        },
        disconnect: function() {}
    },
    mounted() {
        this.$socket.open();
        this.latestInfo = [];
    },
    methods: {
        clickone(){
             this.$toStatistic("cbDealbuyvip", "点击vip功能小调查");
            this.$router.push({
                path:"/vipfunc"
            })
        },
        touch(res) {
             this.$toStatistic("cbDealbuyktu", "点击打开k线图");
            if (res == 1) {
                this.isShow = 0;
                this.isFalse = {
                    display: "none",
                    height: "0"
                };
            } else if (res == 2) {
                this.isShow = 1;
                this.isFalse = {
                    height: "10.3rem",
                    transition: "all 2s;",
                    display: "block",
                    'margin-top':'2.9rem',
                    'margin-bottom':'-2.85rem',
                };
            }
        },
        goback() {
            this.$router.go(this.num);
        },
        depth() {
            this.num = -1;
            let counterparty1 = JSON.parse(
                localStorage.getItem("counterparty")
            );
            this.coin = counterparty1.coin;
            this.counterparty = counterparty1.counterparty;
            this.marketName = counterparty1.marketName;
            if (this.marketName == "Okex") {
                this.symbol = this.coin + "_" + this.counterparty;
            } else {
                this.symbol = this.coin + this.counterparty;
            }
        },
        mianDeal(data) {
             this.$toStatistic("cbDealbuya", "点击交易页面买卖");
            
            this.num--;

            this.active = data;
            let _this = this;
            this.$axios
                .post(
                    "http://120.79.0.99/market/api/marketAll/allMarketIndexDetail?type=btc"
                )
                .then(res => {
                    _this.rate = res.data.usdt[0].current_price_cny;

                    localStorage.setItem("rate", _this.rate);
                });
            if (this.marketName == "火币") {
                if (data == "mainBuy" || data == "mainSale") {
                    this.$router.push({
                        path: "/cbDealBuyone",
                        query: {
                            text: data
                        }
                    });
                } else if (data == "mainunsettled") {
                    this.$router.push({
                        path: "/cbUnsettled"
                        // query:{
                        //     text:data
                        // }
                    });
                } else if (data == "mainhistory") {
                    this.$router.push({
                        path: "/cbhistory"
                        // query:{
                        //     text:data
                        // }
                    });
                }
            } else if (this.marketName == "币安") {
                if (data == "mainBuy" || data == "mainSale") {
                    this.$router.push({
                        path: "/cbDealBuyoneBian",
                        query: {
                            text: data
                        }
                    });
                } else if (data == "mainunsettled") {
                    this.$router.push({
                        path: "/cbUnsettledBian"
                        // query:{
                        //     text:data
                        // }
                    });
                } else if (data == "mainhistory") {
                    this.$router.push({
                        path: "/cbhistoryBian"
                        // query:{
                        //     text:data
                        // }
                    });
                }
            } else if (this.marketName == "OKEx" || this.marketName == "Okex") {
                if (data == "mainBuy" || data == "mainSale") {
                    this.$router.push({
                        path: "/cbDealBuyoneOkex",
                        query: {
                            text: data
                        }
                    });
                } else if (data == "mainunsettled") {
                    this.$router.push({
                        path: "/cbUnsettledOkex"
                        // query:{
                        //     text:data
                        // }
                    });
                } else if (data == "mainhistory") {
                    this.$router.push({
                        path: "/cbhistoryOkex"
                        // query:{
                        //     text:data
                        // }
                    });
                }
            } else if (this.marketName == "ZB") {
                if (data == "mainBuy" || data == "mainSale") {
                    this.$router.push({
                        path: "/cbDealBuyoneZB",
                        query: {
                            text: data
                        }
                    });
                } else if (data == "mainunsettled") {
                    this.$router.push({
                        path: "/cbUnsettledZB"
                        // query:{
                        //     text:data
                        // }
                    });
                } else if (data == "mainhistory") {
                    this.$router.push({
                        path: "/cbhistoryZB"
                        // query:{
                        //     text:data
                        // }
                    });
                }
            }
        },
        sendDetail() {
            // 币安详情
            this.$socket.emit("binance", {
                type: "updatek",
                detail: this.symbol,
                time: "1d"
            });
            this.$options.sockets.updatek = coinDetailData => {
                let data = JSON.parse(coinDetailData)["k"];

                if (this.counterparty.toUpperCase() == "USDT") {
                    this.coinInfo = {
                        close: Number(data.c).toFixed(2),
                        volume: Number(data.v).toFixed(2),
                        high: Number(data.h).toFixed(2),
                        low: Number(data.l).toFixed(2),
                        open: Number(data.o).toFixed(2)
                    };
                } else {
                    this.coinInfo = {
                        close: Number(data.c).toFixed(6),
                        volume: Number(data.v).toFixed(6),
                        high: Number(data.h).toFixed(6),
                        low: Number(data.l).toFixed(6),
                        open: Number(data.o).toFixed(6)
                    };
                }
                data = null;
            };
        },
        sendK() {
            //  币安K
            this.$socket.emit("binance", {
                type: "cachek",
                symbol: this.symbol,
                interval: this.selectTime
            });
            this.$options.sockets.cachek = data => {
                let KlineData = JSON.parse(data);

                let dataArr = [];
                for (let i = 0; i < KlineData.length; i++) {
                    dataArr.push([
                        echarts.format.formatTime(
                            "yyyy-MM-dd hh:mm",
                            KlineData[i][0]
                        ), // time
                        Number(KlineData[i][4]), // close
                        Number(KlineData[i][1]), // open
                        Number(KlineData[i][2]), // hight
                        Number(KlineData[i][3]), // low
                        Number(KlineData[i][5]) // volume
                    ]);
                }
                if (KlineData.length < 300) {
                    for (let index = KlineData.length; index < 300; index++) {
                        dataArr.unshift([0]);
                    }
                }
                this.KData = dataArr;
                this.latestInfo = dataArr[dataArr.length - 1];
                this.currentTime = this.latestInfo[0];
                dataArr = null;
                KlineData = null;
                // // 画K线图
                this.drawChart(this.KData);
            };
        },
        sendHbDetail() {
            this.$socket.emit("huobi", { type: "detail", detail: this.symbol });
            this.$options.sockets.huobidetail = coinDetailData => {
                let data = JSON.parse(coinDetailData).tick;

                if (this.counterparty.toUpperCase() == "USDT") {
                    this.coinInfo = {
                        close: Number(data.close).toFixed(2),
                        volume: Number(data.amount).toFixed(2),
                        high: Number(data.high).toFixed(2),
                        low: Number(data.low).toFixed(2),
                        open: Number(data.open).toFixed(2)
                    };
                } else {
                    this.coinInfo = {
                        close: Number(data.close).toFixed(6),
                        volume: Number(data.amount).toFixed(6),
                        high: Number(data.high).toFixed(6),
                        low: Number(data.low).toFixed(6),
                        open: Number(data.open).toFixed(6)
                    };
                }
                data = null;
            };
        },
        sendHbK() {
            this.$socket.emit("huobi", {
                type: "k",
                detail: this.symbol,
                time: this.selectTime
            });
            this.$options.sockets.huobik = data => {
                let KlineData = JSON.parse(data).data;

                let dataArr = [];
                for (let i = 0; i < KlineData.length; i++) {
                    dataArr.push([
                        echarts.format.formatTime(
                            "yyyy-MM-dd hh:mm",
                            KlineData[i]["id"] * 1000
                        ), // time
                        Number(KlineData[i]["close"]), // close
                        Number(KlineData[i]["open"]), // open
                        Number(KlineData[i]["high"]), // hight
                        Number(KlineData[i]["low"]), // low
                        Number(KlineData[i]["amount"]) // volume
                    ]);
                }
                if (KlineData.length < 300) {
                    for (let index = KlineData.length; index < 300; index++) {
                        dataArr.push([0]);
                    }
                }
                dataArr = dataArr.reverse();
                this.KData = dataArr;
                this.latestInfo = dataArr[dataArr.length - 1];
                this.currentTime = this.latestInfo[0];
                KlineData = null;
                dataArr = null;
                // // 画K线图
                this.drawChart(this.KData);
            };
        },
        sendOKDetail() {
            this.$socket.emit("okcoin", {
                type: "ticker",
                detail: this.symbol
            });
            this.$options.sockets.okexticker = coinDetailData => {
                let data = JSON.parse(coinDetailData);
                if (this.counterparty.toUpperCase() == "USDT") {
                    this.coinInfo = {
                        close: Number(data.last).toFixed(2),
                        volume: Number(data.vol).toFixed(2),
                        high: Number(data.high).toFixed(2),
                        low: Number(data.low).toFixed(2),
                        open: Number(data.buy).toFixed(2)
                    };
                } else {
                    this.coinInfo = {
                        close: Number(data.last).toFixed(6),
                        volume: Number(data.vol).toFixed(6),
                        high: Number(data.high).toFixed(6),
                        low: Number(data.low).toFixed(6),
                        open: Number(data.buy).toFixed(6)
                    };
                }
                data = null;
            };
        },
        sendOkK() {
            this.$socket.emit("okcoin", {
                type: "kline",
                symbol: this.symbol,
                time: this.selectTime,
                contract_type: "this_week",
                size: 300
            });
            this.$options.sockets.okex_kline = data => {
                let KlineData = JSON.parse(data);

                let dataArr = [];
                for (let i = 0; i < KlineData.length; i++) {
                    dataArr.push([
                        echarts.format.formatTime(
                            "yyyy-MM-dd hh:mm",
                            KlineData[i][0]
                        ), // time
                        Number(KlineData[i][4]), // close
                        Number(KlineData[i][1]), // open
                        Number(KlineData[i][2]), // hight
                        Number(KlineData[i][3]), // low
                        Number(KlineData[i][5]) // volume
                    ]);
                }
                if (KlineData.length < 300) {
                    for (let index = KlineData.length; index < 300; index++) {
                        dataArr.unshift([0]);
                    }
                }
                this.KData = dataArr;

                this.latestInfo = dataArr[dataArr.length - 1];
                dataArr = null;
                KlineData = null;
                this.currentTime = this.latestInfo[0];
                // // 画K线图
                this.drawChart(this.KData);
            };
        },
        sendZBDetail() {
            this.$socket.emit("zbmarket", {
                type: "detail",
                detail: this.symbol
            });
            this.$options.sockets.zb_ticker = coinDetailData => {
                let data = JSON.parse(coinDetailData);

                if (this.counterparty.toUpperCase() == "USDT") {
                    this.coinInfo = {
                        close: Number(data.last).toFixed(2),
                        volume: Number(data.vol).toFixed(2),
                        high: Number(data.high).toFixed(2),
                        low: Number(data.low).toFixed(2),
                        open: Number(data.buy).toFixed(2)
                    };
                } else {
                    this.coinInfo = {
                        close: Number(data.last).toFixed(6),
                        volume: Number(data.vol).toFixed(6),
                        high: Number(data.high).toFixed(6),
                        low: Number(data.low).toFixed(6),
                        open: Number(data.buy).toFixed(6)
                    };
                }
                data = null;
            };
        },
        sendZBK() {
            this.$socket.emit("zbmarket", {
                type: "k",
                marke: this.symbol,
                time: this.selectTime
            });
            this.$options.sockets.zb_k = data => {
                let KlineData = JSON.parse(data).data;
                let dataArr = [];
                for (let i = 0; i < KlineData.length; i++) {
                    dataArr.push([
                        echarts.format.formatTime(
                            "yyyy-MM-dd hh:mm",
                            KlineData[i][0]
                        ), // time
                        Number(KlineData[i][4]), // close
                        Number(KlineData[i][1]), // open
                        Number(KlineData[i][2]), // hight
                        Number(KlineData[i][3]), // low
                        Number(KlineData[i][5]) // volume
                    ]);
                }
                if (KlineData.length < 300) {
                    for (let index = KlineData.length; index < 300; index++) {
                        dataArr.unshift([0]);
                    }
                }
                this.KData = dataArr;
                this.latestInfo = dataArr[dataArr.length - 1];
                dataArr = null;
                KlineData = null;
                this.currentTime = this.latestInfo[0];
                // // 画K线图
                this.drawChart(this.KData);
            };
        },
        checkTime(data) {
            // 点击所选的时间段

            this.timeActive = data.params;
            this.selectTime = this.zhToEn(data.params);
            this.ischeckmore = false;
            for (let i = 0; i < this.timeList1.length; i++) {
                if (this.timeList1[i] == data.params) {
                    this.moreActive = data.params;
                }
            }
            if (data.params == "1月") {
                this.moreActive = "1月";
            }
            for (let i = 0; i < this.timeList.length; i++) {
                if (
                    this.timeList[i] == data.params &&
                    this.moreActive != "更多"
                ) {
                    this.moreActive = "更多";
                }
            }

            this.$socket.close();
            this.$socket.open();
            this.KData = [];
            this.start = 95;
            this.end = 100;
            // if(this.selectTime == '1w'){
            //     this.start = 40
            // }else if(this.selectTime =='1M'){
            //     this.start = 0
            //     this.end = 200
            // }
        },
        checkmore(data) {
            //点击更多
            this.ischeckmore = !data.params;
        },
        drawChart(Kdata) {
            //画K线图
            function splitData(rawData) {
                //将数据转化为可用格式
                var categoryData = [];
                var values = [];
                var volumes = [];
                for (var i = 0; i < rawData.length; i++) {
                    categoryData.push(rawData[i].splice(0, 1)[0]);
                    values.push(rawData[i]);
                    volumes.push([
                        i,
                        rawData[i][4],
                        rawData[i][0] > rawData[i][1] ? 1 : -1
                    ]);
                }

                return {
                    categoryData: categoryData,
                    values: values,
                    volumes: volumes
                };
            }
            function calculateMA(dayCount) {
                //均线函数
                var result = [];
                for (var i = 0, len = data.values.length; i < len; i++) {
                    if (i < dayCount) {
                        result.push("-");
                        continue;
                    }
                    var sum = 0;
                    for (var j = 0; j < dayCount; j++) {
                        sum += data.values[i - j][1];
                    }
                    result.push(sum / dayCount);
                }
                return result;
            }
            const upColor = "#F43E3A";
            const downColor = "#42C300";
            let data = splitData(Kdata);
            if (data.values.length < 50) {
                this.start = 0;
            }

            let myChart = echarts.init(document.getElementById("chartCBIdData"));
            // let myChart1 = echarts.init(document.getElementById("chart1"));
            myChart.resize();
            // myChart1.resize();
            let options = {
                animation: false,
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        crossStyle: { type: "solid", width: 1, opacity: 0 }
                    },
                    showContent: false // 不显示提示框
                },
                axisPointer: {
                    type: "line",
                    link: { xAxisIndex: "all" },
                    label: {
                        // backgroundColor: '#ff000000',
                        // color:'#f00'
                        // precision:5
                    }
                },
                visualMap: {
                    show: false,
                    seriesIndex: 5,
                    dimension: 2,
                    pieces: [
                        {
                            value: 1,
                            color: downColor
                        },
                        {
                            value: -1,
                            color: upColor
                        }
                    ]
                },
                grid: [
                    // 设置坐标轴的位置及大小
                    {
                        left: "4%",
                        right: "14%",
                        top: "4%",
                        height: "70%"
                    },
                    {
                        left: "4%",
                        right: "14%",
                        top: "74%",
                        height: "22%"
                    }
                ],
                xAxis: [
                    {
                        type: "category",
                        data: data.categoryData,
                        scale: true,
                        boundaryGap: false,
                        splitLine: { show: false },
                        axisLabel: { show: false }, //刻度标签
                        axisTick: { show: false }, //刻度
                        axisLine: {
                            lineStyle: { color: "#dcdcdc", width: 0.5 }
                        },
                        splitNumber: 20,
                        min: "dataMin", //坐标刻度最小值
                        max: "dataMax",
                        axisPointer: {
                            type: "line",
                            label: { show: false },
                            triggerTooltip: true,
                            handle: {
                                show: false,
                                margin: 30,
                                color: "#B80C00"
                            },
                            lineStyle: {
                                type: "dashed",
                                width: 0.5
                            }
                        }
                    },
                    {
                        type: "category", //坐标轴类型 value  category time
                        gridIndex: 1,
                        data: data.categoryData,
                        boundaryGap: false,
                        axisLine: { lineStyle: { color: "#999", width: 0.5 } }, //轴线
                        axisLabel: {
                            color: "#777",
                            fontSize: 8,
                            margin: 6,
                            formatter: function(params) {
                                if (params != 0) {
                                    return params;
                                } else {
                                    return "";
                                }
                            }
                        },
                        axisTick: { show: false },
                        min: "dataMin",
                        max: "dataMax",
                        axisPointer: {
                            show: true,
                            label: {
                                margin: 3,
                                fontSize: ".16rem",
                                padding: [0, 0, 0, 0],
                                textStyle: {
                                    width: "100%"
                                }
                                // backgroundColor: '#ff000000',
                                // color:'#f00'
                            },
                            lineStyle: {
                                type: "dashed",
                                width: 0.5
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        scale: true,
                        splitNumber: 6,
                        axisLabel: {
                            show: true,
                            showMaxLabel: false,
                            showMinLabel: false,
                            fontSize: 8
                        },
                        axisLine: {
                            show: true,
                            lineStyle: { color: "#999", width: 0.5 }
                        },
                        axisTick: {
                            show: true,
                            lineStyle: { color: "#999", width: 0.5 }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: { color: "#f2f2f2" }
                        },
                        position: "right",
                        offset: 5,
                        axisPointer: {
                            label: {
                                margin: 3,
                                fontSize: ".12rem",
                                padding: [5, 0, 5, 0]
                            },
                            lineStyle: {
                                type: "dashed",
                                width: 0.5
                            }
                        }
                    },
                    {
                        scale: true,
                        gridIndex: 1,
                        splitNumber: 2,
                        axisLabel: {
                            show: true,
                            showMaxLabel: false,
                            showMinLabel: false,
                            fontSize: 8
                        },
                        axisLine: {
                            show: true,
                            lineStyle: { color: "#999", width: 0.5 }
                        },
                        axisTick: {
                            show: true,
                            lineStyle: { color: "#999", width: 0.5 }
                        },
                        splitLine: { show: false },
                        position: "right",
                        offset: 5
                    }
                ],
                dataZoom: [
                    {
                        type: "inside",
                        xAxisIndex: [0, 1],
                        start: this.start,
                        end: this.end,
                        minSpan: 2,
                        throttle: 0
                    }
                ],
                series: [
                    {
                        name: "K线",
                        type: "candlestick",
                        data: data.values,
                        position: "right",
                        offset: 120,
                        itemStyle: {
                            normal: {
                                color: upColor,
                                color0: downColor,
                                borderColor: null,
                                borderColor0: null
                            }
                        },
                        barMaxWidth: 10,
                        barWidth: "75%"
                    },
                    {
                        name: "MA5",
                        type: "line",
                        data: calculateMA(5),
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            normal: { opacity: 0.5, width: 1, type: "solid" }
                        }
                    },
                    {
                        name: "MA10",
                        type: "line",
                        data: calculateMA(10),
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            normal: { opacity: 0.5, width: 1, type: "solid" }
                        }
                    },
                    {
                        name: "MA20",
                        type: "line",
                        showSymbol: false,
                        data: calculateMA(20),
                        smooth: true,
                        lineStyle: {
                            normal: { opacity: 0.5, width: 1, type: "solid" }
                        }
                    },
                    {
                        name: "MA30",
                        type: "line",
                        showSymbol: false,
                        data: calculateMA(30),
                        smooth: true,
                        lineStyle: {
                            normal: { opacity: 0.5, width: 1, type: "solid" }
                        }
                    },
                    {
                        name: "Volume",
                        type: "bar",
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: data.volumes,
                        barMaxWidth: 10,
                        barWidth: "75%"
                    }
                ]
            };
            myChart.setOption(options);
            myChart.dispatchAction({
                type: "showTip",
                seriesIndex: 0,
                dataIndex: data.values.length - 1
            });
            let _this = this;
            myChart.on("dataZoom", function(params) {
                // 监听区域组件的变化
                _this.start = params.batch[0].start;
                _this.end = params.batch[0].end;
            });
            data = null;
            myChart = null;
        },
        zhToEn(a) {
            //将中文时间转换为英文时间
            let b = "";
            if (this.marketName == "币安") {
                if (a.indexOf("分") != -1) {
                    b = a.replace("分", "m");
                } else if (a.indexOf("小时") != -1) {
                    b = a.replace("小时", "h");
                } else if (a.indexOf("天") != -1) {
                    b = a.replace("天", "d");
                } else if (a.indexOf("周") != -1) {
                    b = a.replace("周", "w");
                } else if (a.indexOf("月") != -1) {
                    b = a.replace("月", "M");
                }
            } else if (this.marketName == "火币") {
                if (a.indexOf("分") != -1) {
                    b = a.replace("分", "min");
                } else if (a.indexOf("小时") != -1) {
                    if (a == "1小时") {
                        b = "60min";
                    } else {
                        b = a.replace("小时", "hour");
                    }
                } else if (a.indexOf("天") != -1) {
                    b = a.replace("天", "day");
                } else if (a.indexOf("周") != -1) {
                    b = a.replace("周", "week");
                } else if (a.indexOf("月") != -1) {
                    b = a.replace("月", "mon");
                }
            } else if (this.marketName == "Okex") {
                if (a.indexOf("分") != -1) {
                    b = a.replace("分", "min");
                } else if (a.indexOf("小时") != -1) {
                    b = a.replace("小时", "hour");
                } else if (a.indexOf("天") != -1) {
                    b = a.replace("天", "day");
                } else if (a.indexOf("周") != -1) {
                    b = a.replace("周", "week");
                } else if (a.indexOf("月") != -1) {
                    b = a.replace("月", "mon");
                }
            } else if (this.marketName == "ZB") {
                if (a.indexOf("分") != -1) {
                    b = a.replace("分", "min");
                } else if (a.indexOf("小时") != -1) {
                    b = a.replace("小时", "hour");
                } else if (a.indexOf("天") != -1) {
                    b = a.replace("天", "day");
                } else if (a.indexOf("周") != -1) {
                    b = a.replace("周", "week");
                } else if (a.indexOf("月") != -1) {
                    b = a.replace("月", "mon");
                }
            }
            return b;
        }
    },
    beforeDestroy() {
        delete this.$options.sockets.updatek;
        clearInterval(this.timeId);
        clearInterval(this.timeId1);
        document.removeEventListener("touchstart", e => {
            if (!this.$el.contains(e.target)) this.ischeckmore = false;
        });
        this.$socket.close();
    }
};
</script>
<style>
.onehead {
    width: 30px;
    height: 30px;
    background-color: rgb(238, 243, 246);
    position: fixed;
    right: -15px;
    top: 2rem;
    border-radius: 50%;
    z-index: 9999;
}
#chartBoxCB {
    background-color: #fff;
    margin-top: 0.1rem;
}
.selectTime {
    height: 1.58rem;
    position: relative;
}

.timeBucket {
    padding-left: 0.42rem;
    padding-right: 1rem;
}

.timeBucket > li {
    padding: 0.34rem 0;
    height: 0.28rem;
    line-height: 0.28rem;
    display: inline-block;
    font-size: 0.36rem;
    color: #374452;
    margin-right: 0.43rem;
}

.timeBucket .timeActive {
    color: #42c300;
}
.timeBucket .moreActive {
    color: #42c300;
}

.timeBucket > li.more {
    position: relative;
}

.triangle {
    border-width: 0.1rem;
    border-style: solid;
    border-color: #374452 transparent transparent transparent;
    transform: rotate(-45deg);
    position: absolute;
    right: -0.2rem;
    bottom: 0.2rem;
}

.fullScreen {
    float: right;
}

.drawdown {
    height: 1rem;
    width: 100%;
    position: absolute;
    top: 0.96rem;
    padding-left: 0.42rem;
    background-color: #5868d1;
    z-index: 99;
}

.drawdown li {
    height: 1rem;
    line-height: 1rem;
    display: inline-block;
    margin-right: 0.43rem;
    font-size: 0.36rem;
    color: #f4f7f9;
    text-align: center;
}

.timeBucketInfo {
    font-size: 0.24rem;
    padding-left: 0.42rem;
}

.timeBucketInfo span {
    color: #374452;
    margin-right: 0.1rem;
}

.timeBucketInfo .openTime {
    color: #a6afba;
    margin-right: 0.3rem;
}
.ktu,
.ktu1 {
    width: 20%;
    height: 0.8rem;
    position: absolute;
    right: 0;
    z-index: 9;
    top:-1rem;
    color: #5868d1;
    font-size: 0.36rem;
    line-height: 1rem;
}
.ktu1 {
    top: 10.3rem;
}
.ktu img,
.ktu1 img {
    margin-right: 0.2rem;
    width: 0.5rem;
    margin-top: 0.25rem;
}
.cbDealbuy {
    width: 100%;
    height: 100%;
    height: calc(100vh);
    overflow: auto;
}
.cbDealbuy .buchong {
    width: 100%;
    height: 2.85rem;
}
.cbDealbuy .head {
    top: 0;
    position: fixed;
    /* padding-top: 0.72rem; */
    width: 100%;
    height: 1.6rem;
    line-height: 1.6rem;
    text-align: center;
    z-index: 99;
    /* position: relative; */
    background-color: #fff;
}
.cbDealbuy .head .iconfont {
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.cbDealbuy .head .dealContent {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
    line-height: 0.5rem;
}
.cbDealbuy .head .dealContent i {
    color: #999999;
    font-size: 0.36rem;
    font-weight: 400;
}
.cbDealbuy .main {
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 0;
}
.cbDealbuy .main .mainNav {
    width: 100%;
    top: 1.6rem;
    position: fixed;
    font-size: 0.42rem;
    display: flex;
    height: 1.25rem;
    line-height: 1.25rem;
    justify-content: space-around;
    background-color: #fff;
    z-index: 999;
    box-shadow: 0px 2px 1px 1px #e6eef2;
}
.cbDealbuy .main .mainNav > div.active {
    border-bottom: 1px solid #48c122;
    color: #48c122;
}
</style>




