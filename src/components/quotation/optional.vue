<template>
  <!-- 自选 -->
  <div class="optional" @touchmove='event'>
    <div class="createOptional" v-show="!showCreateOpt">
      <div class="box" v-tap="{methods:toSearch}">+</div>
      <p>{{$t('m.unAddOptional')}}</p>
    </div>
    <!-- chaonima -->
    <ul class="subtitle" v-show="optionalList.length>0" id="subtitle">
      <li class="edit" v-tap="{methods:toEdit}">编辑
        <i></i>
      </li>
      <li>{{$t('m.currentPrice')}}</li>
      <li>{{$t('m.change')}}(24h)</li>
    </ul>
    <ul class="quotation-list">
      <li v-for="(item,i) in optionalList" :key="i" v-tap="{methods:quotationDetail,query:{symbol:item.symbol,coin:item.coin,counterparty:item.counterparty,marketName:item.marketName,exchangeRate:item.exchangePrice}}">
        <optional-item :symbol="item.symbol" :lastest-price="item.close" :percent-change="item.percentChange" :exchange-rate="item.exchangePrice" :coin="item.coin" :counterparty="item.counterparty" :market-name="item.marketName"></optional-item>
        <hr />
      </li>
      <li class="add" v-show="optionalList.length>0" v-tap="{methods:toSearch}">+添加自选</li>
    </ul>
  </div>
</template>
<style scoped>
.subtitle {
  height: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 0.4rem;
  color: #a6afba;
  position: fixed;
  left: 0;
  width: 100%;
  background-color: rgb(237, 241, 244);
}

.subtitle > li {
  flex: 1;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}


.edit {
  color: #42c300;
}

.edit i {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  margin-left: 0.1rem;
  background: url('../../../static/images/edit1.png') no-repeat center;
  background-size: contain;
}

.quotation-list {
  padding-top: 1rem;
}

.createOptional {
  width: 100%;
  height: 100%;
}

.add {
  text-align: center;
  color: #42c300;
  font-size: 0.3rem;
  padding-top: 0.79rem;
  padding-bottom: 0.79rem;
}

.createOptional .box {
  width: 1.5rem;
  height: 1.5rem;
  color: #42c300;
  background-color: rgba(66, 195, 0, 0.2);
  border: 1px solid #42c300;
  border-radius: 0.1rem;
  text-align: center;
  line-height: 1.5rem;
  font-size: 0.73rem;
  font-weight: 100;
  margin: 4.68rem auto 0.48rem;
}

