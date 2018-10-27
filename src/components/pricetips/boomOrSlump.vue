<template>
    <div class="boom-slump">
        <header>
            <div class="back">
                <i class="iconfont icon-fanhui" v-tap="{methods:goback}"></i>
            </div>
            <div class="title">
                <span>暴涨暴跌提醒</span>
            </div>
            <div class="history">
                <router-link to='/historyInflation' tag='span'>历史预警</router-link>
            </div>
        </header>
        <main>

            <ul v-if='changeArr.length>0'>
                <li v-for="(item,i) in changeArr" :key="i">
                    <div class="move-box" @touchstart='touchStart(i)' @touchmove='touchMove(i)' @touchend='touchEnd(i)' :style="item.deleteSlider">
                        <div class="data-name">
                            <span class="symbol">{{item.coin}} / {{item.counterparty}}</span>
                            <span class="exchange">{{item.marketName}}</span>
                            <mt-switch class="swtich" v-model="item.remind" @change="changeRemindStatus(item)"></mt-switch>
                        </div>
                        <div class="content">
                            <span>5分钟内波动超过3%</span>
                        </div>
                    </div>
                    <div class="remove" ref='remove' :style="item.deleteSlider" v-tap='{methods:deleteRemind,params:item.id}'>删除</div>
                </li>
                <div class="add-remind-box">
                    <div class="add-switch">
                        <div>

                            <mt-switch class="switch" @change="shake"></mt-switch>
                        </div>
                        <span>闹钟提醒</span>
                        <div>
                            <mt-switch class="switch" @change="shake2"></mt-switch>

                        </div>
                        <span>短信提醒/电话提醒(VIP)</span>
                    </div>
                    <div class="add-more">
                        <span v-tap='{methods:addRemind}'>+添加更多提醒</span>
                    </div>

                </div>
            </ul>
            <div v-else class="add-remind">
                <!-- <i class="iconfont icon-tianjia add-price-tips" @click='goSearch'></i> -->
                <img src="../../../static/images/circularadd.png" v-tap='{methods:addRemind}'>
                <p>您还没有添加提醒，马上添加吧 ~</p>
            </div>
        </main>
    </div>
</template>

