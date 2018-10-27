<template>
    <div class="cbBourseAccreditA">
        <!-- 各交易所手动输入授权 -->
        <header class="head">
            <i @click="goback" class="iconfont icon-fanhui"></i>
            <span class="dealContent">火币授权</span>
        </header>
        <div class="maiico">
            <div class="ico">
                火币Pro提供的Access Key和Secret Key非常重要，请小心保管，不要外泄，确保资金安全！建议您通过QQ，微信等较为安全的工具发送Key，防止泄露。
            </div>
            <div class="icoremind">请输入您的AccessKey和secretKey</div>
            <!-- <input type="text"> -->
            <div class="input">
                <input class="copy" placeholder="AccessKey" ref="input1">
                <input class="handcopy" placeholder="secretKey" ref="input2">
            </div>
            <div @click="accredit" class="accredit">
                授权交易
            </div>
            <div class="remind">
                <p>用户秘钥经过多重加密且仅存储在本地设备内，请放心使用！如有疑问，请查看
                    <router-link to="/safetyAnalysis">“交易安全分析”</router-link>
                </p>

            </div>
            <div class="statement">
                声明：点击“授权交易”即代表你授权本App通过API访问火币Pro进行相关交易操作。除技术支持之外，我们不提供交易所其他服务，不承担任何资产风险如果怀疑授权存在问题，请登录火币Pro网站移除相关Key。
            </div>
            <div class="course" @click='toCourse'>授权教程</div>
        </div>
    </div>
</template>
<script>
import { encryptKey, MD5, decryptByKey } from "../../lib/js/crypto.js";
import { MessageBox } from "mint-ui";
import axios from "axios";
import {urljm} from  '../../lib/js/jsmi.js'
// const kplsign = require("../../lib/js/sign/KplSign.js");
// var http = require("http");
// var querystring = require("querystring");
export default {
  name: "cbBourseAccreditA",
  data() {
    return {};
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    accredit() {
      // if (
      //     this.$refs.input1.value == "" ||
      //     this.$refs.input2.value == ""
      // ) {
      //     MessageBox("温馨提示", "apikey或secretkey不能为空");
      //     return;
      // }
      //加密存本地
            var userkey = {
                userName: JSON.parse(localStorage.getItem('user')).phone, //用户名
                // apikey: this.$refs.input1.value
                apikey: 'fa049377-f37b907f-e10564e5-07a44'
                    .split("")
                    .reverse()
                    .join(""),
                // secretkey: this.$refs.input2.value
                secretkey: '6ad24e1b-1fca7bf7-ee1e5e07-ca457'
                    .split("")
                    .reverse()
                    .join(""),
                num: RndNum(16)
            };
            console.log(userkey.apikey);
            
           let url = `http://192.168.1.68:9998/api/chaobi/deal/huobi/accounts/${
                userkey.num
            }?apikey=${urljm(userkey.apikey)}&secret=${
                urljm(userkey.secretkey)
            }&method=getAccountInfo`;

            axios.post(url).then(res => {
              console.log(res);
              
                // let list = JSON.parse(res.data.list);
                // if (list.code) {
                //     MessageBox(
                //         "验证不通过",
                //         "您的Access Key或Secret Key输入不正确"
                //     );
                // } else {
                //     localStorage.setItem(
                //         "userkey",
                //         encryptKey(JSON.stringify(userkey))
                //     );
                //     if (localStorage.getItem("sign") == 1) {
                //         this.$router.push({
                //             path: "/cbDealBuy"
                //         });
                //     } else if (localStorage.getItem("sign") == 2) {
                //         this.$router.push({
                //             path: "/authorize"
                //         });
                //     }
                // }
            });
            function RndNum(n) {
                var rnd = "";
                for (var i = 0; i < n; i++)
                    rnd += Math.floor(Math.random() * 10);
                return rnd;
            }
      //火币签名认证
      // let _this = this;
      // var apikey = this.$refs.input1.value;
      // var secretkey = this.$refs.input2.value;
      // kplsign.sign_huobi(
      //   apikey,
      //   secretkey,
      //   "/v1/account/accounts/",
      //   "GET",
      //   {},
      //   function(sgingdadd) {
      //     var url = "/v1/account/accounts/";
      //     _this.huobiget(url, sgingdadd);
      //   }
      // );
    },
    // huobiget(url, sgingdadd) {
    //   let _this = this;
    //   var options = {
    //     host: "chaobi.lian2345.com",
    //     hostname: "chaobi.lian2345.com",
    //     port: 80,
    //     path: "/https/get" + url + "?" + sgingdadd + "&kplkpl=api.huobipro.com",
    //     method: "get"
    //   };
    //   var req = http.get(options, function(res) {
    //     res.setEncoding("utf-8");
    //     res.on("data", function(chun) {
    //       // console.log(chun);

    //       if (JSON.parse(chun)["err-code"]) {
    //         MessageBox("授权失败", "请输入正确的apikey和secretkey");
    //         return;
    //       } else if (JSON.parse(chun).data[0].id) {
    //         MessageBox("温馨提示", "授权成功");
    //         //存个人账号，私钥等
    //         var userkey = {
    //           userName: JSON.parse(localStorage.getItem('user')).phone, //用户名
    //           apikey: _this.$refs.input1.value,
    //           secretkey: _this.$refs.input2.value,
    //           arroundId: JSON.parse(chun).data[0].id
    //         };
    //         // //先将两个秘钥保存在本地和账号名密码相连
    //         localStorage.setItem(
    //           "userkey",
    //           encryptKey(JSON.stringify(userkey))
    //         );
    //         _this.$store.commit(
    //           "setUserkey",
    //           encryptKey(JSON.stringify(userkey))
    //         );
    //         // console.log(localStorage.getItem('sign'));
            
    //         if (localStorage.getItem('sign')==1) {  
    //           _this.$router.push({
    //               path: "/cbDealBuy"
    //               // query: { id: JSON.parse(chun).data[0].id }
    //           });
    //         }else if (localStorage.getItem('sign')==2) {
    //             _this.$router.push({
    //               path: "/authorize"
    //               // query: { id: JSON.parse(chun).data[0].id }
    //           });
    //         }
    //       }
    //     });
    //     res.on("end", function() {});
    //   });
    //   req.on("error", function(err) {
    //     // console.error(err);
    //   });
    //   req.end();
    // },
    toCourse() {
      this.$toStatistic("cbBourseAccredithuobi", "点击阅读火币授权教程");
      this.$router.push({
        path: "/cbCourse",
        query:{'bi':"hb"}
      });
    }
  }
};
</script>
<style>
@import '../../lib/css/accredit.css';
</style>


