<template>
  <div class="cbCourse">
    <header class="head">
      <i @click="goback" class="iconfont icon-fanhui"></i>
      <span v-if="isShow==0" class="dealContent">币安授权教程</span>
      <span v-if="isShow==1" class="dealContent">火币授权教程</span>
      <span v-if="isShow==2" class="dealContent">OKEx授权教程</span>
      <span v-if="isShow==3" class="dealContent">ZB授权教程</span>
      <span v-if="isShow==4" class="dealContent">Gata授权教程</span>
    </header>
    <main>
      <div v-if="isShow==0" class="content">
        <p>平台以开放币安交易平台的交易功能，大家仔细 阅读以下币安交易平台在我们平台交易授权的详 细教程，完成授权之后就可以进行交易了。
        </p>
        <h3>第一部分：注册币安交易平台账号</h3>
        <p>1、打开链接 https://www.binance.com/register.html 进入币安注册页面，使用邮箱注册。输入相关信息。
        </p>
        <img src="../../../static/images/bian/b1@2x.png" alt="">
        <p>2、依次填写帐号信息，点击登录后，需要绑定手 机号码，点击“发送验证码”，输入收到的验证码， 然后点击确定。
        </p>
        <img src="../../../static/images/bian/b2@2x.png" alt="">
        <p>3、依次填写帐号信息，点击登录后，需要绑定手 机号码，点击“发送验证码”，输入收到的验证码， 然后点击确定。
        </p>
        <img src="../../../static/images/bian/b3@2x.png" alt="">

        <p>4、此时会要求创建一个新的API Key，输入API备 注名（注：API备注名不能填写中文，否则授权不 成功），点击“创建新key”。
        </p>
        <img src="../../../static/images/bian/b4@2x.png" alt="">

        <p>5、进入API管理后，点击“展示”，此时需要进行 二次验证，收到手机验证码，填写即可。
        </p>
        <img src="../../../static/images/bian/b5@2x.png" alt="">

        <p>6、进入API管理后，点击“展示”，此时需要进行 二次验证，收到手机验证码，填写即可。
        </p>
        <img src="../../../static/images/bian/b6@2x.png" alt="">

        <h3>第二部分：获取API Key</h3>
        <p>7、进入API管理后，点击“展示”，此时需要进行 二次验证，收到手机验证码，填写即可。
        </p>
        <img src="../../../static/images/bian/b7@2x.png" alt="">

        <p>8、完成后，就可以在“个人”-“我的授权”中查看相 关数字资产情况。
        </p>
        <img src="../../../static/images/bian/b8@2x.png" alt="">

        <p>如果您在使用APP的过程中遇到任何问题，欢迎 加入官方QQ群：870441469 进行咨询、反馈。</p>

      </div>
      <div v-if="isShow==1" class="content">
        <p>平台以开放火币全球站交易平台的交易功能，大家仔细阅读以下火币全球站交易平台在我们平台交易授权的详细教程，完成授权之后就可以进行交易了。</p>
        <h3>第一部分：注册火币全球站账号</h3>
        <p>1、https://www.hbg.com/zh-cn/register/注册火币账号</p>
        <img src="../../../static/images/huobi/1-register@2x.png" alt="">
        <p>2、注册完成，输入账号密码登录账号后，点击页面上方个人信息展开按钮，再点击“账号安全”。</p>
        <img src="../../../static/images/huobi/2-countsafe@2x.png" alt="">
        <p>3、在双重身份验证中选择手机或谷歌验证器，点击绑定。</p>
        <img src="../../../static/images/huobi/3-authentication@2x.png" alt="">
        <p>4、如进行手机绑定，先选择区域号，输入手机号码后再点击“获取验证码”，输入验证码后点击“绑定”，随后邮箱验证提示窗口弹出，点击“点击获取”，验证码将以邮件形式发送到对应邮箱，输入邮箱验证码后，绑定完成。</p>
        <img src="../../../static/images/huobi/4-Bindingphone@2x.png" alt="">
        <p>5、如进行谷歌验证器绑定，先在手机上自行下载谷歌验证器，打开谷歌验证器扫描二维码，随后邮箱验证器提示窗口弹出，点击“点击获取”，验证码将以邮件形式发送到对应邮箱，输入邮箱验证码后，绑定完成。</p>
        <img src="../../../static/images/huobi/5-BindGooglevalidator@2x.png" alt="">
        <h3>第二部分：获取API Key</h3>
        <p>6、在浏览器中访问www.huobipro.com,点击页面上方个人信息按钮，先择“API管理”。</p>
        <img src="../../../static/images/huobi/6-apimanager@2x.png" alt="">
        <p>7、创建API Key。输入备注，点击“创建”。</p>
        <img src="../../../static/images/huobi/7-create@2x.png" alt="">
        <p>8、在安全验证窗口，点击获取手机号和邮箱验证码，获取验证码后正确输入，点击“确定”。</p>
        <img src="../../../static/images/huobi/8-getverificationcode@2x.png" alt="">
        <p>9、成功创建Access Key、Secret Key后，请妥善保存。</p>
        <img src="../../../static/images/huobi/9-successcreatekey@2x.png" alt="">
        <h3>第三部分：授权交易</h3>
        <p>10、打开APP，点击左上角“个人”来到个人页面，再点击“我的授权”进入授权页面，在“未授权”中找到“火币全球站”，点击“授权”。</p>
        <img src="../../../static/images/huobi/10-Licensingdeals-1@2x.png" alt="">
        <img src="../../../static/images/huobi/10-Licensingdeals-2@2x.png" alt="">
        <p>11、输入火币全球站的API密钥、API密钥密码进行授权。</p>
        <img src="../../../static/images/huobi/11-coinaccredit@2x.png" alt="">
        <p>12、完成后，就可以在“个人”-“我的授权”中查找相关数字资产情况。</p>
        <img src="../../../static/images/huobi/12-checkasset@2x.png" alt="">
        <p>如果您在使用APP的过程中遇到任何问题，欢迎加入官方QQ群：870441469进行咨询、反馈</p>

      </div>
      <div v-if="isShow==2" class="content">
        <p>平台以开放OKEx交易平台的交易功能，大家仔细 阅读以下OKEx交易平台在我们平台交易授权的详 细教程，完成授权之后就可以进行交易了。
        </p>
        <h3>第一部分：注册OKEx交易平台账号</h3>
        <p>1、打开免翻墙链接https://www.okb.com/ 进入OKEx注册页面，可以使用手机号或邮箱注册。 使用手机号注册：填写有效手机号码，点击发送 验证码，输入验证码，登录密码为6-32位字符。 记得勾选下图两个勾选框。
        </p>
        <img src="../../../static/images/ok/ok1@2x.png" alt="">
        <p>2、使用邮箱注册：输入有效电子邮箱，登录密码 为6-32位字符。记得勾选下图两个勾选框。
        </p>
        <img src="../../../static/images/ok/ok2@2x.png" alt="">
        <h3>第二部分：获取OKEx API密钥</h3>
        <p>3、注册完，登录OKEx后，点击“个人中心”-“我的 API”-“新建API”。
        </p>
        <img src="../../../static/images/ok/ok3@2x.png" alt="">
        <p>4、在弹出框“API认证”中用户自定义填写备注名， 勾选“交易”权限，并填写手机收到的短信验证码， 点击确定。
        </p>
        <img src="../../../static/images/ok/ok4@2x.png" alt="">
        <p>5、在OKEx’s API列表中“查看”并输入短信验证码， 点击确定。注：该短信回发送到账号绑定的手机。
        </p>
        <img src="../../../static/images/ok/ok5@2x.png" alt="">
        <p>6、成功获取API和二维码。</p>
        <img src="../../../static/images/ok/ok6@2x.png" alt="">
        <h3>第三部分：开通OKEx授权</h3>
        <p>7、回到授权页面，输入公钥、密钥或扫描二维码， 点击“授权交易”。
        </p>
        <img src="../../../static/images/ok/ok7@2x.png" alt="">
        <p>8、完成后，就可以在“个人”-“我的授权”中查看相 关数字资产情况。
        </p>
        <img src="../../../static/images/ok/ok8@2x.png" alt="">>
        <p>如果您在使用APP的过程中遇到任何问题，欢迎 加入官方QQ群：870441469 进行咨询、反馈。</p>

      </div>
      <div v-if="isShow==3" class="content">
        <p>平台以开放ZB交易平台的交易功能，大家仔细阅 读以下ZB交易平台在我们平台交易授权的详细教 程，完成授权之后就可以进行交易了。
        </p>
        <h3>第一部分：注册ZB交易平台账号</h3>
        <p>1、打开免翻墙链接 https://www.zb.cn/ 进入ZB 注册页面，可以使用手机号或邮箱注册。使用手 机号注册：填写有效手机号码，点击发送验证码， 输入验证码，登录密码为6-32位字符。
        </p>
        <img src="../../../static/images/zb/zb1@2x.png" alt="">
        <p>2、鼠标移到页面右上方个人账号处，然后在下拉 扩展菜单中点选Google认证，按照提示填写新谷 歌验证码、短信验证码完成验证。Google认证具 体步骤可以参考《Google一次性密码双重验证教 程》。
        </p>
        <img src="../../../static/images/zb/zb2@2x.png" alt="">
        <p>3、鼠标移到页面右上方个人账号处，然后在下拉 扩展菜单中点选API设置。
        </p>
        <img src="../../../static/images/zb/zb3@2x.png" alt="">
        <p>4、开启API。填写API备注和Google验证码，勾选 API密钥权限，点击创建API密钥。注意，绑定API 交易IP可以不用填写，API密钥权限记得勾选前面 两项，否则可能授权失败。
        </p>
        <img src="../../../static/images/zb/zb4@2x.png" alt="">
        <p>5、成功获取API密钥，密钥仅显示一次，请妥善保 存。
        </p>
        <img src="../../../static/images/zb/zb5@2x.png" alt="">
        <p>6、回到授权页面，输入公钥、密钥或扫描二维码， 点击“授权交易”。
        </p>
        <img src="../../../static/images/zb/zb6@2x.png" alt="">
        <p>7、回到授权页面，输入公钥、密钥或扫描二维码， 点击“授权交易”。
        </p>
        <img src="../../../static/images/zb/zb7@2x.png" alt="">
        <p>如果您在使用APP的过程中遇到任何问题，欢迎 加入官方QQ群：870441469 进行咨询、反馈。</p>

      </div>
    </main>
  </div>
</template>
<style>
.cbCourse header {
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
.cbCourse header .iconfont {
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.cbCourse header .dealContent {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
}
.cbCourse main {
    padding-top: 2rem;
}
.cbCourse main p,
h3 {
    padding: 0 0.4rem 0 0.4rem;
}
.cbCourse main p {
    font-size: 0.42rem;
    line-height: 0.7rem;
    margin-bottom: 0.25rem;
}
.cbCourse main img {
    margin: 0.3rem 0 0.5rem 0;
}
</style>

<script>
export default {
    name: "cbCourse",
    data() {
        return {
            isShow: 0
        };
    },
    created() {
        if (this.$route.query.bi == "ba") {
            this.isShow = 0;
        } else if (this.$route.query.bi == "hb") {
            this.isShow = 1;
        } else if (this.$route.query.bi == "ok") {
            this.isShow = 2;
        } else if (this.$route.query.bi == "zb") {
            this.isShow = 3;
        } else if (this.$route.query.bi == "gt") {
            this.isShow = 4;
        }
    },
    methods: {
        goback() {
            this.$router.goBack();
        }
    }
};
</script>

