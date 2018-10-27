<template lang="html">
    <div class="bchBox">
        <div class="dashangeType">
            <p class="type">提现</p>
            <div class="inputContainer">
                <div class="input-box">
                    <input type="text" id="address" class="text address" @keyup="keyup($event)" v-model="address" placeholder="请输入BCH地址">
                </div>
                <p class="warn">请确保地址填写正确，因填写错误造成的损失，概不负责</p>
                <div class="input-box address-box">
                    <input type="text" class="text sum" @keyup="keyup($event)" v-model="sum" placeholder="请输入提现金额">
                    <span id="rollAll" class="rollAll" v-tap="{methods: rollAll}">全部提现</span>
                </div>
                <p class="warn gray">可提现金额{{account}}BCH</p>
            </div>
            <div class="submit" v-tap="{methods: submit}">
                申请提现
            </div>
            <a href="http://192.168.1.211:8080/H556CB065_0925143552.apk" class="download">下载钱包</a>
            <div class="closeBox" v-tap="{methods: close}">
                
            </div>
        </div>
    </div>
</template>

<script>
import Clipboard from 'clipboard'
import { createParams } from './../js/dsParams.js'
import { Toast } from 'mint-ui'
export default {
    props: {
        type: {
            type: String
        },
        list: {
            type: Object
        },
        account: {}
    },
    data() {
        return {
            address: '',
            selectIndex: 0,
            sum: '',
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
        this.userInfo = this.$store.state.userInfo || {};
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
        },
        rollAll() {
            this.$toStatistic('rollAll');
            this.sum = this.account;
        },
        keyup(event) {
            if (event.keyCode === 13) {
                this.submit();
            }
        },
        submit() {
            this.$toStatistic('reqRollOut');
            document.activeElement.blur();
            if (!this.address) {
                plus.nativeUI.alert('请输入BCH地址!')
                return;
            }
            if (this.sum === '') {
                plus.nativeUI.alert('请输入提现金额!')
                return;
            }
            if (Number(this.sum) - 1 < 0) {
                plus.nativeUI.alert('满1BCH才能提现哦！')
                return;
            }
            if (Number(this.sum) > Number(this.account)) {
                plus.nativeUI.alert('提现金额不能大于总余额！')
                return;
            }
            this.$plusReady(() => {
                window.plus.nativeUI.showWaiting( "正在提交申请..." );
            })
            let params = createParams({address: this.address} , 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCG1kJp/jaVgmRITsqqpGtrMWeeHGhdmSFUwdbZ9dtUihsUfq41zN69qpdBRHAtmgFvSlmGaLLUCq0LmMi+T7rJpsAza+XC8QrqLfdbH/yPHSgeT/kw8adQhL+NskAK6D3BKI1kT8pi+FrX91LVK+d2TJYcPZqdynogQ+4EaBhgCwIDAQAB');
            this.$remote.apply_rollout({
                uid: this.userInfo.uid,
                sum: this.sum,
                address: params.address
            }).then((res) => {
                if (res.data.code === 200) {
                    this.$plusReady(() => {
                        plus.nativeUI.toast('申请提现成功！');
                    })
                    this.$emit('close')
                } else {
                    plus.nativeUI.toast(res.data.result);
                }
                plus.nativeUI.closeWaiting();
            }).catch((err) => {
                plus.nativeUI.closeWaiting();
                plus.nativeUI.toast('申请提现失败，请稍候重试！');
            })
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
.inputContainer{
    margin-top: 120px;
    padding: 0 0.4rem;
    .input-box{
        height:1.2rem;
        line-height: 1.2rem;
        border-radius: 0.1rem;
        margin: 0 auto;
        background-color: rgba(126,107,0,0.08);
        font-size: .4rem;
        vertical-align: middle;
        margin-bottom: .14rem;
    }
    .text{
        width: 4.18rem;
        height: 100%;
        padding-left: 0.5rem;
        background-color: transparent;
        border: none;
        outline: none;
        float: left;
        &.address{
            width: 7rem;
        }
    }
    .text::-webkit-input-placeholder {
        color:rgba(126,107,0,0.5);
    }
    .rollAll{
        display: inline-block;
        height: 100%;
        color: #504400;
    }
}
.warn{
    text-align: left;
    font-size: 0.3rem;
    font-weight:400;
    color:rgba(237,86,89,1);
    margin-bottom: .43rem;
    &.gray{
        color: #999999;
    }
}
.submit{
    width: 6.46rem;
    height: 1.15rem;
    line-height: 1.15rem;
    text-align: center;
    background:rgba(253,225,65,1);
    border-radius: 0.58rem;
    margin: 0 auto;
}
.download{
    display: inline-block;
    font-size: 0.42rem;
    color:rgba(88,104,209,1);
    margin: .58rem auto;
    -webkit-tap-highlight-color:rgba(255,0,0,0);
}
</style>
