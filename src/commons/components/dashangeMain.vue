<template lang="html">
    <div class="group dashange-main">
        <p class="tip">亲，你使用炒币小助手以来</p>
        <p class="amount-text">我们累计帮您赚了<span class="amount">{{mainData.all > 10000?(mainData.all/10000).toFixed(1) + '万':mainData.all}}</span>元</p>
        <div class="group-type-container">
            <div class="group-type">
                <p class="label1">帮你赚了</p>
                <p class="amount1">{{mainData["1"] > 10000?(mainData["1"]/10000).toFixed(1) + '万':mainData["1"]}}元</p>
                <div class="amount-type">
                    分笔委托
                </div>
            </div>
            <div class="group-type">
                <p class="label1">帮你赚了</p>
                <p class="amount1">{{mainData["2"] > 10000?(mainData["2"]/10000).toFixed(1) + '万':mainData["2"]}}元</p>
                <div class="amount-type">
                    云委托
                </div>
            </div>
            <div class="group-type">
                <p class="label1">帮你赚了</p>
                <p class="amount1">{{mainData["3"] > 10000?(mainData["3"]/10000).toFixed(1) + '万':mainData["3"]}}元</p>
                <div class="amount-type">
                    历史委托
                </div>
            </div>
        </div>
        <p class="tip2">快来打赏我吧~</p>
        <p class="tip2-text">我会在以后的日子更加努力！</p>
        <div class="select-type">
            <div class="select-btn select-type-amount" v-tap="{methods: selectDStype,type: 'amount'}">
                数字资产打赏
            </div>
            <div class="select-btn select-type-cny" v-tap="{methods: selectDStype,type: 'cny'}">
                人民币打赏
            </div>
        </div>
        <div class="closeBox" v-tap="{methods: close}">
            
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Object
        }
    },
    data() {
        return {
            mainData: this.list
        }
    },
    methods: {
        selectDStype(params){
            this.$emit('selectDStype', params.type)
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>

<style lang="less" scoped>
.group{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 9.8rem;
    min-height: 3.8rem;
    //background:linear-gradient(-19deg,rgba(3,0,0,0.26),rgba(255,255,255,0.26));
    border-radius: 0.2rem;
}
.dashange-main{
    background:url(./../../../static/images/about/dashang.png) no-repeat;
    background-size: 9.8rem 9.8rem;
    text-align: center;
    border: 1px solid transparent;
    .tip{
        font-size: 0.4rem;
        color:rgba(255,255,255,1);
        margin-top: .86rem;
    }
    .amount-text{
        font-size: 0.58rem;
        color:rgba(254,220,29,1);
        .amount{
            color:rgba(255,255,255,1); 
        }
    }
    .group-type-container{
        display: flex;
        margin-top: .43rem;
        padding: 0 0.5rem;
        .group-type{
            position: relative;
            flex: 1;
            height: 2.31rem;
            background-color: #fff;
            border-radius: 0.08rem;
            box-shadow:0.13rem 0px 0.13rem rgba(177,7,11,0.17);
            margin: 0 .1rem;
            .label1{
                font-size: 0.29rem;
                color:rgba(102,102,102,1);
                margin-top: .2rem;
            }
            .amount1{
                font-size: 0.49rem;
                color:#FF3A55;
                font-weight:bold;
            }
            .amount-type{
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 0.62rem;
                line-height: 0.62rem;
                background:rgba(254,208,3,1);
                color: #664904;
            }
        }
    }
    .tip2{
        font-size: 0.58rem;
        font-weight:800;
        color:rgba(254,208,3,1);
        margin-top: .58rem;
    }
    .tip2-text{
        font-size: 0.35rem;
        color:rgba(255,255,255,1);
        margin-top: .09rem;
    }
    .select-type{
        padding: 0.8rem;
        .select-btn{
            display: inline-block;
            width: 3.41rem;
            height: 1.07rem;
            line-height: 1.07rem;
            border-radius: 0.53rem;
            margin: 0 .29rem;
            &.select-type-amount{
                border: 0.02rem solid rgba(254,220,29,1);
                color: #FEDC1D;
            }
            &.select-type-cny{
                background: rgba(254,220,29,1);
                color: #664904;
            }
        }
    }
    .closeBox{
        width: 0.7rem;
        height: 0.7rem;
        position: absolute;
        right: 0;
        top: 0;
    }
}
</style>
