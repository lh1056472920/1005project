<template>
    <div class="cbhistory">
        <!-- 交易（历史委托）页面 -->
        <div class='header'>
            <div :class='{cbunse:isNum==0}' @click="cbunse(0)">限价/市价单</div>
            <div :class='{cbunse:isNum==1}' @click="cbunse(1)">分笔委托</div>
            <div :class='{cbunse:isNum==2}' @click="cbunse(2)">云买卖</div>
            <div :class='{cbunse:isNum==3}' @click="cbunse(3)">套利模式</div>
        </div>
        <main>
            <div v-if="isNum==0" class="xianshi">
                <div v-if="nonum==1" class="mainsale" v-for="(item,i) in historybuy" :key="i">
                    <div :class="item.type">
                        <span class="one">{{cc}}</span>
                        <span v-if="item.type=='sell-market'||item.type=='sell-limit'" class="two">卖出</span>
                        <span v-if="item.type=='buy-market'||item.type=='buy-limit'" class="two">买入</span>
                    </div>
                    <div class="mainBuyContent">
                        <div class="one">
                            <p>委托数量</p>
                            <p>{{Number(item['amount']).toString().substring(0,9)}}</p>
                        </div>
                        <div class="one">
                            <p>委托价</p>
                            <!-- <p>{{item.price}}</p> -->
                            <p v-if="item.state=='canceled'||item.type=='sell-limit'||item.type=='buy-limit'">{{Number(item.price).toString().substring(0,9)}}</p>
                            <p v-if="item.state=='filled'&&(item.type=='buy-market'||item.type=='sell-market')">市价</p>
                        </div>
                        <div class="one">
                            <p>成交均价</p>
                            <p v-if="item.state=='filled'">{{Number(item['field-cash-amount']/item['field-amount']).toString().substring(0,9)}}</p>
                            <p v-if="item.state=='canceled'">0</p>
                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{timestampToTime(item['finished-at'])}}
                        </span>
                        <div v-if="item.state=='canceled'" :class="item.type">已撤销</div>
                        <div v-if="item.state=='filled'" :class="item.type">已成交</div>
                    </div>
                </div>
                <div v-if="nonum==0" class="iconfont icon-dingdan">
                    <p>您还没有任何委托记录</p>
                </div>
            </div>
            <div v-if="isNum!==0" class="xianshi">
                <div v-if="nonum==1" class="mainsale" v-for="(item,i) in cbUnsettledBian1" :key="i">
                    <div :class="item.type">
                        <span class="one">{{cc}}</span>
                        <span v-if="item.type=='sell-market'||item.type=='sell-limit'" class="two">卖出</span>
                        <span v-if="item.type=='buy-market'||item.type=='buy-limit'" class="two">买入</span>
                    </div>
                    <div class="mainBuyContent">
                        <div class="one">
                            <p>委托数量</p>
                            <p>{{Number(item['amount']).toString().substring(0,9)}}</p>
                        </div>
                        <div class="one">
                            <p>委托价</p>
                            <!-- <p>{{item.price}}</p> -->
                            <p v-if="item.state=='canceled'||item.type=='sell-limit'||item.type=='buy-limit'">{{Number(item.price).toString().substring(0,9)}}</p>
                            <p v-if="item.state=='filled'&&(item.type=='buy-market'||item.type=='sell-market')">市价</p>
                        </div>
                        <div class="one">
                            <p>成交均价</p>
                            <p v-if="item.state=='filled'">{{Number(item['field-cash-amount']/item['field-amount']).toString().substring(0,9)}}</p>
                            <p v-if="item.state=='canceled'">0</p>
                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{timestampToTime(item['finished-at'])}}
                        </span>
                        <div v-if="item.state=='canceled'" :class="item.type">已撤销</div>
                        <div v-if="item.state=='filled'" :class="item.type">已成交</div>
                        <div v-if="item.state=='submitted'" :class="item.type">已提交</div>
                    </div>
                </div>
                <div v-if="nonum==0" class="iconfont icon-dingdan">
                    <p>您还没有任何委托记录</p>
                </div>
            </div>
            <!-- <div v-if="isNum==1" class="xianshi">
                <div v-if="isShow1==1" class="mainsale" v-for="(item,i) in cbUnsettledBian1" :key="i">
                    <div :class="item.type">
                        <span class="one">{{cc}}</span>
                        <span v-if="item.type=='sell-limit'" class="two">卖出</span>
                        <span v-if="item.type=='buy-limit'" class="two">买入</span>
                    </div>
                    <div class="mainBuyContent">
                        <div class="one">
                            <p v-if="item.type=='sell-limit'">卖出总金额</p>
                            <p v-if="item.type=='buy-limit'">买入总金额</p>
                            <p>{{Number(item.dataOne).toString().substring(0,9)}}</p>
                        </div>
                        <div class="one">
                            <p>单笔金额</p>
                            <p>{{Number(item.dataTwo).toString().substring(0,9)}}</p>
                        </div>
                        <div class="one">
                            <p>委托深度</p>
                            <p>{{item.dataThree}}%</p>
                        </div>
                        <div class="one">
                            <p>最高卖价</p>
                            <p>{{Number(item.dataFore).toString().substring(0,9)}}</p>
                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{item.updateTime}}
                        </span>
                        <div :class="item.type">已完成</div>
                    </div>
                </div>
                <div v-if="isShow1==0" class="iconfont icon-dingdan">
                    <p>无未成交</p>
                </div>
            </div>
            <div v-if="isNum==2" class="xianshi">
                <div v-if="isShow1==1" class="mainsale" v-for="(item,i) in cbUnsettledBian1" :key="i">
                    <div :class="item.other">
                        <span class="one">{{cc}}</span>
                        <span v-if="item.other=='sell'" class="two">卖出</span>
                        <span v-if="item.other=='buy'" class="two">买入</span>
                    </div>
                    <div class="mainBuyContent">
                        <div class="one">
                            <p>触发价格</p>
                            <p>{{Number(item.dataOne).toString().substring(0,9)}}</p>
                        </div>
                        <div class="one">
                            <p>委托价格</p>
                            <p>{{Number(item.dataTwo).toString().substring(0,9)}}</p>
                        </div>
                        <div class="one">
                            <p>数量</p>
                            <p>{{Number(item.dataThree).toString().substring(0,9)}}</p>
                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{timestampToTime(item.updateTime)}}
                        </span>
                        <div :class="item.other">已完成</div>
                    </div>
                </div>
                <div v-if="isShow1==0" class="iconfont icon-dingdan">
                    <p>无未成交</p>
                </div>
            </div>
            <div v-if="isNum==3" class="xianshi">
                <div v-if="isShow1==1" class="mainsale" v-for="(item,i) in cbUnsettledBian1" :key="i">
                    <div :class="item.other">
                        <span class="one">{{cc}}</span>
                        <span v-if="item.other=='sell'" class="two">卖出</span>
                        <span v-if="item.other=='buy'" class="two">买入</span>
                    </div>
                    <div class="mainBuyContent">
                        <div class="one">
                            <p>自定义收益率</p>
                            <p>{{Number(item.dataOne).toString().substring(0,9)}}</p>
                        </div>
                        <div class="one">
                            <p v-if="item.other=='sell'">卖出总金额</p>
                            <p v-if="item.other=='buy'">买入总金额</p>
                            <p>{{Number(item.dataTwo).toString().substring(0,9)}}</p>
                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{item.updateTime}}
                        </span>
                        <div :class="item.other">已完成</div>
                    </div>
                </div>
                <div v-if="isShow1==0" class="iconfont icon-dingdan">
                    <p>无未成交</p>
                </div>
            </div> -->
        </main>
    </div>
