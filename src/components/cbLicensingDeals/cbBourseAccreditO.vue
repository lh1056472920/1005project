<template>
  <div class="cbBourseAccreditO">
    <!-- 各交易所二维码授权页面 -->
    <header class="head">
      <i @click="goback" class="iconfont icon-fanhui"></i>
      <span class="dealContent">OKEx授权</span>
    </header>
    <main>
      <div class="ico">
        <img src="" alt="">

        <i class="iconfont icon-erweima"></i>
      </div>
      <div class="copy" @click="smcopy">扫描授权二维码</div>
      <div @click="handcopy" class="handcopy">手动输入</div>
      <div class="remind">
        <p>用户秘钥经过多重加密且仅存储在本地设备内，请放心使用！如有疑问，请查看
          <router-link to="/safetyAnalysis">“交易安全分析”</router-link>
        </p>
      </div>
      <div class="statement">
        声明：点击“授权交易”即代表你授权本App通过API访问OKEx进行相关交易操作。除技术支持之外，我们不提供交易所其他服务，不承担任何资产风险如果怀疑授权存在问题，请登录OKEx网站移除相关Key。
      </div>
      <div class="course" @click='toCourse'>授权教程</div>
    </main>
  </div>
</template>
<script>
export default {
    name: "cbBourseAccreditO",
    data() {
        return {};
    },
    methods: {
        goback() {
            this.$router.go(-1);
        },
        handcopy() {
            this.$toStatistic("cbBourseAccreditloginhuobi", "授权登录火币");
            this.$router.push({
                path: "/cbBourseAccreditOkex"
            });
        },
        toCourse() {
            this.$toStatistic("cbBourseAccredithuobi1", "点击阅读火币授权教程two");
            this.$router.push({
                path: "/cbCourse",
                query: { bi: "ok" }
            });
        },
        smcopy() {
            this.$router.push({
                path: "/QR",
                query:{id:'okex'}
            });
        }
    }
};
</script>
<style >
.cbBourseAccreditO .head {
    /* padding-top: 0.72rem; */
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.6rem;
    line-height: 1.6rem;
    text-align: center;
    z-index: 99;
    /* position: relative; */
    background-color: #fff;
}
.cbBourseAccreditO .head .iconfont {
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.cbBourseAccreditO .head .dealContent {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
}
.cbBourseAccreditO main {
    /* display: flex; */
    justify-content: center;
    padding: 1.6rem 0 0 0;
    width: 100%;
    position: relative;
}
.cbBourseAccreditO main .ico {
    width: 100%;
    height: 3.2rem;
    margin: 1.2rem auto;
    display: flex;
    justify-content: center;
    position: relative;
    /* padding: 0.4rem; */
}
.cbBourseAccreditO main .ico img {
    width: 110px;
    height: 110px;
    border: 1px solid #ccc;
    display: block;
    font-size: 110px;
}
.cbBourseAccreditO main .ico i {
    position: absolute;
    /* top: 0; */
    font-size: 80px;
}
.cbBourseAccreditO main .copy,
.cbBourseAccreditO main .handcopy {
    margin: 0.33rem auto;
    width: 66%;
    height: 1.4rem;
    border-radius: 1.4rem;
    text-align: center;
    line-height: 1.4rem;
    font-size: 0.48rem;
    color: #fff;
    background-color: #374452;
}
.cbBourseAccreditO main .handcopy {
    background-color: #48c122;
}
.cbBourseAccreditO main .remind p {
    padding: 0 0.4rem;
    line-height: 0.6rem;
    font-size: 0.4rem;
}
.cbBourseAccreditO main .remind p a {
    color: #48c122;
}
.cbBourseAccreditO main .statement {
    padding: 0 0.4rem;
    line-height: 0.6rem;
    font-size: 0.38rem;
    margin-top: 0.8rem;
    color: #a6afba;
}
.cbBourseAccreditO main .course {
    width: 20%;
    font-size: 0.48rem;
    text-align: center;
    margin: 0.8rem auto 0;
    color: #48c122;
}
</style>


