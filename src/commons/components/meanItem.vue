<template>
	<div class="mean">
		<div class="mean-box">
			<p>{{meanprice}}{{coin}}</p>
			<span>{{meantime}}</span>
		</div>
		<div class="mean-box">
			<p>{{maxbuy}}{{coin}}</p>
			<span>{{maxbuytime}}</span>
		</div>
		<div class="mean-box">
			<p>{{maxsell}}{{coin}}</p>
			<span>{{maxselltime}}</span>
		</div>
	</div>
</template>

<script>
import remote from '../../lib/js/remote.js'
export default {
	name: 'meanItem',
	props: ['coin', 'timetype', 'exchange', 'symbol'],
	data () {
		return {
			meantime: '',
			maxbuytime: '',
			maxselltime: '',
			meanprice: '',
			maxbuy: '',
			maxsell: ''
		}
	},
	created () {
		this.checkType();
	},
	methods: {
		checkType () {
			//获取交易所交易对均量和最大买入卖出
			let warnParams = new URLSearchParams();
			warnParams.append('tradeName', this.exchange)
			warnParams.append('tradeSymbol', this.symbol)
			// console.log('timetype---' + this.timetype)
			if (this.timetype === '1分钟') {
				this.meantime = '1分钟均量'; this.maxbuytime = '1分钟最大买入量'; this.maxselltime = '1分钟最大卖出量';
				remote.wanning_1m(warnParams).then(res => {
					// console.log(res);
					this.meanprice = res.data.bigWarning.oneAvg.toFixed(4);
					this.maxbuy = res.data.bigWarning.oneBuyMax.toFixed(4);
					this.maxsell = res.data.bigWarning.oneSellMax.toFixed(4);
					this.$emit('getMinuteNum', this.meanprice)
				})
			}
			if (this.timetype === '15分钟') {
				this.meantime = '15分钟均量'; this.maxbuytime = '15分钟最大买入量'; this.maxselltime = '15分钟最大卖出量';
				remote.wanning_15m(warnParams).then(res => {
					// console.log(res);
					this.meanprice = res.data.bigWarning.fifteenAvg.toFixed(4);
					this.maxbuy = res.data.bigWarning.fifteenBuyMax.toFixed(4);
					this.maxsell = res.data.bigWarning.fifteenSellMax.toFixed(4);
					this.$emit('getFifteenNum', this.meanprice)
				})
			}
			if (this.timetype === '1小时') {
				this.meantime = '一小时均量'; this.maxbuytime = '一小时最大买入量'; this.maxselltime = '一小时最大卖出量';
				remote.wanning_1h(warnParams).then(res => {
					// console.log(res);
					this.meanprice = res.data.bigWarning.anHourAvg.toFixed(4);
					this.maxbuy = res.data.bigWarning.anHourBuyMax.toFixed(4);
					this.maxsell = res.data.bigWarning.anHourSellMax.toFixed(4);
					this.$emit('getHourNum', this.meanprice)
				})
			}
		},
	}

}
</script>

<style>
.mean {
  width: 100%;
  /* padding-left: 10px; */
  box-sizing: border-box;
  display: flex;
  margin-bottom: 10px;
}
.mean .mean-box {
  /* background-color: pink; */
  /* text-align: center; */
  display: inline-block;
  vertical-align: top;
  width: 33.3%;
  height: 76px;
  line-height: 38px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 0;
}
.mean .mean-box:first-child {
  text-align: left;
}

.mean .mean-box p {
  font-size: 13px;
}
.mean .mean-box span {
  font-size: 12px;
}
</style>

