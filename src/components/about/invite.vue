<template lang="html">
    <div class="page">
        <HeaderItem title="分享"></HeaderItem>
        <div class="main" ref="drawImage">
            <img src="@/images/about/share.png" class="bgImage" alt="">
            <p class="logo-text">{{inviteText}}</p>
            <div class="conten-text" v-if="$route.params.identify === 'invite'">
                <p class="remind">恭喜您获得VIP特权体验</p>
                <p class="share-amount">最高1BCH</p>
            </div>
            <div class="conten-text" v-else>
                <p class="remind"><span class="label">我已经赚到 </span><span class="text">{{$route.params.totalmoney}} BCH</span></p>
                <p class="share-amount share">快来一起挖矿吧</p>
            </div>
            <div class="qr">
                <canvas class="qr-code" id="qr-code"></canvas>
            </div>
            <p class="remind-code">邀请码：{{inviteCode}}</p>
            <div class="share-container">
                <div class="container" v-for="(item, index) in shareList"  :key="index" v-tap="{methods: buildShare,type: item.type,detail: item.detail}">
                    <img :src="item.imgUrl" class="share-img py" :alt="item.label">
                </div>
            </div>
            <div class="border">
                
            </div>
        </div>
    </div>
</template>

<script>
import HeaderItem from './../../commons/components/HeaderItem.vue'
import html2canvas from './../../commons/js/html2canvas.js'
import Canvas2Image from './../../commons/js/canvasToImage.js'
import QRCode from 'qrcode'
export default {
    components: {
        HeaderItem
    },
    data() {
        return {
            inviteCode: this.$route.params.inviteCode,
            inviteText: '邀请收徒即挖矿',
            shareList: [
                {
                    imgUrl: require('@/images/about/pengyouquan.png'),
                    label: '朋友圈',
                    type: 'weixin',
                    detail: 'WXSceneTimeline'
                },
                {
                    imgUrl: require('@/images/about/weixin.png'),
                    label: '微信好友',
                    type: 'weixin',
                    detail: 'WXSceneSession'
                },
                {
                    imgUrl: require('@/images/about/qq.png'),
                    label: 'QQ好友',
                    type: 'qq'
                },
                {
                    imgUrl: require('@/images/about/download.png'),
                    label: '下载图片',
                    type: 'download'
                }
            ],
            shareInfo: {}
        }
    },
    created() {
        this.userInfo = this.$store.state.userInfo || {};
    },
    mounted () {
        this.initData();
        this.createQRCode();
        //this.getInviteCode();
    },
    methods: {
        initData() {
            
        },
        createQRCode() {
            let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
            QRCode.toCanvas(document.getElementById("qr-code"), `http://192.168.1.211:8080/cbShareIndex.html?inviteCode=${this.inviteCode}`,{
                width: windowWidth / 10.8 * 4
            })
        },
        buildShare(params) {
            let dom = this.$refs['drawImage'];
            let canvas = document.createElement('canvas')
            let context = canvas.getContext("2d")
            let width = window.width; //获取屏幕宽度
            var scaleBy = 3;
            //textHeight(innerText)
            canvas.width = width*scaleBy // 设置画布宽度
            canvas.height = dom.offsetHeight*scaleBy 
            context.scale(scaleBy, scaleBy);
            context.font = 'Microsoft YaHei';
            this.$plusReady(() => {
                window.plus.nativeUI.showWaiting('加载中...')
            })
            html2canvas(dom, {
                canvas: canvas
            }).then((_canvas) => {
                this.$plusReady(() => {
                    window.plus.nativeUI.closeWaiting()
                })
                var imageObject  = Canvas2Image.convertToImage(_canvas,width*scaleBy,dom.offsetHeight*scaleBy,'png')
                this.shareInfo = {
                    url: imageObject.src,
                    imgName: '炒币工具分享.png',
                    id: parseInt(Math.random()*(900000)+100000),
                    shareType: 'image'
                };
                this.shareImage(params)
            });
        },
        shareImage(params) {
            if (params.type === 'download') {
                this.downloadImage();
                return;
            }
            this.$plusReady(() => {
                let imgObj = new window.plus.nativeObj.Bitmap(this.shareInfo.id);
                imgObj.loadBase64Data(this.shareInfo.url,() => {
                    let saveURL = '_downloads/' + this.shareInfo.imgName;
                    imgObj.save(saveURL,{},(res) =>{
                        this.shareTo({
                            scene: params.detail || '',
                            imgPath: res.target,
                            type: params.type
                        })
                        window.plus.gallery.save(saveURL)
                    },function(){
                        window.plus.nativeUI.alert('保存图片失败')
                    })
                },function(){
                    window.plus.nativeUI.alert('加载图片失败')
                })
            })
        },
        downloadImage() {
            this.$plusReady(() => {
                window.plus.nativeUI.showWaiting('正在保存图片...')
                let imgObj = new window.plus.nativeObj.Bitmap(this.shareInfo.id);
                imgObj.loadBase64Data(this.shareInfo.url,() => {
                    let saveURL = '_downloads/' + this.shareInfo.imgName;
                    imgObj.save(saveURL,{},(res) =>{
                        window.plus.nativeUI.closeWaiting()
                        window.plus.gallery.save(saveURL)
                        window.plus.nativeUI.alert('保存图片成功')
                    },function(){
                        window.plus.nativeUI.alert('保存图片失败')
                    })
                },function(){
                    window.plus.nativeUI.alert('加载图片失败')
                })
            })
        },
        shareTo({scene,imgPath,type}) {
            let self = this;
            let shareService = null;
            window.plus.share.getServices(function(services){
                for(let i in services){
                    if( type === services[i].id){
                        shareService = services[i];
                    }
                }
                let data;
                if (self.shareInfo.shareType === 'image') {
                    data = {
                        pictures: [imgPath],
                        extra:{
                            scene: scene
                        }
                    };
                } else {
                    data = {
                        href: self.shareInfo.href,
                        content: self.shareInfo.content.slice(0,200),
                        title: self.shareInfo.title,
                        thumbs: self.shareInfo.thumbs,
                        extra:{
                            scene: scene
                        }
                    }
                }
                shareService.send(data, function(e){
                    window.plus.nativeUI.alert("分享成功！");
                },function(e){
                    //window.plus.nativeUI.alert("分享失败!");
                });
            }, function(e){
                window.plus.nativeUI.alert( "获取分享服务列表失败："+e.message );
            });
        },
        getInviteCode() {
            this.$remote.create_invitecode({
                uid: this.userInfo.uid
            }).then((res) => {
                if (res.status === 200 && res.data.result) {
                    this.inviteCode = res.data.result.uinvitation;
                    this.createQRCode();
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.page{
    width: 10.8rem;
    height: 100vh;
}
.main{
    position: relative;
    background-color: #fff;
    height: calc(100vh - 1.44rem);
    overflow: auto;
    .logo-text{
        font-size:0.72rem;
        font-weight:bold;
        color:rgba(255,255,255,1);
        margin-top: .58rem;
        position: absolute;
        width: 100%;
    }
}
p{
    font-size:0.42rem;
    color:rgba(26,26,26,1);
    text-align: center;
}
.conten-text{
    margin-top: 6.34rem;
}
.remind{
    margin-bottom: .29rem;
    font-size:0.48rem;
    font-weight:bold;
    color:rgba(255,150,2,1);
    .label{
        
    }
    .text{
        
        font-size: 0.8rem;
    }
}
.share-amount{
    font-size:0.86rem;
    font-weight:bold;
    color:rgba(255,150,2,1);
    &.share{
        font-size: 0.54rem;
    }
}
.qr{
    text-align: center;
}
.qr-code {
    
}
.share-container{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    min-height: 2.02rem;
    text-align: center;
    .container{
        display: inline-block;
        .share-img{
            width: 1rem;
            min-width: 1rem;
            min-height: 1rem;
            margin-right: .58rem;
        }
    }
}
.bgImage{
    width: 10.8rem;
    height: 5.4rem;
    position: absolute;
    left: 0;
    top: 0;
}
</style>
