<template>
    <ul class="editOpt-item">
        <li class="assetName">
            <img :src="coinURL" :onerror="actImgDefault" alt="">
            <div>
                <p>{{coin}}
                    <span>/{{counterparty}}</span>
                </p>
                <span>{{marketName}}</span>
            </div>
        </li>
        <li class="top" v-tap="{methods:toTop,params:index}"><img src="../../../static/images/drawable-xxhdpi/top.png" alt=""></li>
        <li class="select" v-show="isSelect===false" v-tap="{methods:Select,params:{isSelect,index}}"><img src="../../../static/images/drawable-xxhdpi/select0.png" alt=""></li>
        <li class="select" v-show="isSelect===true" v-tap="{methods:Select,params:{isSelect,index}}"><img src="../../../static/images/drawable-xxhdpi/select.png" alt=""></li>
    </ul>
</template>
<style scoped>
.editOpt-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(244, 247, 249, 1);
}

.editOpt-item li {
  height: 1.96rem;
  flex: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.editOpt-item li.assetName {
  flex: 2;
  justify-content: flex-start;
  padding-left: 0.42rem;
}

.assetName img {
  width: 0.92rem;
  height: 0.92rem;
  margin-right: 0.2rem;
  margin-left: 0.42rem;
}

.assetName div {
  height: 0.92rem;
}

.assetName p {
  height: 0.4rem;
  line-height: 0.4rem;
  font-size: 0.42rem;
  color: #374452;
}

.assetName span {
  font-size: 0.3rem;
  color: #a6afba;
}

.top img,
.select img {
  width: 0.46rem;
  height: 0.46rem;
}
</style>

<script>
export default {
  name: "editOptItem",
  props: ["coin", "marketName", "counterparty", "index", "select"],
  data() {
    return {
      actImgDefault:
        'this.src="' + require("../../../static/images/coin/new.png") + '"',
      isSelect: false,
      coinName: this.coin.toUpperCase(),
      coinURL: ""
    };
  },
  created() {},
  watch: {
    //监听select
    select() {
      // console.log('监听到select变化');
      this.isSelect = this.select;
    },
    coin() {
      this.coinName = this.coin.toUpperCase();
      this.coinURL =
        process.env.NODE_ENV === "development"
          ? "./../../../static/images/coin/" + this.coinName + ".png"
          : "coin/" + this.coinName + ".png";
    }
  },
  mounted() {
    this.coinURL =
      process.env.NODE_ENV === "development"
        ? "./../../../static/images/coin/" + this.coinName + ".png"
        : "coin/" + this.coinName + ".png";
  },
  methods: {
    toTop(index) {
      this.$emit("toTop", index.params);
    },
    Select(data) {
      this.isSelect = !data.params.isSelect;
      let data1 = {
        isSelect: this.isSelect,
        index: this.index
      };
      this.$emit("selected", data1);
    }
  }
};
</script>