
<template>
    <div class="cbDealbuyoneZB">
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
                        <!-- <p @click="decimal(2)">市价单</p>
                        <i class="jian"></i> -->
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
                    <div v-if="isMode==1" class="mainInput">
                        <div v-if="isShow==0" class="mainInputct">
                            <p>价格</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="priceText" style="text-align:right" @keyup='keydown(1)' ref="input1">
                            <p v-if="counterparty=='usdt'" class="zhuanhuan">≈{{parseInt(priceText*rate*10000)/10000}}CNY</p>
                            <p v-if="counterparty!='usdt'" class="zhuanhuan">≈{{parseInt(priceText*rate*usdtcny*10000)/10000}}CNY</p>
                        </div>
                        <div v-if="isShow==0" class="mainInputct">
                            <p>数量</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="numText" style="text-align:right" :placeholder='coin' @keyup='keydown(2)' ref="input2">
                        </div>
                        <div class="mainInputct">
                            <p>金额</p>
                            <input onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{3}$/.test(value))event.returnValue=false" type="number" class="price" v-model="sumText" @keyup='keydown(3)' :placeholder='counterparty' style="text-align:right">
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
                    <div v-if="isMode==1" class="cang">
                        <div @click="cang('cangone')" :class="{cangactive:cangactive=='cangone'}">全仓</div>
                        <div @click="cang('cangtwo')" :class="{cangactive:cangactive=='cangtwo'}">半仓</div>
                        <div @click="cang('cangthree')" :class="{cangactive:cangactive=='cangthree'}">1/3仓</div>
                        <div @click="cang('cangfour')" :class="{cangactive:cangactive=='cangfour'}">1/4仓</div>
                    </div>
                    <!-- <p v-if="comments==0" class="avail">可用金额:&nbsp; {{parseInt(usdtDate*100000)/100000}} &nbsp;{{counterparty}}</p>
                    <p v-if="comments==1" class="avail">可用金额:&nbsp; {{parseInt(usdtDate1*100000)/100000}} &nbsp;{{coin}}</p> -->
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

