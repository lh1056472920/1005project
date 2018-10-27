<template>
    <div class="history-inflation">
        <header>
            <div class="back">
                <i class="iconfont icon-fanhui" v-tap="{methods:goback}"></i>
            </div>
            <div class="title">
                <span>历史预警记录</span>
            </div>
            <div class="delete">
                <a v-tap="{methods:deleteAll}">清空历史</a>
            </div>
        </header>
        <main>
            <ul>
                <li v-for="(item,i) in historyArr" :key="i">
                    <div class="move-box" @touchstart='touchStart(i)' @touchmove='touchMove(i)' @touchend='touchEnd(i)' :style="item.deleteSlider">
                        <div class="data-name">
                            <span class="symbol">{{item.coin}} / {{item.counterparty}}</span>
                            <span class="exchange">{{item.marketName}}</span>
                            <mt-switch class="swtich" v-model="item.remind"></mt-switch>
                        </div>
                        <div class="content">
                            <span>5分钟内波动超过3%</span>
                        </div>
                    </div>
                    <div class="remove" ref='remove' :style="item.deleteSlider" v-tap='{methods:deleteRemind,params:item.id}'>删除</div>
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
            historyArr: "",
            userId: ""
        };
    },
    created() {
        this.getHistoryData();
        this.$toStatistic('historyInflation');
    },
    methods: {
        getHistoryData() {
            this.userId = this.$store.state.userInfo.uid;
            let params = {
                uid: this.userId,
                typeId: 4
            };
            remote.select_search(params).then(res => {
                //遍历添加 deleteSlider 字段
                let addData = res.data.wallertMarketReminds;

                for (const item of addData) {
                    item.deleteSlider = "";
                    item.remind = Boolean(item.remind);
                    this.sliceSymbol(item);
                }

                this.historyArr = addData;
                console.log(this.historyArr);
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
                        typeId: 4,
                        uid: this.userId
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
                    this.historyArr[num].deleteSlider =
                        "transform:translateX(0px)";

                    // 大于0，表示左滑了，此时滑块开始滑动
                } else if (this.disX > 40) {
                    //具体滑动距离我取的是 手指偏移距离*5。
                    this.historyArr[num].deleteSlider =
                        "transform:translateX(-" + this.disX * 5 + "px)";
                    // 最大也只能等于删除按钮宽度
                    if (this.disX * 5 >= wd) {
                        this.historyArr[num].deleteSlider =
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
                    this.historyArr[num].deleteSlider ===
                        "transform:translateX(0px)" ||
                    ""
                ) {
                    if (this.disX < wd / 2) {
                        this.historyArr[num].deleteSlider =
                            "transform:translateX(0px)";
                    } else {
                        //大于一半 滑动到最大值
                        this.historyArr[num].deleteSlider =
                            "transform:translateX(-80px)";
                    }
                } else if (
                    this.historyArr[num].deleteSlider ===
                    "transform:translateX(-80px)"
                ) {
                    if (this.disX > -40) {
                        this.historyArr[num].deleteSlider =
                            "transform:translateX(-80px)";
                    } else {
                        //大于一半 滑动到最大值
                        this.historyArr[num].deleteSlider =
                            "transform:translateX(0px)";
                    }
                }
            }
        },
        deleteRemind(data){
            var param = { id: data.params };
            remote.delete_remind(param).then(res => {
                if (res.data.code === "200") {
                    this.getHistoryData();
                }
            });
            console.log(data);
        },
        goback() {
            this.$router.go(-1);
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
        }
    }
};
</script>

<style>
.history-inflation header {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    position: fixed;
    z-index: 999;
    box-sizing: border-box;
    width: 100%;
    background-color: #fff;
    height: 1.6rem;
    line-height: 1.6rem;
    box-shadow: 0px 2px 2px 0px rgba(230, 238, 242, 1);
}
.history-inflation header .back {
    width: 1.8rem;
    font-size: 18px;
    color: #808080;
}
.history-inflation header .delete {
    width: 1.8rem;
    font-size: 14px;
    color: #646464;
    text-align: right;
}
.history-inflation header .title {
    font-size: 18px;
    font-family: PingFangSC-Regular;
    font-weight: bold;
    color: rgba(26, 26, 26, 1);
}
.history-inflation main{
    padding-top: 1.7rem;
}
.history-inflation main ul li {
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
.history-inflation li .move-box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    /* 设置过渡动画 */
    transition: 0.3s;
}
.history-inflation li .move-box .content{
    color: #42C300;
}
.history-inflation li .remove {
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
.history-inflation main ul li .data-name {
    padding: 0 15px;
    box-sizing: border-box;
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #e2eaee;
}
.history-inflation .data-name .symbol {
    font-size: 14px;
    line-height: 41px;
    margin-right: 10px;
}
.history-inflation .data-name .exchange {
    font-size: 12px;
    color: #a6afba;
    line-height: 41px;
}
.history-inflation .data-name .swtich {
    padding-top: 8px;
    display: inline-block;
    float: right;
}
.history-inflation main ul li .content {
    padding: 0 15px;
    box-sizing: border-box;
    height: 41px;
    width: 100%;
}
.history-inflation main ul li .content span {
    font-size: 14px;
    line-height: 41px;
}
</style>
