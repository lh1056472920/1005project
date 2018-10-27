
<template>
    <div class="cbDealBuyone">
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
                            <p v-if="counterparty=='usdt'" class="zhuanhuan">≈{{parseInt(priceText*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuan">≈{{parseInt(priceText*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div v-show="isShow==0" class="mainInputct">
                            <p>数量</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="amount" :placeholder='coin' style="text-align:right" @keyup='keydown(2)' ref="input2">
                        </div>
                        <div v-if="isShow1==1&&comments==1" class="mainInputct">
                            <p>数量</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="amount" :placeholder='coin' style="text-align:right" @keyup='keydown(2)' ref="input2">
                        </div>
                        <div v-if="!(isShow1==1&&comments==1)" class="mainInputct">
                            <p>金额</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="sumText" :placeholder='counterparty' @keyup='keydown(3)' style="text-align:right">
                            <p v-if="counterparty=='usdt'" class="zhuanhuanone">≈{{parseInt(sumText*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuanone">≈{{parseInt(sumText*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                    </div>
                    <!-- 分笔委托 -->
                    <div v-if="isMode==2&&comments==0" class="mainInput">
                        <div class="mainInputct">
                            <p>买入总额</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="buysum" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='usdt'" class="zhuanhuanone">≈{{parseInt(buysum*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuanone">≈{{parseInt(buysum*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>单笔金额</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="singlemoney" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='usdt'" class="zhuanhuanone">≈{{parseInt(singlemoney*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuanone">≈{{parseInt(singlemoney*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>委托深度</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" placeholder="0.1%|0.2%" type="number" class="price" v-model="entruesdepth" style="text-align:right" @keyup='keydown(2)' ref="input2">
                        </div>
                        <div class="mainInputct">
                            <p>最高买入价</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="mosthightprice" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='usdt'" class="zhuanhuanone">≈{{parseInt(mosthightprice*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuanone">≈{{parseInt(mosthightprice*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                    </div>
                    <div v-if="isMode==2&&comments==1" class="mainInput">
                        <div class="mainInputct">
                            <p>卖出数量</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="buysum" @keyup='keydown(3)' :placeholder="coin" style="text-align:right">
                            <p v-if="counterparty=='usdt'" class="zhuanhuanone">≈{{parseInt(buysum*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuanone">≈{{parseInt(buysum*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>单笔数量</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="singlemoney" @keyup='keydown(3)' :placeholder="coin" style="text-align:right">
                            <p v-if="counterparty=='usdt'" class="zhuanhuanone">≈{{parseInt(singlemoney*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuanone">≈{{parseInt(singlemoney*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>委托深度</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" placeholder="0.1%|0.2%" type="number" class="price" v-model="entruesdepth" style="text-align:right" @keyup='keydown(2)' ref="input2">
                        </div>
                        <div class="mainInputct">
                            <p>最低价卖出</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="mosthightprice" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='usdt'" class="zhuanhuanone">≈{{parseInt(mosthightprice*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuanone">≈{{parseInt(mosthightprice*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                    </div>
                    <!-- 云委托 -->
                    <div v-if="isMode==3" class="mainInput">
                        <div class="mainInputct">
                            <p>触发价格</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="triggerprice" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='usdt'" class="zhuanhuanone">≈{{parseInt(triggerprice*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuanone">≈{{parseInt(triggerprice*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div class="mainInputct">
                            <p>委托价格</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="entrustprice" @keyup='keydown(3)' :placeholder="counterparty" style="text-align:right">
                            <p v-if="counterparty=='usdt'" class="zhuanhuanone">≈{{parseInt(entrustprice*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuanone">≈{{parseInt(entrustprice*rate*usdtcny*10000)/10000}}CNY</p>
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
                            <p v-if="counterparty=='usdt'" class="zhuanhuanone">≈{{parseInt(yieldcurvesum*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuanone">≈{{parseInt(yieldcurvesum*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                    </div>
                    <div v-if='isMode==1' class="cang">
                        <div @click="cang('cangone')" :class="{cangactive:cangactive=='cangone'}">全仓</div>
                        <div @click="cang('cangtwo')" :class="{cangactive:cangactive=='cangtwo'}">半仓</div>
                        <div @click="cang('cangthree')" :class="{cangactive:cangactive=='cangthree'}">1/3仓</div>
                        <div @click="cang('cangfour')" :class="{cangactive:cangactive=='cangfour'}">1/4仓</div>
                    </div>
                    <!-- <p v-if="comments==0" class="avail">可用金额: {{parseInt(usdtDate*100000)/100000}} &nbsp;{{counterparty}}</p>
                    <p v-if="comments==1" class="avail">可用金额: {{parseInt(usdtDate1*100000)/100000}} &nbsp;{{coin}}</p> -->
                    <div :style="revealstyle" v-if="comments==0&&isMode!== 4" @click="likeBuy('in')" class="likeBuy">立即买入</div>
                    <div :style="revealstyle" v-if="comments==1&&isMode!== 4" @click="likeBuy('out')" class="likeBuyout">立即卖出</div>
                    <div :style="revealstyle" v-if="comments==0&&isMode== 4&&isMode1==0" @click="likeBuy('in')" class="likeBuy">开始套利({{timeset}})</div>
                    <div :style="revealstyle" v-if="comments==0&&isMode== 4&&isMode1==1" @click="likeBuy('in')" class="likeBuyout">立即停止({{timeset}})</div>
                    <div :style="revealstyle" v-if="comments==1&&isMode== 4&&isMode1==0" @click="likeBuy('out')" class="likeBuy">开始套利({{timeset}})</div>
                    <div :style="revealstyle" v-if="comments==1&&isMode== 4&&isMode1==1" @click="likeBuy('out')" class="likeBuyout">立即停止({{timeset}})</div>
                    <div :style="isTrue" class="tu" id="chart">
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
                        <span v-if="counterparty=='usdt'" class="threeshu">($){{threeshu}}</span>
                        <sapn v-if="counterparty=='usdt'" class="fourshu">($){{fourshu}}</sapn>
                        <span v-if="counterparty!='usdt'" class="threeshu">({{counterparty}}){{threeshu}}</span>
                        <span v-if="counterparty!='usdt'" class="fourshu">({{counterparty}}){{fourshu}}</span>
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
import NewDepth from '../../commons/components/dealModule/newDepth.vue'

import { encryptKey, MD5, decryptByKey } from "../../lib/js/crypto.js";
import remote from "../../lib/js/remote.js";

import { myChart } from "../../lib/js/echers.js";
import axios from "axios";
import { urljm } from "../../lib/js/jsmi.js";

import { Toast, MessageBox } from "mint-ui";
const kplsign = require("../../lib/js/sign/KplSign.js");
var http = require("http");
var querystring = require("querystring");
export default {
    name: "cbDealBuyone",
     components:{
        NewDepth
    },
    data() {
        return {
            timeset: '00:00',
            countimeset: null,
            uuid: null,

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
            priceText: null,
            amount1: 0.6,
            sumText: null,
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
            isShow1: 0,
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
            amount: null,
             balancemoney: null,
            reveal:0,
            revealstyle:null
        };
    },
    created() {
        if (this.$route.query.text == "mainBuy") {
            this.comments = 0;
        } else if (this.$route.query.text === "mainSale") {
            this.comments = 1;
        }
    },
    mounted() {
        this.depth();
        // this.straddle();
    },
    watch: {
        $route(to, from) {
            // console.log(to.path);
            // console.log(to.query.text);
            if (to.query.text === "mainBuy") {
                // console.log("ok");
                this.comments = 0;
            } else if (to.query.text === "mainSale") {
                this.comments = 1;
            }
        },
        sumText() {
            this.sumText = parseInt(this.sumText * 10000) / 10000;
            this.amount = parseInt(this.amount * 10000) / 10000;
            this.priceText = parseInt(this.priceText * 10000) / 10000;
            if (this.comments == 0) {
                if (
                    this.isFalseone != {} &&
                    Number(this.sumText) > Number(this.usdtDate)
                ) {
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
        },
        amount() {
            this.sumText = parseInt(this.sumText * 10000) / 10000;
            this.amount = parseInt(this.amount * 10000) / 10000;
            this.priceText = parseInt(this.priceText * 10000) / 10000;
            if (this.comments == 1 && this.isShow1 == 1) {
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
    methods: {
        depth() {
            let counterparty1 = JSON.parse(
                localStorage.getItem("counterparty")
            );
            this.coin = counterparty1.coin;
            this.counterparty = counterparty1.counterparty;
            this.marketName = counterparty1.marketName;
            this.symbol = this.coin + this.counterparty;
            // console.log(this.symbol);

            let _this = this;
            //获取存在本地的key
            this.user = JSON.parse(
                decryptByKey(localStorage.getItem("userkey"))
            );
            //获取本地汇率
            this.rate = JSON.parse(localStorage.getItem("rate"));
            //火币数据
            // 获取自己可用usdt
            if (JSON.parse(decryptByKey(localStorage.getItem("userkey")))) {
                this.urldata =
                    "/v1/account/accounts/" +
                    JSON.parse(decryptByKey(localStorage.getItem("userkey")))
                        .arroundId +
                    "/balance/";

                this.gethuobi();
                // this.usdt = this.$route.query.id;
            } else {
                // console.log("未授权，请去授权");
            }
            if (_this.counterparty != "usdt") {
                // console.log(1111);

                let urldata = `http://chaobi.lian2345.com/https/get/market/history/kline?period=1day&size=1&symbol=${
                    _this.counterparty
                }usdt&type=step1&kplkpl=api.huobi.pro`;
                _this.$axios.get(urldata).then(res => {
                    _this.usdtcny = res.data.data[0].close;
                });
            }
            //买盘卖盘数据
            //单个最新交易数据  /market/trade //路由跳转计时器停止 进入页面 路由器开启
            //setInterval
            this.set = setInterval(function() {
                //火币数据
                let url = `http://chaobi.lian2345.com/https/get/market/depth?symbol=${
                    _this.symbol
                }&type=step1&kplkpl=api.huobi.pro`;
                // console.log(url);

                _this.$axios.get(url).then(res => {
                    // console.log(res);
                    _this.depthAsks = res.data.tick.asks; //卖盘
                    _this.depthBids = res.data.tick.bids; //买盘
                });
                let urldan = `http://chaobi.lian2345.com/https/get/market/trade?symbol=${
                    _this.symbol
                }&kplkpl=api.huobi.pro`;
                _this.$axios.get(urldan).then(res => {
                    _this.newdata = res.data.tick.data[0].price;
                });
            }, 5000);
            //获取深度图数据
            this.$remote.getDepthData({
                type: 'huobi_all',
                symbol: this.symbol
            }).then(res => {
                // console.log(res.data.tick.asks);
                _this.depthAsks = res.data.tick.asks; //卖盘
                _this.depthBids = res.data.tick.bids; //买盘
                let arr = res.data.tick.asks;
                let arr1 = res.data.tick.bids;
                _this.priceText = res.data.tick.bids[0][0];

                let ydata = [];
                let ydata1 = [];
                //买单图数据
                arr.forEach(element => {
                    this.xdata.push(element[0]);
                    ydata.push(element[1]);
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
                    this.xdata1.push(element[0]);
                    ydata1.push(element[1]);
                });
                // console.log(ydata1);
                let sum1 = 0;
                for (let i = 0; i < ydata1.length; i++) {
                    sum1 += ydata1[i];
                    this.ydatasum1.push(sum1.toFixed(3));
                }
                let xxdata = this.xdata1.reverse().concat(this.xdata);
                let yydatasum1 = this.ydatasum1.reverse().concat(this.ydatasum);
                if (xxdata[xxdata.length / 4] > 10) {
                    this.threeshu = parseInt(xxdata[xxdata.length / 4]);
                    this.fourshu = parseInt(xxdata[xxdata.length / 4 * 3]);
                } else {
                    this.threeshu = xxdata[xxdata.length / 4].toFixed(3);
                    this.fourshu = xxdata[xxdata.length / 4 * 3].toFixed(3);
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
            console.log(res);

            this.isWay = 1;
            if (res == 0) {
                this.revealstyle=null
                this.reveal=0
                this.isMode = 1;
                this.decimaltxt = "限价单";
                this.decimaltxt1 = "←点击查看更多买卖方式";
                this.isTrue = {};
                this.isShow = 0;
                this.isShow1 = 0;
                this.isFalse = {
                    "background-color": "#48c122"
                };
                this.isFalseone = {
                    color: "#48c122"
                };
                this.isFalse1 = {};
                this.isFalseone1 = {};
            } else if (res == 2) {
                this.revealstyle=null
                this.reveal=0
                this.isMode = 1;
                this.decimaltxt = "市价单";
                this.decimaltxt1 = "←点击查看更多买卖方式";
                this.isTrue = {
                    "margin-top": "4.22rem"
                };
                this.isShow = 1;
                this.isShow1 = 1;
                this.isFalse1 = {
                    "background-color": "#48c122"
                };
                this.isFalseone1 = {
                    color: "#48c122"
                };
                this.isFalse = {};
                this.isFalseone = {};
            } else if (res == 4) {
                //  if (this.balancemoney<1000) {
                //     this.reveal=1
                //     this.revealstyle={
                //         'background-color':'rgb(153, 153, 153)'
                //     }
                // }
                this.isTrue = {};
                this.isMode = 2;
                this.decimaltxt = "分笔委托";
                this.decimaltxt1 = "什么是分笔委托？";
            } else if (res == 6) {
                //  if (this.balancemoney<1000) {
                //     this.reveal=1
                //     this.revealstyle={
                //         'background-color':'rgb(153, 153, 153)'
                //     }
                // }
                this.isTrue = {};
                this.isMode = 3;
                this.decimaltxt = "云委托 （VIP）";
                this.decimaltxt1 = "什么是云委托？";
            } else if (res == 8) {
                //  if (this.balancemoney<1000) {
                //     this.reveal=1
                //     this.revealstyle={
                //         'background-color':'rgb(153, 153, 153)'
                //     }
                // }
                this.straddle();

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
                    if (this.comments == 1 && this.isShow1 == 1) {
                        return (this.amount = this.usdtDate1);
                    } else {
                        if (this.comments == 1) {
                            return (this.amount = this.usdtDate1)(
                                (this.sumText = this.amount * this.priceText)
                            );
                        } else if (this.comments == 0) {
                            return (this.sumText = this.usdtDate * 1)(
                                (this.amount = this.sumText / this.priceText)
                            );
                        }
                    }
                case "cangtwo":
                    if (this.comments == 1 && this.isShow1 == 1) {
                        return (this.amount = this.usdtDate1 / 2);
                    } else {
                        if (this.comments == 1) {
                            return (this.amount = this.usdtDate1 / 2)(
                                (this.sumText = this.amount * this.priceText)
                            );
                        } else {
                            return (
                                (this.sumText = this.usdtDate / 2),
                                (this.amount = this.sumText / this.priceText)
                            );
                        }
                    }
                case "cangthree":
                    if (this.comments == 1 && this.isShow1 == 1) {
                        return (this.amount = this.usdtDate1 / 3);
                    } else {
                        if (this.comments == 1) {
                            return (this.amount = this.usdtDate1 / 3)(
                                (this.sumText = this.amount * this.priceText)
                            );
                        } else {
                            return (this.sumText = this.usdtDate / 3)(
                                (this.amount = this.sumText / this.priceText)
                            );
                        }
                    }
                case "cangfour":
                    if (this.comments == 1 && this.isShow1 == 1) {
                        return (this.amount = this.usdtDate1 / 4);
                    } else {
                        if (this.comments == 1) {
                            return (this.amount = this.usdtDate1 / 4)(
                                (this.sumText = this.amount * this.priceText)
                            );
                        } else {
                            return (this.sumText = this.usdtDate / 4)(
                                (this.amount = this.sumText / this.priceText)
                            );
                        }
                    }
            }
        },
        //买入,卖出
        likeBuy(res) {
             this.$toStatistic("cbDealbuyhuobi", "点击交易页面火币买卖");
            
            if (!this.$store.state.userInfo) {
                MessageBox.confirm("您还未登录，是否登录").then(res => {
                    this.$router.push({
                        path: "/login"
                    });
                });
                // this.$vipBox().then(event => {
                //     this.$router.push({
                //         path: "/openVip"
                //     });
                // });
            }
                let type, price, usdtmoney;
            if (this.counterparty == "usdt") {
                usdtmoney = (this.usdtDate * this.rate).toString();
            } else {
                usdtmoney = (
                    this.usdtDate *
                    this.rate *
                    this.usdtcny
                ).toString();
            }
            console.log(usdtmoney);

            //买入
            if (res == "in") {
                this.$toStatistic("cbDealbuyhuobisell", "点击交易页面火币买入交易");
                if (this.isMode == 1) {
                    if (
                        this.isFalse["background-color"] &&
                        !this.isFalse1["background-color"]
                    ) {
                        //限价单买入
                        type = "buy-limit";
                        this.amount = this.$refs.input2.value;
                        price = this.$refs.input1.value;
                    } else if (
                        !this.isFalse["background-color"] &&
                        this.isFalse1["background-color"]
                    ) {
                        //市价单买入
                        if (!this.sumText) {
                            MessageBox("温馨提示", "请输入金额");
                            return;
                        }
                        type = "buy-market";
                        // console.log("市价单买入");
                        this.amount = this.$refs.input2.value;
                        //  amount = this.sumText;
                        price = "";
                    }
                } else if (this.isMode == 2) {
                    if (this.reveal==1) {
                            MessageBox(
                                "您的可用金额低于1000元",
                                "将无法使用此功能"
                            );
                            return
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
                            "huobi",
                            usdtmoney,
                            1,
                            "buy",
                            this.symbol,
                            this.buysum,
                            this.singlemoney,
                            this.entruesdepth,
                            this.mosthightprice,
                            "userkey"
                        );
                    }
                } else if (this.isMode == 3) {
                    if (this.reveal==1) {
                            MessageBox(
                                "您的可用金额低于1000元",
                                "将无法使用此功能"
                            );
                            return
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
                                "huobi",
                                usdtmoney,
                                2,
                                "buy",
                                this.symbol,
                                this.triggerprice,
                                this.entrustprice,
                                this.amountplan,
                                0,
                                "userkey"
                            );
                        }
                    }
                } else if (this.isMode == 4) {
                    
                    if (this.isMode1 == 0) {
                        if (this.reveal==1) {
                            MessageBox(
                                "您的可用金额低于1000元",
                                "将无法使用此功能"
                            );
                            return
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
                                    "huobi",
                                    usdtmoney,
                                    3,
                                    "buy",
                                    this.symbol,
                                    this.yieldcurve,
                                    this.yieldcurvesum,
                                    0,
                                    0,
                                    "userkey"
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
                //卖出
            } else if (res == "out") {
                this.$toStatistic("cbDealbuyhuobibuy", "点击交易页面火币卖出交易");
                if (this.isMode == 1) {
                    if (
                        this.isFalse["background-color"] &&
                        !this.isFalse1["background-color"]
                    ) {
                        //限价单卖出
                        type = "sell-limit";
                        price = this.$refs.input1.value;
                        this.amount = this.$refs.input2.value;
                    } else if (
                        !this.isFalse["background-color"] &&
                        this.isFalse1["background-color"]
                    ) {
                        //市价单卖出
                        type = "sell-market";
                        this.amount = this.$refs.input2.value;
                    }
                } else if (this.isMode == 2) {
                    if (this.reveal==1) {
                            MessageBox(
                                "您的可用金额低于1000元",
                                "将无法使用此功能"
                            );
                            return
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
                            "huobi",
                            usdtmoney,
                            1,
                            "sell",
                            this.symbol,
                            this.buysum,
                            this.singlemoney,
                            this.entruesdepth,
                            this.mosthightprice,
                            "userkey"
                        );
                    }
                } else if (this.isMode == 3) {
                    if (this.reveal==1) {
                            MessageBox(
                                "您的可用金额低于1000元",
                                "将无法使用此功能"
                            );
                            return
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
                                "huobi",
                                usdtmoney,
                                2,
                                "sell",
                                this.symbol,
                                this.triggerprice,
                                this.entrustprice,
                                this.amountplan,
                                0,
                                "userkey"
                            );
                        }
                    }
                } else if (this.isMode == 4) {
                    if (this.isMode1 == 0) {
                        if (this.reveal==1) {
                            MessageBox(
                                "您的可用金额低于1000元",
                                "将无法使用此功能"
                            );
                            return
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
                                "huobi",
                                usdtmoney,
                                3,
                                "sell",
                                this.symbol,
                                this.yieldcurve,
                                this.yieldcurvesum,
                                0,
                                0,
                                "userkey"
                            );
                            //获取uuid和时间方便倒计时
                        }}
                    } else if (this.isMode1 == 1) {
                        //停止套利
                        clearInterval(this.countimeset);
                        this.axiosdata1(this.timeset, 0);
                    }
                }
            }
            //下单iost币(火币)
            if (this.isMode == 1) {
                console.log(52656);

                var apikey = this.user.apikey;
                var secretkey = this.user.secretkey;
                var url = "/v1/order/orders/place/";
                if (type == "sell-market" || type == "buy-market") {
                    var args = {
                        "account-id": JSON.parse(
                            decryptByKey(localStorage.getItem("userkey"))
                        ).arroundId,
                        amount: this.amount,
                        // price: price,
                        symbol: this.symbol,
                        type: type
                    };
                } else {
                    var args = {
                        "account-id": JSON.parse(
                            decryptByKey(localStorage.getItem("userkey"))
                        ).arroundId,
                        amount: this.amount,
                        price: price,
                        symbol: this.symbol,
                        type: type
                    };
                }
                // console.log(args);

                //火币post请求
                kplsign.sign_huobi(
                    apikey,
                    secretkey,
                    url,
                    "POST",
                    args,
                    function(sgingdadd) {
                        var content = querystring.stringify(args);
                        var options = {
                            hostname: "chaobi.lian2345.com",
                            port: 80,
                            path:
                                "/https/post" +
                                url +
                                "?" +
                                sgingdadd +
                                "&kplkpl=api.huobipro.com",
                            method: "POST"
                        };
                        var req = http.request(options, function(res) {
                            res.setEncoding("utf8");
                            res.on("data", function(chunk) {
                                console.log(JSON.parse(chunk));

                                if (JSON.parse(chunk)["status"] == "error") {
                                    MessageBox("温馨提示", "委托失败");
                                } else {
                                    MessageBox("温馨提示", "委托成功");
                                }
                            });
                        });
                        req.on("error", function(e) {
                            // console.log("problem with request: " + e.message);
                        });
                        req.write(content);
                        req.end();
                    }
                );
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
                    JSON.parse(decryptByKey(localStorage.getItem(key))).apikey
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
                }).then(res => {
                console.log(money);
                if (type==3&&res.data.arbitrage==0) {
                    MessageBox.confirm("您的套利次数为0，是否购买").then(res => {
                    //购买套利模式
                    this.$router.push({
                        path: "/profitVip"
                            });
                        });
                }else
                
                if (res.data.status == 1 && res.data.list == 1) {
                    MessageBox("温馨提示", "委托成功");
                    this.axiosdata1('24:00',1);
                } else if (res.data.status == "777") {
                    MessageBox("温馨提示", res.data.list);
                } else if (res.data.status == "888") {
                    MessageBox.confirm("您不是会员,是否开通会员").then(res => {
                        //跳转会员连接口
                        this.$vipBox().then(event => {
                            this.$router.push({
                                path: "/openVip"
                            });
                        });
                    });
                } else if (res.data.status == "666") {
                    MessageBox("提示", res.data.list);
                }
            });
        },
        //开始套利
        straddle() {
            remote
                .selectAll({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(this.$store.state.userInfo.phone),
                    smybol: this.symbol,
                    master: "huobi", //交易所
                    type: 3, //交易形式 1 2 3
                    isSuccess: 0
                })
                .then(res => {
                    console.log(res);
                    
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
                        console.log(date1);

                        console.log(date2);

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
                    master: "huobi", //交易所
                    type: 3, //交易形式 1 2 3
                    updateTime: times,
                    isstop: isstop
                })
                .then(res => {
                    console.log(res);
                    
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
                        console.log(this.isMode1);
                        
                        this.straddle();
                    }
                });
        },
        //火币get请求
        gethuobi() {
            var apikey = this.user.apikey;
            var secretkey = this.user.secretkey;
            var url = this.urldata;
            var args = this.argsdata;
            let _this = this;
            kplsign.sign_huobi(apikey, secretkey, url, "GET", args, function(
                sgingdadd
            ) {
                var options = {
                    host: "chaobi.lian2345.com",
                    hostname: "chaobi.lian2345.com",
                    port: 80,
                    path:
                        "/https/get" +
                        url +
                        "?" +
                        sgingdadd +
                        "&kplkpl=api.huobipro.com",
                    method: "get"
                };
                var req = http.get(options, function(res) {
                    res.setEncoding("utf-8");
                    var buffer = [];
                    res.on("data", function(chun) {
                        console.log(chun);

                        buffer.push(chun);
                    });
                    res.on("end", function() {
                        buffer.forEach(element => {
                            _this.usdt += element;
                        });
                        let arr = JSON.parse(_this.usdt).data.list;
                        arr.forEach(element => {
                            if (
                                element.currency == `${_this.counterparty}` &&
                                element.type == "trade"
                            ) {
                                _this.usdtDate = element.balance;
                            } else if (
                                element.currency == `${_this.coin}` &&
                                element.type == "trade"
                            ) {
                                _this.usdtDate1 = element.balance;
                            }
                        });
                    });
                });
                req.on("error", function(err) {});
                req.end();
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
.cbDealBuyone {
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: initial;
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




