<template>
    <div class="tokenDel">
        <!-- 单个币种持仓详情 -->
        <header>
            <span class="back" v-tap="{ methods: goBack }"></span>
            <span class="title">{{symbol}}持仓详情</span>
        </header>
        <main>
            <p class="sub-title">{{coin}}持仓情况</p>
            <div class="condition">
                <div class="category">
                    <p>市场总量</p>
                    <span>{{dataList.totalSupply}}亿</span>
                    <img src="../../../static/images/drawable-xxhdpi/shichang.png" alt="">
                </div>
                <div class="category">
                    <p>流通量</p>
                    <span>{{dataList.flowSupply}}亿</span>
                    <img src="../../../static/images/drawable-xxhdpi/shichang.png" alt="">
                </div>
                <div class="category">
                    <p>流通率</p>
                    <span>{{dataList.percent}}%</span>
                    <img src="../../../static/images/drawable-xxhdpi/shichang.png" alt="">
                </div>
                <div class="category">
                    <p>持仓前10占比</p>
                    <span>{{proportion10*100}}%
                    </span>
                    <img src="../../../static/images/drawable-xxhdpi/chicang.png" alt="">
                </div>
                <div class="category">
                    <p>持仓前30占比</p>
                    <span>{{proportion30*100}}%
                    </span>
                    <img src="../../../static/images/drawable-xxhdpi/chicang.png" alt="">
                </div>
                <div class="category">
                    <p>持仓前100占比</p>
                    <span>{{proportion100*100}}%
                    </span>
                    <img src="../../../static/images/drawable-xxhdpi/chicang.png" alt="">
                </div>
                <div class="category">
                    <p>流通前10占比</p>
                    <span>{{turnover10*100}}%
                    </span>
                    <img src="../../../static/images/drawable-xxhdpi/liutong.png" alt="">
                </div>
                <div class="category">
                    <p>流通前30占比</p>
                    <span>{{turnover30*100}}%
                    </span>
                    <img src="../../../static/images/drawable-xxhdpi/liutong.png" alt="">
                </div>
                <div class="category">
                    <p>流通前100占比</p>
                    <span>{{turnover100*100}}%
                    </span>
                    <img src="../../../static/images/drawable-xxhdpi/liutong.png" alt="">
                </div>
            </div>
            <p class="sub-title">{{coin}}前100变动趋势</p>

            <div id="chart" style="height:10rem"></div>

        </main>
        <ul class="subtitle">
            <li>排序</li>
            <li>地址</li>
            <li>数量</li>
            <li>持仓比例</li>
        </ul>
        <ul class="list">
            <li v-for="(item,i) in list" :key="i">
                <span>{{i+1}}</span>
                <span class="address">{{item.address}}</span>
                <span>{{item.quantity}}</span>
                <span>{{item.proportion}}%</span>
            </li>
        </ul>
    </div>
</template>

