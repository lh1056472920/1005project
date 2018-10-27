<template>
    <div class="price">
        <header>
            <div class="back">
                <span @click="goback" class="iconfont icon-fanhui"></span>
            </div>
            <div class="pricenav">
                <span v-tap='{methods:checkindex,params:1}' :class="{activeClass: activeIndex==1}">涨跌预警</span>
                <span v-tap='{methods:checkindex,params:2}' :class="{activeClass: activeIndex==2}">价差预警</span>
                <span v-tap='{methods:checkindex,params:3}' :class="{activeClass: activeIndex==3}">大单预警</span>
            </div>
        </header>
        <nav>
            <span>{{coin}}/{{counterparty}}</span>
            <span>{{exchange}}</span>
            <span>￥{{(exchangeRate * nowPrice).toFixed(2)}}</span>
            <span>{{nowPrice}}{{counterparty}}</span>
        </nav>
        <div class="information">
            <div class="warning" v-if="activeIndex ===1">
                <div class="remind">
                    <div class="remind-nav">
                        <p>上涨至</p>
                        <div class="input-box">
                            <input type='number' pattern="[0-9]*" v-model="riseNum" oninput="if(value.length > 8)value = value.slice(0, 8)">
                            <span v-show="riseNum">≈¥ {{riseChange}}</span>
                        </div>
                        <i v-tap="{methods:addManyRemind,params:1}">添加</i>
                    </div>
                    <div class="remind-nav">
                        <p>下跌至</p>
                        <div class="input-box">
                            <span v-show="fallNum">≈¥ {{fallChange}}</span>
                            <input type='number' pattern="[0-9]*" v-model="fallNum" oninput="if(value.length > 8)value = value.slice(0, 8)">
                        </div>
                            <i v-tap="{methods:addManyRemind,params:2}">添加</i>
                        </div>
                        <div class="remind-nav">
                            <p>涨跌幅</p>
                            <div class="input-box">
                                <span class="percent">%</span>
                                <input type='number' class="percent-value" pattern="[0-9]*" v-model="rangeNum" oninput="if(value.length > 5)value = value.slice(0, 5)">
                        </div>

                                <i v-tap="{methods:addManyRemind,params:3}">添加</i>
                            </div>
                            <div class="alarm">
                                <mt-switch class="swtich" v-model="value" @change="turn"></mt-switch>

                                <span>闹钟提醒</span>
                            </div>
                        </div>
                        <div class="more">
                            <ul v-if="remindArr.length>0">
                                <li v-for="(item,i) in remindArr" :key="i">
                                    <span>{{item.remindData.type}}</span>
                                    <span v-if="item.remindData.type === '涨跌幅'">{{item.remindData.num}} %</span>
                                    <span v-if="item.remindData.type !== '涨跌幅'">{{item.remindData.num}} </span>
                                    <span v-if='item.remindData.price'>¥{{item.remindData.price}}</span>
                                    <i @click="deleteArrList(item.id)" class="iconfont icon-jianshao"></i>
                                </li>
                            </ul>
                            <div class="checkmore" @click="getmore">
                                查看更多币种预警
                            </div>
                        </div>
                    </div>
                    <div class="warning" v-if="activeIndex ===2">
                        <div class="remind">
                            <div class="remind-nav">
                                <p>对比平台</p>
                                <transition>
                                    <div class="select">
                                        <input type="text" v-model="selectOption" placeholder="请选择" class="seleteName" @click="showOptions" @blur='closeOptions' :readonly="true ">
                                        <i></i>
                                        <div class="options" v-show="showOption">
                                            <p v-for="(item,i) in category" :key="i" @click.stop="getOptions(item.tradeName)">{{item.tradeName}}
                                                <a class="selectSymbol">({{item.tradeSymbol}}) </a>
                                            </p>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                            <div class="remind-nav">
                                <p>高于</p>
                                <div class="input-box">
                                    <span v-show="highPrice">≈¥ {{highChange}}</span>
                                    <input type='number' pattern="[0-9]*" placeholder="0.00" v-model="highPrice" oninput="if(value.length > 8)value = value.slice(0, 8)">
                        </div>
                                    <i @click="addPriceAlmost(1)">添加</i>
                                </div>
                                <div class="remind-nav">
                                    <p>低于</p>
                                    <div class="input-box">
                                        <span v-show="lowPrice">≈¥ {{lowChange}}</span>
                                        <input type='number' pattern="[0-9]*" placeholder="0.00" v-model="lowPrice" oninput="if(value.length > 8)value = value.slice(0, 8)">
                        </div>
                                        <i @click="addPriceAlmost(2)">添加</i>
                                    </div>
                                    <div class="alarm">
                                        <mt-switch class="swtich" v-model="priceErrandValue" @change="turn"></mt-switch>
                                        <span>闹钟提醒</span>
                                    </div>
                                </div>
                                <div class="more">
                                    <ul class="errand">
                                        <li v-for="(item,i) in remindArr" :key="i">
                                            <span>{{item.remindData.type}} {{item.remindData.contrast}} </span>
                                            <span>{{item.remindData.num}} {{item.remindData.counterparty}}</span>
                                            <span>(¥{{item.remindData.price}})</span>
                                            <i @click="deletePeiceErrandArr(item.id)" class="iconfont icon-jianshao"></i>
                                        </li>
                                    </ul>
                                    <div class="checkmore" @click="getmore">
                                        查看更多币种预警
                                    </div>
                                </div>
                            </div>
                            <div class="warning bigVastRemind" v-if="activeIndex ===3">
                                <div class="remind bigremind">
                                    <meanItem :coin='coin' :exchange='exchange' :symbol='symbol' :timetype='oneminute' v-on:getMinuteNum='getMinuteNum'></meanItem>
                                    <div class="inputvalue">
                                        <div class="input-box">
                                            <span v-if="minuteNum">≈¥ {{minuteConvert}}</span>
                                            <input type='number' pattern="[0-9]*" v-model="minuteNum" oninput="if(value.length > 8)value = value.slice(0, 8)">
                        </div>
                                            <i @click="addTimeRemind(1)">添加</i>
                                        </div>
                                        <multiple :mulActive='liActive' v-on:addMulActive="addActive"></multiple>
                                        <div class="alarm">
                                            <mt-switch class="swtich" v-model="bigMinuteValue" @change="turn"></mt-switch>
                                            <span class="alarm-clock">闹钟提醒</span>
                                            <mt-switch class="swtich" v-model="bigMinuteVipValue" @change="turn"></mt-switch>
                                            <span>短信提醒/电话提醒 (VIP)</span>
                                        </div>
                                    </div>
                                    <div class="remind bigremind">
                                        <meanItem :coin='coin' :exchange='exchange' :symbol='symbol' :timetype='fiftymin' v-on:getFifteenNum='getFifteenNum'></meanItem>
                                        <div class="inputvalue">
                                            <div class="input-box">
                                                <span v-if="fifteenNum">≈¥ {{fifminConvert}}</span>
                                                <input type='number' pattern="[0-9]*" v-model="fifteenNum" oninput="if(value.length > 8)value = value.slice(0, 8)">
                        </div>
                                                <i @click="addTimeRemind(2)">添加</i>
                                            </div>
                                            <multiple :mulActive='fifActive' v-on:addMulActive="addFifteenActive"></multiple>
                                            <div class="alarm">
                                                <mt-switch class="swtich" v-model="bigFifteenValue" @change="turn"></mt-switch>
                                                <span class="alarm-clock">闹钟提醒</span>
                                                <mt-switch class="swtich" v-model="bigFifteenVipValue" @change="turn"></mt-switch>
                                                <span>短信提醒/电话提醒 (VIP)</span>
                                            </div>
                                        </div>
                                        <div class="remind bigremind">
                                            <meanItem :coin='coin' :timetype='onehour' :exchange='exchange' :symbol='symbol' v-on:getHourNum='getHourNum'></meanItem>
                                            <div class="inputvalue">
                                                <div class="input-box">
                                                    <span v-if="hourNum">≈¥ {{hourConvert}}</span>
                                                    <input type='number' pattern="[0-9]*" v-model="hourNum" oninput="if(value.length > 8)value = value.slice(0, 8)">
                        </div>
                                                    <i @click="addTimeRemind(3)">添加</i>
                                                </div>
                                                <keep-alive include="multiple">
                                                    <multiple :mulActive='hourActive' v-on:addMulActive="addHourActive"></multiple>
                                                </keep-alive>

                                                <div class="alarm">
                                                    <mt-switch class="swtich" v-model="bigHourValue" @change="turn"></mt-switch>
                                                    <span class="alarm-clock">闹钟提醒</span>
                                                    <mt-switch class="swtich" v-model="bigHourVipValue" @change="turn"></mt-switch>
                                                    <span>短信提醒/电话提醒 (VIP)</span>
                                                </div>
                                            </div>
                                            <div class="more">
                                                <ul v-if="remindArr.length>0">
                                                    <li v-for="(item,i) in remindArr" :key="i">
                                                        <span>{{item.remindData.type}}</span>
                                                        <span>{{item.remindData.num}}</span>
                                                        <i class="iconfont icon-jianshao" @click="deleteOneMinuteRemind(item.id)"></i>
                                                    </li>
                                                </ul>
                                                <div class="checkmore" @click="getmore">
                                                    查看更多币种预警
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
</template>

