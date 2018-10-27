<template>
  <div class="explain">
    <header>
      <i class="iconfont icon-fanhui" @click="goback"></i>
      <span>短线波动说明</span>
      <i class="iconfont icon-sousuo" @click="goSearch"></i>
    </header>
    <main>
      <p>信号说明</p>
      <div>
        <p>盘中大涨</p>
        <span>今日涨幅大于或等于10%以上，如果已提醒过，再次出现的条件，最新价相比上次提醒价上涨5%</span>
      </div>
      <div>
        <p>盘中大跌</p>
        <span>今日跌幅大于或等于10%以上，如果已提醒过，再次出现的条件，最新价相比上次提醒价下跌5%</span>
      </div>
      <div>
        <p>急速拉升</p>
        <span>1分钟内涨幅大于2%，并且1分钟前价格大于昨收价</span>
      </div>
      <div>
        <p>猛烈打压</p>
        <span>1分钟内跌幅大于2%，并且1分钟前价格小于昨收价</span>
      </div>
      <div>
        <p>快速反弹</p>
        <span>5分钟前的价格低于昨收和开盘，且5分钟内涨幅超过5%</span>
      </div>
      <div>
        <p>高台跳水</p>
        <span>5分钟前的价格高于昨收和开盘，且5分钟内跌幅超过5%</span>
      </div>
      <div>
        <p>大笔买入</p>
        <span>出现单笔成交额或者成交量超过阈值的主动买入成交单</span>
      </div>
      <div>
        <p>大笔卖出</p>
        <span>出现单笔成交额或者成交量超过阈值的主动卖出成交单</span>
      </div>
    </main>
  </div>
</template>

<script>

export default {
  data () {
    return {}
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    goSearch () {
      this.$router.push({
        path: "/quotationSearch"
      });
    }
  }
}
</script>

<style>
.explain header {
  position: fixed;
  padding: 0 15px;
  box-sizing: border-box;
  width: 100%;
  height: 1.6rem;
  line-height: 1.6rem;
  background-color: #f4f7f9;
  box-shadow: 0 0 5px #ccc;
  margin-bottom: 3px;
}
.explain header i {
  font-size: 18px;
}
.explain header span {
  font-size: 18px;
  font-weight: 700;
  color: #374452;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.explain header i:last-child {
  float: right;
  font-size: 20px;
  color: #48c122;
}
.explain main {
  padding-top: 1.8rem;
  padding-left: 15px;
  padding-right: 15px;
}
.explain main > p {
  margin-bottom: 10px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #374452;
}
.explain main div {
  margin-bottom: 18px;
}
.explain main div p {
  margin-bottom: 5px;
  color: #374452;
  font-weight: 700;
}
.explain main div span {
  font-size: 14px;
  line-height: 1.8;
  color: #585d63;
}
</style>