<script>
import remote from "../../lib/js/remote";
import { plusReady } from "../../lib/js/plusReady.js";
export default {
    data() {
        return {
            showData: true,
            userId: "",
            typeId: 4,
            changeArr: [],
            startX: 0, //触摸位置
            endX: 0, //结束位置
            moveX: 0, //滑动时的位置
            disX: 0 //移动距离
        };
    },
    created() {
        this.player = null;
        this.getInitializeData();
        this.$toStatistic('boomOrSlump');
    },
    methods: {
        addRemind() {
            this.$router.push({ path: "/floatSearch" });
        },
        goback() {
            this.$router.go(-1);
        },
        getInitializeData() {
            this.userId = this.$store.state.userInfo.uid;
            let params = {
                typeId: this.typeId,
                uid: this.userId
            };

            remote.select_all(params).then(res => {
                //遍历添加 deleteSlider 字段
                let addData = res.data.wallertMarketReminds;

                for (const item of addData) {
                    item.deleteSlider = "";
                    item.remind = Boolean(item.remind);
                    this.sliceSymbol(item);
                }

                this.changeArr = addData;
                console.log(this.changeArr);
            });
        },
        shake() {
            let remindAry = [];
            for (let i = 0; i < this.changeArr.length; i++) {
                remindAry.push(this.changeArr[i].id);
            }
            this.$remote.alarm_or_not_list({
                ids: remindAry
            }).then((res) => {
                
            })
        },
        shake2() {
            function shakeAndVibrate() {
                plus.device.vibrate(2000);
                plus.device.beep(2);
            }
            plusReady(() => {
                shakeAndVibrate()
            });
        },
        deleteRemind(data) {
            var param = { id: data.params };
            remote.delete_remind(param).then(res => {
                if (res.data.code === "200") {
                    this.getInitializeData();
                }
            });
            console.log(data);
        },
        touchStart(num, ev) {
            ev = ev || event;
            //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕

            if (ev.touches.length == 1) {
                // 记录开始位置
                this.startX = ev.touches[0].clientX;
            }
        },
        touchMove(num, ev) {
            ev = ev || event;
            //获取删除按钮的宽度，此宽度为滑块左滑的最大距离
            let wd = this.$refs.remove[num].offsetWidth;
            if (ev.touches.length == 1) {
                // 滑动时距离浏览器左侧实时距离
                this.moveX = ev.touches[0].clientX;
                //起始位置减去 实时的滑动的距离，得到手指实时偏移距离
                this.disX = this.startX - this.moveX;
                // 如果是向右滑动或者不滑动，不改变滑块的位置
                if (this.disX < 40 && this.disX >= 40) {
                    this.changeArr[num].deleteSlider =
                        "transform:translateX(0px)";

                    // 大于0，表示左滑了，此时滑块开始滑动
                } else if (this.disX > 40) {
                    //具体滑动距离我取的是 手指偏移距离*5。
                    this.changeArr[num].deleteSlider =
                        "transform:translateX(-" + this.disX * 5 + "px)";
                    // 最大也只能等于删除按钮宽度
                    if (this.disX * 5 >= wd) {
                        this.changeArr[num].deleteSlider =
                            "transform:translateX(-" + wd + "px)";
                    }
                }
            }
        },
        touchEnd(num, ev) {
            ev = ev || event;
            let wd = this.$refs.remove[num].offsetWidth;
            if (ev.changedTouches.length == 1) {
                let endX = ev.changedTouches[0].clientX;

                this.disX = this.startX - endX;
                // console.log(this.disX)
                //如果距离小于删除按钮一半,强行回到起点
                if (
                    this.changeArr[num].deleteSlider ===
                        "transform:translateX(0px)" ||
                    ""
                ) {
                    if (this.disX < wd / 2) {
                        this.changeArr[num].deleteSlider =
                            "transform:translateX(0px)";
                    } else {
                        //大于一半 滑动到最大值
                        this.changeArr[num].deleteSlider =
                            "transform:translateX(-80px)";
                    }
                } else if (
                    this.changeArr[num].deleteSlider ===
                    "transform:translateX(-80px)"
                ) {
                    if (this.disX > -40) {
                        this.changeArr[num].deleteSlider =
                            "transform:translateX(-80px)";
                    } else {
                        //大于一半 滑动到最大值
                        this.changeArr[num].deleteSlider =
                            "transform:translateX(0px)";
                    }
                }
            }
        },
        //切割交易对
        sliceSymbol(data) {
            if (data.marketName === "币安") {
                if (
                    data.marketToken.substring(data.marketToken.length - 3) ==
                    "BTC"
                ) {
                    data.counterparty = "BTC";
                    data.coin = data.marketToken.substring(
                        0,
                        data.marketToken.length - 3
                    );
                } else if (
                    data.marketToken.substring(data.marketToken.length - 3) ==
                    "btc"
                ) {
                    data.counterparty = "BTC";
                    data.coin = data.marketToken
                        .substring(0, data.marketToken.length - 3)
                        .toLocaleUpperCase();
                } else if (data.marketToken.lastIndexOf("USDT") > 0) {
                    data.counterparty = "USDT";
                    data.coin = data.marketToken.split("USDT")[0];
                } else if (data.marketToken.lastIndexOf("usdt") > 0) {
                    data.counterparty = "USDT";
                    data.coin = data.marketToken
                        .split("usdt")[0]
                        .toLocaleUpperCase();
                } else if (data.marketToken.lastIndexOf("ETH") > 0) {
                    data.counterparty = "ETH";
                    data.coin = data.marketToken.split("ETH")[0];
                } else if (data.marketToken.lastIndexOf("BNB") > 0) {
                    data.counterparty = "BNB";
                    data.coin = data.marketToken.split("BNB")[0];
                }
            } else if (data.marketName === "火币") {
                if (
                    data.marketToken.substring(data.marketToken.length - 3) ==
                    "btc"
                ) {
                    data.counterparty = "BTC";
                    data.coin = data.marketToken.substring(
                        0,
                        data.marketToken.length - 3
                    );
                } else if (data.marketToken.lastIndexOf("eth") > 0) {
                    data.counterparty = "ETH";
                    data.coin = data.marketToken
                        .split("eth")[0]
                        .toLocaleUpperCase();
                } else if (data.marketToken.lastIndexOf("ht") > 0) {
                    data.counterparty = "HT";
                    data.coin = data.marketToken
                        .split("ht")[0]
                        .toLocaleUpperCase();
                } else if (data.marketToken.lastIndexOf("usdt") > 0) {
                    data.counterparty = "USDT";
                    data.coin = data.marketToken
                        .split("usdt")[0]
                        .toLocaleUpperCase();
                }
            } else if (
                data.marketName === "zb" ||
                data.marketName === "ZB" ||
                data.marketName === "OKEx" ||
                data.marketName === "Okex" ||
                data.marketName === "okex"
            ) {
                data.coin = data.marketToken.split("_")[0].toLocaleUpperCase();
                data.counterparty = data.marketToken
                    .split("_")[1]
                    .toLocaleUpperCase();
            }
        },
        changeRemindStatus(item) {
            var params = new URLSearchParams();
            params.append("id", item.id);
            this.$remote.remind_or_not(params).then(res => {
                
            });
        }
    }
};
</script>

