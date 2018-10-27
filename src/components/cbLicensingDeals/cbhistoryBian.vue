<template>
    <div class="cbhistoryBian">
        <!-- 交易（历史委托）页面 -->
        <div class='header'>
            <div :class='{cbunse:isNum==0}' @click="cbunse(0)">限价/市价单</div>
            <div :class='{cbunse:isNum==1}' @click="cbunse(1)">分笔委托</div>
            <div :class='{cbunse:isNum==2}' @click="cbunse(2)">云买卖</div>
            <div :class='{cbunse:isNum==3}' @click="cbunse(3)">套利模式</div>
        </div>
        <main>
            <div v-if="isNum==0" class="xianshi">
                <div class="mainsale" v-for="(item,i) in historybuy" :key="i">
                    <div :class="item.side">
                        <span class="one">{{cc}}</span>
                        <span v-if="item.side=='SELL'" class="two">卖出</span>
                        <span v-if="item.side=='BUY'" class="two">买入</span>
                    </div>
                    <div class="mainBuyContent">
                        <div class="one">
                            <p>委托数量</p>
                            <p>{{Number(item['origQty']).toString().substring(0,9)}}</p>
                        </div>
                        <div class="one">
                            <p>委托价</p>
                            <p v-if="item.type=='LIMIT'">{{Number(item.price).toString().substring(0,9)}}</p>
                            <p v-if="item.type=='MARKET'">市价</p>
                        </div>
                        <div class="one">
                            <p>成交均价</p>
                            <p v-if="item.status=='FILLED'">{{(Number(item['stopPrice'])/Number(item['origQty'])).toString().substring(0,9)}}</p>
                            <p v-if="item.status=='CANCELED'">0</p>
                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{timestampToTime(item['time'])}}
                        </span>
                        <div v-if="item.status=='FILLED'" :class="item.side">已成交</div>
                        <div v-if="item.status=='CANCELED'" :class="item.side">已撤销</div>
                    </div>
                </div>
                <div v-if="isShow==0" class="iconfont icon-dingdan">
                    <p>您还没有任何委托记录</p>
                </div>
            </div>
            <div v-if="isNum!==0" class="xianshi">
                <div class="mainsale" v-for="(item,i) in cbUnsettledBian1" :key="i">
                    <div :class="item.side">
                        <span class="one">{{cc}}</span>
                        <span v-if="item.side=='SELL'" class="two">卖出</span>
                        <span v-if="item.side=='BUY'" class="two">买入</span>
                    </div>
                    <div class="mainBuyContent">
                        <div class="one">
                            <p>委托数量</p>
                            <p>{{Number(item['origQty']).toString().substring(0,9)}}</p>
                        </div>
                        <div class="one">
                            <p>委托价</p>
                            <p v-if="item.type=='LIMIT'">{{Number(item.price).toString().substring(0,9)}}</p>
                            <p v-if="item.type=='MARKET'">市价</p>
                        </div>
                        <div class="one">
                            <p>成交均价</p>
                            <p v-if="item.status=='FILLED'">{{(Number(item['stopPrice'])/Number(item['origQty'])).toString().substring(0,9)}}</p>
                            <p v-if="item.status=='CANCELED'">0</p>
                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{timestampToTime(item['time'])}}
                        </span>
                        <div v-if="item.status=='FILLED'" :class="item.side">已成交</div>
                        <div v-if="item.status=='CANCELED'" :class="item.side">已撤销</div>
                    </div>
                </div>
                <div v-if="isShow==0" class="iconfont icon-dingdan">
                    <p>您还没有任何委托记录</p>
                </div>
            </div>
            <!-- <div v-if="isNum==1" class="xianshi">
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
                        <div :class="item.other">已完成</div>
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
import remote from "../../lib/js/remote.js";
import { MessageBox } from "mint-ui";
import axios from "axios";
import { urljm } from "../../lib/js/jsmi.js";
export default {
    data() {
        return {
            isNum: 0,
            historybuy: [],
            isShow: null,
            isShow1: null,
            Biankey: [],
            symbol: "",
            cc: "",
            cbUnsettledBian1:[]
        };
    },
    created() {
        this.getBian();
    },
    mounted() {},
    methods: {
        cbunse(res) {
              this.$toStatistic("cbDealbuybianhistroy", "查看币安交易记录");
            
            if (res == 0) {
                this.isNum = 0;
                this.getBian();
            } else if (res == 1) {
                this.cbUnsettledBian1=[];
                this.isNum = 1;
                this.axiosdata(1);
            } else if (res == 2) {
                this.cbUnsettledBian1=[];
                this.isNum = 2;
                this.axiosdata(2);
            } else if (res == 3) {
                this.cbUnsettledBian1=[];
                this.isNum = 3;
                this.axiosdata(3);
            }
        },
        axiosdata(type) {
            remote
                .selectAllOrderId({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(
                        this.$store.state.userInfo.phone
                    ),
                    smybol: this.symbol,
                    master: "binance", //交易所
                    type: type //交易形式 1 2 3
                })
                .then(res => {
                    // console.log(res);
                    if (res.data.status == 1) {
                        let orderId = res.data.list;
                        if (orderId.length == 0) {
                            console.log(64646445);

                            this.isShow = 0;
                        } else {
                            this.isShow = 1;
                            let arr = [];
                            var arr1;
                            let _this = this;
                            let i = 0;
                            orderId.forEach(element => {
                                remote
                                    .selectinfoOrderIdBA({
                                        apikey: urljm(this.Biankey.apikey),
                                        secret: urljm(this.Biankey.secretkey),
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
        },
        getBian() {
            this.isShow1=0
            let _this = this;
            this.Biankey = JSON.parse(
                decryptByKey(localStorage.getItem("biankey"))
            );
            // this.Biankey.apikey = urljm(this.Biankey.apikey); //这个是加密后的
            // this.Biankey.secretkey = urljm(this.Biankey.secretkey); //这个是加密后的
            this.symbol =
                JSON.parse(localStorage.getItem("counterparty")).coin +
                JSON.parse(localStorage.getItem("counterparty")).counterparty;
            this.cc =
                JSON.parse(localStorage.getItem("counterparty")).coin +
                "/" +
                JSON.parse(localStorage.getItem("counterparty")).counterparty;

            let url = `http://chaobi.lian2345.com/api/chaobi/deal/binance/allOrders/dfdsafadf?apikey=${
                urljm(this.Biankey.apikey)
            }&secret=${urljm(this.Biankey.secretkey)}&symbol=${this.symbol}`;
            // console.log(url);

            axios.post(url).then(res => {
                console.log(res);
                
                if (res.data.list.data.length == 0) {
                    _this.isShow = 0;
                } else {
                    this.historybuy = res.data.list.data.reverse();
                }
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
        }
    }
};
</script>
<style>
.cbhistoryBian {
    margin-top: 2.8rem;
}
@import "../../lib/css/noDealbugsell.css";
</style>


