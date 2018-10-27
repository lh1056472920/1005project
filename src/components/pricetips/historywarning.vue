<template>
    <div class="history">
        <header>
            <div class="back">
                <i class="iconfont icon-fanhui" @click="goback"></i>
            </div>
            <div class="title">
                <span>历史预警记录</span>
            </div>
            <div class="delete">
                <a @click="deleteAll">全部删除</a>
            </div>
        </header>
        <div class="nav">
            <span @click="checkindex(1)" :class="{activeWarning: activeIndex==1}">涨跌预警</span>
            <span @click="checkindex(2)" :class="{activeWarning: activeIndex==2}">价差预警</span>
            <span @click="checkindex(3)" :class="{activeWarning: activeIndex==3}">大单买卖</span>
        </div>
        <div class="information">
            <div v-if="activeIndex === 1">
                <div class="neverSet" v-if="historyArr.length ===0">
                    <p>您还没设置过预警~</p>
                </div>
                <div v-if="historyArr.length >0">
                    <div class="price-limit" v-for="(item,i) in historyArr" :key="i">
                        <div class="price-name">
                            <span>{{item.remindData.coin}}/{{item.remindData.counterparty}}</span>
                            <span>{{item.marketName}}</span>
                            <i>{{item.tradeTime | formatDate}}</i>
                        </div>
                        <div class="price-num">
                            <span>{{item.remindData.type}}</span>
                            <span>${{item.remindData.num}}</span>
                            <span v-if="item.remindData.price"> {{item.remindData.price}}</span>
                            <i>
                                <span @click="deleteRemind(item.id)">删除</span>
                            </i>
                        </div>
                    </div>
                </div>

            </div>
            <div v-if="activeIndex === 2">
                <div class="neverSet" v-if="historyArr.length ===0">
                    <p>您还没设置过预警~</p>
                </div>
                <div v-if="historyArr.length >0">
                    <div class="price-limit" v-for="(item,i) in historyArr" :key="i">
                        <div class="price-name">
                            <span>{{item.remindData.coin}}/{{item.remindData.counterparty}}</span>
                            <span>{{item.marketName}}</span>
                            <i>{{item.tradeTime | formatDate}}</i>
                        </div>
                        <div class="price-num">
                            <span>{{item.remindData.type}}{{item.remindData.contrast}}</span>
                            <span>${{item.remindData.num}}</span>
                            <span> &nbsp;&nbsp;≈¥ {{item.remindData.price}}</span>
                            <i>
                                <span @click="deleteRemind(item.id)">删除</span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="activeIndex === 3">
                <div class="neverSet" v-if="historyArr.length ===0">
                    <p>您还没设置过预警~</p>
                </div>
                <div v-if="historyArr.length >0">
                    <div class="price-limit" v-for="(item,i) in historyArr" :key="i">
                        <div class="price-name">
                            <span>{{item.remindData.coin}}/{{item.remindData.counterparty}}</span>
                            <span>{{item.marketName}}</span>
                            <i>{{item.tradeTime | formatDate}}</i>
                        </div>
                        <div class="price-num">
                            <span class="little">{{item.remindData.type}}</span>
                            <span class="little">{{item.remindData.num}}USDT</span>
                            <i>
                                <span @click="deleteRemind(item.id)">删除</span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatDate } from "../../lib/js/date.js";
