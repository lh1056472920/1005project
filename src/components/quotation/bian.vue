<template>
<!-- 币安 -->
<div>
	<ul class="subtitle" id="subtitle">
		<li v-tap="{methods:showDropdown,params:showdropdown}">
			<span>{{$t('m.counterparty')}}<i>({{biancounterparty}})</i></span>
			<div class="arrowBox one">
				<i id="downArrow" class="highlight"></i>
			</div>
			<div v-show="showdropdown" class="dropdown">
				<i class="dropdownArrow"></i>
				<p v-for="(item,i) in counterpartyList" :key="i" v-tap="{methods:selectCounterparty,params:item}">{{item}}</p>
			</div>
		</li>
		<li v-tap="{methods:priceSort,params:pricesortStyle}">
			<span>{{$t('m.currentPrice')}}</span>
			<div class="arrowBox">
				<i id="upArrow" :class="{'highlight':pricesortStyle == 'up'}"></i>
				<i id="downArrow" :class="{'highlight':pricesortStyle == 'down'}"></i>
			</div>
		</li>
		<li v-tap="{methods:percentChangeSort,params:percentChangeSortStyle}">
			<span>{{$t('m.change')}}(24h)</span>
			<div class="arrowBox">
				<i id="upArrow" :class="{highlight:percentChangeSortStyle == 'up'}"></i>
				<i id="downArrow" :class="{highlight:percentChangeSortStyle == 'down'}"></i>
			</div>
		</li>
	</ul>
	<ul id="quotationList" class="quotation-list">
		<li v-for="(item,i) in counterpartyCoinList" :key="i" v-tap="{methods:quotationDetail,item: item,query:{symbol:item.symbol,coin:item.coin,counterparty:item.counterparty,marketName:'币安',exchangeRate:item.exchangePrice}}">
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
	getLanguage
} from "../../lib/js/storage";
import {
	Indicator
} from "mint-ui";
export default {
	name: 'Bian',
	data() {
		return {
			showdropdown: false,
			quotationList: [],
			counterpartyList: ["USDT", "BTC", "ETH", "BNB"], //交易对列表
			counterpartyCoinList: [], //交易对币种列表
			exchangeRateList: {}, // 兑换汇率列表
			exchangeRate: Number,
			timeId: "",
			timeId1: "",
			counterpartyCoinListAll: [],
			biancounterparty: "USDT",
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
        this.counterAllObj = {};
        this.sortType = 'close';
		this.hasRates = window.sessionStorage.getItem("exchangeList") && window.sessionStorage.getItem("daoToYuan");
		this.getQuotationData();
	},
	sockets: {
		connect: function() {
			//这里是监听connect事件
			console.log("bian connected");
			// clearInterval(this.timeId)
			// clearInterval(this.timeId1)
			// this.send();
			// let _this = this;
			// this.timeId = setInterval(() => {
			//   delete this.$options.sockets.binanceData;
			//   _this.send();
			// }, 3000);
		},
		connecting: function(data) {
			console.log('connecting');

		},
		disconnect: function() {
			console.log("biansocket disconnect");
		}
	},
	activated() {
		if (!this.hasRates) {
			return;
		}
		this.init();
	},
	methods: {
		getQuotationData() {
			let url = `http://chaobis.lian2345.com/noteskpl/selectmarket_usdt `;
			let url1 = `http://120.79.0.99/market/api/marketAll/allMarketIndexDetail?type=btc`;
			// 设置语言
			let language = getLanguage() || "CHINESE";
			this.$store.commit("setLanguage", language);
			localStorage.setItem('active', '币安')
			Promise.all([
				// 获取各平台币对美元汇率
				this.$axios.get(url).then(res => {
					if (res.status == 200) {
						let exchangeList = res.data;
						window.sessionStorage.setItem(
							"exchangeList",
							JSON.stringify(exchangeList)
						);
					}
				}),
				// 获取RMB对$汇率
				this.$axios.post(url1).then(res => {
					if (res.status == 200) {
						let daoToYuan =
							res.data.data[0].current_price_cny /
							res.data.data[0].current_price_usd;
						window.sessionStorage.setItem(
							"daoToYuan",
							JSON.stringify(daoToYuan)
						);
					}
				})
			]).then(() => {
				if (!this.hasRates) {
					this.hasRates = window.sessionStorage.getItem("exchangeList") && window.sessionStorage.getItem("daoToYuan");
					this.init();
				}
			}).catch((err) => {
				if (!this.hasRates) {
					this.init();
				}
			})
		},
		init() {
			this.toTop()
			this.counterpartyCoinList = this.$store.state.bianList
			this.$socket.open();
			this.exchangeList = JSON.parse(
				window.sessionStorage.getItem("exchangeList")
			);
			this.daoToYuan = JSON.parse(window.sessionStorage.getItem("daoToYuan"));
			clearInterval(this.timeId)
			clearInterval(this.timeId1)
			this.send();
			let _this = this;
			this.timeId1 = setInterval(() => {
				/*delete this.$options.sockets.binanceData;
				_this.send();*/
				this.$socket.emit("allMarket", {
					type: "binance_all"
				});
			}, 5000);
			if (this.counterpartyCoinList.length == 0) {
				Indicator.open({
					text: "Loading...",
					spinnerType: "snake"
				});
			}
			this.ready()
		},
		toTop() {
			window.scrollTo(0, 0)
		},
		ready() {
			// 点击隐鲹下拉框
			document.addEventListener("click", e => {
				if (!this.$el.contains(e.target)) this.showdropdown = false;
			});
		},
		showDropdown(data) {
			// 显示下拉框
			this.showdropdown = !data.params;
		},
		selectCounterparty(data) {
			console.log(data.params);
			this.biancounterparty = data.params;
			this.showdropdown = false;
			/*let arr = [];
			this.counterpartyCoinListAll.forEach((item, i) => {
				if (item["counterparty"] == this.biancounterparty) {
					arr.push(item);
				}
			});*/
			// console.log(arr);
            let currentAry = this.sort(this.counterAllObj[this.biancounterparty], this.sortType);
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
		send() {
			// 请求交易所数据
			// $socket is socket.io-client instance
			this.$socket.emit("allMarket", {
				type: "binance_all"
			});
			this.$options.sockets.binance_all = data => {
				//let data = JSON.parse(binanceData);
				// console.log(data);
				Indicator.close();
				// 转化为需要的数据格式
				let arrusdt = [];
				let arrbtc = [];
				let arreth = [];
				let arrbnb = [];
				data.forEach((item, i) => {
					item.percentChange = Number(Number(item.priceChangePercent).toFixed(2));
					item.close = this.toNonExponential(Number(item.lastPrice));
					item.priceChange = Number(item.priceChange);
					if (item.symbol.substring(item.symbol.length - 3) == 'BTC') {
						data[i].counterparty = "BTC";
						data[i].coin = item.symbol.split("").reverse().join("").slice(3).split("").reverse().join("")
						data[i].exchangePrice =
							Number(this.exchangeList["BTCUSDT"].lastPrice) * this.daoToYuan;
						arrbtc.push(data[i]);
					} else if (item.symbol.lastIndexOf("USDT") > 0) {
						data[i].counterparty = "USDT";
						data[i].coin = item.symbol.split("USDT")[0];
						data[i].exchangePrice = 1 * this.daoToYuan;
						arrusdt.push(data[i]);
					} else if (item.symbol.lastIndexOf("BNB") > 0) {
						data[i].counterparty = "BNB";
						data[i].coin = item.symbol.split("BNB")[0];
						data[i].exchangePrice =
							Number(this.exchangeList.BNBUSDT.lastPrice) * this.daoToYuan;
						arrbnb.push(data[i]);
					} else if (item.symbol.lastIndexOf("ETH") > 0) {
						data[i].counterparty = "ETH";
						data[i].coin = item.symbol.split("ETH")[0];
						data[i].exchangePrice =
							Number(this.exchangeList["ETHUSDT"].lastPrice) * this.daoToYuan;
						arreth.push(data[i]);
					}
				});
				// console.log(arrbtc);
                this.counterAllObj = {
                    BTC: arrbtc,
                    ETH: arreth,
                    BNB: arrbnb,
                    USDT: arrusdt
                };
				//this.counterpartyCoinListAll = data;
				if (this.biancounterparty == "BTC") {
					data = arrbtc;
				} else if (this.biancounterparty == "ETH") {
					data = arreth;
				} else if (this.biancounterparty == "BNB") {
					data = arrbnb;
				} else if (this.biancounterparty == "USDT") {
					data = arrusdt;
				}
				// console.log(this.counterpartyCoinList);
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
		quotationDetail(data) {
			// 跳转至详情页面
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
		this.$store.commit('setBianList', this.counterpartyCoinList)
		this.$socket.close();
		console.log('dea---leave');

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