<script>
import multiple from "../../commons/components/multiple.vue";
import meanItem from "../../commons/components/meanItem.vue";
import remote from "../../lib/js/remote.js";
import { Toast,Indicator } from "mint-ui";

export default {
    data() {
        return {
            //交易对
            symbol: "",
            //币种
            coin: "",
            exchangeList: "",
            //币种转美元
            coinChange: "",
            counterparty: "",
            //美元转人民币
            daoToYuan: "",
            //交易所
            exchange: "ZB",
            //货币人民币价钱
            exchangeRate: "",
            nowPrice: "",
            cny: "",
            allData: "",
            //swich
            priceErrandValue: true,
            bigMinuteValue: true,
            bigMinuteVipValue: true,
            bigFifteenValue: true,
            bigFifteenVipValue: true,
            bigHourValue: true,
            bigHourVipValue: true,
            value: true,
            activeIndex: 2,
            //下拉框
            showOption: "",
            selectOption: "",
            //倍数
            liActive: 0,
            fifActive: 0,
            hourActive: 0,
            //大单预警
            minuteNum: "",
            fifteenNum: "",
            hourNum: "",
            //均量
            minuteMean: "",
            fifteenMean: "",
            hourMean: "",
            //均量时间
            oneminute: "1分钟",
            fiftymin: "15分钟",
            onehour: "1小时",
            priceErrandArr: [],
            //差价input
            highPrice: "",
            lowPrice: "",
            // 涨跌预警

            remindArr: [],
            riseNum: "",
            fallNum: "",
            rangeNum: "",
            //交易所
            category: [],
            userId: "",
            timeout: "",
            number: {
                type: Number,
                default: 6
            }
        };
    },
    components: {
        multiple,
        meanItem
    },
    computed: {
        riseChange: function() {
            return (this.riseNum * this.exchangeRate).toFixed(4);
        },
        fallChange: function() {
            return (this.fallNum * this.exchangeRate).toFixed(4);
        },
        highChange: function() {
            return (this.highPrice * this.exchangeRate).toFixed(4);
        },
        lowChange: function() {
            return (this.lowPrice * this.exchangeRate).toFixed(4);
        },
        hourConvert: function() {
            return (this.hourNum * this.exchangeRate * this.nowPrice).toFixed(
                4
            );
        },
        fifminConvert: function() {
            return (
                this.fifteenNum *
                this.exchangeRate *
                this.nowPrice
            ).toFixed(4);
        },
        minuteConvert: function() {
            return (this.minuteNum * this.exchangeRate * this.nowPrice).toFixed(
                4
            );
        },
    },
    created() {
        this.getActive();
        this.getRemindArrData();
        this.getdata();
    },
    mounted() {
        this.$socket.open();
    },
    sockets: {
        connect: function() {
            console.log("启动中");
            clearInterval(this.timeout);
            if (this.exchange === "火币") {
                this.theNewPriceOfHuobi();
                this.timeout = setInterval(() => {
                    let sockets = this.$options["sockets"];
                    if (sockets) {
                        Object.keys(sockets).forEach(key => {
                            delete this.$options.sockets[key];
                        });
                    }
                    this.theNewPriceOfHuobi();
                }, 5000);
            } else if (this.exchange === "币安") {
                this.theNewPriceOfBian();
            } else if (this.exchange === "OKEx") {
                this.theNewPriceOfOkex();
                this.timeout = setInterval(() => {
                    delete this.$options.sockets.okexticker;

                    this.theNewPriceOfOkex();
                }, 5000);
            } else if (this.exchange === "ZB") {
                this.theNewPriceOfZb();
                this.timeout = setInterval(() => {
                    let sockets = this.$options["sockets"];
                    if (sockets) {
                        Object.keys(sockets).forEach(key => {
                            delete this.$options.sockets[key];
                        });
                    }
                    this.theNewPriceOfZb();
                }, 5000);
            }
        }
    },
    methods: {
        getOptions(name, i) {
            this.selectOption = name;
        },
        //推送
        //火币最新价
        theNewPriceOfHuobi() {
            this.$socket.emit("huobi", { type: "detail", detail: this.symbol });
            this.$options.sockets.huobidetail = res => {
                let data = JSON.parse(res).tick;
                console.log(data);
                this.nowPrice = data.close;
                data = null;
            };
        },
        theNewPriceOfBian() {
            // 币安详情
            this.$socket.emit("binance", {
                type: "updatek",
                detail: this.symbol,
                time: "1d"
            });
            this.$options.sockets.updatek = coinDetailData => {
                let data = JSON.parse(coinDetailData)["k"];
                this.nowPrice = Number(data.c).toFixed(2);
            };
        },
        // OKEx最新价
        theNewPriceOfOkex() {
            this.$socket.emit("okcoin", {
                type: "ticker",
                detail: this.symbol
            });
            this.$options.sockets.okexticker = coinDetailData => {
                let data = JSON.parse(coinDetailData);
                this.nowPrice = Number(data.last).toFixed(2);
                // console.log(data);
                data = null;
            };
        },
        theNewPriceOfZb() {
            this.$socket.emit("zbmarket", {
                type: "detail",
                detail: this.symbol
            });
            this.$options.sockets.zb_ticker = res => {
                let data = JSON.parse(res);
                console.log(data);
                this.nowPrice = Number(data.last).toFixed(2);
            };
        },
        getRemindArrData() {
            //获取数据
            this.symbol = this.$route.query.symbol;
            this.coin = this.$route.query.coin;
            this.counterparty = this.$route.query.counterparty;
            console.log("this.counterparty--" + this.counterparty);

            // this.exchangeRate = this.$route.query.exchangeRate
            if (this.$route.query.priceActive) {
                this.activeIndex = Number(this.$route.query.priceActive);
            }
            this.exchangeList = JSON.parse(
                window.sessionStorage.getItem("exchangeList")
            );

            this.daoToYuan = JSON.parse(
                window.sessionStorage.getItem("daoToYuan")
            );

            //各货币转换人民币价钱
            if (this.counterparty.toLocaleUpperCase() === "BTC") {
                this.exchangeRate =
                    this.exchangeList["BTCUSDT"].lastPrice * this.daoToYuan;
            } else if (this.counterparty.toLocaleUpperCase() === "ETH") {
                this.exchangeRate =
                    this.exchangeList["ETHUSDT"].lastPrice * this.daoToYuan;
            } else if (this.counterparty.toLocaleUpperCase() === "BNB") {
                this.exchangeRate =
                    this.exchangeList["ETHUSDT"].lastPrice * this.daoToYuan;
            } else if (this.counterparty.toLocaleUpperCase() === "HT") {
                this.exchangeRate =
                    this.exchangeList["ETHUSDT"].lastPrice * this.daoToYuan;
            } else if (this.counterparty.toLocaleUpperCase() === "OKB") {
                this.exchangeRate =
                    this.exchangeList["ETHUSDT"].lastPrice * this.daoToYuan;
            } else if (this.counterparty.toLocaleUpperCase() === "QC") {
                this.exchangeRate =
                    this.exchangeList["ETHUSDT"].lastPrice * this.daoToYuan;
            } else if (this.counterparty.toLocaleUpperCase() === "USDT") {
                this.exchangeRate = this.daoToYuan;
            }

            if (this.counterparty.toLocaleUpperCase === "USDT") {
            }
            this.exchange = this.$route.query.marketName;
            if (this.exchange === "Okex") {
                this.exchange = "OKEx";
            }
            // console.log("交易所---" + this.exchange);

            //查看除了当前交易所的其它交易所
            let params = {
                tradeName: this.exchange,
                curr_a: this.coin,
                curr_b: this.counterparty
            };
            remote.select_market(params).then(res => {
                // console.log(res)
                this.category = res.data.datamap;
            });
        },
        getdata(key) {
            let params = {
                typeId: this.activeIndex,
                uid: this.userId
            };
            //当前ID的设置过的预警
            let hasRemind = [];

            remote.select_all(params).then(res => {
                this.allData = res.data.wallertMarketReminds;
                for (const item of res.data.wallertMarketReminds) {
                    if (
                        item.marketName === this.exchange &&
                        item.marketToken === this.symbol &&
                        item.uid === this.userId &&
                        item.typeId === 1
                    ) {
                        item.remindData = JSON.parse(item.remindData);
                        hasRemind.push(item);
                    }
                    if (
                        item.marketName === this.exchange &&
                        item.marketToken === this.symbol &&
                        item.uid === this.userId &&
                        item.typeId === 2
                    ) {
                        item.remindData = JSON.parse(item.remindData);
                        hasRemind.push(item);
                    }
                    if (
                        item.marketName === this.exchange &&
                        item.marketToken === this.symbol &&
                        item.uid === this.userId &&
                        item.typeId === 3
                    ) {
                        item.remindData = JSON.parse(item.remindData);
                        hasRemind.push(item);
                    }
                }
                this.remindArr = hasRemind;
                // console.log(this.remindArr);
            });
        },

        //添加价差预警
        addPriceAlmost(num) {
            let contrast = "";

            //根据选择的交易所生成相对的交易对
            if (this.selectOption == "") {
                Indicator.close();
                this.$messagebox({
                    title: "温馨提示",
                    message: "请选择平台"
                });
                return;
            } else if (this.selectOption === "火币") {
                contrast =
                    this.coin.toLocaleLowerCase() +
                    this.counterparty.toLocaleLowerCase();
            } else if (this.selectOption === "OKEx") {
                contrast =
                    this.coin.toLocaleLowerCase() +
                    "_" +
                    this.counterparty.toLocaleLowerCase();
            } else if (this.selectOption === "币安") {
                contrast =
                    this.coin.toLocaleUpperCase() +
                    this.counterparty.toLocaleUpperCase();
            } else if (this.selectOption === "Gate") {
                contrast =
                    this.coin.toLocaleLowerCase() +
                    "_" +
                    this.counterparty.toLocaleLowerCase();
            } else if (this.selectOption === "ZB") {
                contrast =
                    this.coin.toLocaleLowerCase() +
                    this.counterparty.toLocaleLowerCase();
            }
            //判断是添加的类型
            let type = "";
            let priceVal = "";
            let change = "";
            if (num === 1) {
                type = "高于";
                priceVal = this.highPrice;
                change = this.highChange;
                if (this.highPrice == "") {
                    Indicator.close();
                    this.$messagebox({
                        title: "温馨提示",
                        message: "格式不正确"
                    });
                    return;
                }
            } else if (num === 2) {
                type = "低于";
                priceVal = this.lowPrice;
                change = this.lowChange;
                if (this.lowPrice == "") {
                    Indicator.close();
                    this.$messagebox({
                        title: "温馨提示",
                        message: "格式不正确"
                    });
                    return;
                }
            }
            console.log("num---" + num);
            console.log("priceVal---" + priceVal);

            let marketToken = this.symbol;

            let alarm = Number(this.priceErrandValue);

            let remindData = {
                symblo: contrast,
                type: type,
                num: priceVal,
                price: change,
                contrast: this.selectOption,
                coin: this.coin,
                counterparty: this.counterparty
            };
            let checkData = this.remindArr;
            for (const item of checkData) {
                if (
                    item.remindData.type === remindData.type &&
                    item.remindData.num == remindData.num &&
                    item.remindData.contrast === remindData.contrast
                ) {
                    Indicator.close();
                    this.$messagebox({
                        title: "温馨提示",
                        message: "相同记录仅能设置一条"
                    });
                    return;
                }
            }
            Indicator.open({
                text: "Loading...",
                spinnerType: "snake"
            });

            remindData = JSON.stringify(remindData);

            var params = new URLSearchParams();
            params.append("typeId", this.activeIndex);
            params.append("uid", this.userId);
            params.append("marketToken", marketToken);
            params.append("marketName", this.exchange);
            params.append("alarm", alarm);
            params.append("remindData", remindData);

            remote.save_remind(params).then(res => {
                if (res.data.code === "200") {
                    Indicator.close();
                    this.$messagebox({
                        title: "温馨提示",
                        message: "添加成功"
                    });
                    this.getdata();
                }
            });
        },
        //删除价差预警
        deletePeiceErrandArr(key) {
            var param = { id: key };
            remote.delete_remind(param).then(res => {
                if (res.data.code === "200") {
                    this.getdata(2);
                }
            });
        },
        //添加上升/下跌/涨跌幅预警
        addManyRemind(data) {
            //交易对
            let marketToken = this.symbol;
            //是否提醒
            let alarm = Number(this.value);
            //提醒分类
            let remindType = "";
            let remindNum = "";
            let changePrice = "";
            if (data.params === 1) {
                remindNum = this.riseNum;
                remindType = "上涨至";
                changePrice = this.riseChange;
                if (Number(this.riseNum)<= Number(this.nowPrice)) {
                    console.log(Number(this.riseNum));
                    console.log(Number(this.nowPrice));
                    Toast({
                            message: "上涨价不能低于现价",
                            duration: 5000,
                            duration: 1000
                        });
                        return
                }
            } else if (data.params === 2) {
                remindNum = this.fallNum;
                remindType = "下跌至";
                changePrice = this.fallChange;
                if (Number(this.fallNum)>= Number(this.nowPrice)) {
                    Toast({
                            message: "下跌价不能高于现价",
                            duration: 5000,
                            duration: 1000
                        });
                        return
                }
            } else if (data.params === 3) {
                remindType = "涨跌幅";
                remindNum = this.rangeNum;
            }
            // console.log(data.params);

            if (remindNum === "") {
                this.$messagebox({
                    title: "温馨提示",
                    message: "请输入数额"
                });
                return;
            }
           
            let remindData = {
                type: remindType,
                num: remindNum,
                price: changePrice,
                coin: this.coin,
                counterparty: this.counterparty
            };

            let checkData = this.allData;
            for (const item of checkData) {
                if (
                    item.marketName === this.exchange &&
                    item.marketToken === marketToken &&
                    item.remindData.type === remindData.type &&
                    item.remindData.num === remindData.num
                ) {
                    this.$messagebox({
                        title: "温馨提示",
                        message: "相同记录仅能设置一条"
                    });
                    return;
                }
            }
            Indicator.open({
                text: "Loading...",
                spinnerType: "snake"
            });

            remindData = JSON.stringify(remindData);

            var params = new URLSearchParams();
            params.append("typeId", this.activeIndex);
            params.append("uid", this.userId);
            params.append("marketToken", marketToken);
            params.append("marketName", this.exchange);
            params.append("alarm", alarm);
            params.append("remindData", remindData);

            remote.save_remind(params).then(res => {
                if (res.data.code === "200") {
                    Indicator.close();
                    this.$messagebox({
                        title: "温馨提示",
                        message: "添加成功"
                    });
                    this.getdata();
                }
            });
        },
        //删除涨跌预警
        deleteArrList(i) {
            var param = { id: i };
            remote.delete_remind(param).then(res => {
                if (res.data.code === "200") {
                    this.getdata();
                }
            });
        },
        //添加大单预警
        addTimeRemind(num) {
            let remindNum = "";
            let remindType = "";
            let alarm = "";
            let remindVIP = "";
            if (num === 1) {
                remindNum = this.minuteNum;
                remindType = "1分钟提醒额度";
                alarm = Number(this.bigMinuteValue);
                remindVIP = Number(this.bigMinuteVipValue);
            } else if (num === 2) {
                remindNum = this.fifteenNum;
                remindType = "15分钟提醒额度";
                alarm = Number(this.bigFifteenValue);
                remindVIP = Number(this.bigFifteenVipValue);
            } else if (num === 3) {
                remindNum = this.hourNum;
                remindType = "1小时提醒额度";
                alarm = Number(this.bigHourValue);
                remindVIP = Number(this.bigHourVipValue);
            }

            if (remindNum === "") {
                this.$messagebox({
                    title: "温馨提示",
                    message: "请输入数额"
                });
                return;
            }

            let remindData = {
                type: remindType,
                num: remindNum,
                coin: this.coin,
                counterparty: this.counterparty
            };

            let checkData = this.allData;
            for (const item of checkData) {
                if (
                    item.marketName === this.exchange &&
                    item.marketToken === this.symbol &&
                    item.remindData.type === remindData.type &&
                    item.remindData.num === remindNum
                ) {
                    this.$messagebox({
                        title: "温馨提示",
                        message: "相同记录仅能设置一条"
                    });
                    return;
                }
            }
            Indicator.open({
                text: "Loading...",
                spinnerType: "snake"
            });

            remindData = JSON.stringify(remindData);

            var params = new URLSearchParams();
            params.append("typeId", this.activeIndex);
            params.append("uid", this.userId);
            params.append("marketToken", this.symbol);
            params.append("marketName", this.exchange);
            params.append("alarm", alarm);
            params.append("vip", remindVIP);
            params.append("remindData", remindData);

            remote.save_remind(params).then(res => {
                if (res.data.code === "200") {
                    Indicator.close();
                    this.$messagebox({
                        title: "温馨提示",
                        message: "添加成功"
                    });
                    this.getdata();
                }
            });
        },

        //删除1分钟预警
        deleteOneMinuteRemind(i) {
            var param = { id: i };

            remote.delete_remind(param).then(res => {
                if (res.data.code === "200") {
                    this.getdata();
                }
            });
        },
        checkindex(data) {
            console.log(data);
            this.activeIndex = data.params;
            if (this.$route.query.priceActive) {
                this.$route.query.priceActive = data.params;
            }
            sessionStorage.setItem("priceActive", data.params);
            this.getdata(data.params);
        },
        //switch状态改变
        turn() {
            this.$toast({
                message: "修改成功",
                position: "bottom",
                duration: 500
            });
        },
        getmore() {
            this.$router.push({ path: "/priceRemind" });
        },
        goback() {
            this.$router.goBack();
        },
        //获取大单每1分钟平均量
        getMinuteNum(data) {
            this.minuteMean = data;
        },
        //获取大单每15分钟平均量
        getFifteenNum(data) {
            this.fifteenMean = data;
        },
        //获取大单每小时分钟平均量
        getHourNum(data) {
            this.hourMean = data;
        },
        //大单买卖改变倍数高亮
        addActive(num) {
            this.liActive = num;
            this.minuteNums = (this.minuteMean * num).toFixed(4);
            this.minuteNum = (this.minuteMean * num).toFixed(4);
        },
        //大单买卖改变倍数高亮
        addFifteenActive(num) {
            this.fifActive = num;
            this.fifteenNums = (this.fifteenMean * num).toFixed(4);
            this.fifteenNum = (this.fifteenMean * num).toFixed(4);
        },
        //大单买卖改变倍数高亮
        addHourActive(num) {
            // console.log(num);
            this.hourActive = num;
            this.hourNums = (this.hourMean * num).toFixed(4);
            this.hourNum = (this.hourMean * num).toFixed(4);
        },
        getActive() {
            this.activeIndex =
                JSON.parse(sessionStorage.getItem("priceActive")) || 1;
            this.userId = this.$store.state.userInfo.uid;
        },
        //option开关
        showOptions() {
            this.showOption = true;
        },
        closeOptions() {
            this.showOption = false;
        }
    },
    beforeDestroy() {
        // console.log("000");
        clearInterval(this.timeout);
        delete this.$options.sockets.updatek;
        this.$socket.close();
    },
    watch: {
        //值不一样就取消高亮
        minuteNum() {
            if (this.minuteNum !== this.minuteNums) {
                this.liActive = "";
            }
        },
        //值不一样就取消高亮
        fifteenNum() {
            if (this.fifteenNum !== this.fifteenNums) {
                this.fifActive = "";
            }
        },
        //值不一样就取消高亮
        hourNum() {
            if (this.hourNum !== this.hourNums) {
                this.hourActive = "";
            }
        },
    }
};
</script>
<style>
.price header {
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 1.6rem;
    background-color: #f4f7f9;
}
.price .back {
    width: 4.8%;
    display: inline-block;
    height: 100%;
    text-align: center;
    line-height: 1.6rem;
    margin-left: 15px;
}
.price .back span {
    font-size: 18px;
}
.price .pricenav {
    background-color: #e2eaee;
    display: inline-block;
    box-sizing: border-box;
    vertical-align: top;
    width: 72.5%;
    height: 35px;
    margin-top: 26px;
    transform: translateY(-18px);
    text-align: center;
    line-height: 35px;
    margin-left: 5.333%;
    font-size: 0;
    padding: 2px;
    border-radius: 3px;
}
.price .pricenav span {
    display: inline-block;
    width: 33.3%;
    font-size: 14px;
    /* background-color: pink; */
    height: 31px;
    line-height: 31px;
    color: #a6afba;
    text-align: center;
    border-radius: 3px;
}
.price .pricenav .activeClass {
    background-color: #fff;
    color: #42c300;
}
.price nav {
    position: fixed;
    padding-top: 1.6rem;
    z-index: 998;
    width: 100%;
    height: 40px;
    font-size: 0;
    background-color: #f4f7f9;
    margin-bottom: 8px;
    box-shadow: 2px 2px 2px rgba(230, 238, 242, 1);
}
.price nav span {
    display: inline-block;
    width: 25%;
    text-align: center;
    font-size: 13px;
    line-height: 40px;
}
.price .remind {
    width: 100%;
    box-sizing: border-box;
    padding-left: 4%;
    padding-right: 4%;
    background-color: #f4f7f9;
    margin-bottom: 10px;
}
.price .bigremind {
    padding-right: 0%;
}