<style>
.boom-slump {
    height: 100%;
    background-color: #fff;
}
.boom-slump header {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    position: fixed;
    z-index: 999;
    box-sizing: border-box;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    height: 1.6rem;
    line-height: 1.6rem;
    box-shadow: 0px 2px 2px 0px rgba(230, 238, 242, 1);
}
.boom-slump header .back {
    width: 48px;
    color: #747474;
}
.boom-slump header .back i {
    font-size: 18px;
}
.boom-slump header .title {
    font-size: 18px;
    color: #374452;
    font-weight: 700;
}
.boom-slump header .history {
    text-align: right;
    line-height: 1.6rem;
    font-size: 12px;
    color: #48c122;
}
.boom-slump main {
    padding-top: 1.7rem;
}
.boom-slump main .add-remind {
    padding-top: 135px;
    text-align: center;
    color: #48c122;
}
.boom-slump main .add-remind img {
    border-radius: 2px;
    width: 1.5rem;
    margin-bottom: 28px;
}
.boom-slump main ul li {
    color: #374452;
    width: 100%;
    background-color: #fff;
    height: 82px;
    position: relative;
    /* user-select: none; */
    margin-bottom: 3px;
    overflow: hidden;
    box-shadow: 2px 2px 2px rgba(230, 238, 242, 1);
}
.boom-slump li .move-box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    /* 设置过渡动画 */
    transition: 0.3s;
}
.boom-slump li .move-box .content {
    color: #42c300;
}
.boom-slump li .remove {
    display: inline-block;
    height: 82px;
    width: 80px;
    background-color: #f43e3a;
    position: absolute;
    right: -80px;
    /* right: 0; */
    top: 0;
    color: #fff;
    text-align: center;
    font-size: 16px;
    line-height: 82px;
    transition: 0.3s;
}
.boom-slump main ul li .data-name {
    padding: 0 15px;
    box-sizing: border-box;
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #e9eff3;
}
.boom-slump .data-name .symbol {
    font-size: 14px;
    line-height: 41px;
    margin-right: 10px;
}
.boom-slump .data-name .exchange {
    font-size: 12px;
    color: #a6afba;
    line-height: 41px;
}
.boom-slump .data-name .swtich {
    padding-top: 8px;
    display: inline-block;
    float: right;
}
.boom-slump main ul li .content {
    padding: 0 15px;
    box-sizing: border-box;
    height: 41px;
    width: 100%;
}
.boom-slump main ul li .content span {
    font-size: 14px;
    line-height: 41px;
}
.boom-slump .switch {
    display: inline-block;
}
.boom-slump .add-remind-box {
    height: 6.6rem;
    background-color: #f8fafb;
}
.boom-slump .add-remind-box .add-more {
    height: 5rem;
    line-height: 5rem;
    text-align: center;
    color: #42c300;
}
.boom-slump .add-remind-box .add-more span {
    display: inline-block;
    width: 4rem;
    height: 1rem;
    line-height: 1rem;
}
.boom-slump .add-remind-box .add-switch {
    padding-left: 0.4rem;
    height: 1.6rem;
    line-height: 1.6rem;
}
.boom-slump .add-remind-box .add-switch div {
    display: inline-block;
    vertical-align: -webkit-baseline-middle;
}
</style>

