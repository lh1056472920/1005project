<template>
    <!-- 云委托 -->
    <div class="arbitragenmodel">
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">免责声明</span>
        </header>
        <div class="hearder"></div>
        <main>
            <p>
                授权本炒币助手后，所有的交易均在所授权的交易所能产看到交易记录，并且我们官方是无法通过该账户转账给任何人，详情请阅读每个交易所的API授权说明。
                <br><br>
                本炒币助手均为策略交易，不保证100%盈利，如有疑问，请联系官方客服。<br>
                设置自动化程序交易后，资产盈亏，本公司不担负任何责任。<br>

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

