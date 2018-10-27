<template>
    <div class="cbUnsettledOkex">
        <div class='header'>
            <div :class='{cbunse:isNum==0}' @click="cbunse(0)">限价/市价单</div>
            <div :class='{cbunse:isNum==1}' @click="cbunse(1)">分笔委托</div>
            <div :class='{cbunse:isNum==2}' @click="cbunse(2)">云买卖</div>
            <div :class='{cbunse:isNum==3}' @click="cbunse(3)">套利模式</div>
        </div>
        <main>
            <div v-if="isNum==0" class="xianshi">
                <div v-if="isShow==1&&(item.status==0||item.status==1)" class="mainsale" v-for="(item,i) in cbUnsettledOkex" :key="i">
                    <div :class="item.type">
                        <span class="one">{{cc}}</span>
                        <span v-if="item.type=='sell'" class="two">卖出</span>
                        <span v-if="item.type=='buy'" class="two">买入</span>
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
                        <span>{{timestampToTime(item['create_date'])}}
                        </span>
                        <!-- <div class="cle">已撤销</div> -->
                        <div :class="item.type" @click="Undo(item.order_id)">撤销</div>
                    </div>
                </div>
                <div v-if="isShow==0" class="iconfont icon-dingdan">
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
import remote from "../../lib/js/remote.js";

import { MessageBox } from "mint-ui";
import axios from "axios";
import { urljm } from "../../lib/js/jsmi.js";
export default {
    data() {
        return {
            isNum:0,
            cbUnsettledOkex: [],
            isShow: null,
            isShow1: null,
            Okexkey: [],
            symbol: "",
            cc: "",
            cbUnsettledBian1: []
        };
    },
    created() {
        this.getzb();
    },
    methods: {
        cbunse(res) {
              this.$toStatistic("cbDealbuyokexsttle", "查看okex未成交交易记录");
            
            if (res == 0) {
                this.isNum = 0;
                this.getzb();
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
        getzb() {
            // let _this = this;
            this.Okexkey = JSON.parse(
                decryptByKey(localStorage.getItem("Okexkey"))
            );
            this.Okexkey.secretkey = urljm(this.Okexkey.secretkey); //这个是加密后的
            this.Okexkey.apikey = urljm(this.Okexkey.apikey); //这个是加密后的
            this.symbol =
                JSON.parse(localStorage.getItem("counterparty")).coin +
                "_" +
                JSON.parse(localStorage.getItem("counterparty")).counterparty;
            // console.log(this.symbol);
            this.cc =
                JSON.parse(localStorage.getItem("counterparty")).coin +
                "/" +
                JSON.parse(localStorage.getItem("counterparty")).counterparty;
            //okex数据
            let url = `http://chaobi.lian2345.com/api/chaobi/deal/oken/order_history/${
                this.Okexkey.num
            }?apikey=${this.Okexkey.apikey}&secret=${
                this.Okexkey.secretkey
            }&current_page=1&page_length=200&status=0&symbol=${this.symbol}`;

            axios.post(url).then(res => {
                // console.log(res);
                JSON.parse(res.data.list).orders;
                let list = JSON.parse(res.data.list).orders;
                // console.log(list);
                if (list.length == 0) {
                    this.isShow = 0;
                } else {
                    this.isShow = 1;
                    this.cbUnsettledOkex = list;
                }
            });
        },
         Undo1(data, data1, symbol) {
            MessageBox.confirm("是否确认取消交易所的订单").then(res => {
                this.axiosdata1(this.isNum, data);
            });
        },
        Undo(data) {
             MessageBox.confirm("是否确认取消该委托").then(res => {
            var id = data;
            let url = `http://chaobi.lian2345.com/api/chaobi/deal/oken/cancel_order/${
                this.Okexkey.num
            }?apikey=${this.Okexkey.apikey}&secret=${
                this.Okexkey.secretkey
            }&order_id=${id}&symbol=${this.symbol}`;

            axios.post(url).then(res => {
                // console.log(11212);
                if (JSON.parse(res.data.list).error) {
                    MessageBox("温馨提示", "订单撤销失败");
                } else {
                    this.isShow = 0;
                    MessageBox("温馨提示", "订单撤销成功");
                    // console.log(this.isShow);
                }
            });
            this.getzb();
             });
        },
        // }
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
                    master: "okex", //交易所
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
                    master: "okex", //交易所
                    type: type, //交易形式 1 2 3
                    uuid: uuid
                }).then(res => {
                if (res.data.status==1&&res.data.list==1) {
                    MessageBox('温馨提示','撤销成功')
                    this.axiosdata(this.isNum)
                }
            });
        }
    }
};
</script>
<style>
@import '../../lib/css/noDealbugsell.css';
</style>


