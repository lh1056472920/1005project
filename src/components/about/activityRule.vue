<template lang="html">
    <div class="page">
        <HeaderItem title="活动规则"></HeaderItem>
        <div class="main">
            <ul>
                <li>成功邀请好友注册使用APP，即可获得20天免费VIP体验，限领1次。</li>
                <li class="vip-text">
                    <span>徒弟首次开通/续费1个月vip，师傅得0.001BCH</span>
                    <p class="vip-list">徒弟首次开通/续费1个月vip，师傅得0.001BCH</p>
                    <p class="vip-list">徒弟首次开通/续费3个月VIP，师傅得0.005BCH</p>
                    <p class="vip-list">徒弟首次开通/续费6个月VIP，师傅得0.012BCH</p>
                    <p class="vip-list">徒弟首次开通/续费12个月VIP，师傅得0.030BCH</p>
                </li>
                <li>发放条件：满0.1BCH即可提交提现申请，等待客服审核通过</li>
                <li>活动日期为2018-09-07至2020-09-07</li>
                <li>活动奖励最终解释权归开普勒金融炒币工具所有</li>
            </ul>
        </div>
    </div>
</template>

<script>
import HeaderItem from './../../commons/components/HeaderItem.vue'

export default {
    components: {
        HeaderItem
    },
    data() {
        return {
            
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
    padding: 1rem 0.5rem;
    font-size:0.42rem;
    color:rgba(68,68,68,1);
    background: #fff;
    margin-top: 0.1rem;
    height: calc(100vh - 3.54rem);
    ul{
        list-style: decimal inside;
        li{
            margin-bottom: .86rem;
            .vip-list{
                text-indent: .46rem;
                padding: 0.1rem 0;
            }
            &.vip-text{
                font-size:0.42rem;
                color:rgba(255,150,2,1);
            }
        }
    }
}
</style>
