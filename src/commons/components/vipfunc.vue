<template>
    <div class="vipfunc">
        <!-- 各交易所二维码授权页面 -->
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">VIP功能小调查</span>
        </header>
        <div class="nav">
          VIP功能包括：云委托，分期委托，套利模式
        </div>
        <div class="maincontent">
          <div class="select">
            <p class="po"><i></i>1.这些功能对您帮助大吗？ (单选)</p>
            <div class="inputselect">
              <div class="input" @click="select(0)">
                <span id="oneselet" :class="{one:isNum==0}"></span>
                <span class="two">大</span>
              </div>
              <div class="input" @click="select(1)">
                <span id="oneselet" :class="{one:isNum==1}"></span>
                <span class="two">不大</span>
              </div>
            </div>
          </div>
          <div class="select">
            <p class="po"><i></i>2.您愿意为这些功能付费吗？ (单选)</p>
             <div class="inputselect">
              <div class="input" @click="select1(0)">
                <span id="oneselet" :class="{one:isNum1==0}"></span>
                <span class="two">愿意</span>
              </div>
              <div class="input" @click="select1(1)">
                <span id="oneselet" :class="{one:isNum1==1}"></span>
                <span class="two">不愿意</span>
              </div>
            </div>
          </div>
          <div class="select">
            <p class="po"><i></i>3.您觉得对这些VIP功能，付费范围多少可以接受（单选）</p>
            <div class="inputselect">
              <div class="input" @click="select2(0)">
                <span id="oneselet" :class="{one:isNum2==0}"></span>
                <span class="two">200~300</span>
              </div>
              <div class="input" @click="select2(1)">
                <span id="oneselet" :class="{one:isNum2==1}"></span>
                <span class="two">300~500</span>
              </div>
              <div class="input" @click="select2(2)">
                <span id="oneselet" :class="{one:isNum2==2}"></span>
                <span class="two">500~1000</span>
              </div>
            </div>
          </div>
          <div class="select">
            <p class="po"><i></i>4.您最想要什么样的VIP功能？</p>
            <textarea class="suggest" ></textarea>
          </div>
          <div class="select">
            <p class="po"><i></i>5.方便留下您对邮箱或者微信号码？</p>
            <p class="po1">如果有任何后续疑问，我们可以通过这个方式联系您</p>
            <textarea class="suggest" ></textarea>
            
          </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "vipfunc",
  data() {
    return {
      isNum:null,
      isNum1:null,
      isNum2:null,
    };
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    select(res){
      this.isNum=res
    },
    select1(res){
      this.isNum1=res
    },
    select2(res){
      this.isNum2=res
    }
  }
};
</script>
<style>
.vipfunc {
  margin-top: 1.6rem;
background-color: #fff;
}
.vipfunc .head {
  position: fixed;
  top: 0;
  width: 100%;
  height: 1.6rem;
  line-height: 1.6rem;
  text-align: center;
  z-index: 99;
  background-color: #fff;
  box-shadow: 0px 0px 2px 2px #ccc;
}
.vipfunc .head .iconfont {
  position: absolute;
  left: 0.4rem;
  color: #747474;
  font-weight: bold;
}
.vipfunc .head .dealContent {
  font-size: 0.48rem;
  font-weight: bold;
  color: #374452;
}
.vipfunc .nav {
  height: 1.2rem;
  width: 100%;
  line-height: 1.2rem;
  padding-left: 0.8rem;
  box-sizing: border-box;
  color: #999;
  font-size: 0.42rem;
  background-color: rgb(248, 250, 251);
}
.vipfunc .maincontent .inputselect {
  margin-top: 0.8rem;
  padding-left: 0.4rem;
  display: flex;
}
.vipfunc .maincontent .inputselect .input {
  display: flex;
  width: 30%;
}
.vipfunc .maincontent .inputselect .input span:first-child{
  display: inline-block;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  border: 1px solid #ccc;
}
.vipfunc .maincontent .inputselect .input .one {
  border: 0;
  background-image: url("../../../static/images/confirm-1.png");
  background-size: 0.4rem 0.4rem;
}
.vipfunc .maincontent .inputselect .input .two {
  margin-left: 0.35rem;
  display: inline-block;
  margin-top: -0.08rem;
  font-size: 0.42rem;
}
.vipfunc .maincontent .select {
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid #E2EAEE;
}
.vipfunc .maincontent .select .po {
  overflow: hidden;
  font-size: 0.42rem;
  font-weight: 600;
}
.vipfunc .maincontent .select .po1{
  font-size: 0.4rem;
  color: #999;
}
.vipfunc .maincontent .select .suggest {
  margin-top: 0.4rem;
  width: 80%;
  min-height: 2rem;
}
</style>


