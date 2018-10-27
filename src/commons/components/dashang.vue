<template lang="html">
    <div class="dashange-container">
        <dashang-main v-if="showMain" @close="close" :list="options.list" @selectDStype="selectDStype"></dashang-main>
        <dashange-type v-else  @close="close" :list="options.list" :type="dashangeType"></dashange-type>
    </div>
</template>

<script>
import dashangMain from './dashangeMain.vue'
import dashangeType from './dashangeType.vue'
export default {
    components: {
        dashangMain,
        dashangeType
    },
    data() {
        return {
            showMain: true,
            dashangeType: 'amount',
            list: []
        }
    },
    methods: {
        close(params) {
            this.$el.parentNode.removeChild(this.$el);
            this.confirm(params);
        },
        selectDStype(type) {
            this.dashangeType = type;
            this.showMain = false;
        }
    }
}
</script>

<style lang="less" scoped>
.dashange-container{
    width: 10.8rem;
    height: 100vh;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
}
</style>
