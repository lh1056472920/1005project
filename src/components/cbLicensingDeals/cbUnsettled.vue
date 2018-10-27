<template>
    <div class="cbUnsettled">
        <div class='header'>
            <div :class='{cbunse:isNum==0}' @click="cbunse(0)">限价/市价单</div>
            <div :class='{cbunse:isNum==1}' @click="cbunse(1)">分笔委托</div>
            <div :class='{cbunse:isNum==2}' @click="cbunse(2)">云买卖</div>
            <div :class='{cbunse:isNum==3}' @click="cbunse(3)">套利模式</div>
        </div>
        <main>
            <div v-if="isNum==0" class="xianshi">
                <div v-if="isShow==1" class="mainsale" v-for="(item,i) in cbUnsettled" :key="i">
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
                            <p>{{Number(item.price).toString().substring(0,9)}}</p>
                            <!-- <p v-if="isShow==0">限价</p>
                        <p v-if="isShow==1">市价</p> -->
                        </div>
                        <div class="one">
                            <p>成交均价</p>
                            <p>0</p>
                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{timestampToTime(item['created-at'])}}
                        </span>
                        <!-- <div class="cle">已撤销</div> -->
                        <div :class="item.type" @click="Undo(item.id)">撤销</div>
                    </div>
                </div>
                <div v-if="isShow==0" class="iconfont icon-dingdan">
                    <p>无未成交</p>
                </div>
            </div>
            <!-- 分笔委托 -->
            <div v-if="isNum==1" class="xianshi">
                <div v-if="isShow1==1" class="mainsale" v-for="(item,i) in cbUnsettledBian1" :key="i">
                    <div :class="item.other">
                        <span class="one">{{cc}}</span>
                        <span v-if="item.other=='sell'" class="two">卖出</span>
                        <span v-if="item.other=='buy'" class="two">买入</span>
                    </div>
                    <div class="mainBuyContent">
                        <div class="one">
                            <p v-if="item.other=='sell'">卖出总金额</p>
                            <p v-if="item.other=='buy'">买入总金额</p>
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
                        <div :class="item.other" @click="Undo1(item.uuid,item.order_id,item.symbol)">撤销</div>
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
                            <!-- <p v-if="isShow==0">限价</p>
                        <p v-if="isShow==1">市价</p> -->
                        </div>
                        <div class="one">
                            <p>数量</p>
                            <p>{{Number(item.dataThree).toString().substring(0,9)}}</p>
                            <!-- <p>{{Number(item.executedQty).toFixed(3)}}</p> -->

                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{timestampToTime(item.updateTime)}}
                        </span>
                        <!-- <div class="cle">已撤销</div> -->
                        <div v-if="item.isSuccess==1" class="bianji" @click="Undo(item.order_id)">取消订单</div>
                        <div :class="item.other" @click="Undo1(item.uuid,item.order_id,item.symbol)">撤销下单</div>
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
                        <div :class="item.other" @click="Undo1(item.uuid,item.order_id,item.symbol)">撤销</div>
                    </div>
                </div>
                <div v-if="isShow1==0" class="iconfont icon-dingdan">
                    <p>无未成交</p>
                </div>
            </div>

        </main>
    </div>
</template>
<script>
import { encryptKey, MD5, decryptByKey } from "../../lib/js/crypto.js";
import { MessageBox } from "mint-ui";
import axios from "axios";
import remote from "../../lib/js/remote.js";
import { urljm } from "../../lib/js/jsmi.js";

