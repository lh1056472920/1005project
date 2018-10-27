<template>
    <div class="float-search">
        <header>
            <span class="back">
                <i class="iconfont icon-fanhui" v-tap='{methods:goback}'></i>
            </span>
            <div class="search-form">
                <span class="search-icon"></span>
                <input class="search-input" type="text" v-model="searchText" v-on:input="changeSearch" placeholder="请输入搜索内容">
                <span v-show="searchText" v-tap="{methods:clearSearch}" class="search-clear"></span>
            </div>
            <button class="btn-search" v-tap="{methods:changeSearch}">搜索</button>
        </header>
        <nav v-if="!searchText">
            <ul class="tab" v-show="searchValue==''" @touchmove.prevent>
                <li>
                    <span v-tap="{methods:checkindex,num:2}" :class="{activeTab: activeIndex==2}">币安</span>
                </li>
                <li>
                    <span v-tap="{methods:checkindex,num:3}" :class="{activeTab: activeIndex==3}"> 火币</span>
                </li>
                <li>
                    <span v-tap="{methods:checkindex,num:4}" :class="{activeTab: activeIndex==4}">OKEx</span>
                </li>
                <li>
                    <span v-tap="{methods:checkindex,num:5}" :class="{activeTab: activeIndex==5}">ZB</span>
                </li>
            </ul>
        </nav>
        <main v-if="!searchText">
            <keep-alive>
                <component v-bind:is="activeName" v-show="searchValue==''"></component>
            </keep-alive>
        </main>
        <ul class="search-box" v-if="searchText">
            <li v-for="(item,i) in searchData" :key="i">
                <div class="symbol">
                    <span class="coin">{{item.coin}}</span>
                    <span class="counterparty">{{item.counterparty}}</span>
                    
                </div>
                <div>{{item.marketName}}</div>
                <div><img :src="item.imgUrl" v-tap="{methods:changeRemind,data:item}"></div>
            </li>
        </ul>
    </div>
</template>

<script>
import searchBian from "../../commons/components/search/searchBian.vue";
import searchHuobi from "../../commons/components/search/searchHuobi.vue";
import searchOkex from "../../commons/components/search/searchOkex.vue";
import searchZb from "../../commons/components/search/searchZb.vue";
import remote from "../../lib/js/remote";
export default {
    data() {
        return {
            searchValue: "",
            activeIndex: 2,
            activeName: "searchBian",
            searchText: "",
            userId: "",
            searchData:''
        };
    },
    components: {
        searchBian,
        searchHuobi,
        searchOkex,
        searchZb
    },
    created() {
        this.userId = this.$store.state.userInfo.uid;
    },
    methods: {
        checkindex(data) {
            console.log(data.num);
            this.activeIndex = data.num;
            if (data.num === 2) {
                this.activeName = "searchBian";
            } else if (data.num === 3) {
                this.activeName = "searchHuobi";
            } else if (data.num === 4) {
                this.activeName = "searchOkex";
            } else if (data.num === 5) {
                this.activeName = "searchZb";
            }
        },
        goback() {
            this.$router.go(-1);
        },
        changeSearch() {
            let params = {
                marketToken: this.searchText,
                uid: this.userId
            };
            remote.select_symbol(params).then(res => {
                console.log(res);
                let arr = res.data.resultList;
                arr.forEach(item => {
                    this.sliceSymbol(item)
                    if(item.remind ===1){
                        item.imgUrl = '../../../static/images/drawable-xxhdpi/minus.png'
                    }else{
                        item.imgUrl = '../../../static/images/drawable-xxhdpi/add.png'
                    }
                });
                this.searchData = arr;
            });
        },
        changeRemind(data){
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
                params.append("marketToken", data.data.marketToken);
                params.append("marketName", data.data.marketName);

                remote.save_remind(params).then(res => {
                    if(res.data.code === '200'){
                        this.changeSearch();
                    }
                });
            }
        },
        clearSearch() {
            this.searchText = "";
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
                    data.marketToken.substring(data.marketToken.length - 3) == "btc"
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
                data.marketName === "ZB" ||
                data.marketName === "OKEx" ||
                data.marketName === "Okex"
            ) {
                data.coin = data.marketToken.split("_")[0].toLocaleUpperCase();
                data.counterparty = data.marketToken
                    .split("_")[1]
                    .toLocaleUpperCase();
            }
        }
    }
};
</script>

<style>
.float-search header {
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
    box-shadow:0px 2px 2px 0px rgba(230,238,242,1);
}
.float-search .back {
    display: inline-block;
    width: 0.8rem;
    height: 1.44rem;
    font-size: 0.42rem;
    line-height: 1.44rem;
    text-align: center;
}
.float-search .back i {
    font-size: 0.5rem;
    color: #a6afba;
}
.float-search .search-form {
    display: inline-flex;
    align-items: center;
    width: 8.14rem;
    height: 0.8rem;
    border-bottom: #29dc54 solid 1px;
}
.float-search .search-icon {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    background-size: 0.4rem 0.44rem;
    background-position: center;
    background-repeat: no-repeat;
}
.float-search .search-input {
    font-size: 0.36rem;
    display: inline-block;
    width: 7rem;
    height: 0.6rem;
    border: 0;
    color: #374452;
    outline: none;
    background-color: transparent;
}
.float-search ::-webkit-input-placeholder {
    color: #a6afba;
}
.float-search .search-clear {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    background-image: url("../../../static/images/clear.png");
    background-size: 0.48rem;
    background-position: center;
    background-repeat: no-repeat;
}
.float-search .btn-search {
    font-size: 0.42rem;
    padding: 0;
    border: 0;
    color: #42c300;
    background-color: transparent;
    outline: none;
}
.float-search .tab {
    width: 100%;
    height: 1.4rem;
    margin-bottom: 3px;
    box-shadow: 1px 1px 3px #ddd;
    background-color: #f4f7f9;
    padding-top: 1.6rem;
    position: fixed;
}
.float-search .tab li {
    float: left;
    width: 25%;
    line-height: 1.4rem;
    text-align: center;
    font-size: 0.46rem;
}
.float-search .tab li span {
    display: inline-block;
    box-sizing: border-box;
    height: 1.4rem;
    line-height: 1.4rem;
}
.float-search .activeTab {
    color: #42c300;
    border-bottom: 1px solid #42c300;
}

.float-search main {
    padding-top: 3rem;
}
.float-search .search-box {
    padding-top: 1.6rem;
}
.float-search .search-box li {
    /* display: flex;
    justify-content: space-between; */
    padding: 0 0.6rem;
    height: 1.5rem;
    line-height: 1.5rem;
}
.float-search .search-box li > div{
    display: inline-block;
    line-height: 1.5rem;
    font-size: 15px;
}
.float-search .search-box li img{
    display: inline-block;
    width: 0.7rem;
    vertical-align: middle;
}
.float-search .search-box li > div:nth-child(3){
    float: right;
}
.float-search .search-box .symbol{
    width: 3.5rem;
}
.float-search .search-box .symbol .counterparty{
    font-size: 12px;
    color: #999999;
}
</style>

