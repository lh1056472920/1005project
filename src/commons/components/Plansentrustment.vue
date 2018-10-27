<template>
    <!-- 云委托 -->
    <div class="plansetrustement">
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">云委托</span>
        </header>
        <div class="hearder"></div>
        <main>
            <p>
                预先设置“委托”和“触发委托的条件”，当市场最新成交价格到达设定的触发条件时，系统将预先设置的委托送入市场。
                <br><br>
                案例1：云买入
                <br><br>
                - 当前ETH的市场价格低于5000元<br>
                - 投资者小王认为5000元是重要的阻力位<br>
                - 如果市场价格突破5000元，则后市会有较大幅度上涨<br>
                - 此时小明就可以设置云委托（云买入）
                <br><br>
                案例2：云卖出
                <br><br>
                - 当前ETH的市场价格高于6000元<br>
                - 投资者小明认为6000元是重要的支撑位<br>
                - 如果市场价格跌破6000元，则后市会有较大幅度下跌<br>
                - 此时小明就可以设置云委托（云卖出）

            </p>
        </main>
    </div>
</template>
<style>
.plansetrustement {
    height: calc(100vh);
}
.plansetrustement .head {
    top: 0;
    position: fixed;
    width: 100%;
    height: 1.6rem;
    line-height: 1.6rem;
    text-align: center;
    z-index: 99;
    background-color: #fff;
    box-shadow: 0px 1px 1px 2px #ccc;
}
.plansetrustement .hearder {
    width: 100%;
    height: 1.6rem;
}
.plansetrustement .head .iconfont {
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.plansetrustement .head .dealContent {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
    line-height: 0.5rem;
}
.plansetrustement .head .dealContent i {
    color: #999999;
    font-size: 0.36rem;
    font-weight: 400;
}
.plansetrustement main p {
    margin-top: 0.3rem;
    font-size: 0.42rem;
    background-color: #fff;
    padding: 0.5rem;
    line-height: 0.8rem;
}
</style>
<script>
export default {
    methods: {
        goback() {
            this.$router.goBack();
        }
    }
};
</script>