const kplsign = require("../../lib/js/sign/KplSign.js");
var http = require("http");
var querystring = require("querystring");
export default {
    data() {
        return {
            isNum: 0,
            cbUnsettled: [],
            isShow: null,
            isShow1: null,
            userkey: [],
            symbol: "",
            cc: "",
            isFalse: {},
            cbUnsettledBian1: []
        };
    },
    created() {
        this.gethuobi();
    },
    methods: {
        cbunse(res) {
            this.$toStatistic("cbDealbuyhuobisettle", "查看火币未成交交易记录");

            if (res == 0) {
                this.isNum = 0;
                this.gethuobi();
            } else if (res == 1) {
                this.isNum = 1;
                this.axiosdata(1);
            } else if (res == 2) {
                this.isNum = 2;
                this.axiosdata(2);
            } else if (res == 3) {
                this.isNum = 3;
                this.axiosdata(3);
            }
        },
        Undo(data) {
            MessageBox.confirm("是否确认取消交易所的订单").then(res => {
                let _this = this;
                var id = data;
                var url = "/v1/order/orders/" + id + "/submitcancel";
                var args = {};
                var apikey = this.userkey.apikey;
                var secretkey = this.userkey.secretkey;
                kplsign.sign_huobi(
                    apikey,
                    secretkey,
                    url,
                    "POST",
                    args,
                    function(sgingdadd) {
                        //console.log(sgingdadd)
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
                                // console.log(chunk);

                                if (
                                    JSON.parse(chunk)["err-code"] &&
                                    JSON.parse(chunk)["err-code"] ==
                                        "gateway-internal-error"
                                ) {
                                    MessageBox(
                                        "提示",
                                        "系统繁忙撤销失败，请前往官网撤销"
                                    );
                                } else {
                                    _this.gethuobi();
                                    MessageBox("提示", "撤销成功");
                                }
                            });
                        });
                        req.on("error", function(e) {});
                        req.write(content);
                        req.end();
                    }
                );
            });
        },
        Undo1(data, data1, symbol) {
            this.$toStatistic("cbDealbuyback", "点击撤单");

            MessageBox.confirm("是否确认取消该委托").then(res => {
                this.axiosdata1(this.isNum, data);
            });
        },
        gethuobi() {
            let _this = this;
            this.userkey = JSON.parse(
                decryptByKey(localStorage.getItem("userkey"))
            );
            // console.log(this.userkey);
            this.symbol = `${
                JSON.parse(localStorage.getItem("counterparty")).coin
            }${JSON.parse(localStorage.getItem("counterparty")).counterparty}`;
            this.cc = `${
                JSON.parse(localStorage.getItem("counterparty")).coin
            }/${JSON.parse(localStorage.getItem("counterparty")).counterparty}`;
            var apikey = this.userkey.apikey;
            var secretkey = this.userkey.secretkey;
            var url = "/v1/order/openOrders/";
            var args = {
                "account-id": this.userkey.arroundId,
                symbol: this.symbol
            };
            //火币的get请求(需要签名的);
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
                    res.on("data", function(chun) {
                        if (
                            JSON.parse(chun).data &&
                            JSON.parse(chun).data.length == 0
                        ) {
                            _this.isShow = 0;
                        } else {
                            _this.isShow = 1;
                        }
                        _this.cbUnsettled = JSON.parse(chun).data;
                        console.log(_this.cbUnsettled);
                    });
                    res.on("end", function() {});
                });
                req.on("error", function(err) {});
                req.end();
            });
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
        },
        //查询vip功能的历史未成交
        axiosdata(type) {
            remote
                .selectAll1({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(
                        this.$store.state.userInfo.phone
                    ),
                    smybol: this.symbol,
                    master: "huobi", //交易所
                    type: type //交易形式 1 2 3
                })
                .then(res => {
                    console.log(111);
                    console.log(res);
                    if (res.data.status == 1) {
                        this.cbUnsettledBian1 = res.data.list;
                        if (res.data.list.length == 0) {
                            this.isShow1 = 0;
                        } else {
                            this.isShow1 = 1;
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
        //vip功能的撤销
        axiosdata1(type, uuid) {
            // var goodsurl = "http://chaobi.lian2345.com";
            // // var payurl = "http://chaobi.lian2345.com";
            // var payurl = "http://192.168.1.189:9998";

            // var url = payurl + "/api/chaobi/deal/plain/deleteByPrimaryKey";
            // // var url = payurl + "/api/chaobi/deal/plain/updateByPrimaryKey";
            // var data;
            // data = {
            //     userid: urljm(this.$store.state.userInfo.uid),
            //     username: urljm(
            //         this.$store.state.userInfo.phone
            //     ),
            //     smybol: this.symbol,
            //     master: "huobi", //交易所
            //     type: type, //交易形式 1 2 3
            //     uuid: uuid
            //     //更新
            //     //  dataOne: urljm('65465'),
            //     //     dataTwo: urljm('46546'),
            //     //     dataThree: urljm('5'),
            //     //     dataFore: urljm('56'),
            // };
             remote
                .deleteByPrimaryKey({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(
                        this.$store.state.userInfo.phone
                    ),
                    smybol: this.symbol,
                    master: "huobi", //交易所
                    type: type, //交易形式 1 2 3
                    uuid: uuid
                }).then(res => {
                if (res.data.status == 1 && res.data.list == 1) {
                    MessageBox("温馨提示", "撤销成功");
                    this.axiosdata(this.isNum);
                }
            });
        }
    }
};
</script>
<style>
@import "../../lib/css/noDealbugsell.css";
</style>


