<template>
    <div class="price-remind">
        <header>
            <div class="back">
                <i class="iconfont icon-fanhui" @click="goback"></i>
            </div>
            <div class="title">
                <span>价格提醒</span>
            </div>
            <div class="go-history">
                <router-link to='/historyWarning'>历史预警</router-link>
            </div>
        </header>

        <div class="nav">
            <span @click="checkindex(1)" :class="{activeWarning: activeIndex==1}">涨跌预警</span>
            <span @click="checkindex(2)" :class="{activeWarning: activeIndex==2}">价差预警</span>
        </div>
        <div class="information">
            <div v-if="changeShow === 1">
                <div v-if="changeArr.length===0" class="add-price">
                    <i class="iconfont icon-tianjia add-price-tips" @click='goSearch'></i>
                    <p>您还没有添加提醒，马上添加吧 ~</p>
                </div>
                <div v-if="changeArr.length!==0" class="box" v-for="(item,i) in changeArr" :key="i">
                    <div class="content" @touchstart='touchStart(i)' @touchmove='touchMove(i)' @touchend='touchEnd(i)' :style="item.deleteSlider">
                        <div class="price-limit">
                            <div class="price-name">
                                <span>{{item.remindData.coin}}/{{item.remindData.counterparty}}</span>
                                <span>{{item.marketName}}</span>
                                <mt-switch class="swtich" v-model="item.remind" @change="turnSwitch(item.id)"></mt-switch>
                            </div>
                            <div class="price-num" v-if="item.remindData.type !== '涨跌幅'">
                                <span>{{item.remindData.type}}</span>
                                <span>{{item.remindData.num}} {{item.remindData.counterparty}}</span>
                                <span>≈¥ {{item.remindData.price}}</span>
                                <i @click="getMove(item,1)">编辑</i>
                            </div>
                            <div class="price-num" v-if="item.remindData.type === '涨跌幅'">
                                <span>{{item.remindData.type}}</span>
                                <span>{{item.remindData.num}} %</span>
                                <i @click="getMove(item,1)">编辑</i>
                            </div>
                        </div>
                    </div>
                    <div class="remove" ref='remove' :style="item.deleteSlider" :class="{move:active===i}">
                        <span @click="deleteRemind(item.id)">删除</span>
                    </div>
                </div>

                <div v-if="changeArr.length!==0" class="add-price-limit">
                    <span @click='goSearch'>
                        + 添加涨跌预警
                    </span>
                </div>
            </div>
            <div v-if="changeShow === 2">
                <div v-if="changeArr.length===0" class="add-price">
                    <i class="iconfont icon-tianjia add-price-tips" @click='goSearch'></i>
                    <p>您还没有添加提醒，马上添加吧 ~</p>
                </div>
                <div v-if="changeArr.length!==0" class="box" v-for="(item,i) in changeArr" :key="i">
                    <div class="content" @touchstart='touchStart(i)' @touchmove='touchMove(i)' @touchend='touchEnd(i)' :style="item.deleteSlider">
                        <div class="price-limit">
                            <div class="price-name">
                                <span>{{item.remindData.coin}}/{{item.remindData.counterparty}}</span>
                                <span>{{item.marketName}}</span>
                                <mt-switch class="swtich" v-model="item.remind" @change="turnSwitch(item.id)"></mt-switch>
                            </div>
                            <div class="price-num">
                                <span>{{item.remindData.type}} {{item.remindData.contrast}}</span>
                                <span>{{item.remindData.num}}{{item.remindData.counterparty}}</span>
                                <span>≈¥ {{item.remindData.price}}</span>
                                <i @click="getMove(item,2)">编辑</i>
                            </div>
                        </div>
                    </div>
                    <div class="remove" ref='remove' :style="item.deleteSlider" :class="{move:active===i}">
                        <span @click="deleteRemind(item.id)">删除</span>
                    </div>
                </div>
                <div v-if="changeArr.length!==0" class="add-price-limit">
                    <span @click='goSearch'>
                        + 添加价差预警
                    </span>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import remote from "../../lib/js/remote.js";
