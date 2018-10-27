
<template>
    <div class="cbDealbuyoneBian">

        <main class='cbmain'>
            <div>
                <div class="maintop">
                    <div @click="selectway('selectway')" class="selectcontent">{{decimaltxt}}
                        <i class="iconfont icon-arrow-down"></i>
                    </div>
                    <p @click="whatcancel(decimaltxt1)">
                        {{decimaltxt1}}</p>
                    <div v-if="isWay==0" class="selectOne">
                        <i class="jian"></i>
                        <p @click="decimal(0)">限价单</p>
                        <i class="jian"></i>
                        <p @click="decimal(2)">市价单</p>
                        <i class="jian"></i>
                        <p @click="decimal(4)">分笔委托 &nbsp;（VIP）</p>
                        <i class="jian"></i>
                        <p @click="decimal(6)">云委托 &nbsp;（VIP）</p>
                        <i class="jian"></i>
                        <p @click="decimal(8)">套利模式 &nbsp;（VIP）</p>
                    </div>
                </div>
                <div class="mainLeft">
                    <span v-if="comments==0" class="avail">可用金额: {{parseInt(usdtDate*100000)/100000}} &nbsp;{{counterparty}}</span>
                    <span v-if="comments==1" class="avail">可用金额: {{parseInt(usdtDate1*100000)/100000}} &nbsp;{{coin}}</span>
                    <span v-if="reveal==1" class="avail shaoyu">(低于￥1000元无法使用)</span>
                    <!-- 限价市价 -->
                    <div v-if="isMode==1" class="mainInput">
                        <div v-show="isShow==0" class="mainInputct">
                            <p>价格</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="priceText" style="text-align:right" @keyup='keydown(1)' ref="input1">
                            <p v-if="counterparty=='USDT'" class="zhuanhuan">≈{{parseInt(priceText*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuan">≈{{parseInt(priceText*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>数量</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" :placeholder="coin" class="price" v-model="amount" style="text-align:right" @keyup='keydown(2)' ref="input2">
                        </div>
                        <div v-show="isShow==0" class="mainInputct">
                            <p>金额</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="sumText" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='USDT'" class="zhuanhuanone">≈{{parseInt(sumText*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuanone">≈{{parseInt(sumText*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                    </div>
                    <!-- 分笔委托 -->
                    <div v-if="isMode==2&&comments==0" class="mainInput">
                        <div class="mainInputct">
                            <p>买入总额</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="buysum" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='USDT'" class="zhuanhuanone">≈{{parseInt(buysum*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuanone">≈{{parseInt(buysum*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>单笔金额</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="singlemoney" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='USDT'" class="zhuanhuanone">≈{{parseInt(singlemoney*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuanone">≈{{parseInt(singlemoney*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>委托深度</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" placeholder="0.1%|0.2%" type="number" class="price" v-model="entruesdepth" style="text-align:right" @keyup='keydown(2)' ref="input2">
                        </div>
                        <div class="mainInputct">
                            <p>最高买入价</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="mosthightprice" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='USDT'" class="zhuanhuanone">≈{{parseInt(mosthightprice*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuanone">≈{{parseInt(mosthightprice*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                    </div>
                    <div v-if="isMode==2&&comments==1" class="mainInput">
                        <div class="mainInputct">
                            <p>卖出数量</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="buysum" @keyup='keydown(3)' :placeholder="coin" style="text-align:right">
                            <p v-if="counterparty=='USDT'" class="zhuanhuanone">≈{{parseInt(buysum*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuanone">≈{{parseInt(buysum*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>单笔数量</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="singlemoney" @keyup='keydown(3)' :placeholder="coin" style="text-align:right">
                            <p v-if="counterparty=='USDT'" class="zhuanhuanone">≈{{parseInt(singlemoney*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuanone">≈{{parseInt(singlemoney*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>委托深度</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" placeholder="0.1%|0.2%" type="number" class="price" v-model="entruesdepth" style="text-align:right" @keyup='keydown(2)' ref="input2">
                        </div>
                        <div class="mainInputct">
                            <p>最低价卖出</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="mosthightprice" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='USDT'" class="zhuanhuanone">≈{{parseInt(mosthightprice*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuanone">≈{{parseInt(mosthightprice*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                    </div>
                    <!-- 云委托 -->
                    <div v-if="isMode==3" class="mainInput">
                        <div class="mainInputct">
                            <p>触发价格</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="triggerprice" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='USDT'" class="zhuanhuanone">≈{{parseInt(triggerprice*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuanone">≈{{parseInt(triggerprice*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>委托价格</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="entrustprice" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='USDT'" class="zhuanhuanone">≈{{parseInt(entrustprice*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuanone">≈{{parseInt(entrustprice*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>数量</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" :placeholder="coin" class="price" v-model="amountplan" style="text-align:right" @keyup='keydown(2)' ref="input2">
                        </div>
                    </div>
                    <!-- 套利模式 -->
                    <div v-if="isMode==4" class="mainInput">
                        <div class="mainInputct">
                            <p>推荐收益率</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" placeholder="0.6%" class="price" v-model="amount1" style="text-align:right" @keyup='keydown(2)' ref="input2">
                            <p class="zhuanhuanone">仅供参考</p>
                        </div>
                        <div class="mainInputct">
                            <p>自定义收益率</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" placeholder="0.2%" class="price" v-model="yieldcurve" style="text-align:right" @keyup='keydown(2)' ref="input2">
                        </div>
                        <div class="mainInputct">
                            <p>总金额</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="yieldcurvesum" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='USDT'" class="zhuanhuanone">≈{{parseInt(yieldcurvesum*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='USDT'" class="zhuanhuanone">≈{{parseInt(yieldcurvesum*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                    </div>
                    <div v-if="isMode==1" class="cang">
                        <div @click="cang('cangone')" :class="{cangactive:cangactive=='cangone'}">全仓</div>
                        <div @click="cang('cangtwo')" :class="{cangactive:cangactive=='cangtwo'}">半仓</div>
                        <div @click="cang('cangthree')" :class="{cangactive:cangactive=='cangthree'}">1/3仓</div>
                        <div @click="cang('cangfour')" :class="{cangactive:cangactive=='cangfour'}">1/4仓</div>
                    </div>
                    <!-- <span v-if="comments==0" class="avail">可用金额: {{parseInt(usdtDate*100000)/100000}} &nbsp;{{counterparty}}</span>
                    <span v-if="comments==1" class="avail">可用金额: {{parseInt(usdtDate1*100000)/100000}} &nbsp;{{coin}}</span>
                    <span v-if="reveal==1" class="avail shaoyu">(低于￥1000元无法使用)</span> -->
                    <div :style="revealstyle" v-if="comments==0&&isMode!== 4" @click="likeBuy('in')" class="likeBuy">立即买入</div>
                    <div :style="revealstyle" v-if="comments==1&&isMode!== 4" @click="likeBuy('out')" class="likeBuyout">立即卖出</div>
                    <div :style="revealstyle" v-if="comments==0&&isMode== 4&&isMode1==0" @click="likeBuy('in')" class="likeBuy">开始套利({{timeset}})</div>
                    <div :style="revealstyle" v-if="comments==0&&isMode== 4&&isMode1==1" @click="likeBuy('in')" class="likeBuyout">立即停止({{timeset}})</div>
                    <div :style="revealstyle" v-if="comments==1&&isMode== 4&&isMode1==0" @click="likeBuy('out')" class="likeBuy">开始套利({{timeset}})</div>
                    <div :style="revealstyle" v-if="comments==1&&isMode== 4&&isMode1==1" @click="likeBuy('out')" class="likeBuyout">立即停止({{timeset}})</div>
                    <div :style="isTrue" class="tu" id="chart">
                        <!-- <earch :res='res' :Data='Data' :id='id'></earch> -->
                    </div>
                    <div class="buysell">
                        <div class="oneshu">
                            <span>买单</span>
                        </div>
                        <div class="twoshu">
                            <span>卖单</span>
                        </div>
                    </div>
                    <div class="threeshuz">
                        <span v-if="counterparty=='USDT'" class="threeshu">($){{threeshu}}</span>
                        <sapn v-if="counterparty=='USDT'" class="fourshu">($){{fourshu}}</sapn>
                        <span v-if="counterparty!='USDT'" class="threeshu">({{counterparty}}){{threeshu}}</span>
                        <span v-if="counterparty!='USDT'" class="fourshu">({{counterparty}}){{fourshu}}</span>
                    </div>
                </div>
                <div class="mainRight">
                    <new-depth :counterparty='counterparty' :depthAsks='depthAsks' :depthBids="depthBids" :newdata="newdata" :usdtcny='usdtcny'></new-depth>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
import NewDepth from "../../commons/components/dealModule/newDepth.vue";
import { encryptKey, MD5, decryptByKey } from "../../lib/js/crypto.js";
import remote from "../../lib/js/remote.js";
import axios from "axios";
import { Toast, MessageBox } from "mint-ui";
import { urljm } from "../../lib/js/jsmi.js";
import { myChart } from "../../lib/js/echers.js";
import io from "../../lib/js/socket.io.js";
export default {
    name: "cbDealBuyoneBian",
    components: {
        NewDepth
    },
    data() {
        return {
            timeset: "00:00",
            countimeset: null,
            uuid: null,
            //云委托数据
            // triggerprice:null,//触发价格
            // numprice:null,//数量
            isMode: 1,
            isMode1: 0,
            isWay: 1,
            usdtcny: 0,
            coin: "",
            counterparty: "",
            usdt: [],
            newdata: 0,
            usdtDate: 0,
            usdtDate1: 0,
            rate: 0, //汇率
            priceText: null, //输入价格
            amount1: 0.6, // 输入数量
            amount: null, // 输入数量
            sumText: null, //输入总金额
            //分笔
            buysum: null, //买入总额或卖出数量
            singlemoney: null, //单笔金额或单笔数量
            entruesdepth: null, //委托深度
            mosthightprice: null, //最高价买入或最低价卖出
            //套利
            yieldcurve: null, //收益率
            yieldcurvesum: null, //套利金额
            //云
            triggerprice: null, //触发价格
            entrustprice: null, //委托价格
            amountplan: null, //云委托数量
            isShowone: 0,
            number: 4,
            //   comment: 0,
            comments: 0,
            active: "mainBuy",
            decimaltxt: "限价单",
            decimaltxt1: "←点击查看更多买卖方式",
            isShow: 0,
            isFalse: { "background-color": "#48c122" },
            isFalseone: { color: "#48c122" },
            isFalse1: {},
            isFalseone1: {},
            isTrue: {},
            depthAsks: [], //卖盘
            depthBids: [], //买盘
            historyBy: [],
            //火币请求数据相关参数
            urldata: "",
            argsdata: {},
            huobiData: {},
            cangactive: "",
            // type: ""
            numMoney: null,
            numMoneyData: 0,
            set: null,
            symbol: "",
            user: {},
            marketName: "",
            xdata: [],
            ydatasum: [],
            xdata1: [],
            ydatasum1: [],
            threeshu: 0,
            fourshu: 0,
            Biankey: [],
            balancemoney: null,
            reveal: 0,
            revealstyle: null
        };
    },
    watch: {
        $route(to, from) {
            if (to.query.text === "mainBuy") {
                // this.isMode1 = 0;
                this.comments = 0;
            } else if (to.query.text === "mainSale") {
                // this.isMode1 = 0;

                this.comments = 1;
            }
        },
        sumText() {
            this.sumText = parseInt(this.sumText * 10000) / 10000;
            this.amount = parseInt(this.amount * 10000) / 10000;
            this.priceText = parseInt(this.priceText * 10000) / 10000;
            if (this.comments == 0) {
                if (Number(this.sumText) > Number(this.usdtDate)) {
                    Toast({
                        message: "可用余额不足",
                        duration: 5000,
                        className: "toast",
                        duration: 1000
                    });
                }
            } else if (this.comments == 1) {
                if (Number(this.amount) > Number(this.usdtDate1)) {
                    Toast({
                        message: "可用余额不足",
                        duration: 5000,
                        className: "toast",
                        duration: 1000
                    });
                }
            }
        }
    },
    //     sockets:{
    //     connect: function(){
    //         console.log(5454111111111);

    //     },
    //     customEmit: function(){
    //       console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    //     }
    //   },
    created() {
        if (this.$route.query.text == "mainBuy") {
            this.comments = 0;
        } else if (this.$route.query.text === "mainSale") {
            this.comments = 1;
        }
    },
    mounted() {
        // this.$socket.open();
        // var socket = io.connect(
        //     "ws://chaobis.lian2345.com:20000",
        //     {
        //         timeout: 2000,
        //         reconnection: true,
        //         reconnectionDelayMax: 10000,
        //         reconnectionDelay: 1000
        //     }
        // );
        // // socket.open()
        // socket.emit(" binance_depth_symbols", { symbol: "ETHBTC" }); //向服务器发送消息,币安单个详情

        // //币安depth详情
        // socket.on(" binance_depth_all_symbols ", function(data) {
        //     console.log("...................haha");
        //     console.log(JSON.parse(data));
        // });
        this.depth();
    },
    activated() {},
    methods: {
        depth() {
            // console.log(this.$store.state.userInfo.phone);

            function RndNum(n) {
                var rnd = "";
                for (var i = 0; i < n; i++)
                    rnd += Math.floor(Math.random() * 10);
                return rnd;
            }
            this.Biankey = JSON.parse(
                decryptByKey(localStorage.getItem("biankey"))
            );
            this.Biankey.apikey = urljm(this.Biankey.apikey); //这个是加密后的
            this.Biankey.secretkey = urljm(this.Biankey.secretkey); //这个是加密后的
            let numdata = RndNum(16);
            let counterparty1 = JSON.parse(
                localStorage.getItem("counterparty")
            );
            this.coin = counterparty1.coin;
            this.counterparty = counterparty1.counterparty;
            this.marketName = counterparty1.marketName;
            this.symbol = this.coin + this.counterparty;
            // console.log(this.symbol);
            //获取币价对usdt价格的比例
            if (this.counterparty != "USDT") {
                axios
                    .post(
                        `http://chaobi.lian2345.com/woaini/api/chaobi/biance/deal/prices?symbol=${
                            this.counterparty
                        }USDT`
                    )
                    .then(res => {
                        // console.log(this.counterparty);
                        this.usdtcny = res.data[`${this.counterparty}USDT`];
                        // console.log(this.usdtcny);
                    });
            }
            //获取交易对价格
            axios
                .post(
                    `http://chaobi.lian2345.com/woaini/api/chaobi/biance/deal/prices?symbol=${
                        this.symbol
                    }`
                )
                .then(res => {
                    // console.log(555555555555);
                    this.newdata = res.data[this.symbol];
                    this.priceText = Number(res.data[this.symbol]).toFixed(4);
                    // console.log(this.newdata);
                    
                });
            let _this = this;
            console.log(44);

            //买盘卖盘数据
            //计时器
            // this.set = setInterval(function() {
            //     this.$remote
            //         .getDepthData({
            //             type: "binance_all",
            //             symbol: this.symbol
            //         })
            //         .then(res => {
            //             _this.depthBids = res.data.ask;
            //             _this.depthAsks = res.data.bids;
            //         });
            // }, 5000);
            // let _this = this;
            //获取存在本地的key
            this.user = JSON.parse(
                decryptByKey(localStorage.getItem("biankey"))
            );
            //获取本地汇率
            this.rate = JSON.parse(localStorage.getItem("rate"));
            //币安数据
            // 获取自己可用余额币
            if (JSON.parse(decryptByKey(localStorage.getItem("biankey")))) {
                this.user.secretkey = urljm(this.user.secretkey); //这个是加密后的
                this.user.apikey = urljm(this.user.apikey); //这个是加密后的
                axios
                    .post(
                        `http://chaobi.lian2345.com/api/chaobi/deal/binance/balances/dfdsafadf?apikey=${
                            this.user.apikey
                        }&secret=${this.user.secretkey}`
                    )
                    .then(res => {
                        // console.log(JSON.parse(res.data.list.data));

                        let arr = JSON.parse(res.data.list.data);
                        arr.forEach(element => {
                            if (element["asset"] == this.counterparty) {
                                this.usdtDate = element["free"];
                            } else if (element["asset"] == this.coin) {
                                this.usdtDate1 = element["free"];
                            }
                        });
                    });
            } else {
                // console.log("未授权，请去授权");
            }
            //获取深度图数据
            this.$remote
                .getDepthData({
                    type: "binance_all",
                    symbol: this.symbol
                })
                .then(res => {
                    console.log(res);
                    //!!!!!返回的全是字符串，和其他交易所不同
                    _this.depthAsks = res.data.asks; //卖盘
                    _this.depthBids = res.data.bids; //买盘
                    this.priceText = res.data.bids[0][0];
                    console.log(_this.depthAsks);

                    let arr = res.data.asks;
                    let arr1 = res.data.bids;
                    let ydata = [];
                    let ydata1 = [];
                    //买单图数据
                    arr.forEach(element => {
                        this.xdata.push(Number(element[0]));
                        ydata.push(Number(element[1]));
                    });
                    let sum = 0;
                    // let one = 0;
                    let arrone = [];
                    for (let i = 0; i < ydata.length; i++) {
                        // arrone.push(one)
                        sum += ydata[i];
                        this.ydatasum.push(sum.toFixed(3));
                    }
                    // console.log(arrone);

                    // 买单图数据
                    arr1.forEach(element => {
                        this.xdata1.push(Number(element[0]));
                        ydata1.push(Number(element[1]));
                    });
                    // console.log(ydata1);
                    let sum1 = 0;
                    for (let i = 0; i < ydata1.length; i++) {
                        sum1 += ydata1[i];
                        this.ydatasum1.push(sum1.toFixed(3));
                    }
                    let xxdata = this.xdata1.reverse().concat(this.xdata);
                    let yydatasum1 = this.ydatasum1
                        .reverse()
                        .concat(this.ydatasum);
                    if (xxdata[xxdata.length / 4] > 10) {
                        this.threeshu = parseInt(xxdata[xxdata.length / 4]);
                        this.fourshu = parseInt(
                            xxdata[(xxdata.length / 4) * 3]
                        );
                    } else {
                        this.threeshu = xxdata[
                            parseInt(xxdata.length / 4)
                        ].toFixed(2);
                        this.fourshu = xxdata[
                            parseInt((xxdata.length / 4) * 3)
                        ].toFixed(2);
                    }
                    myChart(xxdata, yydatasum1, "chart");
                });
            if (this.counterparty == "USDT") {
                this.balancemoney = Number(this.usdtDate * this.rate);
            } else {
                this.balancemoney = Number(this.usdtDate * this.rate);
            }
        },
        decimal(res) {
            this.isWay = 1;
            if (res == 0) {
                this.revealstyle = null;
                this.reveal = 0;
                this.isMode = 1;
                this.decimaltxt = "限价单";
                this.decimaltxt1 = "←点击查看更多买卖方式";
                this.isTrue = {};
                this.isShow = 0;
                this.isFalse = {
                    "background-color": "#48c122"
                };
                this.isFalseone = {
                    color: "#48c122"
                };
                this.isFalse1 = {};
                this.isFalseone1 = {};
            } else if (res == 2) {
                this.reveal = 0;
                this.revealstyle = null;
                this.isMode = 1;
                this.decimaltxt = "市价单";
                this.decimaltxt1 = "←点击查看更多买卖方式";
                console.log(222);

                this.isTrue = {
                    "margin-top": "4.22rem"
                };
                this.isShow = 1;
                this.isFalse1 = {
                    "background-color": "#48c122"
                };
                this.isFalseone1 = {
                    color: "#48c122"
                };
                this.isFalse = {};
                this.isFalseone = {};
            } else if (res == 4) {
                // if (this.balancemoney < 1000) {
                //     this.reveal = 1;
                //     this.revealstyle = {
                //         "background-color": "rgb(153, 153, 153)"
                //     };
                // }
                this.isTrue = {};
                this.isMode = 2;
                this.decimaltxt = "分笔委托";
                this.decimaltxt1 = "什么是分笔委托？";
            } else if (res == 6) {
                // if (this.balancemoney < 1000) {
                //     this.reveal = 1;
                //     this.revealstyle = {
                //         "background-color": "rgb(153, 153, 153)"
                //     };
                // }
                this.isTrue = {};
                this.isMode = 3;
                this.decimaltxt = "云委托 （VIP）";
                this.decimaltxt1 = "什么是云委托？";
            } else if (res == 8) {
                // if (this.balancemoney < 1000) {
                //     this.reveal = 1;
                //     this.revealstyle = {
                //         "background-color": "rgb(153, 153, 153)"
                //     };
                // }
                this.straddle();
                // console.log(this.isMode1);
                this.isTrue = {};
                this.isMode = 4;
                this.decimaltxt = "套利模式 （VIP）";
                this.decimaltxt1 = "什么是套利模式？";
            }
        },
        //全仓,半仓...
        cang(data) {
            this.cangactive = data;
            switch (data) {
                case "cangone":
                    if (this.comments == 1) {
                        if (this.isMode == 1) {
                            return (this.amount = this.usdtDate1 / 1),
                                (this.sumText = this.amount * this.priceText)
                            ;
                        } else if (this.isMode == 2) {
                        } else if (this.isMode == 3) {
                        } else if (this.isMode == 4) {
                        }
                    } else if (this.comments == 0) {
                        if (this.isMode == 1) {
                            return (this.sumText = this.usdtDate / 1),
                                (this.amount = this.sumText / this.priceText)
                            ;
                        } else if (this.isMode == 2) {
                        } else if (this.isMode == 3) {
                        } else if (this.isMode == 4) {
                        }
                    }
                case "cangtwo":
                    if (this.comments == 1) {
                        return (this.amount = this.usdtDate1 / 2),
                            (this.sumText = this.amount * this.priceText)
                        ;
                    } else if (this.comments == 0) {
                        return (this.sumText = this.usdtDate / 2),
                            (this.amount = this.sumText / this.priceText / 2)
                        ;
                    }
                case "cangthree":
                    if (this.comments == 1) {
                        return (this.amount = this.usdtDate1 / 3),
                            (this.sumText = this.amount * this.priceText)
                        ;
                    } else if (this.comments == 0) {
                        return (this.sumText = this.usdtDate / 3),
                            (this.amount = this.sumText / this.priceText / 3)
                        ;
                    }
                case "cangfour":
                    if (this.comments == 1) {
                        return (this.amount = this.usdtDate1 / 4),
                            (this.sumText = this.amount * this.priceText)
                        ;
                    } else if (this.comments == 0) {
                        return (this.sumText = this.usdtDate / 4)(
                            (this.amount = this.sumText / this.priceText / 4)
                        );
                    }
            }
        },
        //买入,卖出
        likeBuy(res) {
            this.$toStatistic("cbDealbuybian", "点击交易页面币安买卖");

            if (!this.$store.state.userInfo) {
                MessageBox.confirm("您还未登录，是否登录").then(res => {
                    this.$router.push({
                        path: "/login"
                    });
                });
            }
            let type, price, usdtmoney;
            //买入
            if (this.counterparty == "USDT") {
                usdtmoney = (this.usdtDate * this.rate).toString();
                this.balancemoney = Number(this.usdtDate * this.rate);
            } else {
                usdtmoney = (
                    this.usdtDate *
                    this.rate *
                    this.usdtcny
                ).toString();
                this.balancemoney = Number(this.usdtDate * this.rate);
            }
            console.log(usdtmoney);

            if (res == "in") {
                this.$toStatistic(
                    "cbDealbuybianbuy",
                    "点击交易页面币安买入交易"
                );
                if (this.isMode == 1) {
                    if (
                        this.isFalse["background-color"] &&
                        !this.isFalse1["background-color"]
                    ) {
                        this.amount = this.$refs.input2.value;
                        price = this.$refs.input1.value;
                        axios
                            .post(
                                `http://chaobi.lian2345.com/api/chaobi/deal/binance/BUYLIMIT/dfdsafadf?apikey=${
                                    this.Biankey.apikey
                                }&secret=${this.Biankey.secretkey}&symbol=${
                                    this.symbol
                                }&quantity=${this.amount}&price=${price}`
                            )
                            .then(res => {
                                if (res.data.list == "参数传输有误 ....") {
                                    return;
                                }
                                if (
                                    res.data.list.data.symbol &&
                                    res.data.list.data.symbol == this.symbol
                                ) {
                                    MessageBox("温馨提示", "委托成功");
                                } else {
                                    MessageBox("温馨提示", "委托失败");
                                }
                            });
                    } else if (
                        !this.isFalse["background-color"] &&
                        this.isFalse1["background-color"]
                    ) {
                        //市价单买入
                        // type = "buy-market";
                        // console.log("市价单买入");
                        this.amount = this.$refs.input2.value;
                        axios
                            .post(
                                `http://chaobi.lian2345.com/api/chaobi/deal/binance/BUYMARKET/dfdsafadf?apikey=${
                                    this.Biankey.apikey
                                }&secret=${this.Biankey.secretkey}&symbol=${
                                    this.symbol
                                }&quantity=${this.amount}`
                            )
                            .then(res => {
                                if (res.data.list.data.symbol == this.symbol) {
                                    MessageBox("温馨提示", "委托成功");
                                } else {
                                    MessageBox("温馨提示", "委托失败");
                                }
                            });
                    }
                } else if (this.isMode == 2) {
                    if (this.reveal == 1) {
                        MessageBox(
                            "您的可用金额低于1000元",
                            "将无法使用此功能"
                        );
                        return;
                    }
                    if (
                        this.buysum == null ||
                        this.singlemoney == null ||
                        this.entruesdepth == null ||
                        this.mosthightprice == null ||
                        this.buysum == " " ||
                        this.singlemoney == " " ||
                        this.entruesdepth == " " ||
                        this.mosthightprice == " "
                    ) {
                        return;
                    } else {
                        this.axiosData(
                            "binance",
                            usdtmoney,
                            1,
                            "buy",
                            this.symbol,
                            this.buysum,
                            this.singlemoney,
                            this.entruesdepth,
                            this.mosthightprice,
                            "biankey"
                        );
                    }
                } else if (this.isMode == 3) {
                    if (this.reveal == 1) {
                        MessageBox(
                            "您的可用金额低于1000元",
                            "将无法使用此功能"
                        );
                        return;
                    }
                    if (
                        this.triggerprice == null ||
                        this.entrustprice == null ||
                        this.amountplan == null ||
                        this.triggerprice == " " ||
                        this.entrustprice == " " ||
                        this.amountplan == " "
                    ) {
                        return;
                    } else {
                        {
                            this.axiosData(
                                "binance",
                                usdtmoney,
                                2,
                                "buy",
                                this.symbol,
                                this.triggerprice,
                                this.entrustprice,
                                this.amountplan,
                                0,
                                "biankey"
                            );
                        }
                    }
                } else if (this.isMode == 4) {
                    if (this.isMode1 == 0) {
                        if (this.reveal == 1) {
                            MessageBox(
                                "您的可用金额低于1000元",
                                "将无法使用此功能"
                            );
                            return;
                        }
                        if (this.timeset != "24:00") {
                            this.axiosdata1(this.timeset, 1);
                        } else {
                            if (
                                this.yieldcurve == null ||
                                this.yieldcurvesum == null ||
                                this.yieldcurve == " " ||
                                this.yieldcurvesum == " "
                            ) {
                                return;
                            } else {
                                // this.axiosdata1(this.timeset,1)
                                this.axiosData(
                                    "binance",
                                    usdtmoney,
                                    3,
                                    "buy",
                                    this.symbol,
                                    this.yieldcurve,
                                    this.yieldcurvesum,
                                    0,
                                    0,
                                    "biankey"
                                );
                                // 获取uuid和时间方便倒计时;
                            }
                        }
                    } else if (this.isMode1 == 1) {
                        //停止套利
                        clearInterval(this.countimeset);
                        this.axiosdata1(this.timeset, 0);
                        // this.isMode1 = 0;
                    }
                }
                //卖出
            } else if (res == "out") {
                this.$toStatistic(
                    "cbDealbuybiansell",
                    "点击交易页面币安卖出交易"
                );
                if (this.isMode == 1) {
                    if (
                        this.isFalse["background-color"] &&
                        !this.isFalse1["background-color"]
                    ) {
                        //限价单卖出
                        // type = "sell-limit";
                        // console.log("限价单卖出");
                        price = this.$refs.input1.value;
                        this.amount = this.$refs.input2.value;
                        axios
                            .post(
                                `http://chaobi.lian2345.com/api/chaobi/deal/binance/SELLLIMIT/dfdsafadf?apikey=${
                                    this.Biankey.apikey
                                }&secret=${this.Biankey.secretkey}&symbol=${
                                    this.symbol
                                }&quantity=${this.amount}&price=${price}`
                            )
                            .then(res => {
                                if (res.data.list.data.symbol == this.symbol) {
                                    MessageBox("温馨提示", "委托成功");
                                } else {
                                    MessageBox("温馨提示", "委托失败");
                                }
                            });
                        // console.log(price);
                    } else if (
                        !this.isFalse["background-color"] &&
                        this.isFalse1["background-color"]
                    ) {
                        //市价单卖出
                        this.amount = this.$refs.input2.value;
                        axios
                            .post(
                                `http://chaobi.lian2345.com/api/chaobi/deal/binance/SELLMARKET/dfdsafadf?apikey=${
                                    this.Biankey.apikey
                                }&secret=${this.Biankey.secretkey}&symbol=${
                                    this.symbol
                                }&quantity=${this.amount}`
                            )
                            .then(res => {
                                if (res.data.list.data.symbol == this.symbol) {
                                    MessageBox("温馨提示", "委托成功");
                                } else {
                                    MessageBox("温馨提示", "委托失败");
                                }
                            });
                    }
                } else if (this.isMode == 2) {
                    if (this.reveal == 1) {
                        MessageBox(
                            "您的可用金额低于1000元",
                            "将无法使用此功能"
                        );
                        return;
                    }
                    if (
                        this.buysum == null ||
                        this.singlemoney == null ||
                        this.entruesdepth == null ||
                        this.mosthightprice == null ||
                        this.buysum == " " ||
                        this.singlemoney == " " ||
                        this.entruesdepth == " " ||
                        this.mosthightprice == " "
                    ) {
                        return;
                    } else {
                        this.axiosData(
                            "binance",
                            usdtmoney,
                            1,
                            "sell",
                            this.symbol,
                            this.buysum,
                            this.singlemoney,
                            this.entruesdepth,
                            this.mosthightprice,
                            "biankey"
                        );
                    }
                } else if (this.isMode == 3) {
                    if (this.reveal == 1) {
                        MessageBox(
                            "您的可用金额低于1000元",
                            "将无法使用此功能"
                        );
                        return;
                    }
                    if (
                        this.triggerprice == null ||
                        this.entrustprice == null ||
                        this.amountplan == null ||
                        this.triggerprice == " " ||
                        this.entrustprice == " " ||
                        this.amountplan == " "
                    ) {
                        return;
                    } else {
                        {
                            this.axiosData(
                                "binance",
                                usdtmoney,
                                2,
                                "sell",
                                this.symbol,
                                this.triggerprice,
                                this.entrustprice,
                                this.amountplan,
                                0,
                                "biankey"
                            );
                        }
                    }
                } else if (this.isMode == 4) {
                    if (this.isMode1 == 0) {
                        if (this.reveal == 1) {
                            MessageBox(
                                "您的可用金额低于1000元",
                                "将无法使用此功能"
                            );
                            return;
                        }
                        if (this.timeset != "24:00") {
                            this.axiosdata1(this.timeset, 1);
                        } else {
                            if (
                                this.yieldcurve == null ||
                                this.yieldcurvesum == null ||
                                this.yieldcurve == " " ||
                                this.yieldcurvesum == " "
                            ) {
                                return;
                            } else {
                                this.axiosData(
                                    "binance",
                                    usdtmoney,
                                    3,
                                    "sell",
                                    this.symbol,
                                    this.yieldcurve,
                                    this.yieldcurvesum,
                                    0,
                                    0,
                                    "biankey"
                                );
                                //获取uuid和时间方便倒计时
                            }
                        }
                    } else if (this.isMode1 == 1) {
                        //停止套利
                        clearInterval(this.countimeset);
                        this.axiosdata1(this.timeset, 0);
                    }
                }
            }
        },
        whatcancel(data) {
            switch (data) {
                case "什么是分笔委托？":
                    return this.$router.push({
                        path: "/Pointsentrustment"
                    });
                case "什么是云委托？":
                    return this.$router.push({
                        path: "/Plansentrustment"
                    });
                case "什么是套利模式？":
                    return this.$router.push({
                        path: "/arbitragemodel"
                    });
            }
        },
        selectway() {
            if (this.isWay == 0) {
                this.isWay = 1;
            } else {
                this.isWay = 0;
            }
        },

        //键盘弹起事件
        keydown(data) {
            this.cangactive = "";
            if (data == 3) {
                this.amount = this.sumText / this.priceText;
            } else if (data == 1 || data == 2) {
                this.sumText = this.amount * this.priceText;
            }
        },
        axiosData(
            master, //交易所
            money, //可用金额
            type, //交易类型 1 2 3
            other, //买卖方式
            symbol, //交易对
            one,
            two,
            three,
            four,
            key //本地存储加密key
        ) {
            if (!this.$store.state.userInfo) {
                MessageBox.confirm("您还未登录，是否登录").then(res => {
                    this.$router.push({
                        path: "/login"
                    });
                });
            }
            remote
                .insert({
                    apikey: urljm(
                        JSON.parse(decryptByKey(localStorage.getItem(key)))
                            .apikey
                    ),
                    secury: urljm(
                        JSON.parse(decryptByKey(localStorage.getItem(key)))
                            .secretkey
                    ),
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(this.$store.state.userInfo.phone),
                    smybol: symbol,
                    dataOne: urljm(one),
                    dataTwo: urljm(two),
                    dataThree: urljm(three),
                    dataFore: urljm(four),
                    master: master, //交易所
                    type: type, //交易形式 1 2 3
                    money: urljm(money), //用户金额
                    other: other //交易类型 买或卖
                })
                .then(res => {
                    console.log(res.data.arbitrage);
                    if (type == 3 && res.data.arbitrage == 0) {
                        MessageBox.confirm("您的套利次数为0，是否购买").then(
                            res => {
                                //购买套利模式
                                this.$router.push({
                                    path: "/profitVip"
                                });
                            }
                        );
                    } else if (res.data.status == 1 && res.data.list == 1) {
                        MessageBox("温馨提示", "委托成功");
                        if (this.isMode == 4) {
                            this.axiosdata1("24:00", 1);
                        }
                    } else if (res.data.status == "777") {
                        MessageBox("温馨提示", res.data.list);
                    } else if (res.data.status == "888") {
                        MessageBox.confirm("您不是会员,是否开通会员").then(
                            res => {
                                //跳转会员连接口
                                this.$vipBox().then(event => {
                                    this.$router.push({
                                        path: "/openVip"
                                    });
                                });
                            }
                        );
                    } else if (res.data.status == "666") {
                        MessageBox("提示", res.data.list);
                    }
                });
        },
        //查询套利详情
        straddle() {
            remote
                .selectAll({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(this.$store.state.userInfo.phone),
                    smybol: this.symbol,
                    master: "binance", //交易所
                    type: 3, //交易形式 1 2 3
                    isSuccess: 0
                })
                .then(res => {
                    if (
                        res.data.list.length == true &&
                        res.data.list.length != 0
                    ) {
                        //剩余时间
                        let timeset1 = res.data.list[0].stopTime;
                        //开始时间
                        let timess = res.data.list[0].createTime;
                        let date1 = new Date(timeset1);
                        let date2 = new Date(timess);
                        console.log(timeset1);

                        // console.log(s2);

                        if (date2 >= date1) {
                            //停止套利
                            this.isMode1 = 0;
                        } else {
                            console.log(date1.getHours());
                            console.log(date1.getMinutes());
                            console.log(date1.getSeconds());
                            let h, m, s;
                            if (
                                date1.getHours() == 0 &&
                                date1.getMinutes() == 0 &&
                                date1.getSeconds() == 0
                            ) {
                                console.log(3333);

                                h = 24;
                                m = 0;
                                s = 0;
                            } else {
                                h = date1.getHours();
                                m = date1.getMinutes();
                                s = date1.getSeconds();
                            }
                            if (res.data.list[0].isstop == "1") {
                                console.log(22222222);

                                this.isMode1 = 1;
                                let _this = this;
                                this.countimeset = setInterval(function() {
                                    --s;
                                    if (s < 0) {
                                        --m;
                                        s = 59;
                                    }
                                    if (m < 0) {
                                        --h;
                                        m = 59;
                                    }
                                    if (h < 0) {
                                        s = 0;
                                        m = 0;
                                    }
                                    _this.timeset = h + ":" + m;
                                }, 1000);
                            } else {
                                this.isMode1 = 0;
                                this.timeset = h + ":" + m;
                            }
                        }
                    } else {
                        this.timeset = "24:00";
                    }
                });
        },
        //停止套利
        axiosdata1(times, isstop) {
            let updateTime = times;
            remote
                .stoptaoli({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(this.$store.state.userInfo.phone),
                    smybol: this.symbol,
                    master: "binance", //交易所
                    type: 3, //交易形式 1 2 3
                    updateTime: times,
                    isstop: isstop
                })
                .then(res => {
                    if (
                        (res.data.list.isstop == "0" ||
                            res.data.list.isstop == "1") &&
                        res.data.list.issucess == "1"
                    ) {
                        console.log(11111);
                        console.log(isstop);

                        if (isstop == 0) {
                            this.isMode1 = 0;
                        } else if (isstop == 1) {
                            this.isMode1 = 1;
                        }
                        this.straddle();
                    }
                });
        }
    },
    destroyed() {
        clearInterval(this.set);
        clearInterval(this.countimeset);
    }
};
</script>
<style>
@import "../../lib/css/dealbugsell.css";
.cbDealbuyoneBian {
    width: 100%;
    height: 100%;
    background-color: #fff;
    margin-top: 3.85rem;
}
div.toast {
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 3.3rem !important;
    width: 100%;
    height: 1rem;

    padding: 0 !important;
}
div.toast > span {
    line-height: 1rem !important;
    font-size: 0.43rem;
}
</style>




