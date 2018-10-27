<template lang="html">
    <div class="page">
        <HeaderItem title="收徒挖矿"></HeaderItem>
        <div class="main">
            <div class="background">
                <p class="text">邀请收徒即挖矿</p>
                <span class="activityRule" v-tap="{methods: toActivityRule}">活动规则</span>
                <span class="activityRule profit" v-tap="{methods: toProfitDetail}">我的收益</span>
            </div>
            <div class="panel invite">
                <p class="bold">每邀请1位好友成功开通VIP</p>
                <img src="@/images/about/vip_light.png" class="vip_light" alt="">
                <p class="bolder">立得<span class="bolderText">0.001BCH</span></p>
                <p class="label">被邀请好友填写你的邀请码并成功开通vip您获得奖励</p>
                <p class="invite-btn">
                    <button-item title="立即邀请" bg="#FFB400" width="4.1rem" height="1rem" fontSize="0.42rem" identify="invite" @onClick="toInvite"></button-item>
                </p>
                <a href="javascript:;" class="invite-href inviteNumber">我的邀请码：{{inviteCode}}</a>
            </div>
            <p class="title">- 简单三步  立享权益 -</p>
            <div class="panel step">
                <div class="group">
                    <img src="@/images/about/step1.png" class="step-number" alt="">
                    <p class="step-label">分享给好友</p>
                </div>
                <div class="group">
                    <img src="@/images/about/step2.png" class="step-number" alt="">
                    <p class="step-label">好友注册并开通VIP</p>
                </div>
                <div class="group">
                    <img src="@/images/about/step3.png" class="step-number" alt="">
                    <p class="step-label">获得奖励</p>
                </div>
            </div>
            <p class="title">- 我的战绩 -</p>
            <div class="panel grade">
                <p class="ore-detail" v-tap="{methods: toProfitDetail}">查看我的挖矿详情</p>
                <div class="gradeDetail">
                    <div class="grade-group">
                        <p class="grade-value grade-ore">{{myRankInfo.totalmoney}}</p>
                        <p class="grade-label">获得奖励（BCH）</p>
                    </div>
                    <div class="grade-group">
                        <p class="grade-value">{{myRankInfo.countt}}</p>
                        <p class="grade-label">成功开通VIP的徒弟</p>
                    </div>
                    <div class="grade-group">
                        <p class="grade-value">{{myRankInfo.rank>99?'99+':myRankInfo.rank}}</p>
                        <p class="grade-label">战绩排名</p>
                    </div>
                </div>
                <p class="invite-btn">
                    <button-item title="分享战绩" identify="share" bg="#FFB400" width="4.1rem" height="1.1rem" @onClick="toInvite"></button-item>
                </p>
            </div>
            <p class="title">- 挖矿排行榜 -</p>
            <div class="rank-panel panel">
                <table class="rank-table">
                    <tr>
                        <td class="td-image">
                            <img src="@/images/about/header.png" class="head-image" alt="">
                        </td>
                        <td>
                            <p class="rank-number">排名：第{{myRankInfo.rank>99?'99+':myRankInfo.rank}}</p>
                            <p class="rank-user">我</p>
                        </td>
                        <td class="right">
                            <p class="rank-amount">{{myRankInfo.totalmoney}}</p>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="rank-panel rank-all">
                <table class="rank-table">
                    <tr v-for="(item,index) in allRank"  :key="index">
                        <td class="td-image">
                            <img src="@/images/about/header.png" class="head-image" alt="">
                        </td>
                        <td>
                            <p class="rank-number">NO.{{item.rank}}</p>
                            <p class="rank-user">{{item.phone}}</p>
                        </td>
                        <td class="right">
                            <p class="rank-amount">{{item.totalmoney}}</p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderItem from './../../commons/components/HeaderItem.vue'
import ButtonItem from './../../commons/components/ButtonItem.vue'

