<template>
  <div class="add-search">
    <header @touchmove.prevent>
      <span class="back" @click="goback"></span>
      <div class="search-form">
        <span class="search-icon"></span>
        <input class="search-input" type="text" name="search-input" v-model="searchValue" @input='changeName' placeholder="请输入搜索内容">
        <span class="search-clear"></span>
      </div>
      <button class="btn-search" @click="getSearch">搜索</button>
    </header>
    <ul class="tab" v-show="searchValue==''" @touchmove.prevent>
      <!-- <li>
        <span @click="checkindex(1)" :class="{activeTab: activeIndex==1}">自选</span>
      </li> -->
      <li>
        <span @click="checkindex(2)" :class="{activeTab: activeIndex==2}">币安</span>
      </li>
      <li>
        <span @click="checkindex(3)" :class="{activeTab: activeIndex==3}"> 火币</span>
      </li>
      <li>
        <span @click="checkindex(4)" :class="{activeTab: activeIndex==4}">OKEx</span>
      </li>
      <li>
        <span @click="checkindex(5)" :class="{activeTab: activeIndex==5}">ZB</span>
      </li>
    </ul>
    <div class="box">
      <keep-alive>
        <component v-bind:is="activeName" v-show="searchValue==''"></component>
      </keep-alive>
    </div>
    <ul class="searchLine" v-show="searchValue!==''">
      <li v-for="(item,i) in searchList" :key="i" @click="quotationDetail(item)">
        <span class="market">{{item.coin}}
          <i>{{item.counterparty}}</i>
        </span>
        <span class="type">{{item.type}}</span>
        <hr />
      </li>
      <li v-for="(item,i) in currentSearchList" :key="i" @click="quotationDetail(item)">
        <p v-html="item.marketName&&item.marketName.replace(new RegExp(searchValue,'igm'), `<span style=\'color: #f25a36;\'>${(item.marketName.indexOf(searchValue)==0)?searchValue:(searchValue.toUpperCase())}</span>`)">{{item.marketName}}</p>
        <hr />
      </li>
    </ul>
  </div>
</template>

<script>
import bian from '../quotation/bian.vue';
import huobi from '../quotation/huobi.vue';
import okex from '../quotation/okex.vue';
import zb from '../quotation/zb.vue';
import optional from '../quotation/optional.vue';
import remote from '../../lib/js/remote.js'
// import bian from '../quotation/bian.vue'
export default {
  components: {
    bian,
    huobi,
    okex,
    zb,
    optional
  },
  data () {
    return {
      searchValue: '',
      activeIndex: 2,
      activeName: "bian",
      showdropdown: false,
      quotationList: [],
      counterpartyList: ["USDT", "BTC", "ETH", "BNB"], //交易对列表
      counterpartyCoinList: [], //交易对币种列表
      exchangeRateList: {}, // 兑换汇率列表
      exchangeRate: Number,
      timeId: "",
      counterpartyCoinListAll: [],
      biancounterparty: "",
      pricesortStyle: "",
      percentChangeSortStyle: "",
      currentSearchList: [],
      searchList: []
    }
  },
  sockets: {
    connect: function () {
      //这里是监听connect事件
      // console.log("bian connected");
    },
    disconnect: function () {
      console.log("biansocket disconnect");
    }
  },
  created () {
    this.getActive()
    this.checkindex(this.activeIndex)
  },
  methods: {
    getActive () {
      this.activeIndex = Number(sessionStorage.getItem('addRemindActive')) || 2;
    },
    getSearch () {
      if (this.searchValue === '') {
        console.log('search')
        this.$router.push({
          path: "/quotationSearch"
        });
      } else {
        let params = {
          name: this.searchValue
        }
        remote.search(params).then(res => {
          this.searchList = res.data.wallertMarketsResultTypeList
          this.showSearchList = true
          let arr = [];
          this.searchList.forEach(item => {
            var counterparty = "";
            var coin = "";
            if (item.type == "币安") {
              if (item.marketName.lastIndexOf("BTC") > 0) {
                counterparty = "BTC";
                coin = item.marketName.split("BTC")[0];
              } else if (item.marketName.lastIndexOf("ETH") > 0) {
                counterparty = "ETH";
                coin = item.marketName.split("ETH")[0];
              } else if (item.marketName.lastIndexOf("BNB") > 0) {
                counterparty = "BNB";
                coin = item.marketName.split("BNB")[0];
              } else if (item.marketName.lastIndexOf("USDT") > 0) {
                counterparty = "USDT";
                coin = item.marketName.split("USDT")[0];
              }
            } else if (item.type == "火币") {
              if (item.marketName.lastIndexOf("btc") > 0) {
                counterparty = "btc";
                coin = item.marketName.split("btc")[0];
              } else if (item.marketName.lastIndexOf("eth") > 0) {
                counterparty = "eth";
                coin = item.marketName.split("eth")[0];
              } else if (item.marketName.lastIndexOf("ht") > 0) {
                counterparty = "ht";
                coin = item.marketName.split("ht")[0];
              } else if (item.marketName.lastIndexOf("usdt") > 0) {
                counterparty = "usdt";
                coin = item.marketName.split("usdt")[0];
              }
            } else if (item.type == "Gate" || "OKEx" || "zb") {
              coin = item.marketName.split('_')[0]
              counterparty = item.marketName.split('_')[1]
            }

            arr.push({
              counterparty: counterparty,
              coin: coin,
              type: item.type,
              marketName: item.marketName
            });
          })
          this.searchList = arr
        })
        this.currentSearchList = []
      }
    },
    goback () {
      this.$router.go(-1)
    },
    changeName () {
      if (this.searchValue !== '') {
        let params = {
          name: this.searchValue
        }
        remote.search(params).then(res => {
          console.log(res)
          this.currentSearchList = res.data.wallertMarketsResultTypeList
          this.showSearchList = true
          let arr = [];
          this.currentSearchList.forEach(item => {
            var counterparty = "";
            var coin = "";
            if (item.type == "币安") {
              if (item.marketName.lastIndexOf("BTC") > 0) {
                counterparty = "BTC";
                coin = item.marketName.split("BTC")[0];
              } else if (item.marketName.lastIndexOf("ETH") > 0) {
                counterparty = "ETH";
                coin = item.marketName.split("ETH")[0];
              } else if (item.marketName.lastIndexOf("BNB") > 0) {
                counterparty = "BNB";
                coin = item.marketName.split("BNB")[0];
              } else if (item.marketName.lastIndexOf("USDT") > 0) {
                counterparty = "USDT";
                coin = item.marketName.split("USDT")[0];
              }
            } else if (item.type == "火币") {
              if (item.marketName.lastIndexOf("btc") > 0) {
                counterparty = "btc";
                coin = item.marketName.split("btc")[0];
              } else if (item.marketName.lastIndexOf("eth") > 0) {
                counterparty = "eth";
                coin = item.marketName.split("eth")[0];
              } else if (item.marketName.lastIndexOf("ht") > 0) {
                counterparty = "ht";
                coin = item.marketName.split("ht")[0];
              } else if (item.marketName.lastIndexOf("usdt") > 0) {
                counterparty = "usdt";
                coin = item.marketName.split("usdt")[0];
              }
            } else if (item.type == "Gate" || "OKEx" || "zb") {
              coin = item.marketName.split('_')[0]
              counterparty = item.marketName.split('_')[1]
            }

            arr.push({
              counterparty: counterparty,
              coin: coin,
              type: item.type,
              marketName: item.marketName
            });
          })
          this.currentSearchList = arr
        })
      }
    },
    quotationDetail (data) {
      console.log(data)
      this.$router.push({
        path: "/quotationDet",
        query: {
          symbol: data.marketName,
          coin: data.coin,
          counterparty: data.counterparty,
          marketName: data.type
        }
      });
    },
    checkindex (val) {
      let that = this
      this.activeIndex = val
      if (val === 2) {
        that.activeName = 'bian'
      } else if (val === 3) {
        that.activeName = 'huobi'
      } else if (val === 4) {
        that.activeName = 'okex'
      } else if (val === 5) {
        that.activeName = 'zb'
      } else if (val === 1) {
        that.activeName = 'optional'
      }
      sessionStorage.setItem('addRemindActive', val)
    },
    getUp () {
      console.log('up')
    },
    getDown () {
      console.log('down')
    },
    checkRemind () {
      if (this.opacity === 2) {
        this.opacity = 1
      } else {
        this.opacity = 2
      }
    }
  }
}
</script>

