<template lang="html">
    <div class="dashangeType">
        <p class="type">{{ type === 'cny'?'人民币打赏':'数字资产打赏' }}</p>
        <div class="select-type-cny" v-if="type === 'cny'">
            <div class="select-type">
                <div class="group" :class="{selected: selectIndex === index}" v-for="(item, index) in selectGroup" v-tap="{methods: changeSelect,index: index}"  :key="index">
                    {{item}}元
                </div>
            </div>
            <div class="button" v-tap="{methods: submit}">
                立刻打赏
            </div>
        </div>
        <div class="select-type-amount" v-else>
            <div class="amountList" v-for="(item,index) in amountList"  :key="index">
                <div class="info">
                    <p class="text">{{item.text}}</p>
                    <p class="address">{{item.address}}</p>
                </div>
                <div class="copy" data-clipboard-action="copy" :data-clipboard-text="item.address" v-if="isSupported">
                    复制
                </div>
            </div>
        </div>
        <div class="closeBox" v-tap="{methods: close}">
            
        </div>
    </div>
</template>

<script>
import Clipboard from 'clipboard'
import { Toast } from 'mint-ui'
export default {
    props: {
        type: {
            type: String
        },
        list: {
            type: Object
        }
    },
    data() {
        return {
            selectIndex: 0,
            selectGroup: [
                {
                    amount: '19.9'
                },
                {
                    amount: '39.9'
                },
                {
                    amount: '69.9'
                },
                {
                    amount: '99.9'
                }
            ],
            amountList: [
                {
                    text: '火币打赏地址',
                    address: '000000000a8879d239e......09ec6963'
                },
                {
                    text: '币安打赏地址',
                    address: '000000000a8879d239e......09ec6964'
                },
                {
                    text: 'ZB打赏地址',
                    address: '000000000a8879d239e......09ec6965'
                },
                {
                    text: 'OKEx打赏地址',
                    address: '000000000a8879d239e......09ec6961'
                }
            ],
            isSupported: false
        }
    },
    mounted () {
        this.initCopy()
        this.selectGroup = this.list.shared;
    },
    methods: {
        changeSelect(params) {
            this.selectIndex = params.index;
        },
        close(params) {
            this.$emit('close',params)
        },
        initCopy() {
            this.isSupported = Clipboard.isSupported()
            if (this.isSupported) {
                let clipboard = new Clipboard(".copy")
                clipboard.on('success', e => {
                    Toast({
                        message: '复制成功',
                        className: 'toast-class'
                    })
                })
            }
        },
        submit() {
            this.close({
                amount: this.selectGroup[this.selectIndex]
            })
        }
    }
}
</script>

<style lang="less" scoped>
.dashangeType{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width:8.6rem;
    min-height: 3.8rem;
    //background:linear-gradient(-19deg,rgba(3,0,0,0.26),rgba(255,255,255,0.26));
    border-radius: 0.2rem;
    background:#fff url(./../../../static/images/about/share.png) no-repeat;
    background-size: 8.66rem 4.02rem;
    text-align: center;
}
.type{
    font-size: 0.49rem;
    color: #FFFFFF;
    font-weight: bold;
    margin-top: .43rem;
}
.select-type{
    margin-top: 3.46rem;
    .group{
        display: inline-block;
        width: 2.9rem;
        height: 1.06rem;
        line-height: 1.06rem;
        background:rgba(241,239,242,1);
        border-radius: 0.1rem;
        font-size: 0.49rem;
        color:rgba(153,153,153,1);
        margin: .29rem;
        &.selected{
            background:rgba(253,225,65,1);
            color: #7E6B00;
        }
    }
}
.button{
    margin: .35rem auto .86rem;
    width: 6.51rem;
    height:1.16rem;
    line-height: 1.16rem;
    background:rgba(253,225,65,1);
    border-radius: 0.58rem;
    font-size: 0.44rem;
    color:rgba(126,107,0,1);
}
.closeBox{
    width: 0.54rem;
    height: 0.54rem;
    background: url(./../../../static/images/about/close.png) no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(60%,-60%);
}
.select-type-amount{
    margin-top: 3.46rem;
    padding: 0 0.4rem;
    .amountList{
        display: flex;
        align-items: center;
        margin: 20px 0;
        .info{
            display: inline-block;
            text-align: left;
            flex: 1;
            .text{
                font-size:0.43rem;
                color:rgba(51,51,51,1);
            }
            .address{
                font-size: 0.35rem;
                color:rgba(51,51,51,1);
            }
        }
        .copy{
            display: inline-block;
            width: 1.44rem;
            height: 0.72rem;
            line-height: 0.72rem;
            line-height: 0.72rem;
            background:rgba(253,225,65,1);
            border-radius: 0.1rem;
        }
    }
}
</style>
