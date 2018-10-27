<template>
<!-- ?? -->
    <div @touchmove='event'>
        <ul class="subtitle" id="subtitle">
            <li v-tap="{methods:showDropdown,params:showdropdown}">
                <span>交易对</span>
                <div class="arrowBox one">
                    <i id="downArrow" class="highlight"></i>
                </div>
                <div v-show="showdropdown" class="dropdown">
                    <i class="dropdownArrow"></i>
                    <p v-for="(item,i) in counterpartyList" :key="i" v-tap="{methods:selectCounterparty,params:item}">{{item}}</p>
                </div>
            </li>
            <li v-tap="{methods:priceSort,params:pricesortStyle}">
                <span>当前价</span>
                <div class="arrowBox">
                    <i id="upArrow" :class="{'highlight':pricesortStyle == 'up'}"></i>
                    <i id="downArrow" :class="{'highlight':pricesortStyle == 'down'}"></i>
                </div>
            </li>
            <li v-tap="{methods:percentChangeSort,params:percentChangeSortStyle}">
                 <span>涨跌幅(24h)</span>
                <div class="arrowBox">
                    <i id="upArrow"  :class="{highlight:percentChangeSortStyle == 'up'}"></i>
                    <i id="downArrow" :class="{highlight:percentChangeSortStyle == 'down'}"></i>
                </div>
            </li>
        </ul>
        <ul id="quotationList" class="quotation-list">
            <li  v-for="(item,i) in counterpartyCoinList" :key="i" v-tap="{methods:quotationDetail,query:{symbol:item.symbol,coin:item.coin,counterparty:item.counterparty,marketName:'Gate',exchangeRate:item.exchangePrice}}">
                <quo-item :symbol="item.symbol"
                :lastest-price="item.close"
                :percent-change="item.percentChange"
                :exchange-rate="item.exchangePrice"
                :coin="item.coin"
                :counterparty="item.counterparty"
                ></quo-item>
                <hr />
            </li>
        </ul>
    </div>
</template>
<style scoped>
.subtitle {
  height: 0.82rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 0.3rem;
  color: #a6afba;
  position: fixed;
  left: 0;
  width: 100%;
  background-color: #e2eaee2a;
}

.subtitle > li {
  flex: 1;
  height: 0.82rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quotation-list {
  padding-top: 0.82rem;
}
.arrowBox {
  width: 0.46rem;
  height: 0.82rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#downArrow {
  border-width: 0.12rem 0.1rem;
  border-style: solid;
  border-color: #a6afba transparent transparent;
  opacity: 0.2;
}

#downArrow.highlight {
  border-width: 0.12rem 0.1rem;
  border-style: solid;
  border-color: #a6afba transparent transparent;
  opacity: 1;
}

.arrowBox.one {
  padding-top: 0.12rem;
}

#upArrow {
  border-width: 0.12rem 0.1rem;
  border-style: solid;
  border-color: transparent transparent #a6afba;
  opacity: 0.2;
  margin-bottom: 0.03rem;
}

#upArrow.highlight {
  border-width: 0.12rem 0.1rem;
  border-style: solid;
  border-color: transparent transparent #a6afba;
  opacity: 1;
  margin-bottom: 0.03rem;
}

.dropdown {
  width: 3.38rem;
  background-color: #f8fcff;
  border: 1px solid #e2eaee;
  position: absolute;
  left: 0.46rem;
  top: 0.84rem;
  border-radius: 0.1rem;
}

.dropdown p {
  height: 1.26rem;
  padding-left: 0.5rem;
  line-height: 1.26rem;
  font-size: .44rem;
}

.dropdownArrow {
  display: block;
  width: 0.24rem;
  height: 0.24rem;
  background-color: #f8fcff;
  position: absolute;
  top: -0.17rem;
  left: 1.63rem;
  transform: rotate(45deg);
  border-width: 1px;
  border-style: solid;
  border-color: #e2eaee transparent transparent #e2eaee;
}
</style>

