<template lang="html">
    <div class="page">
        <HeaderItem title="收益详情"></HeaderItem>
        <div class="main">
            <div class="allProfit">
                <h5 class="profit-title">我的总收益</h5>
                <div class="profit-middle">
                    <p class="profit-amount">
                        <span class="amount">{{account}}</span>
                        <span class="profit-type">BCH</span>
                    </p>
                    <button class="rollOut" v-tap="{methods: rollOut}">提现</button>
                </div>
                <div class="profit-container">
                    <div class="profit-origin ore">
                        <p class="amount">{{myRankInfo.totalmoney}}</p>
                        <p class="profit-type">收徒挖矿</p>
                    </div>
                    <div class="profit-origin">
                        <p class="amount">{{myRankInfo.countt}}</p>
                        <p class="profit-type">徒弟数量</p>
                    </div>
                </div>
            </div>
            <div class="profitDetail">
                <tab-nav :list="tabList" :styleOptions="styleOptions" bgColor="transparent" @click="tabChange"></tab-nav>
                <div class="swiper-container">
                    <swiper :options="swiperOption" ref="profitSwiper">
                        <swiper-slide class="tab-container">
                            <table class="profitTable profitTable-record">
                                <tr v-for="(item,index) in walletReord"  :key="index">
                                    <td>
                                        <p class="content">{{item.label}}</p>
                                        <p class="date">{{item.dataText}}</p>
                                    </td>
                                    <td style="text-align: right;">
                                        <p class="amount">{{item.resultText}}</p>
                                        <p class="detail" v-tap="{methods: putForwardDetail,item: item}" v-if="item.result && item.result.length === 1">查看详情</p>
                                    </td>
                                </tr>
                            </table>
                        </swiper-slide>
                        <swiper-slide class="tab-container">
                            <table class="profitTable profitTable-apprentice">
                                <tr class="tableHead" style="border-bottom: 1px solid #edf2f5;text-align: left;">
                                    <th>手机</th>
                                    <th>开通时间</th>
                                    <th>开通时长</th>
                                    <th>获得奖励</th>
                                </tr>
                                <tr v-for="(item,index) in apprentice"  :key="index">
                                    <td>
                                        <p>{{item.fphoneText}}</p>
                                    </td>
                                    <td>
                                        <p>{{item.dateText}}</p>
                                    </td>
                                    <td>
                                        <p>{{item.limitTimeText}}</p>
                                    </td>
                                    <td>
                                        <p class="amount">{{item.fidawardText}}</p>
                                    </td>
                                </tr>
                            </table>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
        </div>
        <rollOutBox v-if="showRollOutBox" :account="account" @close="closeBox"></rollOutBox>
    </div>
</template>

<script>
import HeaderItem from './../../commons/components/HeaderItem.vue'
import tabNav from './../../commons/components/tabNav.vue'
import rollOutBox from './../../commons/components/rollOutBox.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { formatDate } from './../../lib/js/tools.js'

