<template>
    <div class="safetyAnalysis">
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">安全交易分析</span>
        </header>
        <main>
            <div class="content">
                <p>Android端安全分析：</p>
                <p>1、登录APP的时候，用的是手机注册账号，而不是交易平台账号，不会导致交易平台账号信息泄露。</p>
                <p>2、用户授权信息仅存储在移动设备内，不会进行网络传输，也不存在在APP上交易导致密钥泄露。</p>
                <p>3、保存在手机本地的密钥，即使保存方法被破解，只有手机被取走，才有可能导致密钥信息泄露。</p>
                <p>4、密钥信息在手机本地存储，使用第三方加密SDK，结合本地加密算法，密文存储，不会轻易被破解。</p>
                <p>5、APP在防止逆向工程上做了优化，代码经过混淆、而且加入阻碍逆向分析的探针，大幅提升逆向破解难度。</p>
                <p>6、用户一旦察觉密钥信息存在安全风险，可以马上到交易平台，删除对应密钥，有效防止密钥信息泄露带来的安全风险。</p>
                <p>我们团队以产品体验和安全为立足之本，我们将一直为追求极致的用户体验和安全服务而努力。</p>
                <p>大家有任何关于的交易使用问题都可以咨询我们，团队全体人员将竭诚为大家服务。</p>
            </div>
        </main>
    </div>
</template>
<style>
.safetyAnalysis header {
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
.safetyAnalysis header .iconfont {
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.safetyAnalysis header .dealContent {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
}
.safetyAnalysis main {
    padding: 2rem 0.4rem 0 0.4rem;
}
.safetyAnalysis main p {
    font-size: 0.42rem;
    line-height: 0.7rem;
    margin-top: 0.25rem;
}
</style>

<script>
export default {
    name:"safetyAnalysis",
    methods:{
        goback(){
            this.$router.go(-1)
        }
    }
}
</script>

