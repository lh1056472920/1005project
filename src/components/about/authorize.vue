<template>
    <div class="authorize">
        <header>
            <div @click="clickUser" class="user">
                <span class="iconfont icon-fanhui"></span>
            </div>
            <div class="pricenav">
                <span @click="checkindex(1)" :class="{activeClass: activeIndex==1}">已授权</span>
                <span @click="checkindex(2)" :class="{activeClass: activeIndex==2}">未授权</span>
            </div>
            <div class="search-box">
                <i class="iconfont icon-sousuo"></i>
            </div>
        </header>
        <main>
            <!-- 未授权 -->
            <div v-if="isShow==0&&isShowbian==0" class="authorizeList">
                <p class="left">币安</p>
                <p @click="alist(0)" class="right">授权</p>
            </div>
            <div v-if="isShow==0&&isShowhuobi==0" class="authorizeList">
                <p class="left">火币</p>
                <p @click="alist(1)" class="right">授权</p>
            </div>
            <div v-if="isShow==0&&isShowokex==0" class="authorizeList">
                <p class="left">OKEX</p>
                <p @click="alist(2)" class="right">授权</p>
            </div>
            <!-- <div v-if="isShow==0&&isShowgate==0" class="authorizeList">
                <p class="left">Gate</p>
                <p @click="alist(3)" class="right">授权</p>
            </div> -->
            <div v-if="isShow==0&&isShowzb==0" class="authorizeList">
                <p class="left">ZB</p>
                <p @click="alist(4)" class="right">授权</p>
            </div>
            <!-- 已授权 -->
            <div v-if="isShow==1&&isShowbian==1" class="authorizeList">
                <p class="left">币安</p>
                <p @click="cancel(0)" class="right1">取消授权</p>
            </div>
            <div v-if="isShow==1&&isShowhuobi==1" class="authorizeList">
                <p class="left">火币</p>
                <p @click="cancel(1)" class="right1">取消授权</p>
            </div>
            <div v-if="isShow==1&&isShowokex==1" class="authorizeList">
                <p class="left">OKEX</p>
                <p @click="cancel(2)" class="right1">取消授权</p>
            </div>
            <div v-if="isShow==1&&isShowgate==1" class="authorizeList">
                <p class="left">Gate</p>
                <p @click="cancel(3)" class="right1">取消授权</p>
            </div>
            <div v-if="isShow==1&&isShowzb==1" class="authorizeList">
                <p class="left">ZB</p>
                <p @click="cancel(4)" class="right1">取消授权</p>
            </div>
        </main>
    </div>
</template>
<script>
export default {
  name: "authorize",
  data() {
    return {
      activeIndex: 2,
      isShow: 0,
      isShowhuobi: 0,
      isShowbian: 0,
      isShowokex: 0,
      isShowgate: 0,
      isShowzb: 0
    };
  },
  created() {
    this.getlocation();
  },
  methods: {
    getlocation() {
      if (localStorage.getItem("userkey")) {
        this.isShowhuobi = 1;
      };
      if (localStorage.getItem("biankey")) {
        this.isShowbian = 1;
      };
      if (localStorage.getItem("Okexkey")) {
        this.isShowokex = 1;
      };
      if (localStorage.getItem("ZBkey")) {
        this.isShowzb = 1;
      };
      if (localStorage.getItem("gatekey")) {
        this.isShowgate = 1;
      };
      
    },
    clickUser() {
      this.$router.go(-1);
    },
    checkindex(data) {
      this.activeIndex = data;
      if (data == 1) {
        this.isShow = 1;
      } else if (data == 2) {
        this.isShow = 0;
      }
    },
    //授权
    alist(res) {
      localStorage.setItem("sign", 2);
      if (res == 1 && !localStorage.getItem("userkey")) {
        this.$router.push({
          path: "/cbAccredit",
          query: { marketName: "火币" }
        });
      }
      if (res == 0 && !localStorage.getItem("biankey")) {
        this.$router.push({
          path: "/cbAccredit",
          query: { marketName: "币安" }
        });
      }
      if (res == 2 && !localStorage.getItem("Okexkey")) {
        this.$router.push({
          path: "/cbAccredit",
          query: { marketName: "OKEx" }
        });
      }
      if (res == 4 && !localStorage.getItem("ZBkey")) {
        this.$router.push({
          path: "/cbAccredit",
          query: { marketName: "ZB" }
        });
      }
    },
    //取消授权
    cancel(res) {
      if (res == 1) {
        this.isShowhuobi = 0;
        localStorage.removeItem("userkey");
      };
      if (res == 0) {
        this.isShowbian = 0;
        localStorage.removeItem("biankey");
      };
      if (res == 2) {
        this.isShowokex = 0;
        localStorage.removeItem("Okexkey");
      };
      if (res == 4) {
        this.isShowzb = 0;
        localStorage.removeItem("ZBkey");
      };
    }
  }
};
</script>

<style>
.authorize {
  background-color: #edf2f5;
}
.authorize header {
  /* padding-top: 0.72rem; */
  width: 100%;
  height: 1.6rem;
  background-color: #e6eef2;
  margin-bottom: 3px;
  box-shadow: 0 0 3px #ddd;
  position: relative;
}
.authorize .user {
  display: inline-block;
  height: 100%;
  text-align: center;
  line-height: 1.6rem;
  margin-left: 4%;
}
.authorize .user span {
  font-size: 18px;
  color: #747474;
}
.authorize .pricenav {
  position: absolute;
  background-color: #e2eaee;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  width: 50%;
  height: 35px;
  text-align: center;
  line-height: 35px;
  top: 0.3rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0;
  padding: 2px;
  border-radius: 3px;
}
.authorize .pricenav span {
  display: inline-block;
  width: 50%;
  font-size: 14px;
  height: 31px;
  line-height: 31px;
  color: #a6afba;
  text-align: center;
  border-radius: 3px;
}
.authorize .pricenav .activeClass {
  background-color: #fff;
  color: #42c300;
}
.authorize .search-box {
  float: right;
  height: 100%;
  line-height: 1.6rem;
  margin-right: 4%;
}
.authorize .search-box i {
  font-size: 20px;
  color: #e6eef2;
}
.authorize main .authorizeList {
  margin-top: 0.4rem;
  padding: 0 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.4rem;
  background-color: #fff;
  box-sizing: border-box;
}
.authorize main .authorizeList p {
  height: 1rem;
  font-size: 0.46rem;
  line-height: 1rem;
}
.authorize main .authorizeList p.right,
.authorize main .authorizeList p.right1 {
  padding: 0 0.7rem;
  border-radius: 0.5rem;
  background-color: #42c300;
  color: #fff;
  text-align: center;
  font-size: 0.42rem;
}
.authorize main .authorizeList p.right1 {
  background-color: #f43e3a;
}
</style>