export default {
    components: {
        HeaderItem,
        tabNav,
        swiper,
        swiperSlide,
        rollOutBox
    },
    data() {
        return {
            userInfo: {},
            account: 0,
            myRankInfo: {},
            swiperOption: {
                on: {
                    slideChange: () => {
                        //this.activeSwiper = this.swiperName[this.swiper.activeIndex]
                    }
                }
            },
            tabList: [
                {
                    text: '钱包记录'
                },
                {
                    text: '我的徒弟'
                }
            ],
            walletReord: [],
            apprentice: [],
            styleOptions: {
                width: '110px',
                flex: 'none'
            },
            showRollOutBox: false
        }
    },
    created() {
        this.userInfo = this.$store.state.userInfo || {};
        this.getBalance();
        this.getWalletRecord();
        this.getApprenticeRecord();
        this.getMyRank();
    },
    methods: {
        goBack() {
            this.$router.goBack();
        },
        tabChange(index) {
            this.$refs.profitSwiper.swiper.slideTo(index, 500, false)
        },
        putForwardDetail(params) {
            this.$router.push({
                name: 'putForwardDetail',
                params: {
                    item: params.item
                }
            })
        },
        getBalance() {
            this.$remote.get_wallet_balance({
                uid:  this.userInfo.uid
            }).then((res) => {
                if (res.status === 200) {
                    let userData = res.data.result;
                    this.account = userData.account;
                }
            })
        },
        getWalletRecord() {
            this.$remote.get_wallet_record({
                uid: this.userInfo.uid
            }).then((res) => {
                if (res.data.code === 200) {
                    let userData = res.data.result;
                    userData.list.forEach((item) => {
                        item.resultText = item.result + 'BCH';
                        item.dataText = formatDate(new Date(item.utime*1000), 'yyyy-MM-dd hh:mm')
                        switch (item.result) {
                            case '0':
                                item.label = `申请提现${item.utitle}BCH失败`;
                                item.resultText = '提现失败';
                                break;
                            case '1':
                                item.label = `申请提现${item.utitle}BCH`;
                                item.resultText = '审核中';
                                break;
                            case '2':
                                item.label = `提现${item.utitle}BCH成功`;
                                item.resultText = '-' + item.utitle + 'BCH'
                                break;
                            default:
                                item.label = item.utitle;
                        }
                    })
                    this.walletReord = userData.list;
                }
            })
        },
        getApprenticeRecord() {
            this.$remote.get_apprentice_record({
                fid:  this.userInfo.uid
            }).then((res) => {
                if (res.data.code === 200) {
                    let apprenticeList = res.data.result.list;
                    apprenticeList.forEach((item) => {
                        item.fphoneText = item.phone.replace(/(\d{3}).*(\d{4})/g,'$1****$2');
                        item.dateText = formatDate(new Date(item.dateTime*1000),'MM月dd日');
                        item.limitTimeText = parseInt(item.limitTime/(24*60*60*30)) + '个月';
                        item.fidawardText = item.fidaward + 'BCH';
                    })
                    this.apprentice = apprenticeList;
                }
            })
        },
        rollOut() {
            this.$toStatistic('rollOut', '点击提现');
            if (!this.account || this.account - 1 < 0) {
                this.$plusReady(() => {
                    window.plus.nativeUI.alert('满1BCH才能提现哦！')
                })
            } else {
                this.showRollOutBox = true;
            }
        },
        getMyRank() {
            this.$remote.get_my_rank({
                fphone: this.userInfo.phone
            }).then((res) => {
                if (res.status === 200 && res.data.result) {
                    this.myRankInfo = res.data.result;
                }
            })
        },
        closeBox() {
            this.showRollOutBox = false;
            this.getBalance();
            this.getWalletRecord();
            this.getApprenticeRecord();
            this.getMyRank();
        }
    }
}
</script>

<style lang="less" scoped>
    .page{
        width: 10.8rem;
        height: 100vh;
        background:#f9fafb;
        
    }
    .main{
        height: calc(100vh - 1.44rem);
        overflow: auto;
    }
    .allProfit{
        width: 8.8rem;
        margin: 0.2rem auto;
        box-shadow:0px 3px 3px 0px rgba(230,238,242,1);
        border-radius: .1rem;
        padding: 0.5rem;
        .profit-title{
            font-size:0.36rem;
            font-weight: 400;
            color:rgba(26,26,26,1);
        }
        background-color: #fff;
    }
    .profit-middle{
        text-align: center;
    }
    .profit-amount{
        text-align: center;
        color:rgba(255,150,2,1);
        .amount{
            font-size: 0.8rem;
            font-family:PingFangSC-Semibold;
            font-weight:bold;
        }
    }
    .rollOut{
        display: inline-block;
        border: none;
        border-radius: .4rem;
        width: 2.8rem;
        height: .79rem;
        line-height: 0.79rem;
        outline: none;
        background:rgba(40,104,240,0.1);
        color: #5868D1;
    }
    .profit-container{
        display: flex;
        padding: 0.5rem 0;
        .profit-origin{
            flex: 1;
            text-align: center;
            color:rgba(88,104,209,1);
            .amount{
                font-size:0.54rem;
                font-weight:bold;
            }
            .profit-type{
                font-size:0.36rem;
                font-weight:400;
                color:rgba(153,153,153,1);  
            }
            &.ore{
                .profit-type{
                    border-right: 1px solid rgba(40,104,240,0.5);;
                }
            }
        }
    }
    .profitDetail{
        padding: 0 0.5rem;
        margin: 0 auto;
    }
    .swiper-container{
        background-color: #fff;
    }
    .profitTable{
        width: 100%;
        border: none;
        td,th{
            border: none;
        }
        &.profitTable-record{
            tr{
                height: 2.3rem;
                border-bottom: 1px solid rgba(217,217,217,0.1);
            }
        }
        &.profitTable-apprentice{
            tr{
                height: 1.44rem;
                color: #1A1A1A;
                &.tableHead{
                    color: #999999;
                }
            }
            .amount{
                color: #5868D1;
                font-weight: normal;
            }
        }
        .content{
            font-size:0.42rem;
            color:rgba(26,26,26,1);
        }
        .date{
            font-size:0.36rem;
            color:rgba(153,153,153,1);
        }
        .amount{
            font-size:0.42rem;
            font-weight: bold;
            color:rgba(88,104,209,1);   
        }
        .detail{
            font-size:0.36rem;
            color:rgba(153,153,153,1);
        }
    }
    .tab-container{
        display: flex;
        display: -webkit-flex;
        flex-flow: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
    }
</style>
