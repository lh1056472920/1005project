<template>
    <div class="quotation-det" id="quotationDet">
        <header id="header">
            <span class="back iconfont icon-fanhui" v-tap="{ methods: goBack }"></span>
            <span class="assetName">{{marketName}}&nbsp;&nbsp;
                <i>{{coin}}/{{counterparty}}</i>
            </span>
            <span v-show="!isCollect" class="collect0" v-tap="{methods: collect}"></span>
            <span v-show="isCollect" class="collect" v-tap="{methods: collect}"></span>
        </header>
        <div class="realTimeInfo">
            <div class="info-left">
                <p class="price">{{coinInfo.close}}</p>
                <p class="price1">≈ {{(exchangeRate*coinInfo.close).toFixed(2)}}CNY</p>
                <p class="amount">24H量:{{coinInfo.volume}}</p>
            </div>
            <div class="info-right">
                <div class="enter">
                    <span>买:
                        <i>{{coinInfo.close}}</i>
                    </span>
                    <span>高:
                        <i>{{coinInfo.high}}</i>
                    </span>
                    <span>开:
                        <i>{{coinInfo.open}}</i>
                    </span>
                </div>
                <div class="out">
                    <span>卖:
                        <i>{{coinInfo.close}}</i>
                    </span>
                    <span>低:
                        <i>{{coinInfo.low}}</i>
                    </span>
                    <span>收:
                        <i>{{coinInfo.close}}</i>
                    </span>
                </div>
            </div>
        </div>
        <div id="chartBox">
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
            <div id="chartbook" ref="chartbook"></div>
        </div>
        <div class="coinInfo">
            <p>官网:
                <a :href="marketDetail.website">{{marketDetail.website}}</a>
            </p>
            <p>发行时间: {{marketDetail.issudeDate}}</p>
            <p>发行总量: {{marketDetail.counts}}</p>
            <p>流通量: {{marketDetail.marketNumber}}</p>
            <p>激励机制: {{marketDetail.mechanism}}</p>
        </div>
        <div :class="active">
            <p class="intro-title">简介</p>
            <div id="intro-content">
                <p id="content">{{marketDetail.introduction}}</p>
            </div>
            <div v-show="spreadShow" class="spread" v-tap="{methods:spread,params:spredText}">{{spredText}}<img src="../../../static/images/showMore.png" alt=""></div>
        </div>
        <div class="development">
            <p class="development-title">发展历程</p>
            <ul class="development-course">
                <li class="development-item" v-for="(item,i) in developmentList" :key="i">
                    <p class="development-time">{{item.time}}</p>
                    <i class="point"></i>
                    <p class="development-content">{{item.course}}</p>
                </li>
            </ul>
        </div>
        <div class="disclaimer">
            <p>{{disclaimer}}</p>
            <p>{{trusteeship}}</p>
        </div>
        <div class="footerfixed"></div>
        <footer>
            <div @click="clickgo(1)" class="left">交易</div>
            <div @click="clickgo(2)" class="right">预警</div>
        </footer>
    </div>
