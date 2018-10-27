<template lang="html">
    <div class="page">
        <HeaderItem title="填写邀请码"></HeaderItem>
        <div class="main">
            <div class="input-box">
                <input type="text" id="phone" class="text phone" :disabled="fid" v-model="inviteCode" placeholder="每人只能输入一次">
            </div>
            <p class="label-text">向好友/推荐人询问邀请码</p>
            <div class="submit" :class="{gray: fid}" v-tap="{methods: submit}">
                立即验证
            </div>
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
            phone: '',
            userInfo: {},
            fid: false,
            inviteCode: ''
        }
    },
    mounted() {
        this.userInfo = this.$store.state.userInfo || {};
        this.fid = !!this.userInfo.fid;
        this.inviteCode = this.userInfo.fid;
    },
    methods: {
        submit() {
            if (this.fid || !this.inviteCode) {
                return;
            }
            this.$toStatistic('setInviteCode', '点击填写邀请码');
            this.$remote.set_inviteCode({
                fid: this.inviteCode,
                phone: this.userInfo.phone
            }).then((res) => {
                if (res.data.code === 200) {
                    this.fid = !!this.inviteCode;
                    this.userInfo.fid = this.inviteCode;
                    window.sessionStorage.setItem(
                        "user",
                        JSON.stringify(this.userInfo)
                    );
                    this.$plusReady(() => {
                        window.plus.nativeUI.toast( '填写邀请码成功！');
                    })
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
    height: calc(100vh - 1.54rem);
    overflow: auto;
    background: #fff;
    margin-top: 0.1rem;
    text-align: center;
}
.input-box{
    width: 7.5rem;
    height:1.2rem;
    line-height: 1.2rem;
    border-radius: 0.1rem;
    margin: 0 auto;
    background-color: rgba(88,104,209,0.08);
    font-size: .4rem;
    vertical-align: middle;
    margin-bottom: 0.1rem;
    margin-top: 1.44rem;
}
.text{
    width: 4.18rem;
    height: 100%;
    padding-left: 0.5rem;
    background-color: transparent;
    border: none;
    outline: none;
    float: left;
}
.text::-webkit-input-placeholder {
    color:rgba(88,104,209,0.5);
}
.submit{
    width: 7.5rem;
    height: 1.15rem;
    line-height: 1.15rem;
    background:#5868D1;
    border-radius:0.1rem;
    color: #FEFEFE;
    font-size: .42rem;
    text-align: center;
    margin: 0.8rem auto;
    &.gray{
        background-color: gray;
    }
}
.label-text{
    font-size:0.3rem;
    color:rgba(191,191,191,1);
    text-align: left;
    margin-left: 2.16rem;
}
</style>
