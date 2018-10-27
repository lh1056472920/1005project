import remote from './lib/js/remote.js'
import {plusReady} from './lib/js/plusReady.js'
var wgtVer = null;
let wgtUrl='';
class CheckUpdate {
    constructor() {
        
    }
    getCurentVersion() {
        let self = this;
        plusReady(() => {
            window.plus.runtime.getProperty(window.plus.runtime.appid,function(inf){
                wgtVer = inf.version;
                self.getServiceVersion(wgtVer)
            });
        })
    }
    getServiceVersion(currentVersion) {
        remote.check_app_version({
            version: currentVersion,
            wallertAppName: top.document.title
        }).then((response) => {
            let newVer = response && response.data.flag;
            wgtUrl = response && response.data.fileName;
            if( newVer){
                this.downWgt();
            }else{
                //window.plus.nativeUI.alert("无新版本可更新！");
            }
        })
    }
    downWgt() {
        var self = this;
        if (!wgtUrl) {
            return;
        }
        window.plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
            if ( status == 200 ) { 
                self.installWgt(d.filename); // 安装wgt包
            } else {
                //window.plus.nativeUI.alert("下载wgt失败！");
            }
            //window.plus.nativeUI.closeWaiting();
        }).start();
    }
    installWgt(path) {
        window.plus.runtime.install(path,{},function(){
            //window.plus.nativeUI.closeWaiting();
            /*window.plus.nativeUI.alert("应用资源更新完成！",function(){
                window.plus.runtime.restart();
            });*/
        },function(e){
            //window.plus.nativeUI.closeWaiting();
            /*console.log("安装wgt文件失败["+e.code+"]："+e.message);
            window.plus.nativeUI.alert("安装wgt文件失败["+e.code+"]："+e.message);*/
        });
    }
}
new CheckUpdate().getCurentVersion()

export default CheckUpdate