</template>
<script>
import echarts from "echarts";
import axios from "axios";
import { Toast, MessageBox } from "mint-ui";
import { encryptKey, MD5, decryptByKey } from "../../lib/js/crypto.js";
import socketParams from "./../../commons/js/socketParams.js";
import indexDB from "./../../lib/js/indexDB.js";
export default {
    name: "quotation-det",
    data() {
        return {
            isCollect: false,
            isConnect: false,
            active: "intro",
            spreadShow: false,
            spredText: "展开",
            symbol: "",
            coin: "",
            counterparty: "",
            marketName: "",
            username: "",
            uuid: "",
            marketDetail: {},
            coinInfo: {},
            exchangeRate: "",
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
            developmentList: [],
            isFull: false,
            isfullscreen: "全屏",
            content: "",
            trusteeship: "风险提示：请谨防ICO、变相ICO。",
            disclaimer:
                "免责声明：本应用所提供信息仅供参考，用户对使用信息结果自行承担风险。不做任何形式的保证：不保证信息满足您的要求，不保证信息的准确性，不保证信息的安全性、正确性、及时性、合法性。"
        };
    },
    created() {
        this.symbol = this.$route.query.symbol;
        this.coin = this.$route.query.coin;
        this.counterparty = this.$route.query.counterparty;
        this.marketName = this.$route.query.marketName;
        this.exchangeRate = Number(this.$route.query.exchangeRate);
        this.indexDBdata = [];
        this.changeForTime = {
            "15分": 15 * 60 * 1000,
            "1小时": 60 * 60 * 1000,
            "4小时": 4 * 60 * 60 * 1000,
            "1天": 24 * 60 * 60 * 1000,
            "1分": 60 * 1000,
            "5分": 5 * 60 * 1000,
            "30分": 30 * 60 * 1000,
            "1周": 7 * 24 * 60 * 60 * 1000
        };
        this.socketParams = socketParams[this.marketName];
        // 获取币种信息
        let url = `http://chaobi.lian2345.com/kpl/wallert/searchdetail?name=${
            this.coin
        }`;
        axios
            .get(url)
            .then(res => {
                this.marketDetail = res.data.MarketDetail;
                for (let key in JSON.parse(this.marketDetail.development)) {
                    let time = key;
                    let course = JSON.parse(this.marketDetail.development)[key];
                    this.developmentList.push({ time: time, course: course });
                }
            })
            .catch(err => {});
        //this.myChart.resize();
        this.getKLineData();
        //获取本地数据库数据
        this.getDataByDB();
    },
    sockets: {
        connect: function() {
            
        },
        disconnect: function() {
            console.log("socket disconnect");
        }
    },
    computed: {
        DB_tableKey() {
            return `${this.marketName}_${this.symbol}_${this.timeActive}`;
        }
    },
    mounted() {
        //this.$socket.open();
        this.developmentList = [];
        this.latestInfo = [];
        this.isCollect = false;
        this.ready();
        this.myChart = echarts.init(document.getElementById("chartbook"));
        setTimeout(() => {
            this.isSpreadShow();
        }, 500);
    },
    methods: {
        getKLineData() {
            // console.log("socket connect");
            clearInterval(this.timeId);
            clearInterval(this.timeId1);

            if (this.marketName == "币安") {
                this.selectTime = "15m";
                //this.sendDetail();
                this.sendK();
            } else if (this.marketName == "火币") {
                this.selectTime = "15min";
                //this.sendHbDetail();
                this.sendHbK();
            } else if (this.marketName == "Okex") {
                this.selectTime = "15min";
                //this.sendOKDetail();
                this.sendOkK();
            } else if (this.marketName == "ZB") {
                this.selectTime = "15min";
                this.sendZBK();
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
            this.allOptionals();
        },
        //获取本地数据库数据
        getDataByDB() {
            indexDB.initDB().then(res => {
                indexDB
                    .get({ name: "quotation" }, this.DB_tableKey)
                    .then(data => {
                        if (data[0]) {
                            this.indexDBdata = JSON.parse(data[0].dataArray);
                            let last = this.indexDBdata[
                                this.indexDBdata.length - 1
                            ];
                            if (this.counterparty.toUpperCase() == "USDT") {
                                this.coinInfo = {
                                    close: last[1].toFixed(2),
                                    open: last[2].toFixed(2),
                                    high: last[3].toFixed(2),
                                    low: last[4].toFixed(2),
                                    volume: last[5].toFixed(2)
                                };
                            } else {
                                this.coinInfo = {
                                    close: last[1].toFixed(6),
                                    open: last[2].toFixed(6),
                                    high: last[3].toFixed(6),
                                    low: last[4].toFixed(6),
                                    volume: last[5].toFixed(6)
                                };
                            }
                            this.drawChart(this.indexDBdata.concat());
                        } else {
                            this.$plusReady(() => {
                                plus.nativeUI.showWaiting( "正在获取数据..." );
                            })
                        }
                    });
            });
        },
        clickgo(res) {
            if (this.coin == "") {
                return;
            }

            let that = this;
            that.symbol = that.$route.query.symbol;
            that.coin = that.$route.query.coin;
            that.counterparty = that.$route.query.counterparty;
            that.marketName = that.$route.query.marketName;
            if (res == 1) {
                console.log(111111111111);

                if (!localStorage.getItem("user")) {
                    MessageBox.confirm(
                        "您未登录,无法进行查看,是否前往登录"
                    ).then(res => {
                        //跳转登录
                        this.$router.push({
                            path: "/login"
                        });
                    });
                }

                let counterparty = {
                    coin: this.coin,
                    counterparty: this.counterparty,
                    marketName: this.marketName
                };
                localStorage.setItem(
                    "counterparty",
                    JSON.stringify(counterparty)
                );
                console.log(2222);
                if (
                    localStorage.getItem("userkey")&&JSON.parse(localStorage.getItem("user")).phone ===
                        JSON.parse(
                            decryptByKey(localStorage.getItem("userkey"))
                        ).userName &&
                    this.marketName == "火币"
                ) {
                    this.$router.push({
                        path: "/cbDealBuy"
                    });
                } else if (
                    localStorage.getItem("biankey")&&JSON.parse(localStorage.getItem("user")).phone ==
                        JSON.parse(
                            decryptByKey(localStorage.getItem("biankey"))
                        ).userName &&
                    this.marketName == "币安"
                ) {
                    this.$router.push({
                        path: "/cbDealBuy"
                    });
                } else if (
                    localStorage.getItem("Okexkey")&&JSON.parse(localStorage.getItem("user")).phone ===
                        JSON.parse(
                            decryptByKey(localStorage.getItem("Okexkey"))
                        ).userName &&
                    this.marketName == "Okex"
                ) {
                    //进入OKEx交易页面
                    this.$router.push({
                        path: "/cbDealBuy"
                    });
                } else if (
                    localStorage.getItem("ZBkey")&&JSON.parse(localStorage.getItem("user")).phone ==
                        JSON.parse(decryptByKey(localStorage.getItem("ZBkey")))
                            .userName &&
                    this.marketName == "ZB"
                ) {
                    //进入ZB交易页面
                    this.$router.push({
                        path: "/cbDealBuy"
                    });
                } else {
                    console.log(33333);

                    localStorage.setItem("sign", 1);
                    this.$router.push({
                        path: "/cbAccredit",
                        query: {
                            marketName: this.marketName
                            // counterparty: this.counterparty
                        }
                    });
                }
                console.log(44444);
            } else if (res == 2) {
                this.$router.push({
                    path: "/price",
                    query: {
                        symbol: that.symbol,
                        coin: that.coin,
                        counterparty: that.counterparty,
                        marketName: that.marketName,
                        exchangeRate: that.exchangeRate
                    }
                });
            }
        },
        ready() {
            document.addEventListener("touchstart", e => {
                // console.log(this.$el.contains(e.target));
                if (!this.$el.contains(e.target)) this.ischeckmore = false;
            });
        },
        goBack() {
            this.$router.goBack();
        },
        collect() {
            // console.log(11212);
            if (!this.$store.state.userInfo) {
                MessageBox("您还未登录", "请前往个人中心登录");
                return;
            } else {
                let user = this.$store.state.userInfo;
                this.username = user.username;

                if (this.isCollect == false) {
                    let url = `http://192.168.1.225:5656/kpl/wallert/coll/add?userName=${
                        this.username
                    }&&marketToken=${this.symbol}&&marketName=${
                        this.marketName
                    }`;
                    axios
                        .post(url)
                        .then(res => {
                            // console.log(res);
                            if (res.data == 1) {
                                this.allOptionals();
                                // 获取自选项
                                let url2 = `http://192.168.1.225:5656/kpl/wallert/coll/select?userName=${
                                    this.username
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
                                        optionalList = null;
                                    }
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else if (this.isCollect == true) {
                    let url = `http://192.168.1.225:5656/kpl/wallert/coll/delete?uuid=${
                        this.uuid
                    }`;
                    axios.delete(url).then(res => {
                        if (res.data == 1) {
                            this.isCollect = false;
                            // 获取自选项
                            let url2 = `http://192.168.1.225:5656/kpl/wallert/coll/select?userName=${
                                this.username
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
                                    optionalList = null;
                                }
                            });
                        }
                    });
                }
            }
            //点击收藏
        },
        spread(data) {
            //点击展开||收起
            if (data.params == "展开") {
                this.spredText = "收起";
                this.active = "intro1";
            } else {
                this.spredText = "展开";
                this.active = "intro";
            }
        },
        isSpreadShow() {
            //展开显不显示
            var contentHeight = document.getElementById("content").offsetHeight;
            var boxHeight = document.getElementById("intro-content")
                .offsetHeight;
            // console.log(contentHeight);
            // console.log(boxHeight);

            if (contentHeight > boxHeight) {
                this.spreadShow = true;
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
                // console.log(data);
                // console.log(coinDetailData);

                // 币详情数据
                // console.log(this.counterparty);

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
            this.$remote.getKLineData({
                type: 'binance_all',
                symbol: this.symbol,
                time: this.selectTime,
                size: 500
            }).then((res) => {
                if (res.status == 200) {
                    this.handleData(res.data, {
                        formatData: this.formatBianData,
                        callback: this.receiveBianData,
                        allData: true
                    });
                }
            })
        },
        //统一处理函数
        handleData(KlineData,params) {
            this.$plusReady(() => {
                plus.nativeUI.closeWaiting();
            })
            this.$socket.close();
            let dataArray = params.formatData(KlineData,params);
            this.KData = JSON.stringify(dataArray);
            // 画K线图
            this.saveToIndexDB(dataArray);
            this.drawChart(dataArray);
            this.marketDataCallback = params.callback;
            this.reOpenSocket();
        },
        //获取单条k线数据
        reOpenSocket(params) {
            let info = this.socketParams[this.timeActive];
            let timeAry = info.onEvent.split('_');
            this.runningSocket = this.$socketio(this.socketParams.url);
            this.runningSocket.emit(info.event, {
                symbol:this.symbol,
                type: timeAry[timeAry.length - 1]
            });
            this.runningSocket.on(info.onEvent, (dataStr) => {
                this.marketDataCallback(dataStr);
            });
            
            this.runningSocket.on("error", (params) => {
                this.runningSocket.close();
                this.reOpenSocket(params);
            });
        },
        receiveBianData(dataStr) {
            let data = JSON.parse(dataStr);
            let dataArray = [];
            let ary = [
                "t",
                "o",
                "h",
                "l",
                "c",
                "v",
                "T",
                "q",
                "n",
                "V",
                "Q",
                "B"
            ];
            for (let i = 0; i < ary.length; i++) {
                dataArray.push(data.k[ary[i]]);
            }
            if (this.counterparty.toUpperCase() == "USDT") {
                this.coinInfo = {
                    close: Number(data.k.c).toFixed(2),
                    volume: Number(this.$route.query.quoteVolume).toFixed(2),
                    high: Number(data.k.h).toFixed(2),
                    low: Number(data.k.l).toFixed(2),
                    open: Number(data.k.o).toFixed(2)
                };
            } else {
                this.coinInfo = {
                    close: Number(data.k.c).toFixed(6),
                    volume: Number(this.$route.query.quoteVolume).toFixed(6),
                    high: Number(data.k.h).toFixed(6),
                    low: Number(data.k.l).toFixed(6),
                    open: Number(data.k.o).toFixed(6)
                };
            }

            let newArray = this.formatBianData([dataArray]);
            let kData = JSON.parse(this.KData);
            //和前一个时间作对比，大于设定的时间间隔删除第一条和添加一条，反之则直接替换最后一条数据
            if (!this.previousTime) {
                this.previousTime = new Date(
                    kData[kData.length - 1][0]
                ).getTime();
            }
            let hasNewBar =
                dataArray[0] - this.previousTime >
                this.changeForTime[this.selectTime];
            if (hasNewBar) {
                kData.shift();
                kData.push(newArray[0]);
                this.previousTime = dataArray[0];
            } else {
                kData.pop();
                kData.push(newArray[0]);
            }
            this.KData = JSON.stringify(kData);
            if (hasNewBar) {
                this.saveToIndexDB(kData);
            }
            // // 画K线图
            this.drawChart(kData.concat());
        },
        //格式化接收到的数据
        formatBianData(KlineData, params) {
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
                    Number(KlineData[i][5]), // volume
                    Number(this.$route.query.quoteVolume)
                ]);
            }
            if (KlineData.length < 300 && KlineData.length !== 1) {
                for (let index = KlineData.length; index < 300; index++) {
                    dataArr.unshift([0]);
                }
            }
            this.latestInfo = dataArr[dataArr.length - 1];
            this.currentTime = this.latestInfo[0];
            if (params && params.allData) {
                this.coinInfo = {
                    close: dataArr[dataArr.length - 1][1].toFixed(2),
                    open: dataArr[dataArr.length - 1][2].toFixed(2),
                    high: dataArr[dataArr.length - 1][3].toFixed(2),
                    low: dataArr[dataArr.length - 1][4].toFixed(2),
                    volume: dataArr[dataArr.length - 1][5] && dataArr[dataArr.length - 1][5].toFixed(2)
                };
            }
            
            return dataArr;
        },
        //更新数据库
        saveToIndexDB(data) {
            if (this.indexDBdata.length > 0) {
                console.log("更新数据库");
                indexDB.update(
                    { name: "quotation" },
                    { id: this.DB_tableKey, dataArray: JSON.stringify(data) }
                );
            } else {
                console.log("添加数据库");
                indexDB.insert(
                    { name: "quotation" },
                    { id: this.DB_tableKey, dataArray: JSON.stringify(data) }
                );
            }
            this.indexDBdata = data.concat();
        },
        sendHbDetail() {
            this.$socket.emit("huobi", { type: "detail", detail: this.symbol });
            this.$options.sockets.huobidetail = coinDetailData => {
                let data = JSON.parse(coinDetailData).tick;
                // console.log(coinDetailData);

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
            this.$remote.getKLineData({
                type: 'huobi_all',
                symbol: this.symbol,
                time: this.selectTime,
                size: 500
            }).then((res) => {
                if (res.status == 200) {
                    this.handleData(res.data.data, {
                        formatData: this.formatHbData,
                        callback: this.receiveHbData,
                        allData: true
                    });
                }
            })
        },
        formatHbData(KlineData, params) {
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
            if (KlineData.length < 300 && KlineData.length != 1) {
                for (let index = KlineData.length; index < 300; index++) {
                    dataArr.push([0]);
                }
            }
            dataArr = dataArr.reverse();
            this.latestInfo = dataArr[dataArr.length - 1];
            this.currentTime = this.latestInfo[0];
            if (params && params.allData) {
                this.coinInfo = {
                    close: dataArr[dataArr.length - 1][1].toFixed(2),
                    open: dataArr[dataArr.length - 1][2].toFixed(2),
                    high: dataArr[dataArr.length - 1][3].toFixed(2),
                    low: dataArr[dataArr.length - 1][4].toFixed(2),
                    volume: dataArr[dataArr.length - 1][5] && dataArr[dataArr.length - 1][5].toFixed(2)
                };
            }
            return dataArr;
        },
        receiveHbData(data) {
            if (this.counterparty.toUpperCase() == "USDT") {
                this.coinInfo = {
                    close: Number(data.tick.close).toFixed(2),
                    volume: Number(this.$route.query.quoteVolume).toFixed(2),
                    high: Number(data.tick.high).toFixed(2),
                    low: Number(data.tick.low).toFixed(2),
                    open: Number(data.tick.open).toFixed(2)
                };
            } else {
                this.coinInfo = {
                    close: Number(data.tick.close).toFixed(6),
                    volume: Number(this.$route.query.quoteVolume).toFixed(6),
                    high: Number(data.tick.high).toFixed(6),
                    low: Number(data.tick.low).toFixed(6),
                    open: Number(data.tick.open).toFixed(6)
                };
            }
            
            let newArray = this.formatHbData([data.tick]);
            let kData = JSON.parse(this.KData);
            //和前一个时间作对比，大于设定的时间间隔删除第一条和添加一条，反之则直接替换最后一条数据
            if (!this.previousTime) {
                this.previousTime = new Date(kData[kData.length - 1][0]).getTime();
            }
            let hasNewBar = Number(data.ts) - this.previousTime > this.changeForTime[this.timeActive];
            if (hasNewBar) {
                kData.shift();
                kData.push(newArray[0]);
                this.previousTime = Number(data.ts);
            } else {
                kData.pop();
                kData.push(newArray[0]);
            }
            this.KData = JSON.stringify(kData);
            if (hasNewBar) {
                this.saveToIndexDB(kData);
            }
            // // 画K线图
            this.drawChart(kData.concat());
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
            this.$remote.getKLineData({
                type: 'okex_all',
                symbol: this.symbol,
                time: this.selectTime,
                size: 500
            }).then((res) => {
                if (res.status == 200) {
                    this.handleData(res.data, {
                        formatData: this.formatOkexData,
                        callback: this.receiveOkexData,
                        allData: true
                    });
                }
            })
        },
        formatOkexData(KlineData, params) {
            let dataArr = [];
            for (let i = 0; i < KlineData.length; i++) {
                dataArr.push([
                    echarts.format.formatTime(
                        "yyyy-MM-dd hh:mm",
                        Number(KlineData[i][0])
                    ), // time
                    Number(KlineData[i][4]), // close
                    Number(KlineData[i][1]), // open
                    Number(KlineData[i][2]), // hight
                    Number(KlineData[i][3]), // low
                    Number(KlineData[i][5]) // volume
                ]);
            }
            if (KlineData.length < 300 && KlineData.length != 1) {
                for (let index = KlineData.length; index < 300; index++) {
                    dataArr.unshift([0]);
                }
            }
            this.latestInfo = dataArr[dataArr.length - 1];
            this.currentTime = this.latestInfo[0];
            if (params && params.allData) {
                this.coinInfo = {
                    close: dataArr[dataArr.length - 1][1].toFixed(2),
                    open: dataArr[dataArr.length - 1][2].toFixed(2),
                    high: dataArr[dataArr.length - 1][3].toFixed(2),
                    low: dataArr[dataArr.length - 1][4].toFixed(2),
                    volume: dataArr[dataArr.length - 1][5] && dataArr[dataArr.length - 1][5].toFixed(2)
                };
            }
            return dataArr;
        },
        receiveOkexData(dataObj) {
            if (!Array.isArray(dataObj.data)) {
                return;
            }
            let data = dataObj.data[0];
            if (this.counterparty.toUpperCase() == "USDT") {
                this.coinInfo = {
                    close: Number(data[4]).toFixed(2),
                    volume: Number(data[5]).toFixed(2),
                    open: Number(data[1]).toFixed(2),
                    high: Number(data[2]).toFixed(2),
                    low: Number(data[3]).toFixed(2)
                };
            } else {
                this.coinInfo = {
                    close: Number(data[4]).toFixed(6),
                    volume: Number(data[5]).toFixed(6),
                    high: Number(data[2]).toFixed(6),
                    low: Number(data[3]).toFixed(6),
                    open: Number(data[1]).toFixed(6)
                };
            }
            
            let newArray = this.formatOkexData([data]);
            let kData = JSON.parse(this.KData);
            //和前一个时间作对比，大于设定的时间间隔删除第一条和添加一条，反之则直接替换最后一条数据
            if (!this.previousTime) {
                this.previousTime = new Date(kData[kData.length - 1][0]).getTime();
            }
            let hasNewBar = Number(data[0]) - this.previousTime > this.changeForTime[this.timeActive];
            if (hasNewBar) {
                kData.shift();
                kData.push(newArray[0]);
                this.previousTime = Number(data[0]);
            } else {
                kData.pop();
                kData.push(newArray[0]);
            }
            this.KData = JSON.stringify(kData);
            if (hasNewBar) {
                this.saveToIndexDB(kData);
            }
            // 画K线图
            this.drawChart(kData.concat());
        },
        sendZBDetail() {
            this.$socket.emit("zbmarket", {
                type: "detail",
                detail: this.symbol
            });
            this.$options.sockets.zb_ticker = coinDetailData => {
                let data = JSON.parse(coinDetailData);
                // console.log(data);

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
            this.$remote.getKLineData({
                type: 'zb_all',
                symbol: this.symbol,
                time: this.selectTime,
                size: 500
            }).then((res) => {
                if (res.status == 200) {
                    this.handleData(res.data.data, {
                        formatData: this.formatZbData,
                        callback: this.receiveZbData,
                        allData: true
                    });
                }
            })
        },
        formatZbData(KlineData, params) {
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
            if (KlineData.length < 300 && KlineData.length != 1) {
                for (let index = KlineData.length; index < 300; index++) {
                    dataArr.unshift([0]);
                }
            }
            this.latestInfo = dataArr[dataArr.length - 1];
            this.currentTime = this.latestInfo[0];
            if (params && params.allData) {
                this.coinInfo = {
                    close: dataArr[dataArr.length - 1][1].toFixed(2),
                    open: dataArr[dataArr.length - 1][2].toFixed(2),
                    high: dataArr[dataArr.length - 1][3].toFixed(2),
                    low: dataArr[dataArr.length - 1][4].toFixed(2),
                    volume: dataArr[dataArr.length - 1][5] && dataArr[dataArr.length - 1][5].toFixed(2)
                };
            }
            return dataArr;
        },
        receiveZbData(dataStr) {
            console.log('?????????');
            let dataObj = dataStr;
            if (typeof dataStr === 'string') {
                dataObj = JSON.parse(dataStr)
            }
            console.log(dataObj);
            if (!Array.isArray(dataObj.data)) {
                return;
            }
            let data = dataObj.data[0];
            if (this.counterparty.toUpperCase() == "USDT") {
                this.coinInfo = {
                    close: Number(data[4]).toFixed(2),
                    volume: Number(data[5]).toFixed(2),
                    open: Number(data[1]).toFixed(2),
                    high: Number(data[2]).toFixed(2),
                    low: Number(data[3]).toFixed(2)
                };
            } else {
                this.coinInfo = {
                    close: Number(data[4]).toFixed(6),
                    volume: Number(data[5]).toFixed(6),
                    high: Number(data[2]).toFixed(6),
                    low: Number(data[3]).toFixed(6),
                    open: Number(data[1]).toFixed(6)
                };
            }
            
            let newArray = this.formatZbData([data]);
            let kData = JSON.parse(this.KData);
            //和前一个时间作对比，大于设定的时间间隔删除第一条和添加一条，反之则直接替换最后一条数据
            if (!this.previousTime) {
                this.previousTime = new Date(kData[kData.length - 1][0]).getTime();
            }
            let hasNewBar = Number(data[0]) - this.previousTime > this.changeForTime[this.timeActive];
            if (hasNewBar) {
                kData.shift();
                kData.push(newArray[0]);
                this.previousTime = Number(data[0]);
            } else {
                kData.pop();
                kData.push(newArray[0]);
            }
            this.KData = JSON.stringify(kData);
            if (hasNewBar) {
                this.saveToIndexDB(kData);
            }
            // 画K线图
            this.drawChart(kData.concat());
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
            // console.log(this.moreActive);
            if (this.runningSocket) {
                this.runningSocket.close();
                this.getKLineData();
            }
            this.$socket.close();
            //this.$socket.open();
            this.KData = [];
            this.start = 95;
            this.end = 100;
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

            // this.myChart1.resize();
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
                        throttle: 0,
                        preventDefaultMouseMove: false
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
            this.myChart.setOption(options, true);
            this.myChart.dispatchAction({
                type: "showTip",
                seriesIndex: 0,
                dataIndex: data.values.length - 1
            });
            let _this = this;
            this.myChart.on("dataZoom", function(params) {
                // 监听区域组件的变化
                _this.start = params.batch[0].start;
                _this.end = params.batch[0].end;
            });
            data = null;
            //this.myChart = null;
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
        },
        allOptionals() {
            console.log("查询是否已添加自选");
            let url = `http://192.168.1.225:5656/kpl/wallert/coll/select?userName=${
                this.username
            }`;
            axios
                .get(url)
                .then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        if (
                            this.symbol == res.data[i].marketToken &&
                            this.marketName == res.data[i].marketName
                        ) {
                            this.isCollect = true;
                            this.uuid = res.data[i].uuid;
                        }
                    }
                })
                .catch(err => {});
        }
    },
    beforeDestroy() {
        delete this.$options.sockets.updatek;
        clearInterval(this.timeId);
        clearInterval(this.timeId1);
        document.removeEventListener("touchstart", e => {
            if (!this.$el.contains(e.target)) this.ischeckmore = false;
        });
        if (this.runningSocket) {
            this.runningSocket.close();
        }
        this.$socket.close();
    }
};
</script>
<style scoped>
.quotation-det {
    height: calc(100vh);
    overflow: auto;
}
.quotation-det .footerfixed {
    width: 100%;
    height: 1.5rem;
}
.quotation-det footer {
    width: 100%;
    height: 1.5rem;
    position: fixed;
    bottom: 0;
    font-size: 0;
}
.quotation-det footer div {
    display: inline-block;
    width: 50%;
    text-align: center;
    line-height: 1.5rem;
    height: 1.5rem;
    color: #fff;
    font-size: 16px;
}
.quotation-det footer div.left {
    background-color: #42c300;
}
.quotation-det footer div.right {
    background-color: #f43e3a;
}
header {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    /* padding-top: 0.72rem; */
    background-color: rgba(244, 247, 249);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    box-sizing: border-box;
    box-shadow: 0 2px 2px #e3ebee;
}

