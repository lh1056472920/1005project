<template>
    <!-- 云委托 -->
    <div class="pointsentrustment">
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">分笔委托</span>
        </header>
        <div class="hearder"></div>
        <main>
            <p>
                将大额买单/卖单拆分为多个小额订单，并且根据市场最新价格波动调整委托价格，通过连续小单委托减小大额订单对市场价格的影响。
                <br><br>
                案例1：分笔委托-买入
                <br><br>
                小明希望买入100BTC的EOS，但不希望过于影响盘面增加买入的成本，此时小王可以设置“分笔委托”。
                <br><br>
                设置买入委托的总量为100个BTC，每次下单购买的平均数量为0.1个BTC（实际每次下单数量会在90%~110%之间浮动），使用委托深度控制委托单在深度中的位置，同时设置最高买入价格控制买入价格上限。
                <br><br>
                点击“买入”，系统将为小明进行分笔委托：
                <br><br>
                - 总委托量为----小明设置的“总金额”<br>
                - 每一笔委托的数量为----小明设置的“单笔均值”的（90%~110%）<br>
                - 委托的价格为----“最新买1价*（1-小明设置的委托深度）”<br>
                - 并按照该规则，成交一笔，再委托一笔
                <br><br>
                - 当“最新成交价与委托价格偏离过大时，自动撤单并重新进行委托（委托价格距离最新成交价超过“最新成交价*（1-委托深度*2）”）<br>
                - 当“最新成交价”高于小明设置的“最高买入价格”时，停止委托，待最新成交价低于其设置的最高买入价格时恢复<br>
                - 当该委托的“总成交量”等于“委托总量”时，委托自动停止
                <br><br>
                案例2：分笔委托-卖出
                <br><br>
                小明希望卖出50,000个EOS，但不希望过于影响盘面减少卖出的获利，此时小明可以设置“分笔委托”。
                <br><br>
                设置卖出委托的总量为50,000EOS，每次下单卖出的平均数量为150EOS（实际每次下单数量会在90%~110%之间浮动），使用委托深度控制委托单在深度中的位置，同时设置最低卖出价格控制卖出价格下限。
                <br><br>
                点击“卖出”，系统将为小明进行分笔委托：
                <br><br>
                - 总委托量为----小明设置的“总数量”<br>
                - 每一笔委托的数量为----小明设置的“单笔均值”的（90%~110%）<br>
                - 委托的价格为----“最新卖1价*（1+小明设置的委托深度）”<br>
                - 并按照该规则，成交一笔，再委托一笔
                <br><br>
                - 当最新成交价与委托价格偏离过大时，自动撤单并重新进行委托（委托价格距离最新成交价超过“最新成交价*（1+委托深度*2）”）
                <br><br>
                - 当“最新成交价”低于小明设置的“最低卖出价格”时，停止委托，待最新成交价高于其设置的最低卖出价格时恢复<br>
                - 当该委托的“总成交量”等于“委托总量”时，委

            </p>
        </main>
    </div>
</template>
<style>
.pointsentrustment {

  height: calc(100vh);
}
.pointsentrustment .head {
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
.pointsentrustment .hearder {
    width: 100%;
    height: 1.6rem;
}
.pointsentrustment .head .iconfont {
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.pointsentrustment .head .dealContent {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
    line-height: 0.5rem;
}
.pointsentrustment .head .dealContent i {
    color: #999999;
    font-size: 0.36rem;
    font-weight: 400;
}
.pointsentrustment main p {
    margin-top: 0.3rem;
    font-size: 0.42rem;
    background-color: #fff;
    padding: 0.5rem;
    line-height: 0.8rem;
}
</style>
<script>
export default {
    methods:{
        goback(){
            this.$router.goBack()
        }
    }
}
</script>

