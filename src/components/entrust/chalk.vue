<template>
    <div class="fenbi">
        <header>
            <div @click="clickUser" class="user">
                <span class="iconfont icon-fanhui"></span>
            </div>
            <span>分笔委托（VIP）</span>
            <div class="search-box">
                <span class="iconfont">历史记录</span>
            </div>
        </header>
        <main>
            <div v-if="isShow==0" class="xianshi" v-for="(item,i) in datacb" :key="i">
                <div class="mainsale">
                    <div :class="item.other">
                        <span class="one">{{item.smybol}}（{{item.master}}）</span>

                        <span v-if="item.other=='sell'" class="two">卖出</span>
                        <span v-if="item.other=='buy'" class="two">买入</span>
                    </div>
                    <div class="mainBuyContent">
                        <div class="one">
                            <p v-if="item.other=='sell'">卖出总金额</p>
                            <p v-if="item.other=='buy'">买入总金额</p>
                            <p>{{item.dataOne}}</p>
                        </div>
                        <div class="one">
                            <p>单笔金额</p>
                            <p>{{item.dataTwo}}</p>
                        </div>
                        <div class="one">
                            <p>委托深度</p>
                            <p>{{item.dataThree}}%</p>
                        </div>
                        <div class="one">
                            <p v-if="item.other=='sell'">最高卖价</p>
                            <p v-if="item.other=='buy'">最高买价</p>
                            <p>{{item.dataFore}}</p>
                        </div>
                    </div>
                    <div class="mainBuyfooter">
                        <span>{{item.updateTime}}
                        </span>
                        <div class="bianji" @click="Undo(1, item.smybol,item.master,item.uuid)">编辑</div>
                        <div class="sell" @click="Undo(2,item.smybol,item.master,item.uuid)">撤销</div>
                    </div>
                </div>
            </div>
        </main>
        <div v-if="isShow==0" @click="addwt" class="footerxian">
            <i>+</i>
            <span>添加更多委托</span>
        </div>
        <div v-if="isShow==1" @click="addwt" class="addRemind">
            <i class="iconfont icon-tianjia"></i>
            <p>
                您还没有设置分笔委托，马上设置吧 ~
            </p>
        </div>
    </div>