import { Toast, MessageBox } from "mint-ui";
import axios from "axios";
import { urljm } from "../../lib/js/jsmi.js";
import { myChart } from "../../lib/js/echers.js";
export default {
    name: "cbDealbuyoneZB",
    components:{
        NewDepth
    },
    data() {
        return {
            timeset: "24:00",
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
            numText: null,
            amount1: 1,
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
            ZBkey: {},
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
        // this.getdata()
        this.depth();
        let url1 = `http://chaobi.lian2345.com/api/chaobi/deal/zb/ticker/5464646466456165464646464?symbol=${
            this.symbol
        }`;
        axios.post(url1).then(res => {
            this.newdata = JSON.parse(res.data.list).ticker.buy;
        });
    },
    mounted() {
        // this.straddle();
    },
    watch: {
        $route(to, from) {
            if (to.query.text === "mainBuy") {
                this.comments = 0;
            } else if (to.query.text === "mainSale") {
                this.comments = 1;
                // console.log("ok111222");
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
                if (Number(this.numText) > Number(this.usdtDate1)) {
                    Toast({
                        message: "可用余额不足",
                        duration: 5000,
                        className: "toast",
                        duration: 1000
                    });
                }
            }
        },
        numText() {
            this.sumText = parseInt(this.sumText * 10000) / 10000;
            this.amount = parseInt(this.amount * 10000) / 10000;
            this.priceText = parseInt(this.priceText * 10000) / 10000;
        }
    },
    methods: {
        selectway() {
            if (this.isWay == 0) {
                this.isWay = 1;
            } else {
                this.isWay = 0;
            }
        },
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
            //解密获取存在本地的key
            this.ZBkey = JSON.parse(
                decryptByKey(localStorage.getItem("ZBkey"))
            );
            this.ZBkey.secretkey = urljm(this.ZBkey.secretkey); //这个是加密后的
            this.ZBkey.apikey = urljm(this.ZBkey.apikey); //这个是加密后的
            //获取本地汇率
            this.rate = JSON.parse(localStorage.getItem("rate"));
            console.log(this.ZBkey.secretkey);
            console.log(this.ZBkey.apikey);
            //zb数据
            // 获取自己可用币金额
            let url4 = `http://chaobi.lian2345.com/api/chaobi/deal/zb/getAccountInfo/${
                this.ZBkey.num
            }?apikey=${this.ZBkey.apikey}&secret=${
                this.ZBkey.secretkey
            }&method=getAccountInfo`;

            axios.post(url4).then(res => {
                console.log(res);
                let cnymoney = JSON.parse(res.data.list).result.coins;

                cnymoney.forEach(element => {
                    if (element.enName == _this.counterparty.toUpperCase()) {
                        _this.usdtDate = element.available;
                    } else if (element.enName == _this.coin.toUpperCase()) {
                        _this.usdtDate1 = element.available;
                    }
                });
                // this.usdtcny = JSON.parse(res.data.list).ticker.sell;
            });
            //最新价
            let url1 = `http://chaobi.lian2345.com/api/chaobi/deal/zb/ticker/5464646466456165464646464?symbol=${
                _this.symbol
            }`;
            axios.post(url1).then(res => {
                _this.newdata = JSON.parse(res.data.list).ticker.buy;
            });
            //价格转换
            this.set = setInterval(function() {
                if (_this.counterparty != "usdt") {
                    let url2 = `http://chaobi.lian2345.com/api/chaobi/deal/zb/ticker/5464646466456165464646464?symbol=${
                        _this.counterparty
                    }usdt`;
                    axios.post(url2).then(res => {
                        _this.usdtcny = JSON.parse(res.data.list).ticker.sell;
                    });
                }
            }, 5000);

            //ZB数据
            /*let url = `http://chaobi.lian2345.com/api/chaobi/deal/zb/depth/5464646466456165464646464?symbol=${
                this.symbol
            }`;*/
            //获取深度图数据
            this.$remote.getDepthData({
                type: 'zb_all',
                symbol: this.symbol
            }).then(res => {
                // console.log(JSON.parse(res.data.list));
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
                    this.fourshu = parseInt(xxdata[(xxdata.length / 4) * 3]);
                } else {
                    this.threeshu = xxdata[parseInt(xxdata.length / 4)].toFixed(
                        2
                    );
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
                this.revealstyle=null
                this.reveal=0
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
                this.revealstyle=null
                this.reveal=0
                this.isMode = 1;
                this.decimaltxt = "市价单";
                this.decimaltxt1 = "←点击查看更多买卖方式";
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
            // console.log(data);
            this.numMoneyData = 1;
            switch (data) {
                case "cangone":
                    if (this.comments == 1) {
                        return (
                            (this.numMoney = 1),
                            (this.numText = this.usdtDate1 / 1),
                            (this.sumText = this.usdtDate1 * this.priceText)
                        );
                    } else {
                        return (
                            (this.numMoney = 1),
                            (this.sumText = this.usdtDate / 1),
                            (this.numText = this.usdtDate / this.priceText)
                        );
                    }
                case "cangtwo":
                    if (this.comments == 1) {
                        return (
                            (this.numMoney = 0.5),
                            (this.numText = this.usdtDate1 / 2),
                            (this.sumText =
                                (this.usdtDate1 * this.priceText) / 2)
                        );
                    } else {
                        return (
                            (this.numMoney = 0.5),
                            (this.sumText = this.usdtDate / 2),
                            (this.numText = this.usdtDate / this.priceText / 2)
                        );
                    }
                case "cangthree":
                    if (this.comments == 1) {
                        return (
                            (this.numMoney = 1 / 3),
                            (this.numText = this.usdtDate1 / 3),
                            (this.sumText =
                                (this.usdtDate1 * this.priceText) / 3)
                        );
                    } else {
                        return (
                            (this.numMoney = 1 / 3),
                            (this.sumText = this.usdtDate / 3),
                            (this.numText = this.usdtDate / this.priceText / 3)
                        );
                    }
                case "cangfour":
                    if (this.comments == 1) {
                        return (
                            (this.numMoney = 1 / 4),
                            (this.numText = this.usdtDate1 / 4),
                            (this.sumText =
                                (this.usdtDate1 * this.priceText) / 4)
                        );
                    } else {
                        return (
                            (this.numMoney = 0.25),
                            (this.sumText = this.usdtDate / 4),
                            (this.numText = this.usdtDate / this.priceText / 4)
                        );
                    }
            }
        },
        //买入,卖出
        likeBuy(res) {
            this.$toStatistic("cbDealbuyzb", "点击交易页面zb买卖");

            if (!this.$store.state.userInfo) {
                MessageBox.confirm("您还未登录，是否登录").then(res => {
                    this.$router.push({
                        path: "/login"
                    });
                });
            }
            let tradeType, price, amount, usdtmoney;
            if (this.counterparty == "usdt") {
                usdtmoney = (this.usdtDate * this.rate).toString();
            } else {
                usdtmoney = (
                    this.usdtDate *
                    this.rate *
                    this.usdtcny
                ).toString();
            }

            //买入
            if (res == "in") {
                this.$toStatistic("cbDealbuyzbbuy", "点击交易页面zb买入交易");
                if (this.isMode == 1) {
                    if (
                        this.isFalse["background-color"] &&
                        !this.isFalse1["background-color"]
                    ) {
                        //限价单买入
                        tradeType = 1;
                        // console.log("限价单买入");
                        amount = this.$refs.input2.value;
                        price = this.$refs.input1.value;
                        let url = `http://chaobi.lian2345.com/api/chaobi/deal/zb/order/${
                            this.ZBkey.num
                        }?apikey=${this.ZBkey.apikey}&secret=${
                            this.ZBkey.secretkey
                        }&method=order&price=${price}&amount=${amount}&tradeType=${tradeType}&symbol=${
                            this.symbol
                        }`;
                        axios.post(url).then(res => {
                            let list = JSON.parse(res.data.list);
                            console.log(list);

                            if (list.code && list.code == 1000) {
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
                        if (!this.sumText) {
                            MessageBox("温馨提示", "请输入金额");
                            return;
                        }
                        tradeType = 1;
                        // console.log("市价单买入");
                        amount = this.sumText.toString();
                        //  amount = this.sumText;
                        // console.log(amount);
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
                            "zb",
                            usdtmoney,
                            1,
                            "buy",
                            this.symbol,
                            this.buysum,
                            this.singlemoney,
                            this.entruesdepth,
                            this.mosthightprice,
                            "ZBkey"
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
                                "zb",
                                usdtmoney,
                                2,
                                "buy",
                                this.symbol,
                                this.triggerprice,
                                this.entrustprice,
                                this.amountplan,
                                0,
                                "ZBkey"
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
                                    "zb",
                                    usdtmoney,
                                    3,
                                    "buy",
                                    this.symbol,
                                    this.yieldcurve,
                                    this.yieldcurvesum,
                                    0,
                                    0,
                                    "ZBkey"
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
                this.$toStatistic("cbDealbuyzbsell", "点击交易页面zb卖出交易");
                if (this.isMode == 1) {
                    if (
                        this.isFalse["background-color"] &&
                        !this.isFalse1["background-color"]
                    ) {
                        //限价单卖出
                        tradeType = 0;
                        // console.log("限价单卖出");
                        price = this.$refs.input1.value;
                        amount = this.$refs.input2.value;
                        let url = `http://chaobi.lian2345.com/api/chaobi/deal/zb/order/${
                            this.ZBkey.num
                        }?apikey=${this.ZBkey.apikey}&secret=${
                            this.ZBkey.secretkey
                        }&method=order&price=${price}&amount=${amount}&tradeType=${tradeType}&symbol=${
                            this.symbol
                        }`;
                        axios.post(url).then(res => {
                            let list = JSON.parse(res.data.list);
                            console.log(list);

                            if (list.code && list.code == 1000) {
                                MessageBox("温馨提示", "委托成功");
                            } else {
                                MessageBox("温馨提示", "委托失败");
                            }
                        });
                    } else if (
                        !this.isFalse["background-color"] &&
                        this.isFalse1["background-color"]
                    ) {
                        //市价单卖出
                        if (!this.sumText) {
                            MessageBox("温馨提示", "请输入金额");
                            return;
                        }
                        tradeType = 0;
                        // console.log("市价单卖出");
                        amount = this.sumText.toString();
                        // console.log(amount);
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
                            "zb",
                            usdtmoney,
                            1,
                            "sell",
                            this.symbol,
                            this.buysum,
                            this.singlemoney,
                            this.entruesdepth,
                            this.mosthightprice,
                            "ZBkey"
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
                                "zb",
                                usdtmoney,
                                2,
                                "sell",
                                this.symbol,
                                this.triggerprice,
                                this.entrustprice,
                                this.amountplan,
                                0,
                                "ZBkey"
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
                                    "zb",
                                    usdtmoney,
                                    3,
                                    "sell",
                                    this.symbol,
                                    this.yieldcurve,
                                    this.yieldcurvesum,
                                    0,
                                    0,
                                    "ZBkey"
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
        //键盘弹起事件
        keydown(data) {
            this.cangactive = "";
            if (data == 3) {
                this.numText = this.sumText / this.priceText;
            } else if (data == 1 || data == 2) {
                this.sumText = this.numText * this.priceText;
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
                        // if () {
                        this.axiosdata1("24:00", 1);
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
        //开始套利
        straddle() {
            remote
                .selectAll({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(this.$store.state.userInfo.phone),
                    smybol: this.symbol,
                    master: "zb", //交易所
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
                    master: "zb", //交易所
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
.cbDealbuyoneZB {
    width: 100%;
    height: 100%;
    background-color: #fff;
    margin-top: 3.85rem;
}
</style>




