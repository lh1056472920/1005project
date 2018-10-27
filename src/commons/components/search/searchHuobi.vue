<template>
  <!-- ?? -->
  <!-- <div @touchmove='event'> -->
  <div>
    <ul class="subtitle" id="subtitle">
      <li v-tap="{methods:showDropdown,params:showdropdown}">
        <span>交易对
          <i>({{hbcounterparty}})</i>
        </span>
        <div class="arrowBox one">
          <i id="downArrow" class="highlight"></i>
        </div>
        <div v-show="showdropdown" class="dropdown">
          <i class="dropdownArrow"></i>
          <p v-for="(item,i) in counterpartyList" :key="i" v-tap="{methods:selectCounterparty,params:item}">{{item}}</p>
        </div>
      </li>
      <li>
        提醒设置
      </li>
    </ul>
    <ul id="quotationList" class="quotation-list">
      <li v-for="(item,i) in counterpartyCoinList" :key="i">
        <search-Item :symbol="item.symbol" :coin="item.coin" :id="item.id" :counterparty="item.counterparty" :marketToken='item.marketToken' :remind='item.remind' v-on:changeRemind='changeRemind'></search-item>
        <hr />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.subtitle {
    height: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.4rem;
    color: #a6afba;
    position: fixed;
    left: 0;
    width: 100%;
    background-color: rgb(237, 241, 244);
}

.subtitle > li:nth-child(1) {
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1rem;
}

.subtitle > li:nth-child(2) {
    text-align: right;
    margin-right: 1rem;
    width: 2rem;
}

.quotation-list {
    padding-top: 1rem;
}
.arrowBox {
    width: 0.46rem;
    height: 0.85rem;
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
    padding-top: 0.15rem;
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
    top: 1rem;
    border-radius: 0.1rem;
}

.dropdown p {
    height: 1.26rem;
    padding-left: 0.5rem;
    line-height: 1.26rem;
    font-size: 0.44rem;
    color: #374452;
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
import searchItem from "./searchItem.vue";
import remote from "../../../lib/js/remote.js";
import { Indicator } from "mint-ui";
export default {
    name: "searchHuobi",
    data() {
        return {
            showdropdown: false,
            quotationList: [],
            counterpartyList: ["USDT", "BTC", "ETH", "HT"], //?????
            counterpartyCoinList: [], //???????
            counterpartyCoinListAll: [], //
            exchangeRate: Number,
            hbcounterparty: "USDT",
            pricesortStyle: "up"
        };
    },
    components: {
        searchItem
    },
    created() {
        this.getSymbolData();
    },
    methods: {
        toTop() {
            window.scrollTo(0, 0);
        },
        ready() {
            document.addEventListener("click", e => {
                if (!this.$el.contains(e.target)) this.showdropdown = false;
            });
        },
        getSymbolData() {
            this.userId = this.$store.state.userInfo.uid;
            let params = {
                marketName: "火币",
                uid: this.userId
            };
            remote.select_getsymbol(params).then(res => {
                console.log(res);
                let arr = [];
                this.counterpartyCoinListAll = res.data.resultList;
                this.counterpartyCoinListAll.forEach(item => {
                    this.sliceSymbol(item);
                    if (item["counterparty"] == this.hbcounterparty) {
                        arr.push(item);
                    }
                });
                this.counterpartyCoinList = arr;
                console.log(this.counterpartyCoinList);
            });
        },
        showDropdown(data) {
            // ?????
            this.showdropdown = !data.params;
        },
        selectCounterparty(data) {
            console.log(data.params);
            this.hbcounterparty = data.params;
            this.showdropdown = false;
            let arr = [];
            this.counterpartyCoinListAll.forEach((item, i) => {
                if (item["counterparty"] == this.hbcounterparty) {
                    arr.push(item);
                }
            });
            console.log(arr);

            this.counterpartyCoinList = arr;
            this.toTop();
        },
        //添加或减少提醒
        changeRemind(data) {
            console.log(data);
            if (data.remind === 1) {
                var param = { id: data.id };
                remote.delete_remind(param).then(res => {
                    if (res.data.code === "200") {
                        this.getSymbolData();
                    }
                });
            } else {
                var params = new URLSearchParams();
                params.append("typeId", 4);
                params.append("uid", this.userId);
                params.append("marketToken", data.marketToken);
                params.append("marketName", "火币");

                remote.save_remind(params).then(res => {
                    if (res.data.code === "200") {
                        this.getSymbolData();
                    }
                });
            }
        },
        sort(arr, call) {
            // 冒泡排序
            for (let i = 0; i < arr.length - 1; i++) {
                for (let j = 0; j < arr.length - i - 1; j++) {
                    let temp;
                    if (Number(arr[j][call]) < Number(arr[j + 1][call])) {
                        temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
            return arr;
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
                } else if (data.marketToken.lastIndexOf("USDT") > 0) {
                    data.counterparty = "USDT";
                    data.coin = data.marketToken.split("USDT")[0];
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
                    ).toLocaleUpperCase();
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
                data.marketName === "OKEx" ||
                data.marketName === "Okex"
            ) {
                data.coin = data.marketToken.split("_")[0];
                data.counterparty = data.marketToken.split("_")[1];
            }
        }
    }
};
</script>