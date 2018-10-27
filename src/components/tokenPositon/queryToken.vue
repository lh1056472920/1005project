<template>
    <div class="queryToken">
        <!-- 代币持仓查询 -->
        <header>
            <span class="back" v-tap="{ methods: goBack }"></span>
            <span class="title">代币持仓查询</span>
        </header>
        <div class="search">
            <div class="search-form">
                <span class="search-icon"></span>
                <input class="search-input" type="text" v-model="searchText" v-on:input='changeInput' placeholder="请输入搜索内容">
                <span class="search-clear" v-show="searchText !==''" v-tap="{ methods: clearInput }"></span>
            </div>
            <button class="btn-search" v-tap="{ methods: search }">搜索</button>
        </div>
        <ul class="subtitle">
            <li>币种</li>
            <li v-tap="{methods:numSortChange,params:numSortStyle}">
                <span>地址数量</span>
                <div class="arrowBox">
                    <i id="upArrow" :class="{'highlight':numSortStyle == 'up'}"></i>
                    <i id="downArrow" :class="{'highlight':numSortStyle == 'down'}"></i>
                </div>
            </li>
            <li v-tap="{methods:ratioSortChange,params:ratioSortStyle}">
                <span>流通前100占比</span>
                <div class="arrowBox">
                    <i id="upArrow" :class="{'highlight':ratioSortStyle == 'up'}"></i>
                    <i id="downArrow" :class="{'highlight':ratioSortStyle == 'down'}"></i>
                </div>
            </li>
            <li v-tap="{methods:changeSortChange,params:changeSortStyle}">
                <span>一周变化</span>
                <div class="arrowBox">
                    <i id="upArrow" :class="{'highlight':changeSortStyle == 'up'}"></i>
                    <i id="downArrow" :class="{'highlight':changeSortStyle == 'down'}"></i>
                </div>
            </li>
        </ul>
        <ul v-if="searchText ==''" class="list" id="List" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="20">
            <li v-for="(item,i) in dataList" :key="i" v-tap="{methods:toDetail,query:{name:item.name,contract:item.contract,symbol:item.symbol}}">
                <span>{{item.symbol}}</span>
                <span>{{item.holders}}</span>
                <span>{{(item.turnover100*100).toFixed(2)}}%</span>
                <span v-show="(item.changeTurnover100).toFixed(2)>=0">{{'+'+Number((item.changeTurnover100).toFixed(2))}}%</span>
                <span v-show="(item.changeTurnover100).toFixed(2)<0">{{(item.changeTurnover100).toFixed(2)}}%</span>
            </li>
            <mt-spinner type="fading-circle" color="#26a2ff" v-show="showIcon"></mt-spinner>
            <!-- <span v-show="showIcon">正在加载</span> -->
            <p v-show="showdata">
                {{loadingType}}
            </p>
        </ul>
        <ul v-if="searchText !==''" class="list" id="List" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="20">
            <li v-for="(item,i) in searchList" :key="i" v-tap="{methods:toDetail,query:{name:item.name,contract:item.contract,symbol:item.symbol}}">
                <span>{{item.symbol}}</span>
                <span>{{item.holders}}</span>
                <span>{{(item.turnover100*100).toFixed(2)}}%</span>
                <span v-show="(item.changeTurnover100).toFixed(2)>=0">{{'+'+Number((item.changeTurnover100).toFixed(2))}}%</span>
                <span v-show="(item.changeTurnover100).toFixed(2)<0">{{(item.changeTurnover100).toFixed(2)}}%</span>
            </li>
            <mt-spinner type="fading-circle" color="#26a2ff" v-show="showIcon"></mt-spinner>
            <!-- <span v-show="showIcon">正在加载</span> -->
            <p v-show="showdata">
                {{loadingType}}
            </p>
        </ul>
    </div>
</template>
<script>
import { InfiniteScroll } from "mint-ui";
import remote from "../../lib/js/remote.js";

