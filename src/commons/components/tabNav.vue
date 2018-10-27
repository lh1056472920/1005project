<template lang="html">
    <div class="">
        <nav>
            <ul class="tab" :style="bColor">
                <li class="item" :class="index === actived?'actived':''" v-for="(item,index) in list"  :key="index" 
                :style="styleObject" v-tap="{methods: changeTab,index: index}">
                    {{item.text}}
                    <p class="border" v-if="index === 0" ref="tabBorder"></p>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array
        },
        options: {
            type: Object
        },
        styleOptions: {
            type: Object
        },
        bgColor: {
            type: String
        }
    },
    data() {
        return {
            actived: 0,
            tabList: this.list,
            styleObject: {
                
            },
            bColor: {
                backgroundColor: this.bgColor
            }
        }
    },
    mounted () {
        if (this.styleOptions) {
            this.$set(this.styleObject,Object.assign(this.styleObject,this.styleOptions))
        }
    },
    methods: {
        changeTab(params) {
            this.actived = params.index;
            this.$refs.tabBorder[0].style.transform = `translateX(${params.index*100}%)`;
            this.$emit('click', params.index);
        }
    }
}
</script>

<style lang="less">
.page{
    
}
.tab{
    position: relative;
    display: flex;
    overflow: hidden;
}
.item{
    text-align: center;
    position: relative;
    flex: 1;
    float: left;
    height: 1.44rem;
    line-height: 1.44rem;
    font-size: 16px;
    color: #374452;
    &.actived{
        color: #48C122;
    }
}
.border{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: #48C122;
    transition: all 0.5s; 
}
</style>