.createOptional p {
  width: 100%;
  text-align: center;
  font-size: 0.3rem;
  color: #a6afba;
}
</style>
<script>
import optionalItem from "../../commons/components/optionalItem.vue";
import {Indicator} from "mint-ui";
export default {
  name: 'Optional',
  data () {
    return {
      optionalList: [], // 自选项列表
      username: "",
      timeId: "",
      timeId1: "",
      exchangeList: {},
      daoToYuan: "",
      showCreateOpt: false
    };
  },
  components: {
    optionalItem
  },
  created () {
    console.log(this.showCreateOpt);
    
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
      // clearInterval(this.timeId)
      // clearInterval(this.timeId1)
      // this.test()
      // this.timeId = setInterval(()=>{
      //   let sockets = this.$options["sockets"];
      //   if (sockets) {
      //     Object.keys(sockets).forEach(key => {
      //       delete this.$options.sockets[key];
      //     });
      //   }
      //   this.test()
      // },3000)
    },
    disconnect: function (data) {
      console.log("socket disconnect");
    }
  },
  mounted () {},
  activated () {
    this.toTop()
    // if (this.optionalList.length == 0) {
    //     Indicator.open({
    //       text: "Loading...",
    //       spinnerType: "snake"
    //     });
    // }
    this.$socket.open();
    clearInterval(this.timeId)
    clearInterval(this.timeId1)
    this.test()
    this.timeId1 = setInterval(() => {
      let sockets = this.$options["sockets"];
      if (sockets) {
        Object.keys(sockets).forEach(key => {
          delete this.$options.sockets[key];
        });
      }
      this.test()
    }, 3000)

    this.exchangeList = JSON.parse(window.sessionStorage.getItem("exchangeList"));
    this.daoToYuan = JSON.parse(window.sessionStorage.getItem("daoToYuan"));
    let user = this.$store.state.userInfo;
    this.username = user.username;


  },
  methods: {
    toTop(){
      // var target = document.getElementById('quotationList')
      // target.scrollTo(0,0)
      window.scrollTo(0,0)
    },
    toEdit () {
      this.$router.push({
        path: '/EditOptional'
      })
    },
    event () {
      var subtitle = document.getElementById("subtitle");
      subtitle.style.backgroundColor = "#edf1f4";
    },
    test () {
      // Indicator.close();
      let optionalListArr = JSON.parse(window.sessionStorage.getItem("optionalList"));
      // console.log(optionalListArr);
      if (optionalListArr.length == 0) {
        this.showCreateOpt = false
        this.optionalList = []
        // Indicator.close();
        return
      }
      this.showCreateOpt = true
      let arr = [];
      arr = optionalListArr;
      arr.forEach((item, i) => {
        if (item.marketName == "ZB") {
          item.marketName = "zb";
        } else if (item.marketName == "Okex") {
          item.marketName = "OKEx";
        }
      });
      let dataArr = []
      // console.log(arr);

      this.$socket.emit("selectmarkets", {datas: arr}); //向服务器发送消息.获取自选交易对数据
      this.$options.sockets.biance = bianData => {
        let data = JSON.parse(bianData);
        data['marketName'] = "币安"
        data['marketToken'] = data["symbol"]
        data["close"] = Number(data["lastPrice"]);
        data["percentChange"] = Number(data["priceChangePercent"]);
        optionalListArr.forEach(item => {
          if (item.marketToken == data.marketToken && item.marketName == data.marketName) {
            data['uuid'] = item.uuid
          }
        })
        dataArr.push({
          marketName: data['marketName'],
          marketToken: data['marketToken'],
          close: data['close'],
          percentChange: data['percentChange'],
          uuid: data['uuid'],
        })

        if (dataArr.length == optionalListArr.length) {
          this.changeDataFormat(dataArr,optionalListArr);
          dataArr = null
          optionalListArr = null
          arr = null
        }
      }
      this.$options.sockets.huobi = huobiData => {
        let data = JSON.parse(huobiData);
        data['marketName'] = "火币"
        data['marketToken'] = data["symbol"]
        data["close"] = Number(data["close"]);
        data["percentChange"] = (
          (Number(data["close"]) - Number(data["open"])) *
          100 /
          Number(data["open"])
        ).toFixed(2);
        optionalListArr.forEach(item => {
          if (item.marketToken == data.marketToken && item.marketName == data.marketName) {
            data['uuid'] = item.uuid
          }
        })
        dataArr.push({
          marketName: data['marketName'],
          marketToken: data['marketToken'],
          close: data['close'],
          percentChange: data['percentChange'],
          uuid: data['uuid'],
        })

        if (dataArr.length == optionalListArr.length) {
          this.changeDataFormat(dataArr,optionalListArr);
          dataArr = null
          optionalListArr = null
          arr = null
        }
      }
      this.$options.sockets.okex = okexData => {
        let data = JSON.parse(okexData);
        data['marketName'] = "Okex";
        data['marketToken'] = data["symbol"]
        data["close"] = Number(data["last"]);
        data["percentChange"] = (
          (Number(data["last"]) - Number(data["buy"])) *
          100 /
          Number(data["buy"])
        ).toFixed(2);
        optionalListArr.forEach(item => {
          if (item.marketToken == data.marketToken && item.marketName == 'OKEx') {
            data['uuid'] = item.uuid
          }
        })
        dataArr.push({
          marketName: data['marketName'],
          marketToken: data['marketToken'],
          close: data['close'],
          percentChange: data['percentChange'],
          uuid: data['uuid'],
        })

        if (dataArr.length == optionalListArr.length) {
          this.changeDataFormat(dataArr,optionalListArr);
          dataArr = null
          optionalListArr = null
          arr = null
        }
      }
      this.$options.sockets.gate = gateData => {
        let data = JSON.parse(gateData);

        data['marketName'] = "Gate"
        data['marketToken'] = data["name"]
        data["close"] = Number(data["last"]);
        data["percentChange"] = Number(data["percentChange"]);
        // console.log(data);
        // console.log(optionalListArr);
        optionalListArr.forEach(item => {
          if (item.marketName == 'Gate' && item.marketToken.toLocaleUpperCase() == data['name'].toLocaleUpperCase()) {
            data['uuid'] = item.uuid
          }
        })
        dataArr.push({
          marketName: data['marketName'],
          marketToken: data['marketToken'],
          close: data['close'],
          percentChange: data['percentChange'],
          uuid: data['uuid'],
        })
        if (dataArr.length == optionalListArr.length) {
          this.changeDataFormat(dataArr,optionalListArr);
          dataArr = null
          optionalListArr = null
          arr = null
        }
      }
      this.$options.sockets.zb = zbData => {
        let data = JSON.parse(zbData);
        data['marketName'] = "ZB";
        data['marketToken'] = data["name"]
        data["close"] = Number(data["last"]);
        data["percentChange"] = (
          (Number(data["last"]) - Number(data["buy"])) *
          100 /
          Number(data["buy"])
        ).toFixed(2);
        // console.log(data);
        // console.log(optionalListArr);

        optionalListArr.forEach(item => {
          // let temp = item.marketToken.split('_')[0]+item.marketToken.split('_')[1]
          // console.log(temp);

          if (item.marketToken == data.marketToken && item.marketName == 'zb') {
            console.log(12);

            data['uuid'] = item.uuid
          }
        })
        dataArr.push({
          marketName: data['marketName'],
          marketToken: data['marketToken'],
          close: data['close'],
          percentChange: data['percentChange'],
          uuid: data['uuid'],
        })


        if (dataArr.length == optionalListArr.length) {
          this.changeDataFormat(dataArr,optionalListArr);
          dataArr = null
          optionalListArr = null
          arr = null
        }
      }



    },
    toSearch () {
      this.$router.push({
        path: "/quotationSearch"
      });
    },
    changeDataFormat (dataArr,optionalListArr) {
      // console.log(dataArr);

      let arr0 = dataArr
      let arr = [];
      arr0.forEach((item, i) => {
        let counterparty = "";
        let coin = "";
        let exchangePrice = "";
        if (item.marketName == "币安") {
          if (item.marketToken.lastIndexOf("BTC") > 0) {
            counterparty = "BTC";
            coin = item.marketToken.split("BTC")[0];
          } else if (item.marketToken.lastIndexOf("ETH") > 0) {
            counterparty = "ETH";
            coin = item.marketToken.split("ETH")[0];
          } else if (item.marketToken.lastIndexOf("BNB") > 0) {
            counterparty = "BNB";
            coin = item.marketToken.split("BNB")[0];
          } else if (item.marketToken.lastIndexOf("USDT") > 0) {
            counterparty = "USDT";
            coin = item.marketToken.split("USDT")[0];
          }
        } else if (item.marketName == "火币" || item.marketName == "ZB") {
          if (item.marketToken.substring(item.marketToken.length - 3) == 'btc') {
            counterparty = "btc";
            coin = item.marketToken.split("").reverse().join("").slice(3).split("").reverse().join("")
          } else if (item.marketToken.lastIndexOf("eth") > 0) {
            counterparty = "eth";
            coin = item.marketToken.split("eth")[0];
          } else if (item.marketToken.lastIndexOf("ht") > 0) {
            counterparty = "ht";
            coin = item.marketToken.split("ht")[0];
          } else if (item.marketToken.lastIndexOf("qc") > 0) {
            counterparty = "qc";
            coin = item.marketToken.split("qc")[0];
          } else if (item.marketToken.lastIndexOf("zb") > 0) {
            counterparty = "zb";
            coin = item.marketToken.split("zb")[0];
          } else if (item.marketToken.lastIndexOf("usdt") > 0) {
            counterparty = "usdt";
            coin = item.marketToken.split("usdt")[0];
          }
        } else if (item.marketName == "Gate") {
          coin = item.marketToken.split("_")[0].toLocaleUpperCase();
          counterparty = item.marketToken.split("_")[1].toLocaleUpperCase();
        } else {
          coin = item.marketToken.split("_")[0];
          counterparty = item.marketToken.split("_")[1];
        }

        if (counterparty == "btc" || counterparty == "BTC") {
          exchangePrice = this.exchangeList["BTCUSDT"].lastPrice;
        } else if (counterparty == "eth" || counterparty == "ETH") {
          exchangePrice = this.exchangeList["ETHUSDT"].lastPrice;
        } else if (counterparty == "usdt" || counterparty == "USDT") {
          exchangePrice = 1;
        } else if (counterparty == "qc") {
          exchangePrice = this.exchangeList.usdt_qc.ticker.last;
        } else if (counterparty == "ht") {
          exchangePrice = this.exchangeList.htusdt.tick.close;
        } else if (counterparty == "zb") {
          exchangePrice = this.exchangeList.zb_usdt.ticker.last;
        } else if (counterparty == "QTUM") {
          exchangePrice = this.exchangeList.qtum_usdt.last;
        } else if (counterparty == "okb") {
          exchangePrice = this.exchangeList.okb_usdt.ticker.last;
        } else if (counterparty == "BNB") {
          exchangePrice = this.exchangeList.BNBUSDT.lastPrice;
        }

        arr.push({
          symbol: item.marketToken,
          counterparty: counterparty,
          coin: coin,
          marketName: item.marketName,
          uuid: item.uuid,
          close: item.close,
          percentChange: item.percentChange,
          exchangePrice: Number(exchangePrice) * this.daoToYuan
        });
      });
      if (this.optionalList.length == 0) {
        this.optionalList = arr;
      } else if (this.optionalList.length > 0) {
          let temp = []
          for(let j=0;j<optionalListArr.length;j++){
            for(let i=0;i<arr.length;i++){
              if(optionalListArr[j].marketName.toLocaleUpperCase()  == arr[i].marketName.toLocaleUpperCase() && optionalListArr[j].marketToken == arr[i].symbol){
                temp.push(arr[i])
              }
            }
          }
          this.optionalList = temp
          temp = null
      }
      arr = null
      this.$store.commit("setOptionalList", this.optionalList);
    },
    quotationDetail (data) {
      // 跳转至详情页面
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
    }
  },
  deactivated () {
    this.$socket.close();
    clearInterval(this.timeId);
    clearInterval(this.timeId1);
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
