<template lang="html">
    <div class="newHeaderItem">
        <header>
            <div v-tap="{methods: goBack}" class="user">
                <span class="iconfont icon-fanhui"></span>
            </div>
            <span>{{title}}</span>
            <div class="search-box">
                <i class="iconfont icon-sousuo" style="display:none;"></i>
            </div>
        </header>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        },
        overwrite: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        goBack() {
            if (this.overwrite) {
                this.$emit('back')
            } else {
                this.$router.goBack()
            }
        }
    }
}
</script>

<style lang="less" scoped>
.newHeaderItem{
    background-color: rgba(255,255,255,0.95);
    box-shadow:0px .17rem .17rem 0px rgba(230,238,242,1);
}
header {
    display: flex;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    height: 1.44rem;
    line-height: 1.44rem;
}
header {
    font-weight: bold;
    font-size: 0.52rem;
}
.user {
    margin-left: 4%;
}
.user .iconfont.icon-fanhui {
    font-size: 18px;
    color: #808080;
}
</style>
