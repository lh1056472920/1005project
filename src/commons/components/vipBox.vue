<template lang="html">
    <div class="vipBox-container">
        <div class="vipBox-main">
            <div class="content">
                <p>亲，您还未开通VIP</p>
                <p>暂不能使用相关功能哦</p>
            </div>
            <div class="submit" v-tap="{methods: close,action: 'canfirm'}">
                马上开通VIP
            </div>
            <div class="close" v-tap="{methods: close,action: 'close'}">
                
            </div>
        </div>
    </div>
</template>

<script>

export default {
    components: {
        
    },
    data() {
        return {
            content: ''
        }
    },
    methods: {
        close(params) {
            this.$el.parentNode.removeChild(this.$el);
            if (params.action === 'canfirm') {
                this.confirm(params);
            }
        },
        selectDStype(type) {
            
        }
    }
}
</script>

<style lang="less" scoped>
.vipBox-container{
    width: 10.8rem;
    height: 100vh;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
}
.vipBox-main{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    margin-left: .15rem;
    width: 8.98rem;
    height: 9.46rem;
    background: url(./../../../static/images/vipBox.png) no-repeat;
    background-size: 8.98rem 9.46rem;
    .content{
        text-align: center;
        font-size: 0.48rem;
        color:rgba(255,255,255,1);
        margin-top: 4.32rem;
    }
    .submit{
        width: 6.51rem;
        height: 1.16rem;
        line-height: 1.16rem;
        text-align: center;
        background:rgba(253,225,65,1);
        border-radius: 0.58rem;
        margin: 1.15rem auto 0;
        font-size: 0.44rem;
        color:rgba(126,107,0,1);
    }
    .close{
        position: absolute;
        top: 0;
        right: 0;
        width: 0.64rem;
        height: 0.64rem;
    }
}
</style>
