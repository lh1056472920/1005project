
<template>
    <div class="cbUnsettled">
        <!-- 交易买入卖出页面 -->
        <main>
            <div>
                <div class="mainLeft">
                    <div class="mainLeftNav">
                        <div :style="isFalseone" class="leftCheck" @click="check('leftCheck')">
                            <span :style="isFalse" class="yuan"></span>&emsp;&emsp;限价单
                        </div>
                        <p class="wire"></p>

                        <div :style="isFalseone1" class="leftMarket" @click="check('leftMarket')">
                            <span :style="isFalse1" class="yuan"></span>&emsp;&emsp;市价单</div>
                    </div>
                    <div class="mainInput">
                        <div v-if="isShow==0" class="mainInputct">
                            <p>价格</p>
                            <input type="text" class="price" v-model="priceText" style="text-align:right" @keyup='keydown' ref="input1">
                            <p class="zhuanhuan">≈{{priceText*rate}}CNY</p>
                        </div>
                        <div v-if="isShow==0" class="mainInputct">
                            <p>数量</p>
                            <input type="text" class="price" v-model="numText" style="text-align:right" @keyup='keydown' ref="input2">
                        </div>
                        <div class="mainInputct">
                            <p>金额</p>
                            <input type="text" class="price" v-model="sumText" style="text-align:right">
                            <p class="zhuanhuanone">≈{{sumText*rate}}CNY</p>
                        </div>
                    </div>
                    <div class="cang">
                        <div class="cangone">全仓</div>
                        <div class="cangtwo">半仓</div>
                        <div class="cangthree">1/3仓</div>
                        <div class="cangfour">1/4仓</div>
                    </div>
                    <p class="avail">可用金额: {{Number(usdt).toFixed(3)}} &nbsp;USDT</p>
                    <div class="likeBuyout">立即卖出</div>
                    <div :style="isTrue" class="tu"></div>
                </div>
                <div class="mainRight">
                    <div class="mainrightnav">
                        <span class="left">出价（$）</span>
                        <span class="right">数量</span>
                    </div>
                    <div class="mainrighttop">
                        <ul class="mainrightleft">
                            <li @click="getdata(item[0].toFixed(number))" v-if='i<8&&isShowone==0' v-for="(item,i) in depthBids" :key="i">{{item[0].toFixed(number)}}</li>

                            <li @click="getdata(item[0].toFixed(number))" v-if='isShowone==2&&i<16' v-for="(item,i) in depthBids" :key="i">{{item[0].toFixed(number)}}</li>
                        </ul>
                        <ul class="mainrightright">
                            <li @click="getdata1(item[1].toFixed(number))" v-if='i<8&&isShowone==0' v-for="(item,i) in depthBids" :key="i">{{item[1].toFixed(number)}}</li>
                            <li @click="getdata1(item[1].toFixed(number))" v-if='isShowone==2&&i<16' v-for="(item,i) in depthBids" :key="i">{{item[1].toFixed(number)}}</li>
                        </ul>
                    </div>
                    <p class="price">3.4778</p>
                    <p class="priceone">≈22.7135CNY</p>
                    <div class="mainrightbottom">
                        <ul class="mainrightleft">
                            <li @click="getdata(item[0].toFixed(number))" v-if='i<8&&isShowone==0' v-for="(item,i) in depthAsks" :key="i">{{item[0].toFixed(number)}}</li>
                            <li @click="getdata(item[0].toFixed(number))" v-if='isShowone==1&&i<16' v-for="(item,i) in depthAsks" :key="i">{{item[0].toFixed(number)}}</li>
                        </ul>
                        <ul class="mainrightright">
                            <li @click="getdata1(item[1].toFixed(number))" v-if='i<8&&isShowone==0' v-for="(item,i) in depthAsks" :key="i">{{item[1].toFixed(number)}}</li>
                            <li @click="getdata1(item[1].toFixed(number))" v-if='isShowone==1&&i<16' v-for="(item,i) in depthAsks" :key="i">{{item[1].toFixed(number)}}</li>
                        </ul>
                    </div>
                    <div class="select">
                        <div @click="selectcontent('selectcontent')" class="selectcontent">{{decimalstxt}}
                            <i class="jiantou"></i>
                        </div>
                        <div v-if="isNum==0" class="selectOne">
                            <i class="jian"></i>
                            <p @click="decimals(7)">7位小数</p>
                            <p @click="decimals(6)">6位小数</p>
                            <p @click="decimals(5)">5位小数</p>
                            <p @click="decimals(4)">4位小数</p>
                        </div>
                        <div @click="selectcontent('selectcontenttwo')" class="selectcontenttwo">{{decimalstxt1}}
                            <i class="jiantou"></i>
                        </div>
                        <div v-if="isNum1==0" class="selectTwo">
                            <i class="jian"></i>
                            <p @click="decimals(8)">买盘</p>
                            <p @click="decimals(9)">卖盘</p>
                            <p @click="decimals(10)">默认</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
