<template lang="html">
    <div class="page">
        <HeaderItem title="开通会员"></HeaderItem>
        <div class="main">
            <p class="title">
                <img src="@/images/about/vip_light.png" class="title-image" alt="">
                选择开通时长
            </p>
            <div class="select-panel" v-for="(item,index) in amountList"  :key="index" :class="{selected: active === index,recommend: index === recommend}" v-tap="{methods: changeSelect, active: index}">
                <div class="panel-container">
                    <p class="CNY">¥{{item.CNY}}/{{item.date === 1?'':item.date + '个'}}月</p>
                    <p class="BCH">≈{{item.BCH}} BCH</p>
                </div>
            </div>
            <div class="payType">
                <img src="./../../../static/images/about/bct_pay.png" class="payIcon" alt="">
                <span class="payTypeTex">虚拟币支付</span>
                <span class="check" :class="{seelcted: checkBCH}" v-tap="{methods: selectBCH}"></span>
            </div>
        </div>
        <div class="bottom">
            <div class="left" v-if="!checkBCH">
                <div class="total-amount">
                    <span class="label">总计：</span>
                    <span class="amount">¥{{selectAmount.CNY}}</span>
                    <span class="amount-gray">≈{{selectAmount.BCH}} BCH</span>
                </div>
                <p class="remind">您已选择{{selectAmount.date}}个月套餐</p> 
            </div>
            <div class="left" v-else>
                使用虚拟币支付
            </div>
            <div class="submit" v-tap="{methods: submit}">
                立即支付
            </div>
        </div>
        <bch-box @close="closeBchBox" v-if="showBchBox"></bch-box>
    </div>
</template>

<script>
import HeaderItem from './../../commons/components/HeaderItem.vue'
import { getPayURL } from './../../commons/js/pay.js'
import bchBox from './../../commons/components/bchBox.vue'
export default {
    components: {
        HeaderItem,
        bchBox
    },
    data() {
        return {
            active: 2,
            amountList: [
                
            ],
            selectAmount: {
                
            },
            recommend: 2,
            checkBCH: false,
            showBchBox: false
        }
    },
    created() {
        this.setAmountList();
        this.selectAmount = this.amountList[this.active];
        this.userInfo = this.$store.state.userInfo || {};
    },
    computed: {
        rates () {
            return this.$store.state.bch_exchange_rates;
        }
    },
    methods: {
        setAmountList() {
            this.amountList = [
                {
                    CNY: 0.01,
                    BCH: (0.01/this.rates).toFixed(5),
                    date: 1
                },
                {
                    CNY: 0.02,
                    BCH: (897/this.rates).toFixed(5),
                    date: 3
                },
                {
                    CNY: 0.03,
                    BCH: (1794/this.rates).toFixed(5),
                    date: 6
                },
                {
                    CNY: 0.04,
                    BCH: (3588/this.rates).toFixed(5),
                    date: 12
                }
            ]
        },
        changeSelect(params) {
            this.active = params.active
            this.selectAmount = this.amountList[params.active]
        },
        selectBCH() {
            this.checkBCH = !this.checkBCH;
        },
        async submit() {
            this.$toStatistic('payForVip');
            if (this.checkBCH) {
                this.showBchBox = true;
                return;
            }
            this.$plusReady(() => {
                window.plus.nativeUI.showWaiting( "正在加载..." );
            })
            let urlInfo = await getPayURL({
                price: String(this.selectAmount.CNY),
                telephone: this.userInfo.phone,
                times: String(this.selectAmount.date*30*24*60*60),
                userid: this.userInfo.uid,
                type: 'vip'
            });
            
            if (urlInfo && urlInfo.status === 0 && urlInfo.list) {
                this.$plusReady(() => {
                    window.plus.nativeUI.closeWaiting();
                    window.plus.runtime.openWeb(urlInfo.list);
                })
            } else {
                this.$plusReady(() => {
                    window.plus.nativeUI.closeWaiting();
                    window.plus.nativeUI.toast( "获取支付地址失败，请重试!");
                })
            }
        },
        closeBchBox() {
            this.showBchBox = false;
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
    height: calc(100vh - 1.54rem);
    overflow: auto;
    background: #F8FAFB;
    margin-top: 0.1rem;
    text-align: center;
}
.title{
    text-align: left;
    padding: 0.2rem 0.5rem;
    .title-image{
        width: 0.6rem;
        height: 0.5rem;
        vertical-align: top;
    }
}
.select-panel{
    display: inline-block;
    position: relative;
    width: 4.8rem;
    height: 2.8rem;
    background:rgba(255,255,255,1);
    border-radius: 0.15rem;
    box-shadow: .06rem .06rem .06rem rgba(230,238,242,1);
    border:1px solid transparent;
    margin: 0 0.12rem;
    .panel-container{
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .CNY{
            font-size: 0.54rem;
            font-weight:bold;
            color:rgba(255,180,0,1);
        }
        .BCH{
            font-size: 0.34rem;
            color:rgba(153,153,153,1);
        }
    }
    &.recommend{
        background: url(./../../../static/images/about/Recommend.png) no-repeat;
        background-size: 0.8rem 0.8rem;
    }
    &.selected{
        background-color: rgba(255,180,0,0.1);
        border:1px solid rgba(255,180,0,1);
        border-radius: 0.15rem;
        box-shadow: 0.06rem 0.06rem 0.06rem rgba(230,238,242,1);
    }
}
.bottom{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 10.8rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-top:1px solid rgba(226,234,238,1);
    .left{
        flex: 1;
        padding-left: 0.5rem;
        .total-amount{
            .label{
                font-size: 0.4rem;
                color:rgba(26,26,26,1);
            }
            .amount{
                font-size: 0.54rem;
                font-weight: bold;
                color:rgba(255,180,0,1);
            }
            .amount-gray{
                font-size: 0.34rem;
                color:rgba(153,153,153,1);
            }
        }
        .remind{
            font-size: 0.3rem;
            color:rgba(68,68,68,1);
        }
    }
    .remind{
        
    }
    .submit{
        width: 3.73rem;
        background:rgba(255,180,0,1);
        font-size: 0.44rem;
        color: #fff;
        text-align: center;
        height: 1.5rem;
        line-height: 1.5rem;
    }
}
.payType{
    padding: 0.5rem;
    text-align: left;
}
.payIcon{
    width: 0.66rem;
}
.check{
    display: inline-block;
    width: 0.44rem;
    height: 0.44rem;
    border: 1px solid #000;
    border-radius: 50%;
    vertical-align: middle;
    float: right;
    &.seelcted{
        background-image: url(./../../../static/images/select.png);
        background-size: 100% 100%;
        background-origin: border-box;
        border: 1px solid transparent;
        border-radius: 50%;
    }
}
</style>
