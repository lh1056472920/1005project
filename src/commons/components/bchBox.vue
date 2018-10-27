<template lang="html">
    <div class="bchBox">
        <div class="dashangeType">
            <p class="type">区块链资产购买</p>
            <div class="">
                <img src="http://192.168.1.211:8080/kefu.jpg" class="kefuCode" alt="">
                <img src="" class="kefuCode" alt="">
            </div>
            <p class="kefuText">请用微信扫描二维码，添加客服，协助购买</p>
            <div class="select-type-amount">
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
    },
    methods: {
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
        }
    }
}
</script>

<style lang="less" scoped>
.bchBox{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 500;
    background-color: rgba(0, 0, 0, 0.8);
}
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
.kefuCode{
    width: 1.51rem;
    min-width: 1.51rem;
    min-height: 1.51rem;
    margin-top: .95rem;
}
.kefuText{
    display: inline-block;
    width: 4.32rem;
    text-align: left;
    margin-top: .63rem;
    font-size: 0.42rem;
    font-weight:bold;
    color:rgba(40,104,240,1);
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
