<template>
    <div class="bigunit">
        <header>
            <i class="iconfont icon-fanhui" @click="goback"></i>
            <span>大单买卖提醒</span>
            <router-link to='/historyWarning'>历史预警</router-link>
        </header>
        <main>
            <div v-if="changeArr.length ===0" @click="goSearch" class="addRemind">
                <i class="iconfont icon-tianjia" @click='goSearch'></i>
                <p>
                    您还没有添加异常波动提醒，马上添加吧 ~
                </p>
            </div>
            <ul class="remind" v-if="changeArr.length>0">
                <li v-for="(item,i) in changeArr" :key="i">
                    <div class="content" @touchstart='touchStart(i)' @touchmove='touchMove(i)' @touchend='touchEnd(i)' :style="item.deleteSlider">
                        <div class="price-name">
                            <span>{{item.remindData.coin}}/{{item.remindData.counterparty}}</span>
                            <span>{{item.marketName}}</span>
                            <mt-switch class="swtich" v-model="item.remind" @change="changeStatus(item.id)"></mt-switch>
                        </div>
                        <div class="price-num">
                            <span>{{item.remindData.type}}</span>
                            <span>{{item.remindData.num}}</span>
                            <i @click="goMove(item,3)">编辑</i>
                        </div>
                    </div>
                    <div class="remove" ref='remove' :style="item.deleteSlider">
                        <span @click="deleteRemind(item.id)">删除</span>
                    </div>
                </li>
                <li class="add-remind">
                    <span @click='goSearch'>+ 添加涨跌预警</span>
                </li>
            </ul>
        </main>
    </div>
</template>

<script>
import remote from "../../lib/js/remote.js";
export default {
    data() {
        return {
            switchValue1: true,
            arrList: [],
            changeArr: "",
            startX: 0, //触摸位置
            endX: 0, //结束位置
            moveX: 0, //滑动时的位置
            disX: 0, //移动距离
            // deleteSlider: [], //滑动时的效果,使用v-bind:style="deleteSlider"
            userId: ""
        };
    },
    created() {
        //获取userId
        this.getUserId();
        this.getInitializeData();
        this.$toStatistic('bigUnit');
    },
    methods: {
        getUserId() {
            this.userId = this.$store.state.userInfo.uid;
        },
        getInitializeData() {
            let params = {
                typeId: 3,
                uid: this.userId
            };
            remote.select_all(params).then(res => {
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
        goSearch() {
            this.$router.push({ path: "addRemind" });
        },
        goMove(item, i) {
            let that = this;
            console.log(item);
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
                    var param = { id: key };
                    remote.delete_remind(param).then(res => {
                        if (res.data.code === "200") {
                            this.getInitializeData();
                        }
                    });
                })
                .catch(err => {});
        },
        touchStart(num, ev) {
            ev = ev || event;
            //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕

            if (ev.touches.length == 1) {
                // 记录开始位置
                this.startX = ev.touches[0].clientX;
            }
            // console.log(this.array)
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
        },
        changeStatus(key) {
            let url = "kpl/wallert/remind/remindOrNot";
            var params = new URLSearchParams();
            params.append("id", key);
            // params.append('deleteSlider', item.deleteSlider)
            this.$axios.post(url, params).then(res => {
                if (res.data.code === "200") {
                    this.$toast({
                        message: "修改成功",
                        position: "bottom",
                        duration: 500
                    });
                }
            });
        }
    },
    activated() {
        console.log("组件激活");
    }
};
</script>

<style>
.bigunit header {
    position: fixed;
    z-index: 999;

    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
    height: 1.6rem;
    line-height: 1.6rem;
    box-shadow: 2px 2px 5px #e6eef2;
    background-color: #f4f7f9;
}
.bigunit header i {
    font-size: 18px;
}
.bigunit main {
    padding-top: 1.8rem;
}
.bigunit header span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    font-weight: 700;
    color: #374452;
}
.bigunit header a {
    float: right;
    font-size: 12px;
    color: #48c122;
}
.bigunit main .addRemind {
    margin-top: 155px;
    text-align: center;
}
.bigunit main .addRemind i {
    font-size: 50px;
    color: #42c300;
    background-color: #cbe9c4;
    border-radius: 8px;
}
.bigunit main .addRemind p {
    color: #42c300;
    margin-top: 15px;
}
.bigunit .remind li {
    margin-bottom: 8px;
    height: 82px;
    box-shadow: 2px 2px 2px rgba(230, 238, 242, 1);
    width: 100%;
    position: relative;
    overflow: hidden;
}
.bigunit .remind li .price-name {
    box-sizing: border-box;
    padding: 0 15px;
    height: 41px;
    border-bottom: 1px solid #e2eaee;
}
.bigunit .remind li .price-name span {
    font-size: 16px;
    line-height: 41px;
}
.bigunit .remind li .price-name span:nth-child(2) {
    margin-left: 8px;
    font-size: 12px;
    color: #a6afba;
}
.bigunit .swtich {
    padding-top: 8px;
    display: inline-block;
    float: right;
}
.bigunit .remind li .price-num {
    height: 41px;
    box-sizing: border-box;
    padding: 0 15px;
    font-size: 13px;
}
.bigunit .remind li .price-num span {
    line-height: 41px;
    /* display: inline-block;
  vertical-align: top; */
}
.bigunit .remind li .price-num span:nth-child(3) {
    font-size: 12px;
    color: #a6afba;
    margin-left: 8px;
}
.bigunit .remind li .price-num i {
    float: right;
    color: #48c122;
    line-height: 41px;
}
.bigunit .content {
    background-color: #f4f7f9;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    /* 设置过渡动画 */
    transition: 0.3s;
}
.bigunit .remove {
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
.bigunit .remind .add-remind {
    box-shadow: 0 0 0;
    text-align: center;
    line-height: 82px;
    color: #42c300;
}

.bigunit .mint-msgbox-title {
    color: #42c300;
}
</style>
