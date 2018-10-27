
<template>
  <div class="cbAccredit">
    <!-- 第三方授权交易页面 -->
    <header class="head">
      <i @click="goback" class="iconfont icon-fanhui"></i>
      <span class="dealcontentlist">第三方交易授权功能安全授权提示</span>
    </header>
    <div class="maicontent">
      <div class="contentlist">
        尊敬的用户，为了使您了解第三方交易功能可能存在的风险，请您在使用前仔细阅读以下内容。<br><br> 一，重要提示 <br><br>（1）数字资产交易市场是全新的，未经市场验证风险的并且存在着极大的交易风险和政策方面的不确定性的市场; <br>（2）数字资产交易存在极高风险，其全天​​不间断交易，没有涨跌限制，价格容易受庄家操纵，全球各国政府政策的变化，市场传言等各种因素的影响而出现大幅波动; <br>（3）因各国法律，法规和规范性文件的制定或者修改，数字资产交易随时可能被暂停或被禁止; <br>（4）数字资产交易因其依赖于互联网的特性，在交易和存储上均具有极高的风险。<br> <br>二，风险提示 <br><br>（1）互联网是全球公共网络，并不受任何一个机构所控制。数据在互联网上传输的途径不是完全确定的。互联网本身并不是绝对安全可靠的环境，在互联网上传输的数据有可能被某些个人、团体或机构通过某种渠道获得。任何公司的计算机性能、质量、病毒、故障及其他原因，都可能影响交易时间或交易数据。
        <br>（2）互联网上的数据传输可能因通信繁忙出现延迟，或因其他原因出现中断、停顿或数据不完全、数据错误等情况，从而使交易出现延迟、停顿或中断。
        <br>（3）由于第三方交易功能的授权信息是由交易平台所产生，您可以通过扫描二维码或输入的授权信息获取通过 API 进行交易的权限，仅此而已，我们并不会获得您的任何API Key及Secret Key（API Key及Secret Key以下简称“身份验证和密钥信息”）。我们也不承担上述交易过程的安全保障功能。因为您自身的疏忽没有采取必要的安全防范措施造成上述信息泄漏，给您造成的损失，我们不承担任何责任。
        <br>（4）由于信息网络设备维护、信息网络连接故障、电脑、通讯或其他系统的故障、电力故障、天气原因、意外事故、罢工、劳动争议、暴乱、起义、骚乱、生产力或生产资料不足、火灾、洪水、风暴、爆炸、战争、银行或其他合作方原因、数字资产市场崩溃、政府行为、司法或行政机关的命令、其他不在我们可控范围内或我们无能力控制的行为或第三方的原因而造成的不能服务或延迟服务，以及造成的您的损失，我们不承担任何责任。
        <br>（5）我们对于数字资产的市场、价值及价格等不做任何明示或暗示的保证，您理解并了解数字资产市场是不稳定的，价格和价值随时会大幅波动或崩盘，交易数字资产是您个人的自由选择及决定且自行承担因此产生的全部风险及可能产生的损失。
        <br><br>三、安全防范措施
        <br>（1）请您加强身份验证和密钥信息的保护，不要在非官方、钓鱼网站等缺乏安全保障的网站申请身份验证和密钥信息。
        <br>（2）请您不要在互联网和电子设备上向公众或不特定人公开上传、保存本人的身份验证和密钥信息有关的二维码、信息明文并且不要随意把与上述信息有关的电子设备借给他人使用，做好相关保护措施。
        <br>（3）请您定期更新API Key，比如每一个月或者三个月定期删除旧的API Key，使用新生成的API Key。
        <br>（4）为了防止您的电子设备感染病毒，您还需安装杀毒软件，定期查杀病毒，以免被恶意程序窃取您的身份验证和密钥信息。
        <br>（5）为了提高身份验证和密钥信息的安全性能，请您使用正版的电子设备系统软件，防止系统漏洞造成的风险。
        <br>（6）为了防止您的交易出现安全风险，建议大额的交易不要使用本功能，如需使用，风险自负。
      </div>

    </div>
    <footer>
      <div class="btn" @click="btn">
        <span v-show="isShow==0" class="radio">
        </span>
        <span v-show="isShow==1" class="radio1">
        </span>
        <p class="btncontentlist">我已认真阅读，并同意“第三方交易功能授权提示”，并已全面了解第三方交易功能，同意遵守第三方交易功的各项制度和规则。</p>
      </div>
      <div class="skip">
        <div @click="skip('skipBack')" class="skipBack">返回</div>
        <div :style="isFalse" @click="skip('skipStep')" class="skipStep">下一步</div>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
    name: "cbAccredit",
    data() {
        return {
            isFalse: {},
            isShow: 0
        };
    },
    // watch: {
    //   $router() {
    //     window.scrollTo(0, 0);
    //   }
    // },
    methods: {
        goback() {
            // this.$toStatistic("cbAccredit", "点击返回k线图详情");
            this.$router.go(-1);
        },
        btn(data) {
            // console.log(111);
            if (this.isShow == 0) {
                this.isShow = 1;
                this.isFalse = {
                    "background-color": "#48c122"
                };
            } else {
                this.isShow = 0;
                this.isFalse = {};
            }
        },
        skip(arg) {
            this.$toStatistic("cbAccredit", "点击k线图详情");            
            // console.log(222);
            // console.log(this.$route.query.marketName);

            if (arg == "skipStep") {
                if (this.isShow == 0) {
                    // console.log("请勾选同意");
                } else {
                    if (this.$route.query.marketName == "火币") {
                        this.$router.push({
                            path: "/cbBourseAccreditA"
                        });
                    } else if (this.$route.query.marketName == "币安") {
                        this.$router.push({
                            path: "/cbBourseAccredit"
                        });
                    } else if (
                        this.$route.query.marketName == "OKEx" ||
                        this.$route.query.marketName == "Okex"
                    ) {
                        this.$router.push({
                            path: "/cbBourseAccreditO"
                        });
                    } else if (this.$route.query.marketName == "ZB") {
                        this.$router.push({
                            path: "/cbBourseAccreditB"
                        });
                    }
                }
            } else {
                this.$router.go(-1);
            }
        }
    }
};
</script>
<style>
.cbAccredit .maicontent {
    padding: 0.4rem;
}
.cbAccredit .head {
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
.cbAccredit .head .iconfont {
    position: absolute;
    left: 0.4rem;
    color: #747474;
    font-weight: bold;
}
.cbAccredit .head .dealcontentlist {
    font-size: 0.48rem;
    font-weight: bold;
    color: #374452;
}
.cbAccredit > .maicontent {
    padding: 1.8rem 0 200px 0;
    width: 100%;
    position: relative;
}
.cbAccredit >.maicontent > .contentlist {
    padding: 0.4rem;
}
.cbAccredit > footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 130px;
}
.cbAccredit >footer .btn {
    height: 80px;
    background-color: #fff;
    font-size: 0.3rem;
    color: #a6afba;
    padding: 0.4rem 0.4rem;
    box-sizing: border-box;
    /* line-height: 100px; */
}
.cbAccredit >footer .skip {
    display: flex;
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
}
.cbAccredit >footer .skip .skipBack {
    /* display: inline-block; */
    width: 50%;
    background-color: #f43e3a;
    color: #fff;
    font-size: 0.4rem;
}
.cbAccredit >footer .skip .skipStep {
    width: 50%;
    background-color: #374452;
    color: #fff;
    font-size: 0.4rem;
}
.cbAccredit >footer .btn .radio {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    /* border-radius: 13px; */
    /* border: 1px solid #a6afba; */
    vertical-align: top;
    margin-top: 3px;
    background-image: url("../../../static/images/circle.png");
    background-size: 14px 14px;
    background-repeat: no-repeat;
}
.cbAccredit >footer .btn .radio1 {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    /* border-radius: 13px; */
    /* border: 1px solid #a6afba; */
    vertical-align: top;
    margin-top: 3px;
    background-image: url("../../../static/images/confirm-1.png");
    background-size: 14px 14px;
    background-repeat: no-repeat;
}
.cbAccredit >footer .btn .btncontentlist {
    width: 90%;
    height: 60px;
    display: inline-block;
    word-wrap: break-word;
    margin-left: 8px;
    font-size: 0.3rem;
}
</style>