<style scoped>
.add-search header {
  width: 100%;
  height: 1.6rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #f4f7f9;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
.add-search .back {
  display: inline-block;
  width: 0.8rem;
  height: 1.44rem;
  background-image: url('../../../static/images/back.png');
  background-position: 0.27rem center;
  background-size: 0.32rem 0.6rem;
  background-repeat: no-repeat;
}
.add-search .search-form {
  display: inline-flex;
  align-items: center;
  width: 8.14rem;
  height: 0.8rem;
  border-bottom: #29dc54 solid 1px;
}
.add-search .search-icon {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  background-image: url('../../../static/images/search-gray.png');
  background-size: 0.4rem 0.44rem;
  background-position: center;
  background-repeat: no-repeat;
}
.add-search .search-input {
  font-size: 0.36rem;
  display: inline-block;
  width: 7rem;
  height: 0.6rem;
  border: 0;
  color: #374452;
  outline: none;
  background-color: transparent;
}
.add-search ::-webkit-input-placeholder {
  color: #a6afba;
}
.add-search .search-clear {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  background-image: url('../../../static/images/clear.png');
  background-size: 0.48rem;
  background-position: center;
  background-repeat: no-repeat;
}
.add-search .btn-search {
  font-size: 0.42rem;
  padding: 0;
  border: 0;
  color: #42c300;
  background-color: transparent;
  outline: none;
}
.add-search .tab {
  width: 100%;
  height: 1.4rem;
  margin-bottom: 3px;
  box-shadow: 1px 1px 3px #ddd;
  background-color: #f4f7f9;
  padding-top: 1.6rem;
  position: fixed;
}
.add-search .tab li {
  float: left;
  width: 25%;
  line-height: 1.4rem;
  text-align: center;
  font-size: 0.46rem;
}
.add-search .tab li span {
  display: inline-block;
  box-sizing: border-box;
  height: 1.4rem;
  line-height: 1.4rem;
}
.add-search .activeTab {
  color: #42c300;
  border-bottom: 1px solid #42c300;
}

.add-search .searchLine {
  background-color: #f4f7f9;
}
.add-search .searchLine li {
  height: 1.5rem;
  padding-left: 0.42rem;
  padding-right: 0.48rem;
  line-height: 1.5rem;
  /* border-bottom: 1px solid #e2eaee55; */
}
.add-search .searchLine li .type {
  float: right;
}
.add-search .searchLine li span i {
  color: #a6afba;
  font-size: 0.3rem;
}

.box {
  padding-top: 3rem;
}

</style>