<script>
import remote from "../../lib/js/remote.js";
import echarts from "echarts";
export default {
    data() {
        return {
            dataList: "",
            list: "",
            coin: "",
            contractname: "",
            contract: "",
            proportion10: "",
            proportion30: "",
            proportion100: "",
            turnover10: "",
            turnover30: "",
            turnover100: "",
            mapData: "",
            Ydata: [],
            Xdata: [],
            symbol:'BTC'
        };
    },

    created() {
        this.getTokenData();
    },
    mounted() {},
    methods: {
        getTokenData() {
            this.name = this.$route.query.name;
            this.coin = this.$route.query.name;
            this.symbol = this.$route.query.symbol;
            this.contract = this.$route.query.contract;
            this.contractname = this.symbol + "_" + this.name;

            let params = new URLSearchParams();
            params.append("contractname", this.contractname);
            params.append("contract", this.contract);
            remote.cash_getDetailData(params).then(res => {
                let arr = res.data.data.data;
                console.log(arr);
                this.list = res.data.data.ethMarketTurnver100Vo;
                this.dataList = arr;
                this.dataList.totalSupply = (
                    this.dataList.totalSupply / 100000000
                ).toFixed(2);
                this.dataList.flowSupply = (
                    this.dataList.flowSupply / 100000000
                ).toFixed(2);
                this.dataList.percent = (
                    this.dataList.flowSupply /
                    this.dataList.totalSupply *
                    100
                ).toFixed(2);
                this.proportion10 = (arr.proportion.proportion10).toFixed(2);
                this.proportion30 = (arr.proportion.proportion30).toFixed(2);
                this.proportion100 = (arr.proportion.proportion100).toFixed(2);
                this.turnover10 = (arr.turnover.turnover10).toFixed(2);
                this.turnover30 = (arr.turnover.turnover30).toFixed(2);
                this.turnover100 = (arr.turnover.turnover100).toFixed(2);

                this.mapData = arr.rank[2].changeMap;

                let Ychange = "";
                for (const i in this.mapData) {
                    let dataList = this.timestampToTime(i);
                    this.Xdata.push(dataList);
                    Ychange = (this.mapData[i] * 100).toFixed(2) * 1;
                    this.Ydata.push(Ychange);
                }
                this.chart();
            });
        },
        goBack() {
            this.$router.goBack();
        },
        chart() {
            let that = this;

            let myChart = echarts.init(document.getElementById("chart"));

            myChart.resize();
            // 指定图表的配置项和数据
            let option = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        label: {
                            backgroundColor: "#6a7985"
                        }
                    },
                    formatter: '{b0}<br />&nbsp&nbsp {c0}%'
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        boundaryGap: false,
                        data: this.Xdata,
                        axisTick: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                        axisLine: {
                            lineStyle: {
                                color: "#4A5675" // width:2
                            }
                        },
                        type: "value",
                        splitLine: {
                            show: false
                        },
                        scale: true,
                        axisTick: {
                            show: false
                        },
                        axisLabel:{
                            formatter:'{value}%'
                        }
                    }
                ],
                series: [
                    {
                        type: "line",
                        label: {
                            normal: {
                                show: true,
                                position: "top"
                            }
                        },
                        data: this.Ydata
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        timestampToTime(timestamp) {
            var date = new Date(timestamp * 1);
            let Y = date.getFullYear() + "-";
            let M =
                (date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1) + "-";
            let D = date.getDate();
            return Y + M + D;
        }
    }
};
</script>
<style scoped>
.tokenDel {
    width: 100%;
    height: calc(100vh);
    overflow: auto;
}

header {
    width: 100%;
    height: 1.44rem;
    padding-left: 0.42rem;
    display: flex;
    justify-content: flex-start;
    background-color: rgba(244, 247, 249);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    box-shadow: 0 2px 2px #e3ebee;
}

.back {
    width: 0.8rem;
    height: 1.44rem;
    background-image: url("../../../static/images/back.png");
    background-position: 0.27rem center;
    background-size: 0.32rem 0.6rem;
    background-repeat: no-repeat;
}

.title {
    width: 8.14rem;
    height: 1.44rem;
    line-height: 1.44rem;
    text-align: center;
    font-size: 0.54rem;
    color: #404040;
}
.tokenDel main {
    padding-top: 1.7rem;
}
.subtitle {
    width: 100%;
    height: 1.4rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top: 1.44rem;
    background-color: #edf2f5;
}

.subtitle li {
    flex: 1;
    color: #374452;
    font-size: 0.36rem;
    text-align: center;
}
.subtitle li:first-child {
    flex: 0;
    flex-basis: 1.5rem;
}

.list {
    width: 100%;
    background-color: rgba(244, 247, 249);
}

.list li {
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    color: #374452;
    font-size: 0.42rem;
    display: flex;
    border-bottom: 1px solid #e2eaee55;
    box-sizing: border-box;
}

.list li span {
    flex: 1;
}

.list li span:first-child {
    flex: 0;
    flex-basis: 1.5rem;
}

.list li span.address {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
main .sub-title {
    height: 1.2rem;
    padding: 0 0.4rem;
    line-height: 1.2rem;
    color: #999999;
}
.condition {
    padding: 0 0.4rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.condition .category {
    position: relative;
    display: inline-block;
    width: 49%;
    height: 2.2rem;
    box-shadow: 0px 2px 2px 0px rgba(230, 238, 242, 1);
    margin-bottom: 4px;
    background-color: #fff;
    text-align: center;
}
.condition .category img {
    width: 0.8rem;
    position: absolute;
    top: 0;
    left: 0;
}
.condition .category p {
    padding-top: 0.4rem;
    padding-bottom: 0.2rem;
    font-size: 15px;
    color: #1a1a1a;
}
.condition .category span {
    font-size: 12px;
    color: #999999;
}
</style>
