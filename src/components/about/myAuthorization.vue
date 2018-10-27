<template>
    <div class="myAuthorization">
        <header>
            <span>我的授权</span>
        </header>
        <div class="user-bar-1"></div>
        <div class="user-bar">
            <div>
                <span class="left">资产统计</span>
                <!-- <span class="right">{{time}} s</span> -->
                <p class="user-phone-number">
                    <span class="total">总资产(￥)</span>
                    <span class="num">≈
                        <i>{{(huobiAsset+OkexAsset+bianAsset+ZBAsset).toFixed(3)}}</i>
                    </span>
                </p>
            </div>
            <p class="money">
                <span class="moneyLeft">盈亏(￥)
                    <br>
                    <i>{{(huobiAssetAvailable-huobiAssetOpen+OkexAssetAvailable-OkexAssetOpen+bianAssetAvailable-bianAssetOpen+ZBAssetAvailable-ZBAssetOpen).toFixed(2)}}</i>
                </span>
                <span class="moneyLeft">盈亏率
                    <br>
                    <i v-show="huobiAssetOpen+OkexAssetOpen+bianAssetOpen+ZBAssetOpen != 0">{{((huobiAssetAvailable-huobiAssetOpen+OkexAssetAvailable-OkexAssetOpen+bianAssetAvailable-bianAssetOpen+ZBAssetAvailable-ZBAssetOpen)*100/(huobiAssetOpen+OkexAssetOpen+bianAssetOpen+ZBAssetOpen)).toFixed(2)}}%</i>
                    <i v-show="huobiAssetOpen+OkexAssetOpen+bianAssetOpen+ZBAssetOpen == 0">{{0.00}}%</i>
                </span>
            </p>
        </div>
        <main>
            <p class='usertion'>授权交易</p>
            <div class="content">
                <div @click="timer('火币全球站')" class="contentList" v-if="huobiAsset!=0">
                    <div class="left">
                        <p class="bourse">火币PRO</p>
                        <p class="price">￥{{huobiAsset.toFixed(3)}}</p>
                    </div>
                    <div class="right">
                        <p :style="huobiRatio>0?'color:#45ad35;':'color:#F43E3A;'" class="momey">￥{{(huobiAssetAvailable-huobiAssetOpen).toFixed(2)}}</p>
                        <p :style="huobiRatio>0?'background-color:#45ad35;':'background-color:#F43E3A;'" class="proportion">{{(huobiRatio*100).toFixed(2)}}%</p>
                    </div>
                </div>
                <div @click="timer('OKEX')" class="contentList" v-if="OkexAsset!=0">
                    <div class="left">
                        <p class="bourse">OKEX</p>
                        <p class="price">￥{{OkexAsset.toFixed(3)}}</p>
                    </div>
                    <div class="right">
                        <p :style="OkexRatio>0?'color:#45ad35;':'color:#F43E3A;'" class="momey">￥{{(OkexAssetAvailable-OkexAssetOpen).toFixed(2)}}</p>
                        <p :style="OkexRatio>0?'background-color:#45ad35;':'background-color:#F43E3A;'" class="proportion">{{(OkexRatio*100).toFixed(2)}}%</p>
                    </div>
                </div>
                <div @click="timer('币安')" class="contentList" v-if="bianAsset!=0">
                    <div class="left">
                        <p class="bourse">币安</p>
                        <p class="price">￥{{bianAsset.toFixed(3)}}</p>
                    </div>
                    <div class="right">
                        <p :style="bianRatio>0?'color:#45ad35;':'color:#F43E3A;'" class="momey">￥{{(bianAssetAvailable-bianAssetOpen).toFixed(2)}}</p>
                        <p :style="bianRatio>0?'background-color:#45ad35;':'background-color:#F43E3A;'" class="proportion">{{(bianRatio*100).toFixed(2)}}%</p>
                    </div>
                </div>
                <div @click="timer('ZB')" class="contentList" v-if="ZBAsset!=0">
                    <div class="left">
                        <p class="bourse">ZB</p>
                        <p class="price">￥{{ZBAsset.toFixed(3)}}</p>
                    </div>
                    <div class="right">
                        <p :style="ZBRatio>0?'color:#45ad35;':'color:#F43E3A;'" class="momey">￥{{(ZBAssetAvailable-ZBAssetOpen).toFixed(2)}}</p>
                        <p :style="ZBRatio>0?'background-color:#45ad35;':'background-color:#F43E3A;'" class="proportion">{{(ZBRatio*100).toFixed(2)}}%</p>
                    </div>
                </div>
            </div>
            <div v-if="(huobiAsset+OkexAsset+bianAsset+ZBAsset)!=0" @click="goauthorize" class="add">+授权交易所</div>
            <div v-if="(huobiAsset+OkexAsset+bianAsset+ZBAsset)==0" @click="goauthorize" class="add"><img src="../../../static/images/circularadd.png" alt=""><br>您还没有添加交易所授权，马上添加吧~</div>
        </main>
         <div class="aboutfooter">
                <div @click="diajji(1)" class="one"><div :class="{dianji:isjiaji==1}"></div><span :class="{dianji1:isjiaji==1}">行情</span></div>
                <div  @click="diajji(2)" class="two"><div :class="{dianji:isjiaji==2}"></div><span :class="{dianji1:isjiaji==2}">预警</span></div>
                <div  @click="diajji(3)" class="three"><div :class="{dianji:isjiaji==3}"></div><span :class="{dianji1:isjiaji==3}">授权</span></div>
                <div  @click="diajji(4)" class="four"><div :class="{dianji:isjiaji==4}"></div><span :class="{dianji1:isjiaji==4}">我的</span></div>
            </div>
    </div>
</template>
<script>
import { encryptKey, MD5 ,decryptByKey} from '../../lib/js/crypto.js'
import {urljm} from  '../../lib/js/jsmi.js'

