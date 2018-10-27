<template>
    <div class="cbmain">
        <div class="mainRight">
            <div class="mainrightnav">
                <span v-if="counterparty=='usdt'" class="left">出价（$）</span>
                <span v-if="counterparty!='usdt'" class="left">出价（{{counterparty}}）</span>
                <span class="right">数量</span>
            </div>
            <div class="mainrightbottom">
                <ul class="mainrightleft">
                    <li v-if='i<isShowone&&(isShow==1||isShow==0)' v-for="(item,i) in depthAsks" :key="i">{{Number(item[0]).toFixed(number)}}</li>
                </ul>
                <ul class="mainrightright">
                    <li v-if='i<isShowone&&(isShow==1||isShow==0)' v-for="(item,i) in depthAsks" :key="i">{{Number(item[1]).toFixed(number)}}</li>
                </ul>
            </div>
            <p class="price">{{Number(newdata).toFixed(4)}}</p>
            <p v-if="counterparty=='usdt'" class="priceone">≈{{Number(newdata*rate).toFixed(4)}}CNY</p>
            <p v-if="counterparty!='usdt'" class="priceone">≈{{Number(newdata*rate*usdtcny).toFixed(4)}}CNY</p>

            <div class="mainrighttop">
                <ul class="mainrightleft">
                    <li v-if='i<isShowone&&(isShow==2||isShow==0)' v-for="(item,i) in depthBids" :key="i">{{Number(item[0]).toFixed(number)}}</li>
                </ul>
                <ul class="mainrightright">
                    <li v-if='i<isShowone&&(isShow==2||isShow==0)' v-for="(item,i) in depthBids" :key="i">{{Number(item[1]).toFixed(number)}}</li>
                </ul>
            </div>
            <div class="select">
                <div @click="selectcontent(1)" class="selectcontent">{{decimalstxt}}
                    <i class="jiantou"></i>
                </div>
                <div v-if="isNum==0" class="selectOne">
                    <i class="jian"></i>
                    <p @click="decimals(7)">7位小数</p>
                    <p @click="decimals(6)">6位小数</p>
                    <p @click="decimals(5)">5位小数</p>
                    <p @click="decimals(4)">4位小数</p>
                </div>
                <div @click="selectcontent(2)" class="selectcontenttwo">{{decimalstxt1}}
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
</template>
<style scoped>
@import "../../../lib/css/dealbugsell.css";
</style>

<script>
import { Okexdepth, Okextircker } from "../../js/depthData.js";
export default {
    name: "newDepth",
    props: ['depthAsks','depthBids','newdata','counterparty','usdtcny'],
    data() {
        return {
            depthAsks: this.depthAsks,
            depthBids: this.depthBids,
            counterparty: this.counterparty,
            number: 4,
            isShowone: 8,
            isShow: 0,
            usdtcny: this.usdtcny,
            isNum: 1,
            isNum1: 1,
            decimalstxt: "4位小数",
            decimalstxt1: "默认",
            newdata: this.newdata,
            rate: null,
        };
    },
    created() {
        console.log(444444444444444);
        
        this.rate = JSON.parse(localStorage.getItem("rate"));
    },
    methods: {
        decimals(res) {
            switch (res) {
                case 4:
                    return (
                        (this.decimalstxt = "4位小数"),
                        (this.isNum = 1),
                        (this.number = 4)
                    );
                case 5:
                    return (
                        (this.decimalstxt = "5位小数"),
                        (this.isNum = 1),
                        (this.number = 5)
                    );
                case 6:
                    return (
                        (this.decimalstxt = "6位小数"),
                        (this.isNum = 1),
                        (this.number = 6)
                    );
                case 7:
                    return (
                        (this.decimalstxt = "7位小数"),
                        (this.isNum = 1),
                        (this.number = 7)
                    );
                case 8:
                    return (
                        (this.decimalstxt1 = "买盘"),
                        (this.isNum1 = 1),
                        (this.isShowone = 16),
                        (this.isShow = 1)
                    );
                case 9:
                    return (
                        (this.decimalstxt1 = "卖盘"),
                        (this.isNum1 = 1),
                        (this.isShowone = 16),
                        (this.isShow = 2)
                    );
                case 10:
                    return (
                        (this.decimalstxt1 = "默认"),
                        (this.isNum1 = 1),
                        (this.isShowone = 8),
                        (this.isShow = 0)
                    );
            }
        },
        selectcontent(res) {
            if (res == 1 && this.isNum == 1) {
                this.isNum = 0;
            } else if (res == 1 && this.isNum == 0) {
                this.isNum = 1;
            } else if (res == 2 && this.isNum1 == 0) {
                this.isNum1 = 1;
            } else if (res == 2 && this.isNum1 == 1) {
                this.isNum1 = 0;
            }
        }
    }
};
</script>