export default {
    data() {
        return {
            activeIndex: 1,
            historyArr: [],
            userId: 888806
        };
    },
    created() {
        this.getHistoryData();
    },
    methods: {
        getHistoryData() {
            let url = "kpl/wallert/remind/selectAllHistory";
            this.userId = this.$store.state.userInfo.uid;
            this.$axios
                .get(url, {
                    params: {
                        uid: this.userId,
                        typeId: this.activeIndex
                    }
                })
                .then(res => {
                    console.log(res);
                    this.historyArr = res.data.wallertMarketReminds;
                    this.historyArr.forEach(item => {
                        item.remindData = JSON.parse(item.remindData);
                        item.remindData.coin = item.remindData.coin.toLocaleUpperCase();
                        item.remindData.counterparty = item.remindData.counterparty.toLocaleUpperCase();
                    });
                });
        },
        deleteAll() {
            const htmls = `
          <div class="box">
            <div class="isunbind">确定删除提醒?</div>
          </div>
				`;
            this.$messagebox
                .confirm("", {
                    message: htmls,
                    title: "温馨提示",
                    showConfirmButton: true,
                    showCancelButton: true
                })
                .then(action => {
                    var param = {
                        typeId: this.activeIndex,
                        uid: 888807
                    };
                    let url = "kpl/wallert/remind/deletetypeId";
                    this.$axios.delete(url, { params: param }).then(res => {
                        console.log(res);
                        if (res.data.code === "200") {
                            this.getHistoryData();
                        }
                    });
                })
                .catch(err => {});
        },

        deleteRemind(key) {
            const htmls = `
          <div class="box">
            <div class="isunbind">确定删除提醒?</div>
          </div>
				`;
            this.$messagebox
                .confirm("", {
                    message: htmls,
                    title: "温馨提示",
                    showConfirmButton: true,
                    showCancelButton: true
                })
                .then(action => {
                    var param = { id: key };
                    let url = "kpl/wallert/remind/delete";
                    this.$axios.delete(url, { params: param }).then(res => {
                        console.log(res);
                        if (res.data.code === "200") {
                            this.getHistoryData();
                        }
                    });
                })
                .catch(err => {});
        },
        goback() {
            this.$router.go(-1);
        },
        checkindex(num) {
            this.activeIndex = num;
            this.getHistoryData();
        }
    },
    filters: {
        formatDate(time) {
            var date = new Date(time * 1);
            return formatDate(date, "yyyy-MM-dd hh:mm");
        }
    }
};
</script>

<style>
.history header {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    position: fixed;
    z-index: 999;
    box-sizing: border-box;
    width: 100%;
    background-color: #f4f7f9;
    height: 1.6rem;
    line-height: 1.6rem;
}
.history header div {
    display: inline-block;
    vertical-align: top;
    width: 1.8rem;
}
.history header .title {
    width: 6rem;
    text-align: center;
}
.history header .delete {
    text-align: right;
}
.history header i {
    font-size: 18px;
}
.history header span {
    font-size: 18px;
    font-weight: 700;
    color: #374452;
}
.history header a {
    font-size: 12px;
    color: #48c122;
}
.history .nav {
    width: 100%;
    position: fixed;
    z-index: 998;
    padding-top: 1.6rem;
    height: 40px;
    background-color: #f4f7f9;
    line-height: 40px;
    font-size: 0;
    margin-bottom: 8px;
    box-shadow: 2px 2px 2px rgba(230, 238, 242, 1);
}
.history .nav span {
    text-align: center;
    font-size: 14px;
    display: inline-block;
    width: 33.33%;
    color: #374452;
}
.history .nav .activeWarning {
    height: 40px;
    box-sizing: border-box;
    color: #48c122;
    border-bottom: 1px solid #48c122;
}
.history .price-limit {
    margin-bottom: 8px;
    height: 82px;
    background-color: #f4f7f9;
    box-shadow: 2px 2px 2px rgba(230, 238, 242, 1);
}
.history .price-limit .price-name {
    box-sizing: border-box;
    padding: 0 15px;
    height: 41px;
    border-bottom: 1px solid #e2eaee;
}
.history .price-limit .price-name span {
    font-size: 15px;
    line-height: 41px;
    color: #374452;
}
.history .price-limit .price-name span:nth-child(2) {
    margin-left: 8px;
    font-size: 12px;
    color: #a6afba;
}
.history .price-limit .price-name i {
    float: right;
    font-size: 13px;
    line-height: 41px;
    color: #a6afba;
}
.history .price-limit .price-num {
    height: 41px;
    box-sizing: border-box;
    padding: 0 15px;
}
.history .price-limit .price-num span {
    line-height: 41px;
    color: #374452;
}
.history .price-limit .price-num .little {
    font-size: 13px;
}
.history .price-limit .price-num span:nth-child(3) {
    font-size: 12px;
    color: #a6afba;
}
.history .price-limit .price-num i {
    float: right;
    line-height: 41px;
    font-size: 13px;
}
.history .price-limit .price-num i span {
    color: #f43e3a;
}
.history .neverSet {
    width: 100%;
    height: 200px;
}
.history .neverSet p {
    margin: 0 auto;
    line-height: 200px;
    text-align: center;
    font-size: 14px;
    color: #a6afba;
}
.history .information {
    padding-top: 3rem;
}
</style>