export default {
    data() {
        return {
            symbol: "BTC/usdt",
            coin: "btc",
            counterparty: "usdt",
            marketName: "火币",
            active: "",
            activeIndex: 1,
            changeShow: 1,
            typeId: 1,
            startX: 0, //触摸位置
            endX: 0, //结束位置
            moveX: 0, //滑动时的位置
            disX: 0, //移动距离
            changeArr: "",
            userId: "888806"
        };
    },
    created() {
        this.getActive();
        this.getInitializeData();
        this.$toStatistic('priceRemind');
    },
    methods: {
        getInitializeData() {
            this.userId = this.$store.state.userInfo.uid;
            let params = {
                typeId: this.typeId,
                uid: this.userId
            };

            remote.select_all(params).then(res => {
                console.log(res);
                //遍历添加 deleteSlider 字段
                let addData = res.data.wallertMarketReminds;

                for (const item of addData) {
                    item.deleteSlider = "";
                    item.remindData = JSON.parse(item.remindData);
                    item.remind = Boolean(item.remind);
                    item.remindData.coin = item.remindData.coin.toLocaleUpperCase();
                    item.remindData.counterparty = item.remindData.counterparty.toLocaleUpperCase();
                }

                this.changeArr = addData;
            });
        },
        goback() {
            this.$router.go(-1);
        },
        turnSwitch(key) {
            let params = new URLSearchParams();
            params.append("id", key);
            remote.remind_or_not(params).then(res => {
                if (res.data.code === "200") {
                    this.$toast({
                        message: "修改成功",
                        position: "bottom",
                        duration: 500
                    });
                }
            });
        },

        checkindex(num) {
            this.activeIndex = num;
            this.changeShow = num;
            this.typeId = num;
            sessionStorage.setItem("priceRemindActive", num);
            this.getInitializeData(num);
        },
        getActive() {
            this.activeIndex =
                JSON.parse(sessionStorage.getItem("priceRemindActive")) || 1;
            this.changeShow =
                JSON.parse(sessionStorage.getItem("priceRemindActive")) || 1;
            this.typeId =
                JSON.parse(sessionStorage.getItem("priceRemindActive")) || 1;
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
                    showCancelButton: true,
                    cancelButtonClass: "cancelButton",
                    confirmButtonClass: "confirmButton"
                })
                .then(action => {
                    let param = { id: key };
                    remote.delete_remind(param).then(res => {
                        console.log(res);
                        if (res.data.code === "200") {
                            console.log("ok");

                            this.getInitializeData();
                        }
                    });
                })
                .catch(err => {});
        },
        goSearch() {
            this.$router.push({ path: "/addRemind" });
        },

        getMove(item, i) {
            let that = this;

            that.$router.push({
                path: "./price",
                query: {
                    symbol: item.marketToken,
                    coin: item.remindData.coin,
                    counterparty: item.remindData.counterparty,
                    marketName: item.marketName,
                    priceActive: i
                }
            });
        },
        //前往预警
        goAddRemind(i) {
            let that = this;
            that.$router.push({
                path: "./price",
                query: {
                    symbol: that.symbol,
                    coin: that.coin,
                    counterparty: that.counterparty,
                    marketName: that.marketName,
                    priceActive: i
                }
            });
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
                console.log(this.disX);
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
        }
    }
};
</script>
<style>
.price-remind header {
    z-index: 999;
    display: flex;
    justify-content: space-between;
    position: fixed;
    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
    background-color: #f4f7f9;
    height: 1.6rem;
    line-height: 1.6rem;
}
.price-remind header .back {
    width: 1.8rem;
    display: inline-block;
    vertical-align: top;
}
.price-remind header i {
    font-size: 18px;
}
.price-remind header .title {
    text-align: center;
    width: 5rem;
    display: inline-block;
    vertical-align: top;
}
.price-remind header span {
    font-size: 18px;
    font-weight: 700;
    color: #374452;
}
.price-remind header .go-history {
    width: 1.8rem;
    display: inline-block;
    text-align: right;
}
.price-remind header a {
    font-size: 12px;
    color: #48c122;
}
.price-remind .nav {
    position: fixed;
    z-index: 998;
    padding-top: 1.6rem;
    width: 100%;
    height: 1.152rem;
    background-color: #f4f7f9;
    line-height: 1.152rem;
    font-size: 0;
    margin-bottom: 8px;
    box-shadow: 2px 2px 2px rgba(230, 238, 242, 1);
}
.price-remind .nav span {
    text-align: center;
    font-size: 14px;
    display: inline-block;
    width: 50%;
}
.price-remind .activeWarning {
    height: 1.152rem;
    box-sizing: border-box;
    color: #48c122;
    border-bottom: 1px solid #48c122;
}
.price-remind .price-limit {
    margin-bottom: 8px;
    height: 82px;
    background-color: #f4f7f9;
}
.price-remind .price-limit .price-name {
    box-sizing: border-box;
    padding: 0 15px;
    height: 40px;
    border-bottom: 1px solid #e2eaee;
}
.price-remind .price-limit .price-name span {
    font-size: 16px;
    line-height: 41px;
}
.price-remind .price-limit .price-name span:nth-child(2) {
    margin-left: 8px;
    font-size: 12px;
    color: #a6afba;
}
.price-remind .swtich {
    padding-top: 8px;
    display: inline-block;
    float: right;
}
.price-remind .price-limit .price-num {
    height: 41px;
    box-sizing: border-box;
    padding: 0 15px;
}
.price-remind .price-limit .price-num span {
    line-height: 41px;
    /* display: inline-block;
  vertical-align: top; */
}
.price-remind .price-limit .price-num span:nth-child(3) {
    font-size: 12px;
    color: #a6afba;
    margin-left: 8px;
}
.price-remind .price-limit .price-num i {
    float: right;
    color: #48c122;
    line-height: 41px;
}

.price-remind .add-price-limit {
    width: 100%;
    height: 100px;
    text-align: center;
    line-height: 100px;
}
.price-remind .add-price-limit span {
    color: #48c122;
}

.price-remind .add-price {
    width: 100%;
    margin-top: 100px;
    text-align: center;
}
.price-remind .add-price .add-price-tips {
    font-size: 50px;
    color: #42c300;
    background-color: #cbe9c4;
    border-radius: 8px;
}
.price-remind .add-price p {
    color: #42c300;
    margin-top: 15px;
}
.price-remind .box {
    /* float: left; */
    width: 100%;
    height: 82px;
    position: relative;
    /* user-select: none; */
    margin-bottom: 8px;
    overflow: hidden;
    box-shadow: 2px 2px 2px rgba(230, 238, 242, 1);
}
.price-remind .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    /* 设置过渡动画 */
    transition: 0.3s;
}
.price-remind .remove {
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
.move {
    transform: translateX(-80px);
}
.price-remind .information {
    padding-top: 3rem;
}
</style>
