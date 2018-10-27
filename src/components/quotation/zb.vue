<template>
<!-- ?? -->
<div>
	<ul class="subtitle" id="subtitle">
		<li v-tap="{methods:showDropdown,params:showdropdown}">
			<span>交易对<i>({{zbcounterparty}})</i></span>
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
		<li v-for="(item,i) in counterpartyCoinList" :key="i" v-tap="{methods:quotationDetail,query:{symbol:item.symbol,coin:item.coin,counterparty:item.counterparty,marketName:'ZB',exchangeRate:item.exchangePrice}}">
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
	padding-left: 0.42rem;
}

.subtitle>li {
	flex: 1;
	height: 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
}

.subtitle>li:nth-child(2) {
	margin-left: 0.5rem;
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
import quoItem from "../../commons/components/quoItem.vue";
import zbData1 from './../../commons/js/zbData1.js';
import {
	Indicator
} from "mint-ui";
import Axios from "axios";
import io from "../../lib/js/socket.io.js";
export default {
	name: "zb",
	data() {
		return {
			showdropdown: false,
			quotationList: [],
			counterpartyList: ["usdt", "btc", "zb", "qc"], //?????
			counterpartyCoinList: [], //???????
			exchangeRateList: {}, // ??????
			exchangeRate: Number,
			timeId: "",
			counterpartyCoinListAll: [],
			zbcounterparty: "usdt",
			pricesortStyle: "up",
			percentChangeSortStyle: "",
			exchangeList: {},
			daoToYuan: "",
			zbOpenAll: {}
		};
	},
	components: {
		quoItem
	},
	created() {
		console.log("ZB");
        this.counterAllObj = {};
		this.sortType = 'close';
		this.handleZbData1(zbData1);
	},
	sockets: {
		connect: function() {
			//?????connect??
			console.log("zb connected");
		},

		disconnect: function() {
			console.log("zbsocket disconnect");
		}
	},
	activated() {
		this.send1();
		// this.$axios
		// 	.get(
		// 		`http://192.168.1.225:5656/kpl/wallert/http/selectZBSymbolTempOpens`
		// 	)
		// 	.then(res => {
		// 		console.log(111);

		// 		console.log(res.data.maps);
		// 		// this.zbOpenAll = res.data.maps;
		// 	});
		this.toTop();
		this.counterpartyCoinList = this.$store.state.zbList;
		// console.log(this.counterpartyCoinList);

		this.$socket.open();
		clearInterval(this.timeId);
		this.send();
		let _this = this;
		this.timeId = setInterval(() => {
			//delete this.$options.sockets.all;
			// _this.send1();
			//_this.send();
            if (this.$options.sockets.all) {
                this.$socket.emit("zbmarket", {
    				type: "all"
    			});
            } else {
                _this.send();
            }
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
			// var target = document.getElementById('quotationList')
			// target.scrollTo(0,0)
			window.scrollTo(0, 0);
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
			this.zbcounterparty = data.params;
			this.showdropdown = false;
			/*let arr = [];
			this.counterpartyCoinListAll.forEach((item, i) => {
				if (item["counterparty"] == this.zbcounterparty) {
					arr.push(item);
				}
			});*/
			// console.log(arr);
            let currentAry = this.sort(this.counterAllObj[this.zbcounterparty], this.sortType);
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
			//this.toTop();
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
		send1() {
			let _that = this;
			this.zbSocket = io.connect(
				"ws://chaobis.lian2345.com:20000", {
					timeout: 2000,
					reconnection: true,
					reconnectionDelayMax: 10000,
					reconnectionDelay: 1000
				}
			);
			this.zbSocket.emit("zbMarket", {
				type: "1minalls",
				symbol:'123',
				size:'123'
			}); //向服务器发送消息.
			this.zbSocket.on("zb_datas", function(obj1) {
				_that.handleZbData1(obj1);
			});
		},
		handleZbData1(obj1) {
			let obj = {};
			for (const key in obj1) {
				let a = key;
				if (obj1[key] != null) {
					obj[a] = obj1[key].data[0][1];
				}
			}
			this.zbOpenAll = obj;
		},
		send() {

			this.$socket.emit("allMarket", {
				type: "zb_all"
			});
			this.$options.sockets.zb_all = data => {
				Indicator.close();
				// console.log(JSON.parse(zbData));
				//let data = JSON.parse(zbData);
				let arr = [];
				let arrusdt = [];
				let arrbtc = [];
				let arrzb = [];
				let arrqc = [];
				for (let key in data) {
					let coin = "";
					let counterparty = "";
					let percentChange = "";
					let exchangePrice = "";
					if (key.substring(key.length - 3) == "btc") {
						counterparty = "btc";
						coin = key
							.split("")
							.reverse()
							.join("")
							.slice(3)
							.split("")
							.reverse()
							.join("");
						exchangePrice = this.exchangeList["BTCUSDT"].lastPrice;

						percentChange = (
							((Number(data[key].last) -
									Number(
										this.zbOpenAll[coin + "_" + counterparty]
									)) *
								100) /
							Number(this.zbOpenAll[coin + "_" + counterparty])
						).toFixed(2);
						arrbtc.push({
							close: this.toNonExponential(
								Number(data[key].last)
							),
							symbol: key,
							counterparty: counterparty,
							coin: coin,
							percentChange: Number(percentChange),
							exchangePrice: Number(exchangePrice) * this.daoToYuan
						});
					} else if (key.lastIndexOf("zb") > 0) {
						counterparty = "zb";
						coin = key.split("zb")[0];
						exchangePrice = this.exchangeList.zb_usdt.last;
						percentChange = (
							((Number(data[key].last) -
									Number(
										this.zbOpenAll[coin + "_" + counterparty]
									)) *
								100) /
							Number(this.zbOpenAll[coin + "_" + counterparty])
						).toFixed(2);
						arrzb.push({
							close: this.toNonExponential(
								Number(data[key].last)
							),
							symbol: key,
							counterparty: counterparty,
							coin: coin,
							percentChange: Number(percentChange),
							exchangePrice: Number(exchangePrice) * this.daoToYuan
						});
					} else if (key.lastIndexOf("qc") > 0) {
						counterparty = "qc";
						coin = key.split("qc")[0];
						exchangePrice = this.exchangeList.usdt_qc.last;
						percentChange = (
							((Number(data[key].last) -
									Number(
										this.zbOpenAll[coin + "_" + counterparty]
									)) *
								100) /
							Number(this.zbOpenAll[coin + "_" + counterparty])
						).toFixed(2);
						arrqc.push({
							close: Number(data[key].last),
							symbol: key,
							counterparty: counterparty,
							coin: coin,
							percentChange: Number(percentChange),
							exchangePrice: Number(exchangePrice) / this.daoToYuan
						});
					} else if (key.lastIndexOf("usdt") > 0) {
						counterparty = "usdt";
						coin = key.split("usdt")[0];
						exchangePrice = 1;
						let sss = coin + "_" + counterparty;
						percentChange = (
							((Number(data[key].last) -
									Number(
										this.zbOpenAll[coin + "_" + counterparty]
									)) *
								100) /
							Number(this.zbOpenAll[coin + "_" + counterparty])
						).toFixed(2);
						arrusdt.push({
							close: Number(data[key].last),
							symbol: key,
							counterparty: counterparty,
							coin: coin,
							percentChange: Number(percentChange),
							exchangePrice: Number(exchangePrice) * this.daoToYuan
						});
					}

					arr.push({
						close: Number(data[key].last),
						symbol: key,
						percentChange: Number(percentChange),
						counterparty: counterparty,
						coin: coin,
						exchangePrice: Number(exchangePrice) * this.daoToYuan
					});
				}
                this.counterAllObj = {
                    'btc': arrbtc,
                    'zb': arrzb,
                    'qc': arrqc,
                    'usdt': arrusdt
                };
				if (this.zbcounterparty == "btc") {
					data = arrbtc;
				} else if (this.zbcounterparty == "zb") {
					data = arrzb;
				} else if (this.zbcounterparty == "qc") {
					data = arrqc;
				} else if (this.zbcounterparty == "usdt") {
					data = arrusdt;
				} else {
					data = arr;
				}
				//this.counterpartyCoinListAll = arr;
				// 根据当前价排序
				if (this.pricesortStyle == "up") {
					data = this.sort(data, "close");
				} else if (this.pricesortStyle == "down") {
					data = this.sort(data, "close").reverse();
				}
				// 涨跌幅排序
				if (this.percentChangeSortStyle == "up") {
					data = this.sort(data, "percentChange");
				} else if (this.percentChangeSortStyle == "down") {
					data = this.sort(data, "percentChange").reverse();
				}
				this.counterpartyCoinList = data;
				data = null;
			};
		},

		toNonExponential(num) {
			var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
			return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
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
			this.toTop();
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
			this.toTop();
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
		this.$store.commit("setZbList", this.counterpartyCoinList);
		this.$socket.close();
		clearInterval(this.timeId);
		document.removeEventListener("click", e => {
			if (!this.$el.contains(e.target)) this.showdropdown = false;
		});
		if (this.zbSocket) {
			this.zbSocket.close();
		}
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