</template>
<script>
import { encryptKey, MD5, decryptByKey } from "../../lib/js/crypto.js";
import { urljm } from "../../lib/js/jsmi.js";
import remote from "../../lib/js/remote.js";
const kplsign = require("../../lib/js/sign/KplSign.js");
var http = require("http");
var querystring = require("querystring");
export default {
    data() {
        return {
            isNum: 0,
            historybuy: [], //买入已成交
            historysale: [], //卖出已成交
            historyrepeal: [], //卖出已撤销
            historycancel: [], //买入已撤销
            huobiData: [],
            isShow: null,
            isShow1: null,
            nonum: 1,
            symbol: "",
            userkey: [],
            cc: "",
            cbUnsettledBian1: [],
            huobi: null,
            arr: "",
            arr1: ""
        };
    },
    created() {
        this.gethuobi();
    },
    mounted() {},
    methods: {
        cbunse(res) {
            this.$toStatistic("cbDealbuyhuobihistroy", "查看火币交易记录");
            console.log(res);

            if (res == 0) {
                this.isNum = 0;
                this.gethuobi();
            } else if (res == 1) {
                (this.cbUnsettledBian1 = []), (this.isNum = 1);
                this.axiosdata(1);
            } else if (res == 2) {
                (this.cbUnsettledBian1 = []), (this.isNum = 2);
                this.axiosdata(2);
            } else if (res == 3) {
                (this.cbUnsettledBian1 = []), (this.isNum = 3);
                this.axiosdata(3);
            }
        },
        axiosdata(type) {
            this.huobi = JSON.parse(
                decryptByKey(localStorage.getItem("userkey"))
            );
            this.symbol =
                JSON.parse(localStorage.getItem("counterparty")).coin +
                JSON.parse(localStorage.getItem("counterparty")).counterparty;
            remote
                .selectAllOrderId({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(
                        this.$store.state.userInfo.phone
                    ),
                    smybol: this.symbol,
                    master: "huobi", //交易所
                    type: type //交易形式 1 2 3
                })
                .then(res => {
                    // console.log(res);
                    if (res.data.status == 1) {
                        let orderId = res.data.list;
                        if (orderId.length == 0) {
                            console.log(64646445);

                            this.nonum = 0;
                        } else {
                            this.nonum = 1;
                            let arr = [];
                            var arr1;
                            let _this = this;
                            let i = 0;
                            orderId.forEach(element => {
                                remote
                                    .selectinfoOrderId({
                                        apikey: urljm(this.huobi.apikey),
                                        secret: urljm(this.huobi.secretkey),
                                        symbol: this.symbol,
                                        orderId: element["orderid"]
                                    })
                                    .then(res => {
                                        i++;
                                        arr1 = res.data.list.data;
                                        arr.push(arr1);
                                        if (i == orderId.length) {
                                            this.cbUnsettledBian1 = arr;
                                        }
                                    });
                            });
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
            //
        },
        gethuobi() {
            if (!localStorage.getItem("userkey")) {
                this.nonum = 0;
                return;
            }
            this.userkey = JSON.parse(
                decryptByKey(localStorage.getItem("userkey"))
            );
            this.symbol = `${
                JSON.parse(localStorage.getItem("counterparty")).coin
            }${JSON.parse(localStorage.getItem("counterparty")).counterparty}`;
            this.cc = `${
                JSON.parse(localStorage.getItem("counterparty")).coin
            }/${JSON.parse(localStorage.getItem("counterparty")).counterparty}`;
            let _this = this;
            var apikey = this.userkey.apikey;
            var secretkey = this.userkey.secretkey;
            // var url = "/v1/account/accounts/";
            var url = "/v1/order/orders/";
            var args = {
                symbol: _this.symbol,
                states: "filled,canceled"
            };
            // console.log(args);

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
                    let usdt = [];
                    res.on("data", function(chun) {
                        buffer.push(chun);
                    });
                    res.on("end", function() {
                        buffer.forEach(element => {
                            usdt += element;
                        });
                        _this.huobiData = JSON.parse(usdt);

                        _this.mh();
                    });
                });
                req.on("error", function(err) {});
                req.end();
            });
        },
        mh() {
            var arr = [],
                _this = this;
            // console.log(1111);

            if (_this.huobiData.data.length == 0) {
                _this.nonum = 0;
                return;
            } else if (_this.huobiData.data.length != 0) {
                _this.nonum = 1;
            }
            _this.historybuy = _this.huobiData.data;
            // console.log(_this.historybuy);
        },
        timestampToTime(timestamp) {
            var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + "-";
            var M =
                (date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1) + "-";
            var D = date.getDate() + " ";
            var h = date.getHours() + ":";
            var m = date.getMinutes() + ":";
            var s = date.getSeconds();
            return Y + M + D + h + m + s;
        }
        // axiosdatahistroy(type) {
        //     console.log(21654);
        //     remote
        //         .selectAllOrderId({
        //             userid: urljm(this.$store.state.userInfo.uid),
        //             username: urljm(
        //                 this.$store.state.userInfo.phone
        //             ),
        //             smybol: this.symbol,
        //             master: "huobi", //交易所
        //             type: type //交易形式 1 2 3
        //         })
        //         .then(res => {
        //             console.log(res);
        //         });
        //     var goodsurl = "http://chaobi.lian2345.com";
        //     // var payurl = "http://chaobi.lian2345.com";
        //     var payurl = "http://192.168.1.217:9998";

        //     var url = payurl + "/api/chaobi/deal/plain/selectAllOrderIds";
        //     var data;
        //     data = {
        //         userid: urljm(this.$store.state.userInfo.uid),
        //         username: urljm(
        //             this.$store.state.userInfo.phone
        //         ),
        //         smybol: this.symbol,
        //         master: "huobi", //交易所
        //         type: type //交易形式 1 2 3
        //     };
        //     this.$axios({
        //         method: "post",
        //         url: url,
        //         params: data
        //     }).then(res => {
        //         console.log(res);
        //         if (res.data.list.length == 0) {
        //             this.isShow1 = 0;
        //         } else {
        //             this.isShow1 = 1;
        //         }
        //         let historytype = res.data.list;
        //         //    if (res.data.status == 1) {
        //         //        this.cbUnsettledBian1 = res.data.list;
        //         //     } else if (res.data.status == '777') {
        //         //         MessageBox("温馨提示", res.data.list);
        //         //     } else if (res.data.status == '888') {
        //         //         MessageBox.confirm('您不是会员,是否开通会员').then(
        //         //             res => {
        //         //                 //跳转会员连接口
        //         //                 this.$vipBox().then(event => {
        //         //                 this.$router.push({
        //         //                 path: "/openVip"
        //         //                     });
        //         //                 });
        //         //             }
        //         //         );
        //         //     } else if (res.data.status == '666') {
        //         //         MessageBox("提示", res.data.list);
        //         //     }
        //     });
        // }
    }
};
</script>
<style>
.cbhistory {
    margin-top: 2.8rem;
}
@import "../../lib/css/noDealbugsell.css";
</style>


