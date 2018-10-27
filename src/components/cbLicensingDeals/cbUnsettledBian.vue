<template>
    <div class="cbUnsettledBian">
        <div class='header'>
            <div :class='{cbunse:isNum==0}' @click="cbunse(0)">限价/市价单</div>
            <div :class='{cbunse:isNum==1}' @click="cbunse(1)">分笔委托</div>
            <div :class='{cbunse:isNum==2}' @click="cbunse(2)">云买卖</div>
            <div :class='{cbunse:isNum==3}' @click="cbunse(3)">套利模式</div>
        </div>
        <main>
            <div v-if="isNum==0" class="xianshi">
                <div v-if="isShow1==1" class="mainsale" v-for="(item,i) in cbUnsettledBian" :key="i">
                    <div :class="item.side">
                        <span class="one">{{cc}}</span>
                        <span v-if="item.side=='SELL'" class="two">卖出</span>
                        <span v-if="item.side=='BUY'" class="two">买入</span>
                    </div>
                    <div class="mainBuyContent">
                        <div class="one">
                            <p>委托数量</p>
                            <p>{{Number(item.origQty).toString().substring(0,9)}}</p>
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
                            <!-- <p>{{Number(item.executedQty).toFixed(3)}}</p> -->

                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{timestampToTime(item.time)}}
                        </span>
                        <!-- <div class="cle">已撤销</div> -->
                        <div :class="item.side" @click="Undo(item.orderId,item.symbol)">撤销</div>
                    </div>
                </div>
                <div v-if="isShow1==0" class="iconfont icon-dingdan">
                    <p>无未成交</p>
                </div>
            </div>
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
                        <div v-if="item.isSuccess==1" class="bianji" @click="Undo(item.order_id,item.symbol)">取消订单</div>
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
import remote from "../../lib/js/remote.js";
import { MessageBox } from "mint-ui";
import axios from "axios";
import { urljm } from "../../lib/js/jsmi.js";
export default {
    name: "cbUnsettledBian",
    data() {
        return {
            isNum: 0,
            cbUnsettledBian: [],
            isShow: null,
            isShow1: null,
            biankey: {},
            symbol: "",
            cc: "",
            cbUnsettledBian1: []
        };
    },
    created() {
        this.getbian();
    },
    methods: {
        cbunse(res) {
              this.$toStatistic("cbDealbuybiansttle", "查看币安未成交交易记录");
            
            if (res == 0) {
                this.isNum = 0;
                this.getbian();
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
        Undo1(data, data1, symbol) {
            MessageBox.confirm("是否确认取消该委托").then(res => {
                this.axiosdata1(this.isNum, data);
            });
        },
        Undo(data, symbol) {
            MessageBox.confirm("是否确认取消交易所的订单").then(res => {
            var id = data;
            let symbolid = symbol;
            // console.log(data);
            axios
                .post(
                    `http://chaobi.lian2345.com/api/chaobi/deal/binance/deleteOrder/dfdsafadf?apikey=${
                        this.biankey.apikey
                    }&secret=${
                        this.biankey.secretkey
                    }&orderid=${id}&symbol=${symbolid}`
                )
                .then(res => {
                    this.getbian();
                    // this.cbUnsettledBian = res.data;
                });
                });
        },
        getbian() {
            console.log(JSON.parse(localStorage.getItem('user')).phone);
            // JSON.parse(localStorage.getItem('user'))
            
            this.biankey = JSON.parse(
                decryptByKey(localStorage.getItem("biankey"))
            );
            this.biankey.apikey = urljm(this.biankey.apikey); //这个是加密后的
            this.biankey.secretkey = urljm(this.biankey.secretkey); //这个是加密后的
            this.symbol =
                JSON.parse(localStorage.getItem("counterparty")).coin +
                JSON.parse(localStorage.getItem("counterparty")).counterparty;
            this.cc =
                JSON.parse(localStorage.getItem("counterparty")).coin +
                "/" +
                JSON.parse(localStorage.getItem("counterparty")).counterparty;
            //获取币安未成交纪录

            axios
                .post(
                    `http://chaobi.lian2345.com/api/chaobi/deal/binance/openOrders/dfdsafadf?apikey=${
                        this.biankey.apikey
                    }&secret=${this.biankey.secretkey}&symbol=${this.symbol}`
                )
                .then(res => {
                    if (res.data.list.data.length == 0) {
                        this.isShow1 = 0;
                    } else {
                        this.isShow1 = 1;
                        this.cbUnsettledBian = res.data.list.data;
                    }
                });

            //发请求
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
        //查询历史未成交
        axiosdata(type) {
             remote
                .selectAll1({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(
                        this.$store.state.userInfo.phone
                    ),
                    smybol: this.symbol,
                    master: "binance", //交易所
                    type: type //交易形式 1 2 3
                }).then(res => {
                console.log(res);
                if (res.data.status == 1) {
                   this.cbUnsettledBian1 = res.data.list;
                    if (res.data.list.length == 0) {
                        this.isShow1 = 0;
                    } else {
                        this.isShow1 = 1;
                    }
                } else if (res.data.status == '777') {
                    MessageBox("温馨提示", res.data.list);
                } else if (res.data.status == '888') {
                    MessageBox.confirm('您不是会员,是否开通会员').then(
                        res => {
                            //跳转会员连接口
                            this.$vipBox().then(event => {
                            this.$router.push({
                            path: "/openVip"
                                });
                            });
                        }
                    );
                } else if (res.data.status == '666') {
                    MessageBox("提示", res.data.list);
                }
            });
        },
        //撤销
        axiosdata1(type, uuid) {
             remote
                .deleteByPrimaryKey({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(
                        this.$store.state.userInfo.phone
                    ),
                    smybol: this.symbol,
                    master: "binance", //交易所
                    type: type, //交易形式 1 2 3
                    uuid: uuid
                }).then(res => {
                console.log(res);
                
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


