<template lang="html">
    <div class="page">
        <HeaderItem title="会员特权"></HeaderItem>
        <div class="main">
            <div class="banner">
                <div class="bannerContainer">
                    <img src="@/images/about/vip-power.png" class="vip-power-image" alt="">
                    <p class="title">尊贵的VIP会员</p>
                    <p class="tip-date">您的VIP服务，将于{{limitTimeText}}到期</p>
                    <p>
                        <button class="keepVip" v-tap="{methods: goOpenVip}">立即续费</button>
                    </p>
                </div>
            </div>
            <div class="powerList" v-for="(item,index) in powerList"  :key="index">
                <img :src="item.imgSrc" class="image" alt="">
                <div class="">
                    <p class="label">
                        {{item.label}}
                    </p>
                    <p class="label-text">
                        {{item.content}}
                    </p>
                </div>
            </div>
            <div class="bottom-btn" v-tap="{methods: goOpenVip}">
                续费VIP会员
            </div>
        </div>
    </div>
</template>

<script>
//import HeaderItem from './../../commons/components/HeaderItem.vue'
import HeaderItem from './../../commons/components/HeaderItem.vue'

export default {
    components: {
        HeaderItem
    },
    data() {
        return {
            limitTimeText: this.$route.query.limitTimeText || '',
            powerList: [
                {
                    imgSrc: require('@/images/about/book.png'),
                    label: 'VIP专属行情解读群',
                    content: '会员有效期60天以上，可添加客服微信申请加入行情解读群;会员到期将被移出群聊；行业大牛，每日分析行情，给出合理投资建议。'
                },
                {
                    imgSrc: require('@/images/about/photo.png'),
                    label: '24小时短信、电话提醒',
                    content: '行情波动较大，可根据自己的设置，24小时短信、电话实时提醒。'
                },
                {
                    imgSrc: require('@/images/about/plane.png'),
                    label: '云委托',
                    content: '设置好赢利点，告别24小时盯盘，机器自动买卖'
                },
                {
                    imgSrc: require('@/images/about/split.png'),
                    label: '分笔委托',
                    content: '多种好玩资产模板，后期持续更新中...'
                },
                {
                    imgSrc: require('@/images/about/lixi.png'),
                    label: '套利模式',
                    content: '目前剩余10次'
                }
            ]
        }
    },
    created() {
        console.log('??????????');
        console.log(this.$store.state.userInfo.isVip);
    },
    methods: {
        goOpenVip() {
            this.$router.push({
                name: 'openVip'
            })
        }
    }
}
</script>

<style lang="less" scoped>
.page{
    width: 10.8rem;
    height: 100vh;
    position: relative;
}
.main{
    height: calc(100vh - 1.44rem - 1.73rem);
    overflow: auto;
}
.banner{
    background-color: #fff;
    position: relative;
    margin-bottom: 0.1rem;
    .bannerContainer{
        width: 10.8rem;
        text-align: center;
        p{
            text-align: center;
            color: #fff;
        }
        .keepVip{
            outline: none;
            border: none;
            width: 2.8rem;
            height: 0.79rem;
            line-height: 0.79rem;
            color: #5868D1;
            margin: 0.5rem auto;
            background:rgba(40,104,240,0.1);
            border-radius:0.4rem;
        }
        .vip-power-image{
            width: 3.46rem;
            height: 1.61rem;
            min-width: 3.46rem;
            margin: .72rem 0 .29rem;
        }
        .title{
            font-size:0.38rem;
            font-weight:bold;
            color:rgba(40,104,240,1);
        }
        .tip-date{
            color: #868686;
        }
    }
}
.powerList{
    display: flex;
    align-items: center;
    height: 2.59rem;
    padding: 0 0.5rem;
    border-bottom: 1px solid #F8FAFB;
    background-color: #fff;
    &:last-child{
        border-bottom: none;
    }
    .image{
        width: 0.8rem;
        min-width: 0.8rem;
        min-height: 0.8rem;
        margin-right: 0.5rem;
    }
    .label{
        font-size:0.42rem;
        font-weight:bold;
        color:rgba(88,104,209,1);
    }
    .label-text{
        font-size:0.36rem;
        font-weight:400;
        color:rgba(153,153,153,1);
    }
}
.bottom-btn{
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    height: 1.73rem;
    line-height: 1.73rem;
    font-size: 18px;
    background-color: #FFB400;
    color: #fff;
}
</style>




