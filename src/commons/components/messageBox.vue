<template lang="html">
    <div class="messageBox">
        <div class="main">
            <div class="content" v-html="content">
                
            </div>
            <div class="bottom">
                <button class="btn cancle" :style="cancleStyle" v-tap="{methods: close,action: 'cancle'}">取消</button>
                <button class="btn confirm" :style="confirmStyle" v-tap="{methods: close,action: 'confirm'}">确定</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'messageBox',
    data() {
        return {
            content: '',
            cancleStyle: {},
            confirmStyle: {}
        }
    },
    methods: {
        close(params) {
            this.confirm(params);
            this.$el.parentNode.removeChild(this.$el)
        }
    }
}
</script>

<style lang="less" scoped>
.messageBox{
    width: 10.8rem;
    height: 100vh;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
}
.main{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 6.66rem;
    min-height: 3.8rem;
    background-color: #fff;
    //background:linear-gradient(-19deg,rgba(3,0,0,0.26),rgba(255,255,255,0.26));
    border-radius: 0.2rem;
    padding: 1rem;
}
.content{
    min-height: 2.6rem;
    font-size: 0.54rem;
    color:rgba(26,26,26,1);
}
.bottom{
    position: absolute;
    right: 1rem;
    bottom: 0.6rem;
    text-align: right;
    .btn{
        border: none;
        outline: none;
        font-size: 0.42rem;
        color:rgba(88,104,209,1);
        margin-left: .86rem;
        background-color: transparent;
    }
}
</style>
