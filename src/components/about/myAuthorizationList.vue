<template>
    <div class="myAuthorizationList">
        <header>
            <div @click="clickUser" class="user">
                <span class="iconfont icon-fanhui"></span>
            </div>
            <span>{{Bourse}}</span>
            <div class="search-box">
                <i class="iconfont icon-sousuo"></i>
            </div>
        </header>
        <div class="user-bar">
            <div>
                <span class="left">资产统计</span>
                <!-- <span class="right">{{time}} s</span> -->
                <p class="user-phone-number">
                    <span class="total">总资产(￥)</span>
                    <span class="num">≈
                        <i>{{asset.toFixed(3)}}</i>
                    </span>
                </p>
            </div>
            <p class="money">
                <span class="moneyLeft">可用(￥)
                    <br>
                    <i>{{AssetAvailable.toFixed(2)}}</i>
                </span>
                <span class="moneyLeft">冻结(￥)
                    <br>
                    <i>{{AssetFreezed.toFixed(2)}}</i>
                </span>
            </p>
        </div>
        <main>
            <p class='usertion'>授权交易</p>
            <div class="content" v-for="(item,i) in bidata" :key="i">
                <div class="contentList">
                    <div class="left">
                        <p class="bourse">{{item.coin}}</p>
                        <p class="price">可用{{item.coinAvailable.toFixed(2)}}</p>
                        <p class="price">冻结{{item.coinFreezed.toFixed(2)}}</p>
                    </div>
                    <div class="left">
                        <p class="bourse">￥{{item.coinAsset.toFixed(2)}}</p>
                        <p class="price">总数量{{item.coinAmount.toFixed(6)}}</p>
                    </div>
                    <div class="right">
                        <p v-if="(item.coinChangePercentage).toString().indexOf('-')>-1" style="color:#F43E3A" class="momey">￥{{item.coinAssetChange.toFixed(2)}}</p>
                        <p v-if="(item.coinChangePercentage).toString().indexOf('-')==-1" style="color:#42c300" class="momey">￥+{{item.coinAssetChange.toFixed(2)}}</p>
                        <p v-if="(item.coinChangePercentage).toString().indexOf('-')>-1" style="background-color:#F43E3A" class="proportion">{{item.coinChangePercentage}}</p>
                        <p v-if="(item.coinChangePercentage).toString().indexOf('-')==-1" style="background-color:#42c300" class="proportion">+{{item.coinChangePercentage}}</p>
                    </div>
                </div>
            </div>
            <div @click="goauthorize" class="add">+授权交易所</div>
        </main>
    </div>
