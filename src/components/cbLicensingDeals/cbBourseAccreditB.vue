<template>
    <div class="cbBourseAccreditB">
        <!-- 各交易所二维码授权页面 -->
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">ZB授权</span>
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
                声明：点击“授权交易”即代表你授权本App通过API访问ZB进行相关交易操作。除技术支持之外，我们不提供交易所其他服务，不承担任何资产风险如果怀疑授权存在问题，请登录ZB网站移除相关Key。
            </div>
            <div class="course" @click='toCourse'>授权教程</div>
        </main>
    </div>
</template>
<script>
export default {
    name: "cbBourseAccreditB",
    data() {
        return {};
    },
    methods: {
        goback() {
            this.$router.go(-1);
        },
        handcopy() {
            // console.log(this.$store.state.count);

            this.$router.push({
                path: "/cbBourseAccreditZB"
            });
        },
        toCourse() {
            this.$toStatistic("cbBourseAccreditzb", "点击阅读zb授权教程");
            this.$router.push({
                path: "/cbCourse",
                query: { bi: "zb" }
            });
        },
        smcopy() {
            this.$router.push({
                path: "/QR",
                query: { id: "zb" }
            });
        }
    }
};
</script>
<style>
.cbBourseAccreditB .head {
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
.cbBourseAccreditB .head .iconfont {
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.cbBourseAccreditB .head .dealContent {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
}
.cbBourseAccreditB main {
    /* display: flex; */
    justify-content: center;
    padding: 1.6rem 0 0 0;
    width: 100%;
    position: relative;
}
.cbBourseAccreditB main .ico {
    width: 100%;
    height: 3.2rem;
    margin: 1.2rem auto;
    display: flex;
    justify-content: center;
    position: relative;
    /* padding: 0.4rem; */
}
.cbBourseAccreditB main .ico img {
    width: 110px;
    height: 110px;
    border: 1px solid #ccc;
    display: block;
    font-size: 110px;
}
.cbBourseAccreditB main .ico i {
    position: absolute;
    /* top: 0; */
    font-size: 80px;
}
.cbBourseAccreditB main .copy,
.cbBourseAccreditB main .handcopy {
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
.cbBourseAccreditB main .handcopy {
    background-color: #48c122;
}
.cbBourseAccreditB main .remind p {
    padding: 0 0.4rem;
    line-height: 0.6rem;
    font-size: 0.4rem;
}
.cbBourseAccreditB main .remind p a {
    color: #48c122;
}
.cbBourseAccreditB main .statement {
    padding: 0 0.4rem;
    line-height: 0.6rem;
    font-size: 0.38rem;
    margin-top: 0.8rem;
    color: #a6afba;
}
.cbBourseAccreditB main .course {
    width: 20%;
    font-size: 0.48rem;
    text-align: center;
    margin: 0.8rem auto 0;
    color: #48c122;
}
</style>


