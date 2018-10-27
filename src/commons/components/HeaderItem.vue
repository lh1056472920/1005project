<template>
    <div class="header-item-wrapper">
        <mt-header :title="title" :fixed="fixed" :style="styleObj">
            <div class="back" slot="left" v-if="back" :style="backIconStyle" v-tap="{methods: goBack}"></div>
            <div class="right" slot="right" v-if="rightIcon" :style="rightIconStyle" v-tap="{methods: rightIconClick}"></div>
            <div class="accomplish" slot="right" v-if="accomplish" v-tap="{methods: complete}">{{$t('m.accomplish')}}</div>
        </mt-header>
    </div>
</template>

<script>
    const backDeep = require('../../../static/images/back-deep.png')
    const backLight = require('../../../static/images/back.png')

    export default {
        name: 'HeaderItem',
        data () {
            return {}
        },
        props: {
            // 回退按钮
            back: {
                type: Boolean,
                default: true
            },
            // 完成
            accomplish: {
                type: Boolean,
                default: false
            },
            // 头部标题
            title: String,
            // 头部固定
            fixed: {
                type: Boolean,
                default: false
            },
            // back icon颜色 'deep'/'light'
            backIcon: {
                type: String,
                dafault: 'deep'
            },
            // 右侧icon
            rightIcon: String,
            color: {
                type: String,
                default: '#374452'
            },
            // 整体背景色
            bg: {
                type: String,
                default: '#fff'
            },
            // 下侧边框颜色
            bottomColor: String,
            overwrite: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            styleObj () {
                let style = {
                    height: '1.44rem',
                    backgroundColor: this.bg,
                    color: this.color,
                    fontSize: '0.54rem',
                    padding: '0',
                    zIndex: '100',
                    lineHeight: '2',
                    fontWeight:'bold'
                }
                if (this.bottomColor) {
                    style.borderBottom = `1px solid ${this.bottomColor}`
                }
                return style
            },
            backIconStyle () {
                let icon = this.backIcon === 'deep' ? backDeep : backLight
                return {
                    backgroundImage: `url(${icon})`
                }
            },
            rightIconStyle () {
                return {
                    backgroundImage: `url(${this.rightIcon})`
                }
            }
        },
        methods: {
            goBack () {
                if (this.overwrite) {
                    this.$emit('back')
                } else {
                    this.$router.goBack()
                }
            },
            rightIconClick () {
                this.$emit('right-click')
            },
            goEditOptional(data){
                this.$router.push({
                    path:'/editOptional'
                })
            },
            complete(){
                // this.$router.push({
                //     path:'/optional'
                // })
                this.goBack()
            }
        }
    }
</script>

<style scoped>
    .header-item-wrapper{
        /* padding-top: .72rem; */
        height: 1.44rem;
    }
    .back{
        width: 1.4rem;
        height: 1.44rem;
        background-position: 0.54rem center;
        background-size: 0.32rem 0.6rem;
        background-repeat: no-repeat;
    }
    .editOptional {
        font-size: 0.41rem;
        padding: 0.44rem;
    }

    .accomplish {
        font-size: 0.41rem;
        padding-right: 0.42rem;
        color: #42C300;
    }

    .right{
        width: 1.44rem;
        height: 1.44rem;
        float: right;
        background-position: center center;
        background-size: 0.6rem 0.6rem;
        background-repeat: no-repeat;  
    }
    .header-item-wrapper .mint-header-title{
        font-weight: bold;
    }
</style>