.back {
    width: 0.8rem;
    height: 1.44rem;
    line-height: 1.44rem;
    margin-left: 0.3rem;
}

.assetName {
    width: 8.14rem;
    text-align: center;
    font-size: 0.54rem;
    color: #404040;
}

.collect0 {
    width: 1.44rem;
    height: 1.44rem;
    background-image: url("../../../static/images/drawable-xxhdpi/collect0.png");
    background-position: center center;
    background-size: 0.6rem 0.6rem;
    background-repeat: no-repeat;
}
.collect {
    width: 1.44rem;
    height: 1.44rem;
    background-image: url("../../../static/images/drawable-xxhdpi/collect.png");
    background-position: center center;
    background-size: 0.6rem 0.6rem;
    background-repeat: no-repeat;
}

.realTimeInfo {
    height: 2.72rem;
    background-color: rgba(244, 247, 249, 1);
    display: flex;
    padding-top: 1.44rem;
}

.info-left {
    flex: 1;
    padding-left: 0.42rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.info-right {
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: stretch;
    padding: 0.3rem 0.86rem 0.5rem 0;
}

.info-right .enter,
.info-right .out {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.info-right .enter {
    margin-right: 0.2rem;
}

.info-right span {
    color: #42c300;
    font-size: 0.3rem;
}

.info-right span i {
    color: #404040;
}

.price {
    font-size: 0.6rem;
    color: #42c300;
}

.price1 {
    font-size: 0.36rem;
    color: #a6afba;
}

.amount {
    font-size: 0.3rem;
    color: #a6afba;
}

#chartBox {
    height: 12.4rem;
    max-height: calc(100vh - 6.06rem);
    background-color: rgba(244, 247, 249, 1);
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
    background-color: #374452;
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

.coinInfo {
    background-color: rgba(244, 247, 249, 1);
    margin-top: 0.1rem;
    padding-left: 0.43rem;
    height: 4.73rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.coinInfo p {
    font-size: 0.36rem;
    color: #374452;
}

.coinInfo a {
    color: #48c122;
}

.intro {
    background-color: rgba(244, 247, 249, 1);
    margin-top: 0.1rem;
    padding-bottom: 0.36rem;
}
.intro1 {
    background-color: rgba(244, 247, 249, 1);
    margin-top: 0.1rem;
    padding-bottom: 0.36rem;
}

.intro-title {
    padding: 0.36rem 0;
    text-align: center;
    font-size: 0.36rem;
    color: #374452;
}

.intro #intro-content {
    padding: 0 0.45rem;
    height: 1.62rem;
    font-size: 0.36rem;
    color: #374452;
    /* white-space: nowrap; */
    /* text-overflow: ellipsis; */
    overflow: hidden;
}
.intro1 #intro-content {
    padding: 0 0.45rem;
    font-size: 0.36rem;
    color: #374452;
    overflow: hidden;
}

.spread {
    font-size: 0.36rem;
    color: #42c300;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.22rem;
}

.intro img {
    width: 0.29rem;
    height: 0.15rem;
    margin-left: 0.13rem;
}
.intro1 img {
    width: 0.29rem;
    height: 0.15rem;
    margin-left: 0.13rem;
    transform: rotate(180deg);
}

.development {
    background-color: rgba(244, 247, 249, 1);
    margin-top: 0.1rem;
}

.development-title {
    padding: 0.33rem 0;
    font-size: 0.36rem;
    text-align: center;
    color: #374452;
}

.development-course {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-bottom: 0.5rem;
}

.point {
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 50%;
    background-color: #48c122;
    position: absolute;
    left: -0.05rem;
    top: 0.18rem;
}

.development-item {
    border-left: 1px solid #48c122;
    width: 7.18rem;
    padding: 0 0.44rem 0.5rem 0.34rem;
    /* padding-left: .34rem;
    padding-right: .44rem; */
    position: relative;
}

.development-item:last-child {
    padding-bottom: 0;
}

.development-time {
    position: absolute;
    left: -2.48rem;
    font-size: 0.3rem;
    color: #374452;
    width: 2rem;
}

.development-content {
    font-size: 0.3rem;
    color: #374452;
}

.disclaimer {
    padding: 0.33rem 0.4rem 0.65rem 0.4rem;
}

.disclaimer p {
    font-size: 0.25rem;
    color: #a6afba;
}
#chartbook{
    height: calc(100% - 1.58rem);
}
</style>