<script>
import quoItem from "../../commons/components/quoItem.vue";
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      showdropdown: false,
      quotationList: [],
      counterpartyList: ["usdt", "btc", "eth", "qtum"], //?????
      counterpartyCoinList: [], //???????
      exchangeRateList: {}, // ??????
      exchangeRate: Number,
      timeId: "",
      timeId1: "",
      counterpartyCoinListAll: [],
      gatecounterparty: "usdt",
      pricesortStyle: "up",
      percentChangeSortStyle: "",
      exchangeList: {},
      daoToYuan: ""
    };
  },
  components: {
    quoItem
  },
  created() {
    // console.log("Gate");
  },
  sockets: {
    connect: function() {
      //?????connect??
      // console.log("gate connected");
      // clearInterval(this.timeId)
      // clearInterval(this.timeId1)
      // this.send();
      // let _this = this;
      // this.timeId = setInterval(() => {
      //   // console.log(2);
      //   delete this.$options.sockets.alls;
      //   _this.send();
      // }, 2000);
    },

    disconnect: function() {
      // console.log("gatesocket disconnect");
    }
  },
  activated() {
    this.$socket.open();
    clearInterval(this.timeId)
    clearInterval(this.timeId1)
      this.send();
      let _this = this;
      this.timeId1 = setInterval(() => {
        // console.log(2);
        delete this.$options.sockets.alls;
        _this.send();
      }, 2000);
    if (this.counterpartyCoinList.length == 0) {
      Indicator.open({
        text: "Loading...",
          spinnerType: "snake"
        });
      }
     this.exchangeList = JSON.parse(
       window.sessionStorage.getItem("exchangeList")
    );
    this.daoToYuan = JSON.parse(window.sessionStorage.getItem("daoToYuan"));
    this.ready();
  },
  methods: {
    toTop(){
      var target = document.getElementById('quotationList')
      target.scrollIntoView();
    },
    ready() {
      document.addEventListener("click", e => {
        if (!this.$el.contains(e.target)) this.showdropdown = false;
      });
    },
    event() {
      var subtitle = document.getElementById("subtitle");
      subtitle.style.backgroundColor = "#edf1f4";
    },
    showDropdown(data) {
      // ?????
      this.showdropdown = !data.params;
    },
    selectCounterparty(data) {
      // console.log(data.params);
      this.gatecounterparty = data.params;
      this.showdropdown = false;
      let arr = [];
      this.counterpartyCoinListAll.forEach((item, i) => {
        if (item["counterparty"] == this.gatecounterparty) {
          arr.push(item);
        }
      });
      // console.log(arr);

      this.counterpartyCoinList = arr;
      this.toTop()
    },
    quotationDetail(data) {
      // ???????
      this.$router.push({
        path: "/quotationDet",
        query: {
          symbol: data.query.symbol,
          coin: data.query.coin,
          counterparty: data.query.counterparty,
          marketName: data.query.marketName,
          exchangeRate: data.query.exchangeRate
        }
      });
    },
    send() {
     
      this.$socket.emit("gate", { type: "alls" });
      this.$options.sockets.alls = gateData => {
        let data = JSON.parse(gateData);
        Indicator.close();
        let arr = [];
        for (let key in data) {
          arr.push({
            symbol: key,
            percentChange: data[key].percentChange,
            close: Number(data[key].last)
          });
        }
        let arr1 = [];
        let arrusdt = [];
        let arrbtc = [];
        let arreth = [];
        let arrqtum = [];
        arr.forEach((item, i) => {
          let coin = item.symbol.split("_")[0];
          let counterparty = item.symbol.split("_")[1];
          let exchangePrice = "";

          arr1[i] = {
            close: item.close,
            symbol: item.symbol,
            percentChange: Number(item.percentChange),
            counterparty: counterparty,
            coin: coin
          };
          if (counterparty == "btc") {
            arr1[i]["exchangePrice"] =
              Number(this.exchangeList["BTCUSDT"].lastPrice) * this.daoToYuan;
            arrbtc.push(arr1[i]);
          } else if (counterparty == "eth") {
            arr1[i]["exchangePrice"] =
              Number(this.exchangeList["ETHUSDT"].lastPrice) * this.daoToYuan;
            arreth.push(arr1[i]);
          } else if (counterparty == "usdt") {
            arr1[i]["exchangePrice"] = 1 * this.daoToYuan;
            arrusdt.push(arr1[i]);
          } else if (counterparty == "qtum") {
            arr1[i]["exchangePrice"] =
              Number(this.exchangeList.qtum_usdt.last) * this.daoToYuan;
            arrqtum.push(arr1[i]);
          }
        });
        if (this.gatecounterparty == "btc") {
          data = arrbtc;
        } else if (this.gatecounterparty == "eth") {
          data = arreth;
        } else if (this.gatecounterparty == "qtum") {
          data = arrqtum;
        } else if (this.gatecounterparty == "usdt") {
          data = arrusdt;
        } else {
          data = arr1;
        }
        this.counterpartyCoinListAll = arr1;
        // 根据当前价排序
        if (this.pricesortStyle == "up") {
          data = this.sort(
            data,
            "close"
          );
        } else if (this.pricesortStyle == "down") {
          data = this.sort(
            data,
            "close"
          ).reverse();
        }
        // 涨跌幅排序
        if (this.percentChangeSortStyle == "up") {
          data = this.sort(
            data,
            "percentChange"
          );
        } else if (this.percentChangeSortStyle == "down") {
          data = this.sort(
            data,
            "percentChange"
          ).reverse();
        }
        this.counterpartyCoinList = data
        data = null
      };
      
    },
    priceSort(data) {
      this.percentChangeSortStyle = "";
      if (data.params == "" || data.params == "down") {
        this.pricesortStyle = "up";
        this.counterpartyCoinList = this.sort(
          this.counterpartyCoinList,
          "close"
        );
      } else if (data.params == "up") {
        this.pricesortStyle = "down";
        this.counterpartyCoinList = this.sort(
          this.counterpartyCoinList,
          "close"
        ).reverse();
      }
      this.toTop()
    },
    percentChangeSort(data) {
      this.pricesortStyle = "";
      if (data.params == "" || data.params == "down") {
        this.percentChangeSortStyle = "up";
        this.counterpartyCoinList = this.sort(
          this.counterpartyCoinList,
          "percentChange"
        );
      } else if (data.params == "up") {
        this.percentChangeSortStyle = "down";
        this.counterpartyCoinList = this.sort(
          this.counterpartyCoinList,
          "percentChange"
        ).reverse();
      }
      this.toTop()
    },
    sort(arr, call) {
      // 冒泡排序
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          let temp;
          if (arr[j][call] < arr[j + 1][call]) {
            temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }
      return arr;
    }
  },
  deactivated() {
    // console.log("dea---leave");
    clearInterval(this.timeId);
    clearInterval(this.timeId1);
    document.removeEventListener("click", e => {
        if (!this.$el.contains(e.target)) this.showdropdown = false;
      })
    this.$socket.close();
    Indicator.close();
    let sockets = this.$options["sockets"];
    if (sockets) {
      Object.keys(sockets).forEach(key => {
        delete this.$options.sockets[key];
      });
    }
    
  }
};
</script>