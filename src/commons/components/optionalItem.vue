<template>
     <ul class="list">
        <li class="assetsName">
            <!-- <img src="../../../static/images/coin/BTC.png" alt=""> -->
            <img :src="coinURL" :onerror="actImgDefault" alt="">
            <div>
                <span>{{coin}}<i>/{{counterparty}}</i></span>
                <span>{{marketName}}</span>
            </div>

        </li>
        <li class="price">
            <span class="dollar">{{lastestPrice}}</span>
            <span v-show="exchangeRate*lastestPrice>=1" class="RMB">￥{{(exchangeRate*lastestPrice).toFixed(2)}}</span>
            <span v-show="exchangeRate*lastestPrice<1&&exchangeRate*lastestPrice*10>=1" class="RMB">￥{{(exchangeRate*lastestPrice).toFixed(6)}}</span>
            <span v-show="exchangeRate*lastestPrice*10<1&&exchangeRate*lastestPrice*100>=1" class="RMB">￥{{(exchangeRate*lastestPrice).toFixed(7)}}</span>
            <span v-show="exchangeRate*lastestPrice*100<1" class="RMB">￥{{(exchangeRate*lastestPrice).toFixed(8)}}</span>
        </li>
        <li class="change-li">
            <span v-show="percentChange>=0" class="change">+{{percentChange}}%</span>
            <span v-show="percentChange<0" class="change1">{{percentChange}}%</span>
        </li>
    </ul>
</template>
<style scoped>
ul.list {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  height: 1.88rem;
  background-color: #f4f7f9;
}
ul.list li {
  font-size: 0.36rem;
  width: 3.6rem;
  color: #374452;
  text-align: center;
}
.assetsName {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-left: .42rem;
}
.assetsName img {
  width: 0.92rem;
  height: 0.92rem;
}
.assetsName div {
    display: flex;
    flex-direction: column;
}
.assetsName span {
  font-size: 0.42rem;
  width: 2rem;
}

.assetsName div span:first-child {
    color: #374452;
}

.assetsName div i,
.assetsName div span:last-child {
    color: #A6AFBA;
    font-size: .3rem;
}

.price {
  display: inline-flex;
  align-items: flex-end;
  flex-flow: column;
  padding-right: 1rem;
  box-sizing: border-box;
}
.dollar {
  font-size: 0.42rem;
  font-weight: 700;
}
.RMB {
  font-size: 0.3rem;
  color: #a6afba;
}
.change {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.14rem;
  height: 0.8rem;
  border-radius: 1rem;
  color: #fff;
  background-color: #42c300;
  font-weight: 550;
}

.change1 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.14rem;
  height: 0.8rem;
  border-radius: 1rem;
  color: #fff;
  background-color: #f43e3a;
  font-weight: 550;
}
</style>
<script>
export default {
    name:'quoItem',
    props:['symbol','lastestPrice','percentChange','exchangeRate','coin','counterparty','marketName'],
    data(){
        return {
            actImgDefault:'this.src="'+require('../../../static/images/coin/new.png')+'"',
            coinName: this.coin.toUpperCase(),
            coinURL: ''
        }
    },
    watch:{
      coin(){
        this.coinName= this.coin.toUpperCase()
        this.coinURL = process.env.NODE_ENV === 'development'? './../../../static/images/coin/'+ this.coinName +'.png' :'coin/'+ this.coinName+'.png'
        
      }
    },
    mounted(){
        this.coinURL = process.env.NODE_ENV === 'development'? './../../../static/images/coin/'+ this.coinName +'.png' :'coin/'+ this.coinName+'.png'
    }
};
</script>