// const kplsign = require("../../lib/js/sign/KplSign.js");
const kplsign = require("../../lib/js/sign/KplSign.js");
var http = require("http");
var querystring = require("querystring");
export default {
    name: "myAuthorization",
    data() {
        return {
            isjiaji:3,
            argsdata: {},
            user: {},
            urldata: {},
            usdt: [],
            huobiAsset: 0, //huobi总资产
            huobiAssetAvailable: 0, //huobi总可用资产
            huobiAssetOpen: 0, //开盘时huobi总资产
            huobiRatio: 0, //huobi盈亏率
            huobiProfit: 0, //huobi盈亏额
            huobiAssetList:[], //huobi有资产币种列表
            OkexAsset: 0, //OKEx总资产
            OkexAssetAvailable: 0, //OKEx总可用资产
            OkexAssetOpen: 0, //开盘时OKEx总资产
            OkexRatio: 0, //OKEx盈亏率
            OkexProfit: 0, //OKEx盈亏额
            OkexAssetList:[], //OKEx有资产币种列表
            bianAsset: 0, //bian总资产
            bianAssetAvailable: 0, //bian总可用资产
            bianAssetOpen: 0, //开盘时bian总资产
            bianRatio: 0, //bian盈亏率
            bianProfit: 0, //bian盈亏额
            bianAssetList:[], //bian有资产币种列表
            ZBAsset: 0, //ZB总资产
            ZBAssetAvailable: 0, //ZB总可用资产
            ZBAssetOpen: 0, //开盘时ZB总资产
            ZBRatio: 0, //ZB盈亏率
            ZBProfit: 0, //ZB盈亏额
            ZBAssetList:[], //ZB有资产币种列表
            ZBOpenAll:{},
            time: 30,
            countime: null
        };
    },
    created() {
        this.getHuobi();
        this.getOkex();
        this.getBian();
        this.getZb();
        this.countDown();
    },
    methods: {
        diajji(res){
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
        clickUser() {
            this.$router.go(-1);
        },
        goauthorize() {
            this.$router.push({
                path: "/authorize"
            });
        },
        timer(data){
            this.$router.push({
                path: "/myAuthorizationList",
                query:{
                    'Bourse':data
                }
            });            
        },
        countDown() {
            let _this = this;
            _this.countime= setInterval(function () {
            _this.time--;
            // console.log(_this.time);

            if (_this.time == -1) {
                _this.getHuobi();
                _this.getOkex();
                _this.getBian();
                _this.getZb();
                _this.time = 30;
            }
            },1000)
        },
        //获取火币总资产和盈亏
        getHuobi() {
            console.log('huobi');
            
            if (localStorage.getItem("userkey") == null) {
                return;
            }
            this.user = JSON.parse(decryptByKey(localStorage.getItem("userkey")));
            this.urldata =
                "/v1/account/accounts/" + this.user.arroundId + "/balance/";
            var apikey = this.user.apikey;
            var secretkey = this.user.secretkey;
            var url = this.urldata;
            // var url = "/v1/account/accounts/"+JSON.parse(localStorage.getItem("arroundId"))+"/balance/";
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
                    let buffer = [];
                    res.on("data", function(chun) {
                        buffer.push(chun);
                    });
                    _this.usdt=[]
                    res.on("end", function() {
                        buffer.forEach(element => {
                            _this.usdt += element;
                        });
                        let arr = JSON.parse(_this.usdt).data.list;
                        let huobiAvailable = {}
                        let huobiFreezed = {}
                        let huobiOpen = ''
                        for (let index = 0; index < arr.length; index++) {
                            if(arr[index].type == 'trade'){
                                huobiAvailable[arr[index].currency] = arr[index].balance
                            }else if(arr[index].type == 'frozen'){
                                huobiFreezed[arr[index].currency] = arr[index].balance
                            }
                            if(Number(arr[index].balance)>0){

                                huobiOpen = huobiOpen == ''?arr[index].currency : huobiOpen+','+arr[index].currency
                            }
                                
                            
                        }
                        // console.log(huobiAvailable);
                        // console.log(huobiFreezed);
                        console.log(huobiOpen);
                        let openUrl = `http://chaobi.lian2345.com/api/chaobi/deal/github/huobi/k?symbols=${huobiOpen}`
                        _this.$axios.post(openUrl).then(res=>{
                            let huobiPriceList = res.data
                            let huobiPriceList1 = {}
                            huobiPriceList.forEach(item=>{
                                if(item.symbol != 'usdt'&& item.symbol.indexOf('usdt')>0){
                                    huobiPriceList1[item.symbol.split('usdt')[0]] = JSON.parse(item.data).data[0]
                                }else if(item.symbol != 'usdt'&& item.symbol.indexOf('usdt')==-1&&item.symbol.indexOf('btc')>0){
                                    huobiPriceList1[item.symbol.split('btc')[0]] = JSON.parse(item.data).data[0]
                                }else if(item.symbol != 'usdt'&& item.symbol.indexOf('usdt')==-1&&item.symbol.indexOf('eth')>0){
                                    huobiPriceList1[item.symbol.split('eth')[0]] = JSON.parse(item.data).data[0]
                                }
                            })
                            
                            let huobiAsset= 0; //huobi总资产
                            _this.huobiAssetAvailable= 0; //huobi总可用资产
                            _this.huobiAssetOpen= 0; //开盘时huobi总资产
                            _this.huobiRatio= 0; //huobi盈亏率
                            _this.huobiProfit= 0; //huobi盈亏额
                            _this.huobiAssetList=[]; //huobi有资产币种列表
                            for (const key in huobiAvailable) {
                                let arr = []
                                if(Number(huobiAvailable[key])>0){
                                        let ratio;
                                        let coinAvailable;
                                        let coinAsset;
                                        let coinAmount;
                                        let coinChangePercentage;
                                        let coinAssetChange;
                                        if(key == 'usdt'){
                                            ratio = 1
                                            huobiAsset+=Number(huobiAvailable[key])*ratio*localStorage.getItem("rate")  // 总资产
                                            _this.huobiProfit += 0
                                            _this.huobiAssetAvailable+=Number(huobiAvailable[key])*ratio*localStorage.getItem("rate")  // 总可用
                                            _this.huobiAssetOpen+=Number(huobiAvailable[key])*ratio*localStorage.getItem("rate")
                                            _this.huobiRatio = (_this.huobiAssetAvailable-_this.huobiAssetOpen)/_this.huobiAssetOpen  //盈亏率
                                            coinAvailable = Number(huobiAvailable[key])*ratio*localStorage.getItem("rate") // 币可用
                                            coinAsset = Number(huobiAvailable[key])*ratio*localStorage.getItem("rate") // 币资产
                                            coinAmount = Number(huobiAvailable[key]) // 币数量
                                            coinChangePercentage = 0
                                            coinAssetChange = 0.00

                                        }else{
                                            // console.log(key);
                                            let ticker = huobiPriceList1[key]
                                            ratio = Number(ticker.close) // 币种对美元的最新汇率
                                            huobiAsset+=Number(huobiAvailable[key])*ratio*localStorage.getItem("rate")  // 总资产
                                            _this.huobiProfit +=  Number(huobiAvailable[key])*(Number(ticker.close)-Number(ticker.open))*localStorage.getItem("rate")  // 盈亏
                                            _this.huobiAssetAvailable+=Number(huobiAvailable[key])*ratio*localStorage.getItem("rate")  // 总可用
                                            _this.huobiAssetOpen += Number(huobiAvailable[key])*Number(ticker.open)*localStorage.getItem("rate")  //开盘时总可用
                                            _this.huobiRatio =  (_this.huobiAssetAvailable-_this.huobiAssetOpen)/_this.huobiAssetOpen  //盈亏率
                                            coinAvailable = Number(huobiAvailable[key])*ratio*localStorage.getItem("rate") // 币可用
                                            coinAsset = Number(huobiAvailable[key])*ratio*localStorage.getItem("rate") // 币资产
                                            coinAmount = Number(huobiAvailable[key]) // 币数量
                                            coinChangePercentage = (Number(ticker.close)-Number(ticker.open))*100/Number(ticker.open) // 币涨跌幅
                                            coinAssetChange = Number(huobiAvailable[key])*(Number(ticker.close)-Number(ticker.open))*localStorage.getItem("rate") // 币盈收
                                            
                                            
                                        }
                                        _this.huobiAssetList.push({
                                            'coin':key,
                                            'coinAvailable':coinAvailable,
                                            'coinAsset':coinAsset,
                                            'coinAmount':coinAmount,
                                            'coinChangePercentage':coinChangePercentage.toFixed(2)+'%',
                                            'coinAssetChange':coinAssetChange,
                                            'huobiAsset':huobiAsset,
                                            'huobiAssetAvailable':_this.huobiAssetAvailable
                                        })
                                        if(Number(huobiFreezed[key])>0){
                                            console.log('可用冻结都不为0');
                                            huobiAsset+= Number(huobiFreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                            _this.huobiAssetList[_this.huobiAssetList.length-1].coinFreezed = Number(huobiFreezed[key])*ratio*localStorage.getItem("rate")
                                            _this.huobiAssetList[_this.huobiAssetList.length-1].coinAmount+= Number(huobiFreezed[key])
                                            _this.huobiAssetList[_this.huobiAssetList.length-1].coinAsset+= Number(huobiFreezed[key])*ratio*localStorage.getItem("rate")
                                            _this.huobiAssetList[_this.huobiAssetList.length-1].huobiAsset = huobiAsset
                                        }else if(Number(huobiFreezed[key]) == 0){
                                            console.log('可用不为0冻结为0');
                                            _this.huobiAssetList[_this.huobiAssetList.length-1].coinFreezed = 0
                                        }  
                                        // console.log(_this.huobiAssetList);
                                        _this.huobiAsset = huobiAsset
                                        _this.$store.commit('setHuobiAssetList',_this.huobiAssetList)  
                                        ratio = null
                                        coinAvailable = null
                                        coinAsset = null
                                        coinAmount = null
                                        coinChangePercentage = null
                                        coinAssetChange = null
                                }
                                if(Number(huobiFreezed[key])>0){
                                    if(Number(huobiAvailable[key]) == 0) {
                                        console.log('可用为0冻结不为0');
                                        // console.log(key);
                                        if(key == 'usdt'){
                                            let ratio = 1
                                            huobiAsset+=Number(huobiFreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                            let coinFreezed = Number(huobiFreezed[key])*ratio*localStorage.getItem("rate") // 币冻结资产
                                            let coinAmount = Number(huobiFreezed[key]) // 币数量
                                            let coinChangePercentage = 0 // 币涨跌幅
                                            _this.huobiAssetList.push({
                                                'coin':key,
                                                'coinAvailable':0,
                                                'coinAsset':coinFreezed,
                                                'coinAmount':coinAmount,
                                                'coinChangePercentage':coinChangePercentage.toFixed(2)+'%',
                                                'coinAssetChange':0,
                                                'coinFreezed':coinFreezed,
                                                'huobiAsset':huobiAsset,
                                                'huobiAssetAvailable':_this.huobiAssetAvailable
                                            })
                                            _this.huobiAsset = huobiAsset
                                            _this.$store.commit('setHuobiAssetList',_this.huobiAssetList) 
                                        }else{
                                                let ticker = huobiPriceList1[key]
                                                let ratio = Number(ticker.close)
                                                huobiAsset+=Number(huobiFreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                                let coinFreezed = Number(huobiFreezed[key])*ratio*localStorage.getItem("rate") // 币冻结资产
                                                let coinAmount = Number(huobiFreezed[key]) // 币数量
                                                let coinChangePercentage = (Number(ticker.close)-Number(ticker.open))*100/Number(ticker.open) // 币涨跌幅
                                                _this.huobiAssetList.push({
                                                    'coin':key,
                                                    'coinAvailable':0,
                                                    'coinAsset':coinFreezed,
                                                    'coinAmount':coinAmount,
                                                    'coinChangePercentage':coinChangePercentage.toFixed(2)+'%',
                                                    'coinAssetChange':0,
                                                    'coinFreezed':coinFreezed,
                                                    'huobiAsset':huobiAsset,
                                                    'huobiAssetAvailable':_this.huobiAssetAvailable
                                                })
                                                _this.huobiAsset = huobiAsset
                                                _this.$store.commit('setHuobiAssetList',_this.huobiAssetList) 
                                        }
                                    }
                                }
                        
                            }
                        })
                    });
                    // buffer=[]
                });
                req.on("error", function(err) {
                    // console.error(err);
                });
                req.end();
            });
        },
        //获取Okex总资产和盈亏
        getOkex(){
            console.log('okex');
            
            if (localStorage.getItem("Okexkey") == null) {
                return;
            }
            let Okexkey = JSON.parse(decryptByKey(localStorage.getItem('Okexkey')))
            // console.log(Okexkey);
            let url = `http://chaobi.lian2345.com/api/chaobi/deal/oken/userinfo/${Okexkey.num}?apikey=${urljm(Okexkey.apikey)}&secret=${
                urljm(Okexkey.secretkey)}&method=getAccountInfo`;
            this.$axios.post(url).then(res => {
                // console.log(JSON.parse(res.data.list).info.funds);
                let okeyfree = JSON.parse(res.data.list).info.funds.free
                let okeyfreezed = JSON.parse(res.data.list).info.funds.freezed
                // console.log(okeyfree);
                // console.log(okeyfreezed);

                let OkexAsset = 0
                // this.OkexAsset= 0; //OKEx总资产
                this.OkexAssetAvailable= 0; //OKEx总可用资产
                this.OkexAssetOpen= 0; //开盘时OKEx总资产
                this.OkexRatio= 0; //OKEx盈亏率
                this.OkexProfit= 0; //OKEx盈亏额
                this.OkexAssetList=[]; //OKEx有资产币种列表
                for (const key in okeyfree) {
                    let arr = []
                    if(Number(okeyfree[key])>0){
                        let url1 = `http://chaobi.lian2345.com/api/chaobi/deal/oken/tickerNew/5464646466456165464646464?symbol=${key}_usdt`;
                        this.$axios.post(url1).then(res=>{
                            // console.log(JSON.parse(res.data.list).data[0]);
                            let ratio;
                            let coinAvailable;
                            let coinAsset;
                            let coinAmount;
                            let coinChangePercentage;
                            let coinAssetChange;
                            if(key == 'usdt'){
                                ratio = 1
                                this.OkexProfit += 0
                                OkexAsset+=Number(okeyfree[key])*ratio*localStorage.getItem("rate")  // 总资产
                                this.OkexAssetAvailable+=Number(okeyfree[key])*ratio*localStorage.getItem("rate")  // 总可用
                                this.OkexAssetOpen+=Number(okeyfree[key])*ratio*localStorage.getItem("rate")  
                                this.OkexRatio =  (this.OkexAssetAvailable-this.OkexAssetOpen)/this.OkexAssetOpen  //盈亏率
                                coinAvailable = Number(okeyfree[key])*ratio*localStorage.getItem("rate") // 币可用
                                coinAsset = Number(okeyfree[key])*ratio*localStorage.getItem("rate") // 币资产
                                coinAmount = Number(okeyfree[key]) // 币数量
                                coinChangePercentage = 0 // 币涨跌幅
                                coinAssetChange = 0
                            }else{

                                let ticker = JSON.parse(res.data.list).data[0]
                                ratio = Number(ticker.close) // 币种对美元的最新汇率
                                this.OkexProfit +=  Number(okeyfree[key])*(Number(ticker.close)-Number(ticker.open))*localStorage.getItem("rate")  // 盈亏
                                OkexAsset+=Number(okeyfree[key])*ratio*localStorage.getItem("rate")  // 总资产
                                this.OkexAssetAvailable+=Number(okeyfree[key])*ratio*localStorage.getItem("rate")  // 总可用
                                this.OkexAssetOpen += Number(okeyfree[key])*Number(ticker.open)*localStorage.getItem("rate")  //开盘时总可用
                                this.OkexRatio =  (this.OkexAssetAvailable-this.OkexAssetOpen)/this.OkexAssetOpen  //盈亏率
                                coinAvailable = Number(okeyfree[key])*ratio*localStorage.getItem("rate") // 币可用
                                coinAsset = Number(okeyfree[key])*ratio*localStorage.getItem("rate") // 币资产
                                coinAmount = Number(okeyfree[key]) // 币数量
                                coinChangePercentage = ticker.changePercentage.indexOf('+')==-1?ticker.changePercentage:ticker.changePercentage.split('+')[1] // 币涨跌幅
                                coinAssetChange = Number(okeyfree[key])*(Number(ticker.close)-Number(ticker.open))*localStorage.getItem("rate") // 币盈收
                            }
                            this.OkexAssetList.push({
                                'coin':key,
                                'coinAvailable':coinAvailable,
                                'coinAsset':coinAsset,
                                'coinAmount':coinAmount,
                                'coinChangePercentage':coinChangePercentage,
                                'coinAssetChange':coinAssetChange,
                                'OkexAsset':OkexAsset,
                                'OkexAssetAvailable':this.OkexAssetAvailable
                            })
                            if(Number(okeyfreezed[key])>0){
                                console.log('可用冻结都不为0');
                                OkexAsset+= Number(okeyfreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                this.OkexAssetList[this.OkexAssetList.length-1].coinFreezed = Number(okeyfreezed[key])*ratio*localStorage.getItem("rate")
                                this.OkexAssetList[this.OkexAssetList.length-1].coinAmount+= Number(okeyfreezed[key])
                                this.OkexAssetList[this.OkexAssetList.length-1].coinAsset+= Number(okeyfreezed[key])*ratio*localStorage.getItem("rate")
                                this.OkexAssetList[this.OkexAssetList.length-1].OkexAsset = OkexAsset
                            }else if(Number(okeyfreezed[key]) == 0){
                                console.log('可用不为0冻结为0');
                                this.OkexAssetList[this.OkexAssetList.length-1].coinFreezed = 0
                            }  
                            // console.log(this.OkexAssetList);
                            this.OkexAsset = OkexAsset
                            this.$store.commit('setOkexAssetList',this.OkexAssetList) 
                            ratio = null
                            coinAvailable = null
                            coinAsset = null
                            coinAmount = null
                            coinChangePercentage = null
                            coinAssetChange = null 
                        })
                    }else if(Number(okeyfree[key]) == 0) {
                        if(Number(okeyfreezed[key])>0){
                            console.log('可用为0冻结不为0');
                            if(key == 'usdt'){
                                let ratio = 1
                                OkexAsset+=Number(okeyfreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                let coinFreezed = Number(okeyfreezed[key])*ratio*localStorage.getItem("rate") // 币冻结资产
                                let coinAmount = Number(okeyfreezed[key]) // 币数量
                                let coinChangePercentage = 0.00 + "%" // 币涨跌幅
                                this.OkexAssetList.push({
                                    'coin':key,
                                    'coinAvailable':0,
                                    'coinAsset':coinFreezed,
                                    'coinAmount':coinAmount,
                                    'coinChangePercentage':coinChangePercentage,
                                    'coinAssetChange':0,
                                    'coinFreezed':coinFreezed,
                                    'OkexAsset':OkexAsset,
                                    'OkexAssetAvailable':this.OkexAssetAvailable
                                })
                                this.OkexAsset = OkexAsset
                                this.$store.commit('setOkexAssetList',this.OkexAssetList) 
                            }else{

                                let url1 = `http://chaobi.lian2345.com/api/chaobi/deal/oken/tickerNew/5464646466456165464646464?symbol=${key}_usdt`;
                                this.$axios.post(url1).then(res=>{
                                    let ticker = JSON.parse(res.data.list).data[0]
                                    let ratio = Number(JSON.parse(res.data.list).data[0].close)
                                    OkexAsset+=Number(okeyfreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                    let coinFreezed = Number(okeyfreezed[key])*ratio*localStorage.getItem("rate") // 币冻结资产
                                    let coinAmount = Number(okeyfreezed[key]) // 币数量
                                    let coinChangePercentage = ticker.changePercentage.indexOf('+')==-1?ticker.changePercentage:ticker.changePercentage.split('+')[1] // 币涨跌幅
                                    this.OkexAssetList.push({
                                        'coin':key,
                                        'coinAvailable':0,
                                        'coinAsset':coinFreezed,
                                        'coinAmount':coinAmount,
                                        'coinChangePercentage':coinChangePercentage,
                                        'coinAssetChange':0,
                                        'coinFreezed':coinFreezed,
                                        'OkexAsset':OkexAsset,
                                        'OkexAssetAvailable':this.OkexAssetAvailable
                                    })
                                    this.OkexAsset = OkexAsset
                                    this.$store.commit('setOkexAssetList',this.OkexAssetList) 
                                    // console.log(this.OkexAssetList);
                                })
                            }
                        }
                    }
                    
                }
                OkexAsset = null
            })

        },
        //获取Bian总资产和盈亏
        getBian(){
            console.log('bian');
            if (localStorage.getItem("biankey") == null) {
                return;
            }
            
            let biankey = JSON.parse(decryptByKey(localStorage.getItem('biankey')))
            // console.log('biankey');
            // console.log(biankey);
            
            let url = `http://chaobi.lian2345.com/api/chaobi/deal/binance/balances/dfdsafadf?apikey=${urljm(biankey.apikey)}&secret=${urljm(biankey.secretkey)}`;
            // console.log(url);
            
            this.$axios.post(url).then(res => {
                let list = JSON.parse(res.data.list.data)
                // console.log(list);
                
                // this.bianAsset= 0; //bian总资产
                let bianAsset= 0; //bian总资产
                this.bianAssetAvailable= 0; //bian总可用资产
                this.bianAssetOpen= 0; //开盘时bian总资产
                this.bianRatio= 0; //bian盈亏率
                this.bianProfit= 0; //bian盈亏额
                this.bianAssetList=[]; //bian有资产币种列表
                // for (const key in list) {
                for (let index = 0; index < list.length; index++) {
                    
                    if(Number(list[index].free)>0){
                        let url2 = `http://chaobi.lian2345.com/api/chaobi/deal/binance/ticker24hr/dfdsafadf?apikey=${
                        urljm(biankey.apikey)
                        }&secret=${urljm(biankey.secretkey)}&symbol=${list[index].asset}USDT`;
                        this.$axios.post(url2).then(res=>{
                            let ratio;
                            let coinAvailable;
                            let coinAsset;
                            let coinAmount;
                            let coinChangePercentage;
                            let coinAssetChange;
                            if(list[index].asset == 'USDT'){
                                ratio = 1

                                this.bianProfit +=  0  // 盈亏
                                bianAsset+=Number(list[index].free)*ratio*localStorage.getItem("rate")  // 总资金
                                this.bianAssetAvailable+=Number(list[index].free)*ratio*localStorage.getItem("rate")  // 总可用
                                this.bianAssetOpen += Number(list[index].free)*localStorage.getItem("rate")  //开盘时总可用
                                this.bianRatio =  (this.bianAssetAvailable-this.bianAssetOpen)/this.bianAssetOpen  //盈亏率
    
                                coinAvailable = Number(list[index].free)*ratio*localStorage.getItem("rate") // 币可用
                                coinAsset = Number(list[index].free)*ratio*localStorage.getItem("rate") // 币资产
                                coinAmount = Number(list[index].free) // 币数量
                                coinChangePercentage = 0 // 币涨跌幅
                                coinAssetChange = 0 // 币盈收
                            }else {
                                let ticker = JSON.parse(res.data.list.data)
                                ratio = Number(ticker.lastPrice) // 币种对美元的最新汇率
                                this.bianProfit +=  Number(list[index].free)*(Number(ticker.lastPrice)-Number(ticker.openPrice))*localStorage.getItem("rate")  // 盈亏
                                bianAsset+=Number(list[index].free)*ratio*localStorage.getItem("rate")  // 总资金
                                this.bianAssetAvailable+=Number(list[index].free)*ratio*localStorage.getItem("rate")  // 总可用
                                this.bianAssetOpen += Number(list[index].free)*Number(ticker.openPrice)*localStorage.getItem("rate")  //开盘时总可用
                                this.bianRatio =  (this.bianAssetAvailable-this.bianAssetOpen)/this.bianAssetOpen  //盈亏率
    
                                coinAvailable = Number(list[index].free)*ratio*localStorage.getItem("rate") // 币可用
                                coinAsset = Number(list[index].free)*ratio*localStorage.getItem("rate") // 币资产
                                coinAmount = Number(list[index].free) // 币数量
                                coinChangePercentage = ticker.priceChangePercent +'%' // 币涨跌幅
                                coinAssetChange = Number(list[index].free)*(Number(ticker.lastPrice)-Number(ticker.openPrice))*localStorage.getItem("rate") // 币盈收
                            }
                            this.bianAssetList.push({
                                'coin':list[index].asset,
                                'coinAvailable':coinAvailable,
                                'coinAsset':coinAsset,
                                'coinAmount':coinAmount,
                                'coinChangePercentage':coinChangePercentage,
                                'coinAssetChange':coinAssetChange,
                                'bianAsset':bianAsset,
                                'bianAssetAvailable':this.bianAssetAvailable
                            })
                            if(Number(list[index].locked)>0){
                                    // console.log('可用不为0冻结为0');
                                    bianAsset+=Number(list[index].locked)*ratio*localStorage.getItem("rate") // 总冻结
                                    this.bianAssetList[this.bianAssetList.length-1].coinFreezed = Number(list[index].locked)*ratio*localStorage.getItem("rate")
                                    this.bianAssetList[this.bianAssetList.length-1].coinAmount+= Number(list[index].locked)
                                    this.bianAssetList[this.bianAssetList.length-1].coinAsset+= Number(list[index].locked)*ratio*localStorage.getItem("rate")
                                    this.bianAssetList[this.bianAssetList.length-1].bianAsset = bianAsset
                            }else if(Number(list[index].locked) == 0){
                                    // console.log('可用不为0冻结为0');
                                    this.bianAssetList[this.bianAssetList.length-1].coinFreezed = 0
                            } 
                            // console.log(this.bianAssetList);
                            this.bianAsset = bianAsset
                            this.$store.commit('setBianAssetList',this.bianAssetList)
                            ratio = null
                            coinAvailable = null
                            coinAsset = null
                            coinAmount = null
                            coinChangePercentage = null
                            coinAssetChange = null
                        })
                         
                    }
                    if(Number(list[index].locked)>0){
                        if(Number(list[index].free) == 0) {
                            // console.log('可用为0冻结不为0');
                            if(list[index].asset == 'USDT'){
                                let ratio = 1// 币种对美元的最新汇率
                                bianAsset+=Number(list[index].locked)*ratio*localStorage.getItem("rate") // 加冻结
                                let coinFreezed = Number(list[index].locked)*ratio*localStorage.getItem("rate") // 币冻结资产
                                let coinAmount = Number(list[index].locked) // 币数量
                                let coinChangePercentage = 0 // 币涨跌幅
                                this.bianAssetList.push({
                                    'coin':list[index].asset,
                                    'coinAvailable':0,
                                    'coinAsset':coinFreezed,
                                    'coinAmount':coinAmount,
                                    'coinChangePercentage':coinChangePercentage,
                                    'coinAssetChange':0,
                                    'coinFreezed':coinFreezed,
                                    'bianAsset':bianAsset,
                                    'bianAssetAvailable':this.bianAssetAvailable
                                })
                                this.bianAsset = bianAsset
                                this.$store.commit('setBianAssetList',this.bianAssetList)
                            }else {
                                // console.log('进来了');
                                
                                let url2 = `http://chaobi.lian2345.com/api/chaobi/deal/binance/ticker24hr/dfdsafadf?apikey=${
                                urljm(biankey.apikey)
                                }&secret=${urljm(biankey.secretkey)}&symbol=${list[index].asset}USDT`;
                                this.$axios.post(url2).then(res=>{
                                    let ticker = JSON.parse(res.data.list.data)
                                    // console.log(ticker);
                                    
                                    let ratio = Number(ticker.lastPrice) // 币种对美元的最新汇率
                                    bianAsset+=Number(list[index].locked)*ratio*localStorage.getItem("rate") // 加冻结
                                    let coinFreezed = Number(list[index].locked)*ratio*localStorage.getItem("rate") // 币冻结资产
                                    let coinAmount = Number(list[index].locked) // 币数量
                                    let coinChangePercentage = ticker.priceChangePercent +'%' // 币涨跌幅
                                    this.bianAssetList.push({
                                        'coin':list[index].asset,
                                        'coinAvailable':0,
                                        'coinAsset':coinFreezed,
                                        'coinAmount':coinAmount,
                                        'coinChangePercentage':coinChangePercentage,
                                        'coinAssetChange':0,
                                        'coinFreezed':coinFreezed,
                                        'bianAsset':bianAsset,
                                        'bianAssetAvailable':this.bianAssetAvailable
                                    })
                                    this.bianAsset = bianAsset
                                    this.$store.commit('setBianAssetList',this.bianAssetList)
                                    // console.log(this.bianAssetList);
                                    
                                })
                            }
                        }
                    }
                } 
            })

        },
        //获取Zb总资产和盈亏
        getZb(){
            console.log('zb');
            
            if (localStorage.getItem("ZBkey") == null) {
                return;
            }
            let ZBkey = JSON.parse(decryptByKey(localStorage.getItem('ZBkey')))
            let url0 = `http://chaobi.lian2345.com/kpl/wallert/http/selectZBOpens`
            this.$axios.get(url0).then(res=>{
                console.log(res.data.maps);
                let openAll = res.data.maps
                let url = `http://chaobi.lian2345.com/api/chaobi/deal/zb/getAccountInfo/${ZBkey.num}?apikey=${urljm(ZBkey.apikey)}&secret=${
                    urljm(ZBkey.secretkey)
                }&method=getAccountInfo`;
                this.$axios.post(url).then(res => {
                    let list = JSON.parse(res.data.list).result.coins
                    // console.log(list);
                    
                    let ZBfreeNum = 0
                    let ZBfreezedNum = 0
                    let ZBAsset= 0;
                    // this.ZBAsset= 0; //ZB总资产
                    this.ZBAssetAvailable= 0; //ZB总可用资产
                    this.ZBAssetOpen= 0; //开盘时ZB总资产
                    this.ZBRatio= 0; //ZB盈亏率
                    this.ZBProfit= 0; //ZB盈亏额
                    this.ZBAssetList=[]; //ZB有资产币种列表
                    for (let index = 0; index < list.length; index++) {
                        if(Number(list[index].available)>0){
                            let url2 = `http://chaobi.lian2345.com/api/chaobi/deal/zb/ticker/5464646466456165464646464?symbol=${
                                list[index].enName
                            }usdt`
                            this.$axios.post(url2).then(res=>{
                                // console.log(res);
                                
                                let ratio;
                                let coinAvailable;
                                let coinAsset;
                                let coinAmount;
                                let coinChangePercentage;
                                let coinAssetChange;
                                if(list[index].enName == 'USDT'){
                                    ratio = 1
                                    this.ZBProfit +=  0  // 盈亏
                                    ZBAsset+=Number(list[index].available)*ratio*localStorage.getItem("rate")  // 总资金
                                    this.ZBAssetAvailable+=Number(list[index].available)*ratio*localStorage.getItem("rate")  // 总可用
                                    this.ZBAssetOpen += Number(list[index].available)*ratio*localStorage.getItem("rate")  //开盘时总可用
                                    this.ZBRatio =  (this.bianAssetAvailable-this.bianAssetOpen)/this.bianAssetOpen || 0  //盈亏率
        
                                    coinAvailable = Number(list[index].available)*ratio*localStorage.getItem("rate") // 币可用
                                    coinAsset = Number(list[index].available)*ratio*localStorage.getItem("rate") // 币资产
                                    coinAmount = Number(list[index].available) // 币数量
                                    coinChangePercentage = 0.00+'%' // 币涨跌幅
                                    coinAssetChange = 0 // 币盈收
                                }else{

                                    let ticker = JSON.parse(res.data.list).ticker
                                    // console.log(list[index].enName);
                                    // console.log(openAll[list[index].enName.toLowerCase()]);
                                    
                                    ratio = Number(ticker.last) // 币种对美元的最新汇率
                                    this.ZBProfit +=  Number(list[index].available)*(Number(ticker.last)-Number(openAll[list[index].enName.toLowerCase()]))*localStorage.getItem("rate")  // 盈亏
                                    ZBAsset+=Number(list[index].available)*ratio*localStorage.getItem("rate")  // 总可用
                                    this.ZBAssetAvailable+=Number(list[index].available)*ratio*localStorage.getItem("rate")  // 总可用
                                    this.ZBAssetOpen += Number(list[index].available)*Number(openAll[list[index].enName.toLowerCase()])*localStorage.getItem("rate")  //开盘时总可用
                                    this.ZBRatio =  (this.ZBAssetAvailable-this.ZBAssetOpen)/this.ZBAssetOpen || 0  //盈亏率
        
                                    coinAvailable = Number(list[index].available)*ratio*localStorage.getItem("rate") // 币可用
                                    coinAsset = Number(list[index].available)*ratio*localStorage.getItem("rate") // 币资产
                                    coinAmount = Number(list[index].available) // 币数量
                                    coinChangePercentage = ((Number(ticker.last)-Number(openAll[list[index].enName.toLowerCase()]))*100/Number(openAll[list[index].enName.toLowerCase()])).toFixed(2)+'%' // 币涨跌幅
                                    coinAssetChange = Number(list[index].available)*(Number(ticker.last)-Number(openAll[list[index].enName.toLowerCase()]))*localStorage.getItem("rate") // 币盈收
                                }
                                this.ZBAssetList.push({
                                    'coin':list[index].enName,
                                    'coinAvailable':coinAvailable,
                                    'coinAsset':coinAsset,
                                    'coinAmount':coinAmount,
                                    'coinChangePercentage':coinChangePercentage,
                                    'coinAssetChange':coinAssetChange,
                                    'ZBAsset':ZBAsset,
                                    'ZBAssetAvailable':this.ZBAssetAvailable
                                })
                                
                                if(Number(list[index].freez)>0){
                                        // console.log('可用冻结都不为0');
                                        // console.log(this.ZBAsset);
                                        
                                        ZBAsset+=Number(list[index].freez)*ratio*localStorage.getItem("rate") // 总冻结
                                        this.ZBAssetList[this.ZBAssetList.length-1].coinFreezed = Number(list[index].freez)*ratio*localStorage.getItem("rate")
                                        this.ZBAssetList[this.ZBAssetList.length-1].coinAmount+= Number(list[index].freez)
                                        this.ZBAssetList[this.ZBAssetList.length-1].coinAsset+= Number(list[index].freez)*ratio*localStorage.getItem("rate")
                                        this.ZBAssetList[this.ZBAssetList.length-1].ZBAsset = ZBAsset
                                }else if(Number(list[index].freez) == 0){
                                        // console.log('可用不为0冻结为0');
                                        this.ZBAssetList[this.ZBAssetList.length-1].coinFreezed = 0
                                }
                                // console.log(this.ZBAssetList);
                                this.ZBAsset = ZBAsset
                                this.$store.commit('setZBAssetList',this.ZBAssetList) 
                                ratio = null
                                coinAvailable = null
                                coinAsset = null
                                coinAmount = null
                                coinChangePercentage = null
                                coinAssetChange = null
                            })
                        }
                        if(Number(list[index].freez)>0){
                            if(Number(list[index].available)==0){
                                console.log('可用为0冻结不为0');
                                if(list[index].enName == 'USDT'){
                                    let ratio = 1// 币种对美元的最新汇率
                                    ZBAsset+=Number(list[index].freez)*ratio*localStorage.getItem("rate") // 加冻结
                                    let coinFreezed = Number(list[index].freez)*ratio*localStorage.getItem("rate") // 币冻结资产
                                    let coinAmount = Number(list[index].freez) // 币数量
                                    let coinChangePercentage = 0.00 +'%' // 币涨跌幅
                                    this.ZBAssetList.push({
                                        'coin':list[index].enName,
                                        'coinAvailable':0,
                                        'coinAsset':coinFreezed,
                                        'coinAmount':coinAmount,
                                        'coinChangePercentage':coinChangePercentage,
                                        'coinAssetChange':0,
                                        'coinFreezed':coinFreezed,
                                        'ZBAsset':ZBAsset,
                                        'ZBAssetAvailable':this.ZBAssetAvailable
                                    })
                                    this.ZBAsset = ZBAsset
                                    this.$store.commit('setZBAssetList',this.ZBAssetList)
                                }else {
                                    console.log(list[index].enName);
                                    
                                    let url2 = `http://chaobi.lian2345.com/api/chaobi/deal/zb/ticker/5464646466456165464646464?symbol=${
                                        list[index].enName
                                    }usdt`
                                    this.$axios.post(url2).then(res=>{
                                        let ticker = JSON.parse(res.data.list).ticker
                                        let ratio = Number(ticker.last)
                                        ZBAsset+=Number(list[index].freez)*ratio*localStorage.getItem("rate") // 总冻结

                                        let coinFreezed = Number(list[index].freez)*ratio*localStorage.getItem("rate") // 币冻结资产
                                        let coinAmount = Number(list[index].freez) // 币数量
                                        let coinChangePercentage = ((Number(ticker.last)-Number(openAll[list[index].enName.toLowerCase()]))*100/Number(openAll[list[index].enName.toLowerCase()])).toFixed(2)+'%' // 币涨跌幅
                                        this.ZBAssetList.push({
                                            'coin':list[index].enName,
                                            'coinAvailable':0,
                                            'coinAsset':coinFreezed,
                                            'coinAmount':coinAmount,
                                            'coinChangePercentage':coinChangePercentage,
                                            'coinAssetChange':0,
                                            'coinFreezed':coinFreezed,
                                            'ZBAsset':ZBAsset,
                                            'ZBAssetAvailable':this.ZBAssetAvailable
                                        })
                                        this.ZBAsset = ZBAsset
                                        this.$store.commit('setZBAssetList',this.ZBAssetList)
                                    })
                                }
                            }
                        }
                        
                    } 
                })
            })

        }
    },
    beforeDestroy(){
        clearInterval(this.countime)
    }

};
</script>

<style scoped>
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
    /* display: flex;
    justify-content: center; */
    width: 25%;
    height: 1.6rem;
    /* line-height: 1.6rem; */
    color: #999;
    font-size: 0.38rem;
    text-align: center;
    position: relative;
}
.aboutfooter >div >div {
    width: 0.6rem;
    height: 0.6rem;
    margin-top:0.3rem auto 0.1rem;
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
    /* position: absolute;
    top: 0.4rem; */
}
.myAuthorization {
    height: calc(100vh);
    overflow: auto;
}
.myAuthorization header {
    top: 0;
    position: fixed;
    /* display: flex; */
    text-align: center;
    /* justify-content: space-between;
    align-content: center; */
    width: 100%;
    height: 1.6rem;
    line-height: 1.6rem;
    background-color: #f4f7f9;
    box-shadow: 0 0 3px #ddd;
    z-index: 999;
}
.myAuthorization header > span {
    font-weight: bold;
    font-size: 0.52rem;
}
.myAuthorization .user {
    margin-left: 4%;
}
.myAuthorization .user span {
    font-size: 18px;
    color: #374452;
}

.myAuthorization .search-box {
    margin-right: 4%;
}
.myAuthorization .search-box i {
    font-size: 20px;
    color: #f4f7f9;
}
.user-bar-1 {
    height: 1.6rem;
    width: 100px;
}
.user-bar {
    /* margin-top: 1.6rem; */
    position: relative;
    height: 4.71rem;
}
.user-bar > div {
    color: #fff;
    position: relative;
    z-index: 1;
    height: 2.67rem;
    font-size: 0.42rem;
}
.user-bar > div .left {
    position: absolute;
    left: 0.4rem;
    top: 0.6rem;
}
.user-bar > div .right {
    position: absolute;
    top: 0.6rem;
    right: 0.4rem;
}
.user-bar > div:after {
    content: " ";
    position: absolute;
    /* left: -5%; */
    bottom: -1.3rem;
    z-index: -2;
    width: 100%;
    height: 4rem;
    background: linear-gradient(#45ad35, #42c300); /* 标准的语法 */
}
.user-bar > p.money {
    justify-content: center;
    align-items: center;
    display: flex;
    width: 100%;
    height: 2rem;
    background: linear-gradient(#45ad35, #42c300);
    margin-top: 1.3rem;
}
.user-bar > p.money span {
    width: 50%;
    display: block;
    text-align: center;
    color: #fff;
    font-size: 0.42rem;
}
.user-icon {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    position: absolute;
    top: 0.92rem;
    left: 50%;
    transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0); /* IE 9 */
    -moz-transform: translate(-50%, 0); /* Firefox */
    -webkit-transform: translate(-50%, 0); /* Safari 和 Chrome */
    -o-transform: translate(-50%, 0); /* Opera */
}
.user-phone-number {
    font-size: 0.42rem;
    font-family: PingFangSC-Light;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    position: absolute;
    bottom: 0.8rem;
    left: 50%;
    transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0); /* IE 9 */
    -moz-transform: translate(-50%, 0); /* Firefox */
    -webkit-transform: translate(-50%, 0); /* Safari 和 Chrome */
    -o-transform: translate(-50%, 0); /* Opera */
}
.user-phone-number span.num {
    position: absolute;
    left: -0.4rem;
    top: 0.9rem;
}
.user-phone-number span.num i {
    position: absolute;
    font-size: 0.6rem;
    left: 0.4rem;
    top: -0.2rem;
}
.myAuthorization main {
    width: 100%;
    margin-top: 12%;
    /* background-color: #e6edf0; */
    
}
.myAuthorization main .usertion {
    width: 100%;
    height: 0.8rem;
    font-size: 0.38rem;
    line-height: 0.8rem;
    color: #a6afba;
    padding-left: 0.4rem;
    box-sizing: border-box;
}
.myAuthorization main .content .contentList {
    display: flex;
    justify-content: space-between;
    height: 2.5rem;
    background-color: #fff;
    width: 100%;
    margin-bottom: 0.4rem;
}
.myAuthorization main .content .contentList div {
    width: 50%;
    display: flex;
    flex-flow: column;
    align-self: center;
}
.myAuthorization main .content .contentList div.left p {
    text-align: left;
    padding-left: 0.4rem;
    box-sizing: border-box;
    font-size: 0.46rem;
}
.myAuthorization main .content .contentList div.left p.bourse {
    color: #374452;
}
.myAuthorization main .content .contentList div.left p.price {
    color: #a6afba;
    margin-top: 6%;
    background-color: #fff;
}
.myAuthorization main .content .contentList div.right {
    padding-right: 0.4rem;
    align-items: flex-end;
    box-sizing: border-box;
}
.myAuthorization main .content .contentList div.right p {
    width: 2.2rem;
    box-sizing: border-box;
    font-size: 0.44rem;
}
.myAuthorization main .content .contentList div.right p.momey {
    color: #48c122;
    text-align: center;
}
.myAuthorization main .content .contentList div.right p.proportion {
    background-color: #42c300;
    color: #fff;
    height: 0.8rem;
    text-align: center;
    line-height: 0.8rem;
    border-radius: 0.4rem;
    margin-top: 6%;
}
.myAuthorization main .add {
    margin-bottom: 2rem;
    padding: .7rem 0;
    text-align: center;
    color: #48c122;
    font-size: 0.42rem;
}
.myAuthorization main .add img {
    max-width: 15%;
    margin-bottom: 0.3rem;
}
</style>