export default {
    data() {
        return {
            searchText: "",
            numSortStyle: "up",
            ratioSortStyle: "",
            changeSortStyle: "",
            dataList: [],
            page: 1,
            size: 30,
            loading: false,
            loadingType: "已完全加载",
            showdata: false,
            showIcon: false,
            searchList: []
        };
    },
    mounted() {
        this.$toStatistic('queryToken');
        // this.getCashData();
    },
    methods: {
        getCashData() {
            if (this.searchText !== "") {
                if (this.page !== 1) {
                    this.searchShowIcon = true;
                }
                let arr = [];

                let params = new URLSearchParams();
                params.append("page", this.searchPage);
                params.append("size", this.size);
                params.append("symbol", this.searchText);
                remote.cash_searchData(params).then(res => {
                    console.log(res);
                    if (res.data.data.length == 0) {
                        this.searchShowIcon = false;
                        this.searchShowdata = true;
                        this.loading = true;
                    } else {
                        this.searchShowdata = false;

                        arr = res.data.data;
                        arr.forEach(item => {
                            this.searchList.push(item);
                        });
                        console.log(this.searchList);
                        this.loading = false;
                        this.searchPage++;
                    }
                });
            } else {
                if (this.page !== 1) {
                    this.showIcon = true;
                }
                let arr = [];
                let params = new URLSearchParams();
                params.append("page", this.page);
                remote.cash_getData(params).then(res => {
                    console.log(res);
                    if (res.data.data.length !== 0) {
                        this.showdata = false;
                        arr = res.data.data;
                        this.loading = false;

                        arr.forEach(item => {
                            item.changeTurnover100 =
                                item.changeTurnover100 * 100;
                            this.dataList.push(item);
                        });
                        this.showIcon = true;
                        this.showIcon = false;
                        this.page++;
                    } else if (res.data.data.length === 0) {
                        this.showdata = true;
                        this.showIcon = false;
                        this.loading = true;
                        setTimeout(() => {
                            this.showdata = false;
                            // this.loading = false;
                        }, 2000);
                    }
                });
            }
        },
        loadMore() {
            this.loading = true;
            this.getCashData();
        },
        goBack() {
            this.$router.goBack();
        },
        changeInput() {
            this.searchPage = 1;
            this.searchList = [];
            this.dataList = [];

            this.page = 1;
            this.searchPage = 1;
            this.getCashData();
        },
        clearInput() {
            this.searchText = "";
        },
        search() {
            if (this.searchText === "") {
                return;
            } else {
                this.changeInput();
            }
        },
        toDetail(params) {
            console.log(params);

            this.$router.push({
                path: "/tokenDel",
                query: {
                    symbol: params.query.symbol,
                    contract: params.query.contract,
                    name: params.query.name
                }
            });
        },
        numSortChange(data) {
            this.ratioSortStyle = "";
            this.changeSortStyle = "";
            if (data.params == "" || data.params == "down") {
                this.numSortStyle = "up";
                this.dataList = this.sort(this.dataList, "holders");
            } else if (data.params == "up") {
                this.numSortStyle = "down";
                this.dataList = this.sort(this.dataList, "holders").reverse();
            }
            this.toTop();
        },
        ratioSortChange(data) {
            this.numSortStyle = "";
            this.changeSortStyle = "";
            if (data.params == "" || data.params == "down") {
                this.ratioSortStyle = "up";
                this.dataList = this.sort(this.dataList, "turnover100");
            } else if (data.params == "up") {
                this.ratioSortStyle = "down";
                this.dataList = this.sort(
                    this.dataList,
                    "turnover100"
                ).reverse();
            }
            this.toTop();
        },
        changeSortChange(data) {
            this.ratioSortStyle = "";
            this.numSortStyle = "";
            if (data.params == "" || data.params == "down") {
                this.changeSortStyle = "up";
                this.dataList = this.sort(this.dataList, "changeTurnover100");
            } else if (data.params == "up") {
                this.changeSortStyle = "down";
                this.dataList = this.sort(
                    this.dataList,
                    "changeTurnover100"
                ).reverse();
            }
            this.toTop();
        },
        toTop() {
            var target = document.getElementById("List");
            target.scrollIntoView();
            // window.scrollTo(0,0)
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
    }
};
</script> 

<style scoped>
.queryToken {
    width: 100%;
    height: calc(100vh);
    overflow: auto;
}
header {
    width: 100%;
    height: 1.44rem;
    padding-left: 0.42rem;
    display: flex;
    justify-content: flex-start;
    background-color: rgba(244, 247, 249);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
}

.back {
    width: 0.8rem;
    height: 1.44rem;
    background-image: url("../../../static/images/back.png");
    background-position: 0.27rem center;
    background-size: 0.32rem 0.6rem;
    background-repeat: no-repeat;
}

.title {
    width: 8.14rem;
    height: 1.44rem;
    line-height: 1.44rem;
    text-align: center;
    font-size: 0.54rem;
    color: #404040;
}

.search {
    /* padding: 1.44rem 0.42rem 0 0.42rem; */
    padding-top: 1.44rem;
    height: 1.5rem;
    width: 100%;
    background-color: rgba(244, 247, 249);
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    z-index: 99;
}

.search .search-form {
    width: 8.75rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    background-color: rgba(237, 242, 245, 1);
    border-radius: 0.5rem;
}

.search-icon {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-image: url("../../../static/images/search-gray.png");
    background-size: 0.4rem 0.44rem;
    background-position: center;
    background-repeat: no-repeat;
}
.search-input {
    font-size: 0.36rem;
    display: inline-block;
    width: 7rem;
    height: 0.6rem;
    border: 0;
    color: #374452;
    outline: none;
    background-color: transparent;
}
::-webkit-input-placeholder {
    color: #a6afba;
}
.search-clear {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-image: url("../../../static/images/clear.png");
    background-size: 0.48rem;
    background-position: center;
    background-repeat: no-repeat;
}
.btn-search {
    font-size: 0.42rem;
    /* padding-right: 0.7rem; */
    border: 0;
    color: #374452;
    background-color: transparent;
    outline: none;
}

.subtitle {
    width: 100%;
    height: 1.4rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top: 2.94rem;
    position: fixed;
    background-color: #edf2f5;
}

.subtitle li {
    flex: 1;
    color: #374452;
    font-size: 0.36rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.subtitle li:first-child {
    flex: 0;
    flex-basis: 2rem;
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

.list {
    width: 100%;
    background-color: rgba(244, 247, 249);
    padding-top: 4.34rem;
    text-align: center;
}

.list li {
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    color: #374452;
    font-size: 0.42rem;
    display: flex;
    border-bottom: 1px solid #e2eaee55;
    box-sizing: border-box;
}

.list li span {
    flex: 1;
}

.list li span:first-child {
    flex: 0;
    flex-basis: 2rem;
}
</style>
