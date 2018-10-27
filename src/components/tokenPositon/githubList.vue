<template>
    <div class="queryToken">
        <!-- 代币持仓查询 -->
        <header>
            <span class="back" v-tap="{ methods: goBack }"></span>
            <span class="title">Github代码榜</span>
        </header>
        <div class="search">
            <div class="search-form">
                <span class="search-icon"></span>
                <input class="search-input" type="text" v-model="searchText" v-on:input='changeInput' placeholder="请输入搜索内容">
                <span v-show="searchText!== ''" class="search-clear" v-tap="{ methods: clearInput }"></span>
            </div>
            <button class="btn-search" v-tap="{ methods: search }">搜索</button>
        </div>
        <ul class="subtitle">
            <li>币种</li>
            <li v-tap="{methods:threeSortChange,params:threeSortStyle}">
                <span>近3月</span>
                <div class="arrowBox">
                    <i id="upArrow" :class="{'highlight':threeSortStyle == 'up'}"></i>
                    <i id="downArrow" :class="{'highlight':threeSortStyle == 'down'}"></i>
                </div>
            </li>
            <li v-tap="{methods:sixSortChange,params:sixSortStyle}">
                <span>近6月</span>
                <div class="arrowBox">
                    <i id="upArrow" :class="{'highlight':sixSortStyle == 'up'}"></i>
                    <i id="downArrow" :class="{'highlight':sixSortStyle == 'down'}"></i>
                </div>
            </li>
            <li v-tap="{methods:twelveSortChange,params:twelveSortStyle}">
                <span>近12月</span>
                <div class="arrowBox">
                    <i id="upArrow" :class="{'highlight':twelveSortStyle == 'up'}"></i>
                    <i id="downArrow" :class="{'highlight':twelveSortStyle == 'down'}"></i>
                </div>
            </li>
        </ul>
        <ul v-if="searchText ==''" class="list" id="List" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="20">
            <li v-for="(item,i) in dataList" :key="i">
                <span>
                    <i>{{item.repoName}}</i>
                    <i>{{item.orgName}}</i>
                </span>
                <span>
                    <i>{{item.m3Commit}}提交</i>
                    <i>{{item.m3Contrib}}人贡献</i>
                </span>
                <span>
                    <i>{{item.m6Commit}}提交</i>
                    <i>{{item.m6Contrib}}人贡献</i>
                </span>
                <span>
                    <i>{{item.m12Commit}}提交</i>
                    <i>{{item.m12Contrib}}人贡献</i>
                </span>
            </li>
            <mt-spinner type="fading-circle" color="#26a2ff" v-show="showIcon"></mt-spinner>
            <!-- <span v-show="showIcon">正在加载</span> -->
            <p v-show="showdata">
                {{loadingType}}
            </p>
        </ul>
        <ul v-if="searchText !==''" class="list" id="List" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="20">
            <li v-for="(item,i) in searchList" :key="i">
                <span>
                    <i>{{item.repoName}}</i>
                    <i>{{item.orgName}}</i>
                </span>
                <span>
                    <i>{{item.m3Commit}}提交</i>
                    <i>{{item.m3Contrib}}人贡献</i>
                </span>
                <span>
                    <i>{{item.m6Commit}}提交</i>
                    <i>{{item.m6Contrib}}人贡献</i>
                </span>
                <span>
                    <i>{{item.m12Commit}}提交</i>
                    <i>{{item.m12Contrib}}人贡献</i>
                </span>
            </li>
            <mt-spinner type="fading-circle" color="#26a2ff" v-show="searchShowIcon"></mt-spinner>
            <p v-show="searchShowdata">
                {{searchLoadingType}}
            </p>
        </ul>

    </div>
</template>