</template>
<script>
import { encryptKey, MD5 ,decryptByKey} from '../../lib/js/crypto.js'
import { urljm } from "../../lib/js/jsmi.js";
const kplsign = require("../../lib/js/sign/KplSign.js");
var http = require("http");
var querystring = require("querystring");
export default {
    name: "myAuthorizationList",
    data() {
        return {
            argsdata: {},
            user: {},
            urldata: {},
            usdt: [],
            sumMoney: 0, //火币总资产
            sumMoneyTrade: 0, //火币可用资产
            sumMoneyFronze: 0, //火币冻结资产
            huobiList: [],
            Arry: [],
            array: [],
            rate: 0,
            // arrdata: [],
            huobiRatio:0,
            time:30,
            countime:null,
            bidata:[],
            usdtDate:[],
            Bourse:'',
            asset:0,
            AssetAvailable:0,
            AssetFreezed:0,
        };
    },
    created() {
        this.Bourse = this.$route.query.Bourse
    },
    mounted() {
        if(this.Bourse == '火币全球站'){
            // this.gethuobi();
            this.bidata = this.$store.state.HuobiAssetList || []
            this.asset = this.bidata[this.bidata.length-1].huobiAsset || 0
            this.AssetAvailable = this.bidata[this.bidata.length-1].huobiAssetAvailable || 0
            this.AssetFreezed = this.asset - this.AssetAvailable
        }else if(this.Bourse == 'OKEX'){
            this.bidata = this.$store.state.OkexAssetList || []
            this.asset = this.bidata[this.bidata.length-1].OkexAsset || 0
            this.AssetAvailable = this.bidata[this.bidata.length-1].OkexAssetAvailable || 0
            this.AssetFreezed = this.asset - this.AssetAvailable
            
        }else if(this.Bourse == '币安'){
            this.bidata = this.$store.state.BianAssetList || []
            this.asset = this.bidata[this.bidata.length-1].bianAsset || 0
            this.AssetAvailable = this.bidata[this.bidata.length-1].bianAssetAvailable || 0
            this.AssetFreezed = this.asset - this.AssetAvailable
            
        }else if(this.Bourse == 'ZB'){
            this.bidata = this.$store.state.ZBAssetList || []
            this.asset = this.bidata[this.bidata.length-1].ZBAsset || 0
            this.AssetAvailable = this.bidata[this.bidata.length-1].ZBAssetAvailable || 0
            this.AssetFreezed = this.asset - this.AssetAvailable
            
        }
        console.log(this.bidata);
        this.countDown()
    },
    methods: {
        clickUser() {
            this.$router.go(-1);
        },
        goauthorize() {           
            this.$router.push({
                path: "/authorize"
            });
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
                        // console.log(huobiOpen);
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
                            let huobiAssetAvailable= 0; //huobi总可用资产
                            let huobiAssetList=[]; //huobi有资产币种列表
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
                                            huobiAssetAvailable+=Number(huobiAvailable[key])*ratio*localStorage.getItem("rate")  // 总可用
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
                                            huobiAssetAvailable+=Number(huobiAvailable[key])*ratio*localStorage.getItem("rate")  // 总可用
                                            coinAvailable = Number(huobiAvailable[key])*ratio*localStorage.getItem("rate") // 币可用
                                            coinAsset = Number(huobiAvailable[key])*ratio*localStorage.getItem("rate") // 币资产
                                            coinAmount = Number(huobiAvailable[key]) // 币数量
                                            coinChangePercentage = (Number(ticker.close)-Number(ticker.open))*100/Number(ticker.open) // 币涨跌幅
                                            coinAssetChange = Number(huobiAvailable[key])*(Number(ticker.close)-Number(ticker.open))*localStorage.getItem("rate") // 币盈收
                                            
                                            
                                        }
                                        huobiAssetList.push({
                                            'coin':key,
                                            'coinAvailable':coinAvailable,
                                            'coinAsset':coinAsset,
                                            'coinAmount':coinAmount,
                                            'coinChangePercentage':coinChangePercentage.toFixed(2)+'%',
                                            'coinAssetChange':coinAssetChange,
                                            'huobiAsset':huobiAsset,
                                            'huobiAssetAvailable':huobiAssetAvailable
                                        })
                                        if(Number(huobiFreezed[key])>0){
                                            console.log('可用冻结都不为0');
                                            huobiAsset+= Number(huobiFreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                            huobiAssetList[huobiAssetList.length-1].coinFreezed = Number(huobiFreezed[key])*ratio*localStorage.getItem("rate")
                                            huobiAssetList[huobiAssetList.length-1].coinAmount+= Number(huobiFreezed[key])
                                            huobiAssetList[huobiAssetList.length-1].coinAsset+= Number(huobiFreezed[key])*ratio*localStorage.getItem("rate")
                                            huobiAssetList[huobiAssetList.length-1].huobiAsset = huobiAsset
                                        }else if(Number(huobiFreezed[key]) == 0){
                                            console.log('可用不为0冻结为0');
                                            huobiAssetList[huobiAssetList.length-1].coinFreezed = 0
                                        }  
                                        _this.bidata.forEach((item,i)=>{
                                            for (let index = 0; index < huobiAssetList.length; index++) {
                                                if(item.coin == huobiAssetList[index].coin){
                                                    _this.bidata[i] = huobiAssetList[index]
                                                }
                                            }
                                        })
                                        _this.asset = huobiAssetList[huobiAssetList.length-1].huobiAsset || 0
                                        _this.AssetAvailable = huobiAssetList[huobiAssetList.length-1].huobiAssetAvailable || 0
                                        _this.AssetFreezed = _this.asset - _this.AssetAvailable
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
                                        if(key == 'usdt'){
                                            let ratio = 1
                                            huobiAsset+=Number(huobiFreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                            let coinFreezed = Number(huobiFreezed[key])*ratio*localStorage.getItem("rate") // 币冻结资产
                                            let coinAmount = Number(huobiFreezed[key]) // 币数量
                                            let coinChangePercentage = 0 // 币涨跌幅
                                            huobiAssetList.push({
                                                'coin':key,
                                                'coinAvailable':0,
                                                'coinAsset':coinFreezed,
                                                'coinAmount':coinAmount,
                                                'coinChangePercentage':coinChangePercentage.toFixed(2)+'%',
                                                'coinAssetChange':0,
                                                'coinFreezed':coinFreezed,
                                                'huobiAsset':huobiAsset,
                                                'huobiAssetAvailable':huobiAssetAvailable
                                            })
                                            _this.bidata.forEach((item,i)=>{
                                            for (let index = 0; index < huobiAssetList.length; index++) {
                                                    if(item.coin == huobiAssetList[index].coin){
                                                        _this.bidata[i] = huobiAssetList[index]
                                                    }
                                                }
                                            })
                                            _this.asset = huobiAssetList[huobiAssetList.length-1].huobiAsset || 0
                                            _this.AssetAvailable = huobiAssetList[huobiAssetList.length-1].huobiAssetAvailable || 0
                                            _this.AssetFreezed = _this.asset - _this.AssetAvailable
                                        }else{
                                                let ticker = huobiPriceList1[key]
                                                let ratio = Number(ticker.close)
                                                huobiAsset+=Number(huobiFreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                                let coinFreezed = Number(huobiFreezed[key])*ratio*localStorage.getItem("rate") // 币冻结资产
                                                let coinAmount = Number(huobiFreezed[key]) // 币数量
                                                let coinChangePercentage = (Number(ticker.close)-Number(ticker.open))*100/Number(ticker.open) // 币涨跌幅
                                                huobiAssetList.push({
                                                    'coin':key,
                                                    'coinAvailable':0,
                                                    'coinAsset':coinFreezed,
                                                    'coinAmount':coinAmount,
                                                    'coinChangePercentage':coinChangePercentage.toFixed(2)+'%',
                                                    'coinAssetChange':0,
                                                    'coinFreezed':coinFreezed,
                                                    'huobiAsset':huobiAsset,
                                                    'huobiAssetAvailable':huobiAssetAvailable
                                                })
                                                _this.bidata.forEach((item,i)=>{
                                                    for (let index = 0; index < huobiAssetList.length; index++) {
                                                        if(item.coin == huobiAssetList[index].coin){
                                                            _this.bidata[i] = huobiAssetList[index]
                                                        }
                                                    }
                                                })
                                                _this.asset = huobiAssetList[huobiAssetList.length-1].huobiAsset || 0
                                                _this.AssetAvailable = huobiAssetList[huobiAssetList.length-1].huobiAssetAvailable || 0
                                                _this.AssetFreezed = _this.asset - _this.AssetAvailable
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
                let OkexAsset = 0
                let OkexAssetAvailable= 0; //OKEx总可用资产
                let OkexAssetList=[]; //OKEx有资产币种列表
                for (const key in okeyfree) {
                    if(Number(okeyfree[key])>0){
                        let url1 = `http://chaobi.lian2345.com/api/chaobi/deal/oken/tickerNew/5464646466456165464646464?symbol=${key}_usdt`;
                        this.$axios.post(url1).then(res=>{
                            let ratio;
                            let coinAvailable;
                            let coinAsset;
                            let coinAmount;
                            let coinChangePercentage;
                            let coinAssetChange;
                            if(key == 'usdt'){
                                ratio = 1
                                OkexAsset+=Number(okeyfree[key])*ratio*localStorage.getItem("rate")  // 总资产
                                OkexAssetAvailable+=Number(okeyfree[key])*ratio*localStorage.getItem("rate")  // 总可用
                                coinAvailable = Number(okeyfree[key])*ratio*localStorage.getItem("rate") // 币可用
                                coinAsset = Number(okeyfree[key])*ratio*localStorage.getItem("rate") // 币资产
                                coinAmount = Number(okeyfree[key]) // 币数量
                                coinChangePercentage = 0 // 币涨跌幅
                                coinAssetChange = 0
                            }else{

                                let ticker = JSON.parse(res.data.list).data[0]
                                ratio = Number(ticker.close) // 币种对美元的最新汇率
                                OkexAsset+=Number(okeyfree[key])*ratio*localStorage.getItem("rate")  // 总资产
                                OkexAssetAvailable+=Number(okeyfree[key])*ratio*localStorage.getItem("rate")  // 总可用
                                coinAvailable = Number(okeyfree[key])*ratio*localStorage.getItem("rate") // 币可用
                                coinAsset = Number(okeyfree[key])*ratio*localStorage.getItem("rate") // 币资产
                                coinAmount = Number(okeyfree[key]) // 币数量
                                coinChangePercentage = ticker.changePercentage.indexOf('+')==-1?ticker.changePercentage:ticker.changePercentage.split('+')[1] // 币涨跌幅
                                coinAssetChange = Number(okeyfree[key])*(Number(ticker.close)-Number(ticker.open))*localStorage.getItem("rate") // 币盈收
                            }
                            OkexAssetList.push({
                                'coin':key,
                                'coinAvailable':coinAvailable,
                                'coinAsset':coinAsset,
                                'coinAmount':coinAmount,
                                'coinChangePercentage':coinChangePercentage,
                                'coinAssetChange':coinAssetChange,
                                'OkexAsset':OkexAsset,
                                'OkexAssetAvailable':OkexAssetAvailable
                            })
                            if(Number(okeyfreezed[key])>0){
                                console.log('可用冻结都不为0');
                                OkexAsset+= Number(okeyfreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                OkexAssetList[OkexAssetList.length-1].coinFreezed = Number(okeyfreezed[key])*ratio*localStorage.getItem("rate")
                                OkexAssetList[OkexAssetList.length-1].coinAmount+= Number(okeyfreezed[key])
                                OkexAssetList[OkexAssetList.length-1].coinAsset+= Number(okeyfreezed[key])*ratio*localStorage.getItem("rate")
                                OkexAssetList[OkexAssetList.length-1].OkexAsset = OkexAsset
                            }else if(Number(okeyfreezed[key]) == 0){
                                console.log('可用不为0冻结为0');
                                OkexAssetList[OkexAssetList.length-1].coinFreezed = 0
                            }  
                            // this.bidata = OkexAssetList || []
                            this.bidata.forEach((item,i)=>{
                                for (let index = 0; index < OkexAssetList.length; index++) {
                                    if(item.coin == OkexAssetList[index].coin){
                                        this.bidata[i] = OkexAssetList[index]
                                    }
                                }
                            })
                            this.asset = OkexAssetList[OkexAssetList.length-1].OkexAsset || 0
                            this.AssetAvailable = OkexAssetList[OkexAssetList.length-1].OkexAssetAvailable || 0
                            this.AssetFreezed = this.asset - this.AssetAvailable
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
                                OkexAssetList.push({
                                    'coin':key,
                                    'coinAvailable':0,
                                    'coinAsset':coinFreezed,
                                    'coinAmount':coinAmount,
                                    'coinChangePercentage':coinChangePercentage,
                                    'coinAssetChange':0,
                                    'coinFreezed':coinFreezed,
                                    'OkexAsset':OkexAsset,
                                    'OkexAssetAvailable':OkexAssetAvailable
                                })
                                this.bidata.forEach((item,i)=>{
                                    for (let index = 0; index < OkexAssetList.length; index++) {
                                        if(item.coin == OkexAssetList[index].coin){
                                            this.bidata[i] = OkexAssetList[index]
                                        }
                                    }
                                })
                                this.asset = OkexAssetList[OkexAssetList.length-1].OkexAsset || 0
                                this.AssetAvailable = OkexAssetList[OkexAssetList.length-1].OkexAssetAvailable || 0
                                this.AssetFreezed = this.asset - this.AssetAvailable
                            }else{

                                let url1 = `http://chaobi.lian2345.com/api/chaobi/deal/oken/tickerNew/5464646466456165464646464?symbol=${key}_usdt`;
                                this.$axios.post(url1).then(res=>{
                                    let ticker = JSON.parse(res.data.list).data[0]
                                    let ratio = Number(JSON.parse(res.data.list).data[0].close)
                                    OkexAsset+=Number(okeyfreezed[key])*ratio*localStorage.getItem("rate") // 加冻结
                                    let coinFreezed = Number(okeyfreezed[key])*ratio*localStorage.getItem("rate") // 币冻结资产
                                    let coinAmount = Number(okeyfreezed[key]) // 币数量
                                    let coinChangePercentage = ticker.changePercentage.indexOf('+')==-1?ticker.changePercentage:ticker.changePercentage.split('+')[1] // 币涨跌幅
                                    OkexAssetList.push({
                                        'coin':key,
                                        'coinAvailable':0,
                                        'coinAsset':coinFreezed,
                                        'coinAmount':coinAmount,
                                        'coinChangePercentage':coinChangePercentage,
                                        'coinAssetChange':0,
                                        'coinFreezed':coinFreezed,
                                        'OkexAsset':OkexAsset,
                                        'OkexAssetAvailable':OkexAssetAvailable
                                    }) 
                                    this.bidata.forEach((item,i)=>{
                                        for (let index = 0; index < OkexAssetList.length; index++) {
                                            if(item.coin == OkexAssetList[index].coin){
                                                this.bidata[i] = OkexAssetList[index]
                                            }
                                            
                                        }
                                    })
                                    this.asset = OkexAssetList[OkexAssetList.length-1].OkexAsset || 0
                                    this.AssetAvailable = OkexAssetList[OkexAssetList.length-1].OkexAssetAvailable || 0
                                    this.AssetFreezed = this.asset - this.AssetAvailable
                                })
                            }
                        }
                    }
                    
                }
                
                            
            
            })

        },
        //获取Bian总资产和盈亏
        getBian(){
            console.log('bian');
            if (localStorage.getItem("biankey") == null) {
                return;
            }
            
            let biankey = JSON.parse(decryptByKey(localStorage.getItem('biankey')))
            let url = `http://chaobi.lian2345.com/api/chaobi/deal/binance/balances/dfdsafadf?apikey=${urljm(biankey.apikey)}&secret=${urljm(biankey.secretkey)}`;
            
            this.$axios.post(url).then(res => {
                let list = JSON.parse(res.data.list.data)
                let bianAsset= 0; //bian总资产
                let bianAssetAvailable= 0; //bian总可用资产
                let bianAssetList=[]; //bian有资产币种列表
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
                                bianAsset+=Number(list[index].free)*ratio*localStorage.getItem("rate")  // 总资金
                                bianAssetAvailable+=Number(list[index].free)*ratio*localStorage.getItem("rate")  // 总可用
                                coinAvailable = Number(list[index].free)*ratio*localStorage.getItem("rate") // 币可用
                                coinAsset = Number(list[index].free)*ratio*localStorage.getItem("rate") // 币资产
                                coinAmount = Number(list[index].free) // 币数量
                                coinChangePercentage = 0 // 币涨跌幅
                                coinAssetChange = 0 // 币盈收
                            }else {
                                let ticker = JSON.parse(res.data.list.data)
                                ratio = Number(ticker.lastPrice) // 币种对美元的最新汇率
                                bianAsset+=Number(list[index].free)*ratio*localStorage.getItem("rate")  // 总资金
                                bianAssetAvailable+=Number(list[index].free)*ratio*localStorage.getItem("rate")  // 总可用
                                coinAvailable = Number(list[index].free)*ratio*localStorage.getItem("rate") // 币可用
                                coinAsset = Number(list[index].free)*ratio*localStorage.getItem("rate") // 币资产
                                coinAmount = Number(list[index].free) // 币数量
                                coinChangePercentage = ticker.priceChangePercent +'%' // 币涨跌幅
                                coinAssetChange = Number(list[index].free)*(Number(ticker.lastPrice)-Number(ticker.openPrice))*localStorage.getItem("rate") // 币盈收
                            }
                            bianAssetList.push({
                                'coin':list[index].asset,
                                'coinAvailable':coinAvailable,
                                'coinAsset':coinAsset,
                                'coinAmount':coinAmount,
                                'coinChangePercentage':coinChangePercentage,
                                'coinAssetChange':coinAssetChange,
                                'bianAsset':bianAsset,
                                'bianAssetAvailable':bianAssetAvailable
                            })
                            if(Number(list[index].locked)>0){
                                    // console.log('可用不为0冻结为0');
                                    bianAsset+=Number(list[index].locked)*ratio*localStorage.getItem("rate") // 总冻结
                                    bianAssetList[bianAssetList.length-1].coinFreezed = Number(list[index].locked)*ratio*localStorage.getItem("rate")
                                    bianAssetList[bianAssetList.length-1].coinAmount+= Number(list[index].locked)
                                    bianAssetList[bianAssetList.length-1].coinAsset+= Number(list[index].locked)*ratio*localStorage.getItem("rate")
                                    bianAssetList[bianAssetList.length-1].bianAsset = bianAsset
                            }else if(Number(list[index].locked) == 0){
                                    // console.log('可用不为0冻结为0');
                                    bianAssetList[bianAssetList.length-1].coinFreezed = 0
                            } 
                            // this.bidata = bianAssetList || []
                            this.bidata.forEach((item,i)=>{
                                for (let index = 0; index < bianAssetList.length; index++) {
                                    if(item.coin == bianAssetList[index].coin){
                                        this.bidata[i] = bianAssetList[index]
                                    }
                                    
                                }
                            })
                            this.asset = bianAssetList[bianAssetList.length-1].bianAsset || 0
                            this.AssetAvailable = bianAssetList[bianAssetList.length-1].bianAssetAvailable || 0
                            this.AssetFreezed = this.asset - this.AssetAvailable
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
                                bianAssetList.push({
                                    'coin':list[index].asset,
                                    'coinAvailable':0,
                                    'coinAsset':coinFreezed,
                                    'coinAmount':coinAmount,
                                    'coinChangePercentage':coinChangePercentage,
                                    'coinAssetChange':0,
                                    'coinFreezed':coinFreezed,
                                    'bianAsset':bianAsset,
                                    'bianAssetAvailable':bianAssetAvailable
                                })
                                this.bidata.forEach((item,i)=>{
                                    for (let index = 0; index < bianAssetList.length; index++) {
                                        if(item.coin == bianAssetList[index].coin){
                                            this.bidata[i] = bianAssetList[index]
                                        }
                                        
                                    }
                                })
                                this.asset = bianAssetList[bianAssetList.length-1].bianAsset || 0
                                this.AssetAvailable = bianAssetList[bianAssetList.length-1].bianAssetAvailable || 0
                                this.AssetFreezed = this.asset - this.AssetAvailable
                            }else {
                                // console.log('进来了');
                                
                                let url2 = `http://chaobi.lian2345.com/api/chaobi/deal/binance/ticker24hr/dfdsafadf?apikey=${
                                biankey.apikey
                                }&secret=${biankey.secretkey}&symbol=${list[index].asset}USDT`;
                                this.$axios.post(url2).then(res=>{
                                    let ticker = JSON.parse(res.data.list.data)
                                    let ratio = Number(ticker.lastPrice) // 币种对美元的最新汇率
                                    bianAsset+=Number(list[index].locked)*ratio*localStorage.getItem("rate") // 加冻结
                                    let coinFreezed = Number(list[index].locked)*ratio*localStorage.getItem("rate") // 币冻结资产
                                    let coinAmount = Number(list[index].locked) // 币数量
                                    let coinChangePercentage = ticker.priceChangePercent +'%' // 币涨跌幅
                                    bianAssetList.push({
                                        'coin':list[index].asset,
                                        'coinAvailable':0,
                                        'coinAsset':coinFreezed,
                                        'coinAmount':coinAmount,
                                        'coinChangePercentage':coinChangePercentage,
                                        'coinAssetChange':0,
                                        'coinFreezed':coinFreezed,
                                        'bianAsset':bianAsset,
                                        'bianAssetAvailable':bianAssetAvailable
                                    })
                                    this.bidata.forEach((item,i)=>{
                                        for (let index = 0; index < bianAssetList.length; index++) {
                                            if(item.coin == bianAssetList[index].coin){
                                                this.bidata[i] = bianAssetList[index]
                                            }
                                        }
                                    })
                                    this.asset = bianAssetList[bianAssetList.length-1].bianAsset || 0
                                    this.AssetAvailable = bianAssetList[bianAssetList.length-1].bianAssetAvailable || 0
                                    this.AssetFreezed = this.asset - this.AssetAvailable
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
                let url = `http://chaobi.lian2345.com/api/chaobi/deal/zb/getAccountInfo/${urljm(ZBkey.num)}?apikey=${urljm(ZBkey.apikey)}&secret=${
                    ZBkey.secretkey
                }&method=getAccountInfo`;
                this.$axios.post(url).then(res => {
                    let list = JSON.parse(res.data.list).result.coins
                    let ZBAsset= 0;
                    let ZBAssetAvailable= 0; //ZB总可用资产
                    let ZBAssetList=[]; //ZB有资产币种列表
                    for (let index = 0; index < list.length; index++) {
                        if(Number(list[index].available)>0){
                            let url2 = `http://chaobi.lian2345.com/api/chaobi/deal/zb/ticker/5464646466456165464646464?symbol=${
                                list[index].enName
                            }usdt`
                            this.$axios.post(url2).then(res=>{
                                let ratio;
                                let coinAvailable;
                                let coinAsset;
                                let coinAmount;
                                let coinChangePercentage;
                                let coinAssetChange;
                                if(list[index].enName == 'USDT'){
                                    ratio = 1
                                    ZBAsset+=Number(list[index].available)*ratio*localStorage.getItem("rate")  // 总资金
                                    ZBAssetAvailable+=Number(list[index].available)*ratio*localStorage.getItem("rate")  // 总可用
                                    coinAvailable = Number(list[index].available)*ratio*localStorage.getItem("rate") // 币可用
                                    coinAsset = Number(list[index].available)*ratio*localStorage.getItem("rate") // 币资产
                                    coinAmount = Number(list[index].available) // 币数量
                                    coinChangePercentage = 0.00+'%' // 币涨跌幅
                                    coinAssetChange = 0 // 币盈收
                                }else{

                                    let ticker = JSON.parse(res.data.list).ticker
                                    ratio = Number(ticker.last) // 币种对美元的最新汇率
                                    ZBAsset+=Number(list[index].available)*ratio*localStorage.getItem("rate")  // 总可用
                                    ZBAssetAvailable+=Number(list[index].available)*ratio*localStorage.getItem("rate")  // 总可用
                                    coinAvailable = Number(list[index].available)*ratio*localStorage.getItem("rate") // 币可用
                                    coinAsset = Number(list[index].available)*ratio*localStorage.getItem("rate") // 币资产
                                    coinAmount = Number(list[index].available) // 币数量
                                    coinChangePercentage = ((Number(ticker.last)-Number(openAll[list[index].enName.toLowerCase()]))*100/Number(openAll[list[index].enName.toLowerCase()])).toFixed(2)+'%' // 币涨跌幅
                                    coinAssetChange = Number(list[index].available)*(Number(ticker.last)-Number(openAll[list[index].enName.toLowerCase()]))*localStorage.getItem("rate") // 币盈收
                                }
                                ZBAssetList.push({
                                    'coin':list[index].enName,
                                    'coinAvailable':coinAvailable,
                                    'coinAsset':coinAsset,
                                    'coinAmount':coinAmount,
                                    'coinChangePercentage':coinChangePercentage,
                                    'coinAssetChange':coinAssetChange,
                                    'ZBAsset':ZBAsset,
                                    'ZBAssetAvailable':ZBAssetAvailable
                                })
                                
                                if(Number(list[index].freez)>0){
                                        ZBAsset+=Number(list[index].freez)*ratio*localStorage.getItem("rate") // 总冻结
                                        ZBAssetList[ZBAssetList.length-1].coinFreezed = Number(list[index].freez)*ratio*localStorage.getItem("rate")
                                        ZBAssetList[ZBAssetList.length-1].coinAmount+= Number(list[index].freez)
                                        ZBAssetList[ZBAssetList.length-1].coinAsset+= Number(list[index].freez)*ratio*localStorage.getItem("rate")
                                        ZBAssetList[ZBAssetList.length-1].ZBAsset = ZBAsset
                                }else if(Number(list[index].freez) == 0){
                                        // console.log('可用不为0冻结为0');
                                        ZBAssetList[ZBAssetList.length-1].coinFreezed = 0
                                }
                                // this.bidata = ZBAssetList || []
                                this.bidata.forEach((item,i)=>{
                                    for (let index = 0; index < ZBAssetList.length; index++) {
                                        if(item.coin == ZBAssetList[index].coin){
                                            this.bidata[i] = ZBAssetList[index]
                                        }
                                        
                                    }
                                })
                                this.asset = ZBAssetList[ZBAssetList.length-1].ZBAsset || 0
                                this.AssetAvailable = ZBAssetList[ZBAssetList.length-1].ZBAssetAvailable || 0
                                this.AssetFreezed = this.asset - this.AssetAvailable
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
                                    ZBAssetList.push({
                                        'coin':list[index].enName,
                                        'coinAvailable':0,
                                        'coinAsset':coinFreezed,
                                        'coinAmount':coinAmount,
                                        'coinChangePercentage':coinChangePercentage,
                                        'coinAssetChange':0,
                                        'coinFreezed':coinFreezed,
                                        'ZBAsset':ZBAsset,
                                        'ZBAssetAvailable':ZBAssetAvailable
                                    })
                                    this.bidata.forEach((item,i)=>{
                                    for (let index = 0; index < ZBAssetList.length; index++) {
                                            if(item.coin == ZBAssetList[index].coin){
                                                this.bidata[i] = ZBAssetList[index]
                                            }
                                            
                                        }
                                    })
                                    this.asset = ZBAssetList[ZBAssetList.length-1].ZBAsset || 0
                                    this.AssetAvailable = ZBAssetList[ZBAssetList.length-1].ZBAssetAvailable || 0
                                    this.AssetFreezed = this.asset - this.AssetAvailable
                                }else {
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
                                        ZBAssetList.push({
                                            'coin':list[index].enName,
                                            'coinAvailable':0,
                                            'coinAsset':coinFreezed,
                                            'coinAmount':coinAmount,
                                            'coinChangePercentage':coinChangePercentage,
                                            'coinAssetChange':0,
                                            'coinFreezed':coinFreezed,
                                            'ZBAsset':ZBAsset,
                                            'ZBAssetAvailable':ZBAssetAvailable
                                        })
                                        this.bidata.forEach((item,i)=>{
                                            for (let index = 0; index < ZBAssetList.length; index++) {
                                                if(item.coin == ZBAssetList[index].coin){
                                                    this.bidata[i] = ZBAssetList[index]
                                                }
                                                
                                            }
                                        })
                                        this.asset = ZBAssetList[ZBAssetList.length-1].ZBAsset || 0
                                        this.AssetAvailable = ZBAssetList[ZBAssetList.length-1].ZBAssetAvailable || 0
                                        this.AssetFreezed = this.asset - this.AssetAvailable
                                    })
                                }
                            }
                        }
                        
                    } 
                })
            })

        },
        //倒计时
        countDown(){
            let _this=this
            _this.countime= setInterval(function () {
                _this.time--
                // console.log(_this.time);
                
                if (_this.time==-1) {
                    if(_this.Bourse == '火币全球站'){
                        _this.getHuobi()
                    }else if(_this.Bourse == 'OKEX'){
                        _this.getOkex()
                    }else if(_this.Bourse == '币安'){
                        _this.getBian()
                    }else if(_this.Bourse == 'ZB'){
                        _this.getZb()
                    }
                    _this.time=30
                }
            },1000)
        }
    },
    beforeDestroy(){
        clearInterval(this.countime); 
    }
};
</script>

<style scoped>
.myAuthorizationList {
   height: calc(100vh);
    overflow: auto;
}
.myAuthorizationList header {
    position: fixed;
    top: 0;
    /* padding-top: 0.72rem; */
    display: flex;
    text-align: center;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    height: 1.6rem;
    line-height: 1.6rem;
    background-color: #f4f7f9;
    box-shadow: 0 0 3px #ddd;
    z-index: 999;
}
.myAuthorizationList header > span {
    font-weight: bold;
    font-size: 0.52rem;
}
.myAuthorizationList .user {
    margin-left: 4%;
}
.myAuthorizationList .user span {
    font-size: 18px;
    color: #374452;
}

.myAuthorizationList .search-box {
    margin-right: 4%;
}
.myAuthorizationList .search-box i {
    font-size: 20px;
    color: #f4f7f9;
}
.user-bar {
    position: relative;
    height: 4.71rem;
    margin-top: 1.6rem;
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
.myAuthorizationList main {
    width: 100%;
    margin-top: 12%;
    /* background-color: #e3ebee; */
}
.myAuthorizationList main .usertion {
    width: 100%;
    height: 0.8rem;
    font-size: 0.38rem;
    line-height: 0.8rem;
    color: #a6afba;
    padding-left: 0.4rem;
    box-sizing: border-box;
}
.myAuthorizationList main .content {
    margin-bottom: 2%;
}
.myAuthorizationList main .content .contentList {
    display: flex;
    justify-content: space-between;
    height: 2.5rem;
    background-color: #fff;
    width: 100%;
}
.myAuthorizationList main .content .contentList div {
    width: 50%;
    display: flex;
    flex-flow: column;
    align-self: center;
}
.myAuthorizationList main .content .contentList div.left p {
    text-align: left;
    padding-left: 0.4rem;
    box-sizing: border-box;
    font-size: 0.46rem;
}
.myAuthorizationList main .content .contentList div.left p.bourse {
    color: #374452;
    font-size: 18px;
    margin-bottom: 3%;
}
.myAuthorizationList main .content .contentList div.left p.price {
    color: #a6afba;
    /* margin-top: 6%; */
    background-color: #fff;
    font-size: 13px;
}
.myAuthorizationList main .content .contentList div.right {
    padding-right: 0.4rem;
    align-items: flex-end;
    box-sizing: border-box;
}
.myAuthorizationList main .content .contentList div.right p {
    width: 2.2rem;
    box-sizing: border-box;
    font-size: 0.44rem;
}
.myAuthorizationList main .content .contentList div.right p.momey {
    color: #48c122;
    text-align: center;
}
.myAuthorizationList main .content .contentList div.right p.proportion {
    background-color: #42c300;
    color: #fff;
    height: 0.8rem;
    text-align: center;
    line-height: 0.8rem;
    border-radius: 0.4rem;
    margin-top: 6%;
}
.myAuthorizationList main .add {
    padding: .7rem 0;
    text-align: center;
    margin-bottom: 2rem;
    color: #48c122;
    font-size: 0.46rem;
}
</style>