.price .remind > div p {
    height: 38px;
    line-height: 38px;
}
.price .remind .input-box {
    position: relative;
    width: 75%;
    height: 48px;
    display: inline-block;
}

.price .remind .input-box input {
    width: 100%;
    height: 48px;
    box-sizing: border-box;
    border: 1px solid #a6afba;
    padding-left: 6%;
    padding-right: 25%;
}
.price .remind > div i {
    display: inline-block;
    width: 23%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #42c300;
    vertical-align: top;
}
.price .remind-nav {
    position: relative;
}
.price .remind .alarm {
    font-size: 0;
    height: 46px;
    padding-top: 12px;
    /* line-height: 50px; */
}
.price .remind .alarm > span {
    display: inline-block;
    height: 38px;
    vertical-align: top;
    line-height: 38px;
    font-size: 12px;
}
.price .remind .alarm .alarm-clock {
    margin-right: 5%;
}
.price .remind .input-box span {
    width: 100px;
    font-size: 12px;
    height: 100%;
    color: #a6afba;
    line-height: 48px;
    position: absolute;
    right: 0;
    top: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.price .remind .remind-nav .percent {
    left: 0;
    top: 0;
    width: 25px;
    text-align: center;
}
.price .remind .remind-nav .percent-value {
    padding-left: 10%;
}
.price .more {
    line-height: 48px;
    padding: 0 15px;
    margin-bottom: 20px;
}

.price .swtich {
    display: inline-block;
    margin-top: 7px;
    margin-right: 1.33%;
}
.price .inputvalue {
    position: relative;
    width: 100%;
    box-sizing: border-box;
}
.price .inputvalue input {
    width: 75%;
    height: 48px;
    box-sizing: border-box;
    border: 1px solid #a6afba;
    padding-left: 6%;
    padding-right: 20%;
}
.price .inputvalue i {
    display: inline-block;
    width: 19%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #42c300;
    vertical-align: top;
}
.price .rising span:nth-child(3) {
    margin-left: 20px;
    font-size: 12px;
    color: #a6afba;
}
.price .decline span:nth-child(3) {
    margin-left: 20px;

    font-size: 12px;
    color: #a6afba;
}
.price .rising i {
    float: right;
    font-size: 18px;
    color: #f43e3a;
}
.price .errand i {
    float: right;
    font-size: 18px;
    color: #f43e3a;
}
.price .decline i {
    float: right;
    font-size: 18px;
    color: #f43e3a;
}
.price .percent i {
    float: right;
    font-size: 18px;
    color: #f43e3a;
}
.price .checkmore {
    width: 68%;
    height: 48px;
    background-color: #48c122;
    margin: 0 auto;
    border-radius: 24px;
    line-height: 48px;
    text-align: center;
    color: #fff;
    margin-top: 20px;
}
.price .minute i {
    float: right;
    font-size: 18px;
    color: #f43e3a;
}
.price li i {
    float: right;
    font-size: 18px;
    color: #f43e3a;
}
.price li span:nth-child(3) {
    font-size: 12px;
    color: #a6afba;
}
.price .remind > div .seleteName {
    line-height: 48px;
    border: 1px solid #a6afba;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    padding: 0 20px;
}
.price .remind .select {
    position: relative;
}
.price .remind .select i {
    top: 22px;
    right: 6%;
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 5px 5px 0px;
    border-style: solid;
    border-color: #a6afba transparent transparent;
}
.price .options {
    transition: all 1s;
    box-sizing: border-box;
    position: absolute;
    z-index: 999;
    background-color: #fff;
    border: 1px solid #a6afba;
    border-top: none;
    width: 100%;
}
.price .remind .options p {
    font-size: 13px;
    box-sizing: border-box;
    line-height: 32px;
    padding: 0 20px;
    height: 32px;
    color: black;
    z-index: 999;
    background-color: #fff;
}
.price .remind .options p:hover {
    background-color: #ade1f5;
    color: #fff;
}
.price .remind .options .selectSymbol {
    height: 32px;
    line-height: 32px;
    margin-left: 20px;
}
.bigVastRemind ul li span:first-child {
    display: inline-block;
    width: 34%;
}
.price .information {
    padding-top: 3rem;
}
</style>