export default {
    name: "cbUnsettled",
    data() {
        return {
            usdt: 0,
            rate: 0, //汇率
            priceText: null,
            numText: null,
            sumText: null,
            isShowone: 0,
            number: 4,
            comments: 0,
            // commenty: 0,
            // commentys: null,
            decimalstxt: "4位小数",
            decimalstxt1: "默认",
            isShow: 0,
            isNum: 1,
            isNum1: 1,
            isFalse: { "background-color": "#48c122" },
            isFalseone: { color: "#48c122" },
            isFalse1: {},
            isFalseone1: {},
            isTrue: {},
            depthAsks: [], //卖盘
            depthBids: [], //买盘
            historyBy: [],
            hha: "",
            //火币请求数据相关参数
            apikeydata: "",
            secretkeydata: "",
            urldata: "",
            argsdata: {},
            huobiData: {}
        };
    },
    watch: {
        hha() {
            return this.$route.query.active;
        }
    },
    created() {
        this.depth();
    },
    methods: {
        depth() {
            // console.log(this.$route.query.active);
            if (this.$route.query.active == "mainBuy") {
                this.comments = 0;
            } else if (this.$route.query.active == "mainSale") {
                this.comments = 1;
            }
            let _this = this;
            //获取汇率
            this.$axios
                .post(
                    "http://120.79.0.99/market/api/marketAll/allMarketIndexDetail?type=btc"
                )
                .then(res => {
                    _this.rate = res.data.usdt[0].current_price_cny;
                });
            // console.log(111);
            //获取单个行情深度
            // setInterval(() => {
            let url =
                "http://chaobi.lian2345.com/https/get/market/depth?symbol=bchusdt&type=step1&kplkpl=api.huobi.pro";
            this.$axios.get(url).then(res => {
                this.depthAsks = res.data.tick.asks; //卖盘
                this.depthBids = res.data.tick.bids; //买盘
                // console.log(this.depthAsks);
            });
            // }, 10000);
        },
        //市价单限价单点击变色
        check(data) {
            if (data == "leftCheck") {
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
            } else if (data == "leftMarket") {
                this.isTrue = {
                    "margin-top": "3.22rem"
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
            }
        },
        //买卖盘点击
        selectcontent(data) {
            if (data == "selectcontent") {
                this.isNum = 0;
            } else if (data == "selectcontenttwo") {
                this.isNum1 = 0;
            }
        },
        //小数位点击
        decimals(num) {
            this.isNum = 1;
            this.isNum1 = 1;
            switch (num) {
                case 4:
                    return (this.decimalstxt = "4位小数"), (this.number = 4);
                case 5:
                    return (this.decimalstxt = "5位小数"), (this.number = 5);
                case 6:
                    return (this.decimalstxt = "6位小数"), (this.number = 6);
                case 7:
                    return (this.decimalstxt = "7位小数"), (this.number = 7);
                case 8:
                    return (this.decimalstxt1 = "买盘"), (this.isShowone = 1);
                case 9:
                    return (this.decimalstxt1 = "卖盘"), (this.isShowone = 2);
                case 10:
                    return (this.decimalstxt1 = "默认"), (this.isShowone = 0);
            }
        },
        //获取数据
        getdata(data) {
            // console.log(data);
            this.priceText = Number(data);
            // console.log(this.priceText);
            this.sumText = this.priceText * this.numText;
        },
        getdata1(data) {
            this.numText = Number(data);
            // console.log(this.numText);
            this.sumText = this.priceText * this.numText;

            // console.log(data);
        },
        keydown() {
            // if (typeof(Number(this.$refs.input1.value))!=Number) {
            //     this.priceText='请输入数字'

            // }
            // console.log(5454);
            // console.log(this.$refs.input1.value);
            this.sumText =
                Number(this.$refs.input1.value) *
                Number(this.$refs.input2.value);
        },
        gethuobi() {
            // var apikey = "fa049377-f37b907f-e10564e5-07a44";
            // var secretkey = "6ad24e1b-1fca7bf7-ee1e5e07-ca457";
            var apikey = "c7486d6a-ea52dfe0-28ab05a8-8cd1c";
            var secretkey = "4e01834c-391a5f34-b1e33165-4ae69";
            // var url = "/v1/account/accounts/";
            // var args = {};
            //火币获取userid       https get 请求
            var id = 4556453;
            // var apikey = this.apikeydata;
            // var secretkey = this.secretkeydata;
            var url = this.urldata;
            var args = this.argsdata;
            // console.log(url);

            // var url = "/v1/account/accounts/" + id + "/balance";
            //火币的签名   huobi_access_key       huobi_secretkey
            //火币的get请求(需要签名的);
            var shu;
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
                        // console.log(chun);

                        buffer.push(chun);
                    });
                    res.on("end", function() {
                        shu = buffer;
                    });
                });
                req.on("error", function(err) {
                    // console.error(err);
                });
                req.end();
            });
            // setTimeout(function() {
            //     this.huobiData = JSON.parse(shu);
            //     // console.log(this.huobiData);
            // }, 800);
        }
    }
};
</script>
<style>
.cbUnsettled {
    width: 100%;
    height: 100%;
}
.cbUnsettled .head {
    width: 100%;
    height: 1.6rem;
    line-height: 1.6rem;
    text-align: center;
    z-index: 99;
    position: relative;
    background-color: #fff;
}
.cbUnsettled .head .iconfont {
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.cbUnsettled .head .dealContent {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
}
.cbUnsettled main {
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 0;
}
.cbUnsettled main .mainNav {
    font-size: 0.42rem;
    display: flex;
    height: 1.25rem;
    line-height: 1.25rem;
    justify-content: space-around;
    background-color: #fff;
}
.cbUnsettled main .mainNav > div.active {
    border-bottom: 1px solid #48c122;
    color: #48c122;
}
.cbUnsettled main .mainLeft {
    display: inline-block;
    vertical-align: top;
    width: 50%;
    padding-left: 0.4rem;
    box-sizing: border-box;
}
.cbUnsettled main .mainRight {
    font-size: 0.4rem;
    display: inline-block;
    vertical-align: top;
    width: 50%;
}
.cbUnsettled main .mainLeft .leftCheck,
.cbUnsettled main .mainLeft .leftMarket {
    position: relative;
    font-size: 0.42rem;
    display: inline-block;
    width: 50%;
    height: 1.69rem;
    line-height: 1.69rem;
}
.cbUnsettled main .mainLeft .mainLeftNav {
    position: relative;
}
.cbUnsettled main .mainLeft .wire {
    width: 0px;
    height: 40%;
    border: 0.5px solid #000;
    position: absolute;
    right: 50%;
    top: 30%;
}
.cbUnsettled main .mainLeft .yuan {
    position: absolute;
    top: 0.6rem;
    left: 0.2rem;
    display: inline-block;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 1px solid #747474;
    /* margin-top: -5px; */
}
.cbUnsettled main .mainLeft .mainInput .mainInputct > input {
    width: 100%;
    height: 1.1rem;
    /* line-height: 1rem; */
    border: 1px solid #a6afba;
    margin-bottom: 0.5rem;
    font-size: 0.4rem;
    padding-right: 0.35rem;
    box-sizing: border-box;
    font-weight: bold;
}
.cbUnsettled main .mainLeft .mainInput .mainInputct {
    position: relative;
    font-size: 0.42rem;
}
.cbUnsettled main .mainLeft .mainInput .mainInputct p {
    color: #a6afba;
    position: absolute;
    left: 0.35rem;
    top: 0.25rem;
}
.cbUnsettled main .mainLeft .mainInput .mainInputct p.zhuanhuan,
.cbUnsettled main .mainLeft .mainInput p.zhuanhuanone {
    left: 0;
    top: 1rem;
    font-size: 0.4rem;
}
.cbUnsettled main .mainLeft .cang {
    display: flex;
    width: 100%;
    height: 0.8rem;
    border: 1px solid #a6afba;
    box-sizing: border-box;
}
.cbUnsettled main .mainLeft .cang > div {
    width: 25%;
    text-align: center;
    line-height: 0.8rem;
    color: #a6afba;
    font-size: 0.4rem;
    border-right: 1px solid #a6afba;
}
.cbUnsettled main .mainLeft .cang > div:last-child {
    border: none;
}
.cbUnsettled main .mainLeft .avail {
    margin: 0.167rem 0 0.5rem 0;
    font-size: 0.4rem;
    color: #374452;
}
.cbUnsettled main .mainLeft .likeBuyout {
    height: 1.2rem;
    width: 100%;
    border-radius: 1.2rem;
    font-size: 0.48rem;
    background-color: #F43E3A;
    color: #fff;
    margin: 0 auto;
    text-align: center;
    line-height: 1.2rem;
}
.cbUnsettled main .mainLeft .tu {
    margin-top: 0.6rem;
    width: 100%;
    height: 5rem;
    border: 1px solid #a6afba;
}
.cbUnsettled main .mainRight {
    padding: 0 0.3rem;
    box-sizing: border-box;
}
.cbUnsettled main .mainRight .mainrightnav {
    position: relative;
    height: 1.69rem;
    width: 100%;
    line-height: 1.69rem;
    text-align: right;
}
.cbUnsettled main .mainRight .mainrightnav .left {
    position: absolute;
    left: 0;
}
.cbUnsettled main .mainRight .mainrighttop,
.cbUnsettled main .mainRight .mainrightbottom {
    font-size: 0;
}
.cbUnsettled main .mainRight .mainrighttop ul,
.cbUnsettled main .mainRight .mainrightbottom ul {
    font-size: 0.41rem;
    color: #f43e3a;
    font-weight: bold;
    display: inline-block;
    width: 50%;
}
.cbUnsettled main .mainRight .mainrighttop ul.mainrightright,
.cbUnsettled main .mainRight .mainrightbottom ul.mainrightright {
    text-align: right;
}
.cbUnsettled main .mainRight > p {
    text-align: center;
    margin: 0 auto;
}
.cbUnsettled main .mainRight p.price {
    font-weight: bold;
    font-size: 0.8rem;
    color: #374452;
    line-height: 1.4rem;
    margin-top: 0.3rem;
}
.cbUnsettled main .mainRight p.priceone {
    font-size: 0.46rem;
    color: #a6afba;
    line-height: 0.5rem;
}
.cbUnsettled main .mainRight .mainrightbottom {
    margin-top: 0.5rem;
    color: #48c122;
}
.cbUnsettled main .mainRight .mainrightbottom ul {
    color: #48c122;
}
.cbUnsettled main .mainRight .select {
    font-size: 0;
    position: relative;
    width: 100%;
    height: 0.8rem;
    border: 1px solid #a6afba;
    margin-top: 0.5rem;
}

.cbUnsettled main .mainRight .select .selectcontent,
.cbUnsettled main .mainRight .select .selectcontenttwo {
    font-size: 0.4rem;
    display: inline-block;
    box-sizing: border-box;
    border-right: 1px solid #a6afba;
    position: relative;
    font-size: 0.32rem;
    width: 50%;
    height: 0.8rem;
    padding-left: 8%;
    color: #a6afba;
    line-height: 0.8rem;
}
.cbUnsettled main .mainRight .select .selectcontenttwo {
    padding-left: 15%;
    border-right: none;
}
.cbUnsettled main .mainRight .select .selectcontenttwo .jiantou,
.cbUnsettled main .mainRight .select .selectcontent .jiantou {
    width: 0;
    height: 0;
    position: absolute;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 8px solid #a6afba;
    right: 6%;
    top: 0.25rem;
}
.cbUnsettled main .mainRight .select .selectcontenttwo .jiantou {
    right: 12.5%;
}
.cbUnsettled main .mainRight .select .selectTwo,
.cbUnsettled main .mainRight .select .selectOne {
    font-size: 0.4rem;
    width: 50%;
    position: absolute;
    top: -4rem;
    border-radius: 3px;
    /* overflow: hidden; */
}
.cbUnsettled main .mainRight .select .selectTwo {
    width: 49%;
    top: -3rem;
    right: 0;
}
.cbUnsettled main .mainRight .select .selectTwo i,
.cbUnsettled main .mainRight .select .selectOne i {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 12px solid #fff;
    position: absolute;
    right: 2%;
    bottom: -0.24rem;
}
.cbUnsettled main .mainRight .select .selectTwo i {
    right: 8%;
}
.cbUnsettled main .mainRight .select .selectTwo p,
.cbUnsettled main .mainRight .select .selectOne p {
    height: 0.9rem;
    text-align: center;
    line-height: 0.9rem;
    background-color: #fff;
    color: #374452;
}
.cbUnsettled main .mainRight .select .selectTwo p:hover,
.cbUnsettled main .mainRight .select .selectOne p:hover {
    color: #48c122;
}
</style>




