<template>
<!-- ?? -->
<div>
	<ul class="subtitle" id="subtitle">
		<li v-tap="{methods:showDropdown,params:showdropdown}">
			<span>交易对<i>({{okbcounterparty}})</i></span>
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
				<i id="upArrow" :class="{highlight:percentChangeSortStyle == 'up'}"></i>
				<i id="downArrow" :class="{highlight:percentChangeSortStyle == 'down'}"></i>
			</div>
		</li>
	</ul>
	<ul class="quotation-list" id="quotationList">
		<li v-for="(item,i) in counterpartyCoinList" :key="i" v-tap="{methods:quotationDetail,query:{symbol:item.symbol,coin:item.coin,counterparty:item.counterparty,marketName:'Okex',exchangeRate:item.exchangePrice}}">
			<quo-item :symbol="item.symbol" :lastest-price="item.close" :percent-change="item.percentChange" :exchange-rate="item.exchangePrice" :coin="item.coin" :counterparty="item.counterparty"></quo-item>
			<hr />
		</li>
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
	padding-left: .42rem;
}

.subtitle>li {
	flex: 1;
	height: 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
}

.subtitle>li:nth-child(2) {
	margin-left: .5rem;
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
	font-size: .44rem;
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
import quoItem from "../../commons/components/quoItem.vue";
import {
	Indicator
} from "mint-ui";
export default {
	name: 'Okex',
	data() {
		return {
			showdropdown: false,
			quotationList: [],
			counterpartyList: ["usdt", "btc", "eth", "okb"], //?????
			counterpartyCoinList: [], //???????
			exchangeRateList: {}, // ??????
			exchangeRate: Number,
			timeId: "",
			timeId1: "",
			counterpartyCoinListAll: [],
			okbcounterparty: "usdt",
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
		console.log("Okex");
		this.counterAllObj = {};
		this.sortType = 'close';
	},
	sockets: {
		connect: function() {
			//?????connect??
			console.log("okex connected");
			// clearInterval(this.timeId)
			// clearInterval(this.timeId1)
			// this.send();
			// let _this = this;
			// this.timeId = setInterval(() => {
			//   // console.log(2);
			//   delete this.$options.sockets.all;
			//   _this.send();
			// }, 2000);
		},

		disconnect: function() {
			console.log("okexsocket disconnect");
		}
	},
	activated() {
		this.toTop()
		this.counterpartyCoinList = this.$store.state.okexList
		this.$socket.open();
		this.exchangeList = JSON.parse(
			window.sessionStorage.getItem("exchangeList")
		);
		this.daoToYuan = JSON.parse(window.sessionStorage.getItem("daoToYuan"));
		clearInterval(this.timeId1)
		this.send();
		let _this = this;
		this.timeId1 = setInterval(() => {
			// console.log(2);
			/*delete this.$options.sockets.all;
			_this.send();*/
			_this.$socket.emit("allMarket", { type: "okex_all" });
		}, 5000);
		if (this.counterpartyCoinList.length == 0) {
			Indicator.open({
				text: "Loading...",
				spinnerType: "snake"
			});
		}
		this.ready();
	},
	methods: {
		toTop() {
			// var target = document.getElementById('quotationList')
			// target.scrollTo(0,0)
			window.scrollTo(0, 0)
		},
		ready() {
			document.addEventListener("click", e => {
				if (!this.$el.contains(e.target)) this.showdropdown = false;
			});
		},
		showDropdown(data) {
			// ?????
			this.showdropdown = !data.params;
		},
		selectCounterparty(data) {
			console.log(data.params);
			this.okbcounterparty = data.params;
			this.showdropdown = false;
			/*let arr = [];
			this.counterpartyCoinListAll.forEach((item, i) => {
				if (item["counterparty"] == this.okbcounterparty) {
					arr.push(item);
				}
			});*/
			let currentAry = this.sort(this.counterAllObj[this.okbcounterparty], this.sortType);
            let currentSortAry = [];
            if (this.pricesortStyle === 'down' || this.percentChangeSortStyle === 'down') {
                currentSortAry = currentAry.reverse();
            } else {
                currentSortAry = currentAry;
            }
			this.counterpartyCoinList = currentSortAry.slice(0, 30);
			setTimeout(() => {
				this.counterpartyCoinList = currentSortAry;
			}, 0)
			//this.toTop()
		},
		quotationDetail(data) {
			// this.$socket.close()
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
            /*this.runningSocket = this.$socketio('ws://192.168.1.103:20002');
            this.runningSocket.emit('okexMarket', {
                type: "ticket"
            });
            this.runningSocket.on('okex_ticket', (okexData) => {
                if (!this.loadingSocket) {
                    this.loadingSocket = true;
                    console.log('??????????');
                    console.log(typeof  okexData);
                    console.log(okexData);
                }
            })
            
            return;*/
			this.$socket.emit("allMarket", { type: "okex_all" });
			this.$options.sockets.okex_all = res => {
				//let data = JSON.parse(okexData).tickers;
				// console.log(data);

				Indicator.close();
				// console.log(JSON.parse(okexData));
				let arr = [];
				let arrusdt = [];
				let arrbtc = [];
				let arreth = [];
				let arrokb = [];
				let data = res.data;
				data.forEach((item, i) => {
					let coin = item.symbol.split("_")[0];
					let counterparty = item.symbol.split("_")[1];
					let exchangePrice = "";
					let percentChange = Number(item.changePercentage.split("%")[0])
					arr[i] = {
						close: Number(item.last),
						symbol: item.symbol,
						percentChange: Number(percentChange.toFixed(2)),
						counterparty: counterparty,
						coin: coin
					};
					if (counterparty == "btc") {
						arr[i].close = this.toNonExponential(Number(item.last))
						arr[i].exchangePrice =
							Number(this.exchangeList["BTCUSDT"].lastPrice) * this.daoToYuan;
						arrbtc.push(arr[i]);
					} else if (counterparty == "eth") {
						arr[i].close = this.toNonExponential(Number(item.last))
						arr[i].exchangePrice =
							Number(this.exchangeList["ETHUSDT"].lastPrice) * this.daoToYuan;
						arreth.push(arr[i]);
					} else if (counterparty == "usdt") {
						arr[i].close = this.toNonExponential(Number(item.last))
						arr[i].exchangePrice = 1 * this.daoToYuan;
						arrusdt.push(arr[i]);
					} else if (counterparty == "okb") {
						arr[i].close = this.toNonExponential(Number(item.last))
						arr[i].exchangePrice =
							Number(this.exchangeList.okb_usdt.ticker.last) * this.daoToYuan;
						arrokb.push(arr[i]);
					}
				});
				this.counterAllObj = {
					'btc': arrbtc,
					'eth': arreth,
					'okb': arrokb,
					'usdt': arrusdt
				};
				if (this.okbcounterparty == "btc") {
					data = arrbtc;
				} else if (this.okbcounterparty == "eth") {
					data = arreth;
				} else if (this.okbcounterparty == "okb") {
					data = arrokb;
				} else if (this.okbcounterparty == "usdt") {
					data = arrusdt;
				} else {
					data = arr;
				}
				//this.counterpartyCoinListAll = arr;
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
		toNonExponential(num) {
			var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
			return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
		},
		priceSort(data) {
			this.percentChangeSortStyle = "";
			this.sortType = 'close';
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
			this.sortType = 'percentChange';
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
					if (Number(arr[j][call]) < Number(arr[j + 1][call])) {
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
		this.$store.commit('setOkexList', this.counterpartyCoinList)
        if (this.runningSocket) {
            this.runningSocket.close();
        }
		this.$socket.close();
		clearInterval(this.timeId);
		clearInterval(this.timeId1);
		document.removeEventListener("click", e => {
			if (!this.$el.contains(e.target)) this.showdropdown = false;
		})
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