<template>
  <ul class="list">
    <li class="assetsName">
      <img :src="coinURL" :onerror="actImgDefault" alt="">
      <span>{{coinName}}
        <i>/{{counterparty}}</i>
      </span>
    </li>
    <li class="change-type">
      <img :src="imgUrl" v-tap="{methods:changeType,params:{remind:remind,
      marketToken:marketToken,
      id:id}}">
    </li>
  </ul>
</template>
<style scoped>
ul.list {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    align-items: center;
    height: 1.88rem;
    background-color: #f4f7f9;
}
ul.list li {
    font-size: 0.36rem;
    width: 3.6rem;
    color: #374452;
    text-align: center;
}

.assetsName {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding-left: 1rem;
    width: 4rem;
}
.assetsName img {
    width: 0.92rem;
    height: 0.92rem;
}
.assetsName span {
    font-size: 0.42rem;
    width: 3rem;
    padding-left: 0.24rem;
    text-align: left;
}

.assetsName span i {
    color: #a6afba;
    font-size: 0.3rem;
}

.price {
    display: inline-flex;
    align-items: flex-end;
    flex-flow: column;
    padding-left: 1.2rem;
    padding-right: 0.5rem;
    box-sizing: border-box;
}
.dollar {
    font-size: 0.46rem;
    font-weight: 700;
}
.RMB {
    font-size: 0.3rem;
    color: #a6afba;
}
.change {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.14rem;
    height: 0.8rem;
    border-radius: 1rem;
    color: #fff;
    background-color: #42c300;
    font-weight: 550;
}

.change1 {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.14rem;
    height: 0.8rem;
    border-radius: 1rem;
    color: #fff;
    background-color: #f43e3a;
    font-weight: 550;
}
.change-type img {
    width: 0.7rem;
}
</style>
<script>
export default {
    name: "searchItem",
    props: ["symbol", "coin", "counterparty", "remind", "marketToken","id"],
    data() {
        return {
            actImgDefault:
                'this.src="' +
                require("../../../../static/images/coin/new.png") +
                '"',
            coinName: this.coin.toUpperCase(),
            coinURL: "",
            imgUrl: ""
        };
    },
    watch: {
        coin() {
            this.coinName = this.coin.toUpperCase();
            this.coinURL =
                process.env.NODE_ENV === "development"
                    ? "./../../../../static/images/coin/" +
                      this.coinName +
                      ".png"
                    : "coin/" + this.coinName + ".png";
        },
        remind() {
            if (this.remind === 1) {
                this.imgUrl =
                    process.env.NODE_ENV === "development"
                        ? "./../../../../static/images/drawable-xxhdpi/minus.png"
                        : "drawable-xxhdpi/minus.png";
            } else {
                this.imgUrl =
                    process.env.NODE_ENV === "development"
                        ? "./../../../../static/images/drawable-xxhdpi/add.png"
                        : "drawable-xxhdpi/add.png";
            }
        }
    },
    mounted() {
        this.changeCoin();
    },
    methods: {
        changeCoin() {
            this.coinURL =
                process.env.NODE_ENV === "development"
                    ? "./../../../../static/images/coin/" +
                      this.coinName +
                      ".png"
                    : "coin/" + this.coinName + ".png";
            if (this.remind === 1) {
                this.imgUrl =
                    process.env.NODE_ENV === "development"
                        ? "./../../../../static/images/drawable-xxhdpi/minus.png"
                        : "drawable-xxhdpi/minus.png";
            } else {
                this.imgUrl =
                    process.env.NODE_ENV === "development"
                        ? "./../../../../static/images/drawable-xxhdpi/add.png"
                        : "drawable-xxhdpi/add.png";
            }
        },
        changeType(data) {
            this.$emit("changeRemind", data.params);
        }
    }
};
</script>