<script>
import { InfiniteScroll } from "mint-ui";
import remote from "../../lib/js/remote";
export default {
    data() {
        return {
            inSearch: false,
            searchText: "",
            threeSortStyle: "up",
            sixSortStyle: "",
            twelveSortStyle: "",
            page:1,
            size: 30,
            searchPage: 1,
            dataList: [],
            defaultData: [],
            searchList: [],
            showdata: false,
            showIcon: false,
            loadingType: "已完全加载",
            loading: false,
            searchShowIcon: false,
            searchShowdata: false,
            searchLoadingType: "已完全加载"
        };
    },
    created() {
        this.$toStatistic('githubList');
        // this.getGithubData();
    },
    mounted() {},
    methods: {
        //初始化数据
        getGithubData() {
            if (this.searchText !== "") {
                if (this.page !== 1) {
                    this.searchShowIcon = true;
                }
                let arr = [];

                let params = new URLSearchParams();
                params.append("page", this.searchPage);
                params.append("size", this.size);
                params.append("symbol", this.searchText);
                remote.github_search(params).then(res => {
                    if (res.data.length == 0) {
                        this.searchShowIcon = false;
                        this.searchShowdata = true;
                        this.loading = true;
                    } else {
                        this.searchShowdata = false;

                        arr = res.data;
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
                let params = new URLSearchParams();
                params.append("page", this.page);
                let arr = [];
                remote.github_data(params).then(res => {
                    console.log(res);
                    if (res.data.length == 0) {
                        this.showIcon = false;
                        this.showdata = true;
                        this.loading = true;
                    } else {
                        this.showdata = false;

                        arr = res.data;
                        arr.forEach(item => {
                            this.dataList.push(item);
                        });
                        this.loading = false;
                        this.page++;
                    }
                });
            }
        },
        changeInput() {
            console.log("11");
            this.searchPage = 1;
            this.searchList = [];
            this.dataList = [];

            this.page = 1;
            this.searchPage = 1;
            this.getGithubData();
        },
        //下拉获取更多
        loadMore() {
            this.loading = true;
            this.getGithubData();
        },
        githubDetails(data) {
            this.$router.push({
                path: "/githubDetails",
                query: {
                    orgName: data.query.orgName,
                    repoName: data.query.repoName
                }
            });
        },
        goBack() {
            this.$router.goBack();
        },
        clearInput() {
            this.searchText = "";
            this.getGithubData();
        },
        search() {
            // alert("点击搜索");
            if(this.searchText ===''){
                return 
            }else {
                this.changeInput()
            }
        },
        threeSortChange(data) {
            this.sixSortStyle = "";
            this.twelveSortStyle = "";
            if (data.params == "" || data.params == "down") {
                this.threeSortStyle = "up";
                this.dataList = this.sort(this.dataList, "m3Commit");
                this.searchList = this.sort(this.searchList, "m3Commit");
            } else if (data.params == "up") {
                this.threeSortStyle = "down";
                this.dataList = this.sort(this.dataList, "m3Commit").reverse();
                this.searchList = this.sort(this.searchList, "m3Commit").reverse();
            }
            this.toTop();
        },
        sixSortChange(data) {
            this.threeSortStyle = "";
            this.twelveSortStyle = "";
            if (data.params == "" || data.params == "down") {
                this.sixSortStyle = "up";
                this.dataList = this.sort(this.dataList, "m6Commit");
                this.searchList = this.sort(this.searchList, "m6Commit");
            } else if (data.params == "up") {
                this.sixSortStyle = "down";
                this.dataList = this.sort(this.dataList, "m6Commit").reverse();
                this.searchList = this.sort(this.searchList, "m6Commit").reverse();
            }
            this.toTop();
        },
        twelveSortChange(data) {
            this.threeSortStyle = "";
            this.sixSortStyle = "";
            if (data.params == "" || data.params == "down") {
                this.twelveSortStyle = "up";
                this.dataList = this.sort(this.dataList, "m12Commit");
                this.searchList = this.sort(this.searchList, "m12Commit");
            } else if (data.params == "up") {
                this.twelveSortStyle = "down";
                this.dataList = this.sort(this.dataList, "m12Commit").reverse();
                this.searchList = this.sort(this.searchList, "m12Commit").reverse();
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
    padding: 1.44rem 0.42rem 0 0.42rem;
    height: 1.5rem;
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
    height: 1.8rem;
    text-align: center;
    color: #374452;
    font-size: 0.42rem;
    display: flex;
    border-bottom: 1px solid #e2eaee55;
    box-sizing: border-box;
}

.list li span {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.list li span:first-child i:first-child {
    font-weight: bold;
}

.list li span i:nth-child(2) {
    color: #a6afba;
    font-size: 0.3rem;
}
.List p {
    text-align: center;
    height: 20px;
    line-height: 20px;
}
</style>