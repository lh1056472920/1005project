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
	<ul id="quotationList" class="quotation-list">
		<li v-for="(item,i) in counterpartyCoinList" :key="i" v-tap="{methods:quotationDetail,item: item,query:{symbol:item.symbol,coin:item.coin,counterparty:item.counterparty,marketName:'火币',exchangeRate:item.exchangePrice}}">
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
	name: 'Huobi',
	data() {
		return {
			showdropdown: false,
			quotationList: [],
			counterpartyList: ["usdt", "btc", "eth", "ht"], //?????
			counterpartyCoinList: [], //???????
			counterpartyCoinListAll: [], //
			exchangeRateList: {}, // ??????
			exchangeRate: Number,
			timeId: "",
			// timeId1: "",
			hbcounterparty: "usdt",
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
		console.log("火币");
		this.counterAllObj = {};
		this.sortType = 'close';
	},
	sockets: {
		connect: function() {
			//?????connect??
			console.log("huobi connected");
			// clearInterval(this.timeId)
			// clearInterval(this.timeId1)
			// this.send();
			// let _this = this;
			// this.timeId = setInterval(() => {
			//   delete this.$options.sockets.all;
			//   _this.send();
			// }, 2000);

		},
		connecting: function(data) {
			console.log('connecting');

		},
		error: function(data) {
			console.log(data);

		},
		connect_failed: function(data) {
			console.log(data);

		},
		disconnect: function() {
			console.log("huobisocket disconnect");
		}
	},
	activated() {
		this.toTop()
		this.counterpartyCoinList = this.$store.state.huobiList
		this.$socket.open();
		clearInterval(this.timeId)
		// clearInterval(this.timeId1)
		this.send();
		let _this = this;
		this.timeId = setInterval(() => {
			/*delete this.$options.sockets.all;
			_this.send();*/
			this.$socket.emit("allMarket", {
				type: "huobi_all"
			});
		}, 5000);
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
		toTop() {
			window.scrollTo(0, 0)
		},
		ready() {
			document.addEventListener("click", e => {
				if (!this.$el.contains(e.target)) this.showdropdown = false;
			});
		},
		// event () {
		//   var subtitle = document.getElementById("subtitle");
		//   subtitle.style.backgroundColor = "#edf1f4";
		// },
		showDropdown(data) {
			// ?????
			this.showdropdown = !data.params;
		},
		selectCounterparty(data) {
			console.log(data.params);
			this.hbcounterparty = data.params;
			this.showdropdown = false;
			/*let arr = [];
			this.counterpartyCoinListAll.forEach((item, i) => {
				if (item["counterparty"] == this.hbcounterparty) {
					arr.push(item);
				}
			});*/
			
			let currentAry = this.sort(this.counterAllObj[this.hbcounterparty], this.sortType);
            let currentSortAry = [];
            if (this.pricesortStyle === 'down' || this.percentChangeSortStyle === 'down') {
                currentSortAry = currentAry.reverse();
            } else {
                currentSortAry = currentAry;
            }

			this.counterpartyCoinList = currentSortAry.slice(0, 30);
            setTimeout(() => {
                this.counterpartyCoinList = currentSortAry;
            },0)
			//this.toTop()
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
					exchangeRate: data.query.exchangeRate,
					quoteVolume: data.item.quoteVolume
				}
			});
		},
		send() {
			this.$socket.emit("allMarket", {
				type: "huobi_all"
			});
			this.$options.sockets.huobi_all = res => {
				Indicator.close();
				//let data = JSON.parse(huobiData).data;

				let arr = [];
				let arrusdt = [];
				let arrbtc = [];
				let arreth = [];
				let arrht = [];
				let data = res.data;
				// console.log(this.hbcounterparty);
				data.forEach((item, i) => {
					let counterparty = "";
					let coin = "";
					let exchangePrice = "";
					let percentChange = (item.close - item.open) * 100 / item.open;
					if (item.symbol.substring(item.symbol.length - 3) == 'btc') {
						counterparty = "btc";
						coin = item.symbol.split("").reverse().join("").slice(3).split("").reverse().join("")
						exchangePrice = this.exchangeList["BTCUSDT"].lastPrice;
						arrbtc.push({
							close: this.toNonExponential(item.close),
							symbol: item.symbol,
							counterparty: counterparty,
							coin: coin,
							percentChange: Number(percentChange.toFixed(2)),
							exchangePrice: Number(exchangePrice) * this.daoToYuan
						});
					} else if (item.symbol.lastIndexOf("eth") > 0) {
						counterparty = "eth";
						coin = item.symbol.split("eth")[0];
						exchangePrice = this.exchangeList["ETHUSDT"].lastPrice;
						arreth.push({
							close: item.close,
							symbol: item.symbol,
							counterparty: counterparty,
							coin: coin,
							percentChange: Number(percentChange.toFixed(2)),
							exchangePrice: Number(exchangePrice) * this.daoToYuan
						});
					} else if (item.symbol.lastIndexOf("ht") > 0) {
						counterparty = "ht";
						coin = item.symbol.split("ht")[0];
						exchangePrice = this.exchangeList.htusdt.tick.close;
						arrht.push({
							close: item.close,
							symbol: item.symbol,
							counterparty: counterparty,
							coin: coin,
							percentChange: Number(percentChange.toFixed(2)),
							exchangePrice: Number(exchangePrice) * this.daoToYuan
						});
					} else if (item.symbol.lastIndexOf("usdt") > 0) {
						counterparty = "usdt";
						coin = item.symbol.split("usdt")[0];
						exchangePrice = 1;
						arrusdt.push({
							close: item.close,
							symbol: item.symbol,
							counterparty: counterparty,
							coin: coin,
							percentChange: Number(percentChange.toFixed(2)),
							exchangePrice: Number(exchangePrice) * this.daoToYuan
						});
					}

					arr[i] = {
						close: item.close,
						symbol: item.symbol,
						counterparty: counterparty,
						coin: coin,
						percentChange: Number(percentChange.toFixed(2)),
						exchangePrice: Number(exchangePrice) * this.daoToYuan
					};
				});
				// console.log(this.hbcounterparty);
				this.counterAllObj = {
					'btc': arrbtc,
					'eth': arreth,
					'ht': arrht,
					'usdt': arrusdt
				}
				if (this.hbcounterparty == "btc") {
					data = arrbtc;
				} else if (this.hbcounterparty == "eth") {
					data = arreth;
				} else if (this.hbcounterparty == "ht") {
					data = arrht;
				} else if (this.hbcounterparty == "usdt") {
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
				this.counterpartyCoinList = data;
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
		this.$store.commit('setHuobiList', this.counterpartyCoinList)
		this.$socket.close();
		clearInterval(this.timeId);
		// clearInterval(this.timeId1);
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
	},
};
</script>