export default {
    components: {
        HeaderItem,
        ButtonItem
    },
    data() {
        return {
            inviteCode: '',
            userInfo: {},
            myRankInfo: {},
            allRank: []
        }
    },
    created() {
        this.userInfo = this.$store.state.userInfo || {};
        this.getInviteCode();
        this.getMyRank();
        this.getAllRank();
    },
    methods: {
        toActivityRule() {
            this.$toStatistic('activityRule', '点击活动规则');
            this.$router.push({
                path: '/activityRule'
            })
        },
        toInvite(type) {
            if (type === 'invite') {
                this.$toStatistic('invite', '点击立即邀请');
            } else {
                this.$toStatistic('shareScore', '点击分享战绩');
            }
            this.$router.push({
                name: 'invite',
                params: {
                    identify: type,
                    inviteCode: this.inviteCode,
                    totalmoney: this.myRankInfo.totalmoney
                }
            })
        },
        toProfitDetail() {
            this.$toStatistic('myProfit', '点击我的收益');
            this.$router.push({
                path: "/profitDetail"
            });
        },
        getInviteCode() {
            this.$remote.get_inviteCode({
                uid: this.userInfo.uid
            }).then((res) => {
                if (res.status === 200 && res.data.result) {
                    this.inviteCode = res.data.result;
                }
            })
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
        getAllRank() {
            this.$remote.get_all_rank().then((res) => {
                if (res.status === 200 && res.data.result && res.data.result.list) {
                    this.allRank = res.data.result.list;
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.page{
    width: 10.8rem;
    height: 100vh;
}
.main{
    position: relative;
    width: 10.8rem;
    height: calc(100vh - 1.44rem);
    overflow: auto;
    background-color: #F8FAFB;
    color: #1A1A1A;
    overflow-x: hidden;
}
.invite-href{
    font-size:0.36rem;
    font-weight:bold;
    color:#999999;
    -webkit-tap-highlight-color: transparent;
}
.invite-btn{
    margin: 30px 0;
}
table,td{
    border: none;
}
.background{
    background: url('./../../../static/images/about/apprentice.png') no-repeat;
    background-size: 10.8rem;
    height: 4.32rem;
    padding-top: 1.44rem;
    font-size: .52rem;
    font-weight: bold;
    color: #fff;
    text-align: center;
    .text{
        font-size:0.72rem;
        font-weight:bold;
        color:rgba(255,255,255,1);
    }
    .activityRule{
        background-color: #5868D1;
        color: #fff;
        position: absolute;
        top: .43rem;
        right: -.43rem;
        display: inline-block;
        width: 2.88rem;
        height: .86rem;
        line-height: .86rem;
        border-radius: .46rem;
        text-align: center;
        font-size: .43rem;
        font-weight: normal;
        &.profit{
            top: 1.5rem;
            background-color: #ee54ec;
        }
    }
}
.panel{
    width: 9.8rem;
    background:rgba(255,255,255,1);
    border-radius:0.1rem;
    box-shadow:0px 3px 3px 0px rgba(230,238,242,1);
    background-color: #fff;
    overflow: hidden;
    text-align: center;
    margin: 0 auto;
    padding: 0.5rem 0;
    &.invite{
        margin-top: -2.59rem;
        .vip_light{
            width: 1.07rem;
        }
        .bold{
            font-style: normal;
            font-size: 0.48rem;
            margin-bottom: 0.5rem;
        }
        .bolder{
            width: 3.74rem;
            color: #FF9602;
            margin: .2rem auto;
            font-size: 0.42rem;
            .bolderText{
                font-weight:bold;
                font-size: .86rem;
            }
        }
        .label{
            margin: 0 auto;
            font-size:0.36rem;
            color:rgba(153,153,153,1);
        }
    }
    &.step{
        display: flex;
        .group{
            flex: 1;
            .step-number{
                width: 1.2rem;
                height: 1.2rem;
                min-width: 1.2rem;
                margin: 0 auto;
            }
            .step-label{
                font-size: 0.36rem;
                padding: 0.2rem 0;
            }
            
        }
    }
    &.grade{
        .ore-detail{
            text-align: right;
            font-size:0.36rem;
            color:rgba(255,180,0,1);
            padding: 0.3rem 0.5rem;
        }
        .gradeDetail{
            display: flex;
            .grade-group{
                flex: 1;
                .grade-value{
                    font-size:0.54rem;
                    font-weight:bold;
                    color: #5868D1;
                    &.grade-ore{
                        color:rgba(255,150,2,1);
                    }
                }
                .grade-label{
                    font-size: 0.36rem;
                    color:#999999; 
                    margin: 0.2rem 0 0.4rem;
                }
            }
        }
        .share-text{
            font-size:0.36rem;
            color:#999999;
        }
    }
}
.title{
    font-size:0.48rem;
    font-weight:bold;
    color:rgba(88,104,209,1);
    text-align: center;
    padding: 0.3rem 0;
}
.rank-panel{
    background-color: #fff;
    .rank-table{
        width: 9.8rem;
        margin: 0 auto;
        tr{
            height: 2.3rem;
        }
        .td-image{
            width: 1rem;
        }
        .head-image{
            width: 1.58rem;
            min-width: 1.58rem;
            min-height: 1.58rem;
        }
        .right{
            text-align: right;
        }
        .rank-number{
            font-size:0.42rem;
            color:rgba(68,68,68,1);
            text-align: left;
        }
        .rank-user{
            font-size:0.36rem;
            color:rgba(153,153,153,1);
            text-align: left;
        }
        .rank-amount{
            font-size:0.54rem;
            font-weight:bold;
            color:rgba(255,150,2,1);
        }
    }
    &.rank-all{
        margin: 0.5rem auto 0;
        width: 9.8rem;
    }
}
</style>
