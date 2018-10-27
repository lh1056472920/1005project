<template>
    <!-- 云委托 -->
    <div class="arbitragenmodel">
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">套利模式</span>
        </header>
        <div class="hearder"></div>
        <main>
            <p>
                套利模式，根据独家算法策略、实时行情监控、大数据精准匹配等方式，研发出来的一种独家炒币方式。
                <br><br>
                通过设置想要获得的收益率，点击开启，系统后台便时刻帮你盯盘买卖。不保证100%的成功率，建议根据官方推荐收益率设置。

            </p>
        </main>
    </div>
</template>
<style>
.arbitragenmodel {
    height: calc(100vh);
}
.arbitragenmodel .head {
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
.arbitragenmodel .hearder {
    width: 100%;
    height: 1.6rem;
}
.arbitragenmodel .head .iconfont {
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.arbitragenmodel .head .dealContent {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
    line-height: 0.5rem;
}
.arbitragenmodel .head .dealContent i {
    color: #999999;
    font-size: 0.36rem;
    font-weight: 400;
}
.arbitragenmodel main p {
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

