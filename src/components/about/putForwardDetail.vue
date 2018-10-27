<template lang="html">
    <div class="page">
        <HeaderItem title="提现详情"></HeaderItem>
        <div class="main">
            <div class="group">
                <p class="label">提现申请时间</p>
                <p class="value">{{putForward.dataText}}</p>
            </div>
            <div class="group">
                <p class="label">提现状态</p>
                <p class="value">{{putForward.statusText}}</p>
            </div>
            <div class="group">
                <p class="label">提现金额</p>
                <p class="value">{{putForward.sumText}}</p>
            </div>
            <div class="group">
                <p class="label">提现地址</p>
                <p class="value">
                    {{putForward.address}} 
                    <span class="copy btn-copy" data-clipboard-action="copy" :data-clipboard-text="putForward.address" v-if="isSupported">复制</span></p>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderItem from './../../commons/components/HeaderItem.vue'
import { formatDate } from './../../lib/js/tools.js'
import { Toast } from 'mint-ui'
import Clipboard from 'clipboard'
export default {
    components: {
        HeaderItem
    },
    data() {
        return {
            putForward: {},
            isSupported: false
        }
    },
    created() {
        this.getData();
    },
    mounted () {
        this.initCopy()
    },
    methods: {
        initCopy() {
            this.isSupported = Clipboard.isSupported()
            if (this.isSupported) {
                let clipboard = new Clipboard(".btn-copy")
                clipboard.on('success', e => {
                    Toast({
                        message: this.$t('m.copySuccess'),
                        className: 'toast-class'
                    })
                })
            }
        },
        getData() {
            this.$remote.get_rollout_detain({
                id: this.$route.params.item.id
            }).then((res) => {
                if (res.data.code === 200) {
                    let rollOutData = res.data.result;
                    rollOutData.dataText = formatDate(new Date(rollOutData.utime*1000), 'yyyy-MM-dd hh:mm')
                    rollOutData.sumText = rollOutData.sum + 'BCH';
                    switch (rollOutData.status) {
                        case 0:
                            rollOutData.statusText = `申请提现失败`;
                            break;
                        case 1:
                            rollOutData.statusText = `审核中`;
                            break;
                        case 2:
                            rollOutData.statusText = `提现成功`;
                            break;
                        default:
                            rollOutData.statusText = '审核中';
                    }
                    this.putForward = rollOutData;
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
    margin-top: 0.2rem;
    padding: 0 0.5rem;
    height: calc(100vh - 1.64rem);
    background-color: #fff;
}
.group{
    padding: 1rem 0;
}
.copy{
    margin-left: 0.5rem;
}
.label{
    color: #5868D1;
    font-size:0.38rem;
    font-weight:bold;
}
.value{
    color: #444444;
    margin-top: 0.5rem;
}
.copy.btn-copy{
    color: #5868D1;
    font-size:0.38rem;
    font-weight:bold;
}
</style>