</template>
<style>
.fenbi .addRemind {
    margin-top: 1.6rem;
    text-align: center;
    padding-top: 2.6rem;
    
}
.fenbi .addRemind i {
    font-size: 1.5rem;
    color: #42c300;
    background-color: #cbe9c4;
    border-radius: 8px;
}
.fenbi .addRemind p {
    color: #42c300;
    margin-top: 0.5rem;
}
.footerxian {
    width: 100%;
    text-align: center;
    color: #868686;
    font-size: 0.42rem;
}
.mainBuyfooter .bianji {
    position: absolute;
    right: 1.8rem;
    bottom: 0.4rem;
    font-size: 0.42rem;
    color: #5868d1;
}
.fenbi header {
    top: 0;
    position: fixed;
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
.fenbi header > span {
    font-weight: bold;
    font-size: 0.52rem;
    margin-left: 1.2rem;
}
.fenbi .user {
    margin-left: 4%;
}
.fenbi .search-box {
    margin-right: 4%;
}
.fenbi .search-box span {
    font-size: 0.42rem;
    color: #999;
}
.fenbi main {
    margin-top: 1.7rem;
}
@import "../../lib/css/noDealbugsell.css";
</style>

<script>
import { Toast, MessageBox } from "mint-ui";
import { urljm } from "../../lib/js/jsmi.js";
import remote from '../../lib/js/remote.js';
export default {
    name: "chalk",
    data() {
        return {
            cbUnsettledBian: [],
            isShow: 1,
            // isShow1: null,
            biankey: {},
            symbol: "",
            cc: "",
            datacb: []
        };
    },
    created() {
        this.axiosdata();
        this.$toStatistic('chalk');
    },
    methods: {
        addwt() {
              this.$toStatistic("chalkfenbi", "分笔委托添加");
            this.$router.push({
                path: "/addRemind"
            });
        },
        clickUser() {
            this.$router.goBack();
        },
        Undo(data, data1, data2, data3) {
            console.log(data1);
            console.log(data2);
            console.log(data3);
            
            if (data == 1) {
                let marketName, coin, counterparty1;
                if (data2 == "binance") {
                    console.log(data1);
                    
                    data1 = data1.toUpperCase();
                    marketName = "币安";
                    if (data1.substring(data1.length - 3) == "BTC") {
                        counterparty1 = "BTC";
                        coin = data1
                            .split("")
                            .reverse()
                            .join("")
                            .slice(3)
                            .split("")
                            .reverse()
                            .join("");
                    } else if (data1.lastIndexOf("USDT") > 0) {
                        counterparty1 = "USDT";
                        coin = data1.split("USDT")[0];
                    } else if (data1.lastIndexOf("BNB") > 0) {
                        counterparty1 = "BNB";
                        coin = data1.split("BNB")[0];
                    } else if (data1.lastIndexOf("ETH") > 0) {
                        counterparty1 = "ETH";
                        coin = data1.split("ETH")[0];
                    }
                } else if (data2 == "okex") {
                    marketName = "Okex";
                    coin = data1.split("_")[0];
                    counterparty1 = data1.split("_")[1];
                } else if (data2 == "huobi") {
                    marketName = "火币";
                    if (data1.substring(data1.length - 3) == "btc") {
                        counterparty1 = "btc";
                        coin = data1
                            .split("")
                            .reverse()
                            .join("")
                            .slice(3)
                            .split("")
                            .reverse()
                            .join("");
                    } else if (data1.lastIndexOf("eth") > 0) {
                        counterparty1 = "eth";
                        coin = data1.split("eth")[0];
                    } else if (data1.lastIndexOf("ht") > 0) {
                        counterparty1 = "ht";
                        coin = data1.split("ht")[0];
                    } else if (data1.lastIndexOf("usdt") > 0) {
                        counterparty1 = "usdt";
                        coin = data1.split("usdt")[0];
                    }
                } else {
                    marketName = "ZB";
                    if (data1.substring(data1.length - 3) == "btc") {
                        counterparty1 = "btc";
                        coin = data1
                            .split("")
                            .reverse()
                            .join("")
                            .slice(3)
                            .split("")
                            .reverse()
                            .join("");
                    } else if (data1.lastIndexOf("zb") > 0) {
                        counterparty1 = "zb";
                        coin = data1.split("zb")[0];
                    } else if (data1.lastIndexOf("usdt") > 0) {
                        counterparty1 = "usdt";
                        coin = data1.split("usdt")[0];
                    }
                }
                let counterparty = {
                    coin: coin,
                    counterparty: counterparty1,
                    marketName: marketName
                };
                localStorage.setItem(
                    "counterparty",
                    JSON.stringify(counterparty)
                );
                this.$router.push({
                    path: "/cbDealBuy"
                });
            } else if (data == 2) {
                MessageBox.confirm(
                    "撤销该订单，将停止该币种的云委托功能，可再次开启该功能。"
                ).then(res => {
                    this.axiosdata1(data1, data2, data3);
                });
            }
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
        axiosdata() {
            if (!this.$store.state.userInfo) {
                MessageBox.confirm("您还未登录，是否登录").then(res => {
                    this.$router.push({
                        path: "/login"
                    });
                });
            } else {
                 remote.selectAllHistory({
                    userid: urljm(this.$store.state.userInfo.uid),
                    username: urljm(
                        this.$store.state.userInfo.phone
                    ),
                    type: 1//交易形式 1 2 3
                }).then(res => {
                    console.log(res);
                    
                    if (res.data.status == 1) {
                        this.datacb = res.data.list;
                        if (this.datacb.length==0 ) {
                            
                            this.isShow = 1;
                        }else {
                            this.isShow = 0;
                            
                        }
                    }  else if (res.data.status == "777") {
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
            }
        },
        //撤单
        axiosdata1(master, symbol, uuid) {
            remote.deleteByPrimaryKey({
                 userid: urljm(this.$store.state.userInfo.uid),
                username: urljm(
                    this.$store.state.userInfo.phone
                ),
                smybol: symbol,
                master: master, //交易所
                type: 1, //交易形式 1 2 3
                uuid: uuid
            }).then(res => {
                if (res.data.status == 1 && res.data.list == 1) {
                    MessageBox("温馨提示", "撤销成功");
                    this.isShow = 1;
                    this.axiosdata();
                }
            });
        }
    }
};
</script>


