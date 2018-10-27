require('es6-promise').polyfill()
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

// import Mint from 'mint-ui'

import {
    MessageBox
} from 'mint-ui'

import App from './app.vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import statistics from './commons/js/statistic.js'
import createAlertDialog from './commons/js/alertDialog.js'

import remote from './lib/js/remote.js'
Vue.prototype.$axios = axios
Vue.prototype.$remote = remote
Vue.prototype.$backbuttonEvent = []

import {
    plusReady
} from './lib/js/plusReady'
Vue.prototype.$plusReady = (fn) => {
    plusReady(fn)
}
Vue.prototype.$toStatistic = (statistic, describe) => {
    plusReady(() => {
        window.plus.statistic.eventTrig(statistic, {
            'type': 'tap',
            'describe': describe || statistics[statistic]
        });
    })
}
Vue.prototype.$createAlertDialog = createAlertDialog;
import {
    Popup,
    Loadmore,
    Header,
    Range,
    Swipe,
    SwipeItem,
    InfiniteScroll
} from 'mint-ui'




// 引人样式
import './lib/css/base.css'
import '../static/iconfont/iconfont.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import './lib/css/pluginCustom.css'
// import './lib/css/dealbugsell.css'
import 'swiper/dist/css/swiper.css'
//引入vue-socket.io
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
Vue.prototype.$socketio = socketio;
Vue.use(VueSocketio, socketio('ws://chaobis.lian2345.com:20002', {
    'timeout': 2000,
    'reconnection': true,
    'reconnectionDelayMax': 10000,
    'reconnectionDelay': 1000
}));
// Vue.use(VueSocketio, socketio('ws://192.168.1.225:37017', {
//     'timeout': 2000,
//     'reconnection': true,
//     'reconnectionDelayMax': 10000,
//     'reconnectionDelay': 1000
// }));


// 引入route
import router from './router'
import VueTap from './lib/js/v-tap'
import store from './store.js'
import i18nConfig from './i18n'
import messageBox from './commons/js/messageBox.js'
import dsMessageBox from './commons/js/dashang.js'
import vipBox from './commons/js/vipBox.js'


Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(MintUI)
Vue.use(VueI18n)
Vue.use(messageBox)
Vue.use(dsMessageBox)
Vue.use(vipBox)
Vue.directive('tap', VueTap)
const i18n = new VueI18n(i18nConfig)
    // Vue.use(Mint)
    // require ('./huobi_sign_test.js')
VueRouter.prototype.goBack = function() {
        this.isBack = true
        window.history.go(-1)
    }
    //设置路由拦截
router.beforeEach((to, from, next) => {
    plusReady(() => {
        let pageAry = ['/info', '/find']
        if (to.path === '/mappingDescription' || pageAry.indexOf(to.path) >= 0) {
            window.plus.navigator.setStatusBarStyle('light')
        } else {
            window.plus.navigator.setStatusBarStyle('dark')
        }
    })
    if (to.meta.passAuth) {
        // 不拦截的路由
        next()
    } else {
        let token = store.state.userInfo.ticket || (window.localStorage.getItem('user') && JSON.parse(window.localStorage.getItem('user')).ticket)
        if (token) {
            if (!store.state.token) {
                // token放到store
                store.commit('setToken', token)
            }
            next()
        } else {
            next()
                /*next({
                    path: '/login'
                })*/
        }
    }
})

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: {
        App
    },
    render: (h) => {
        return h('app')
    },
    created() {
        this.checkTimer = null;
        this.userUid = this.$store.state.userInfo.uid;
        this.networkStatus = 'normal';
        this.getBch_exchange_rates();
        this.checkNetwork();
        this.checkIsLogout();
        this.initAlarm();
    },
    mounted() {
        // this.init()

        plusReady(() => {
            // 添加返回事件
            let first;
            window.plus.key.addEventListener('backbutton', () => {
                if (this.$route.path === '/mapping') {
                    return
                }
                for (let i = 0; i < this.$backbuttonEvent.length; i++) {
                    if (typeof this.$backbuttonEvent[i] === 'function') {
                        try {
                            this.$backbuttonEvent[i]();
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
                if (this.$route.meta.isQuit) {
                    /*MessageBox.close()
                    MessageBox.confirm(this.$t('m.isLogout')).then(action => {
                        window.plus.runtime.quit()
                    }).catch(cancel => {
                        console.log(cancel)
                    })*/
                    
                    if (!first) {
                        first = new Date().getTime(); //记录第一次按下回退键的时间
                        plus.nativeUI.toast('再按一次退出应用'); //给出提示
                        
                        setTimeout(function() {
                            //1s中后清除
                            first = null;
                        }, 1000);
                    } else {
                        if (new Date().getTime() - first < 1000) {
                            //如果两次按下的时间小于1s，
                            plus.runtime.quit(); //那么就退出app
                        }
                    }
                } else {
                    router.goBack()
                }
            })
        })
    },
    methods: {
        async getBch_exchange_rates() {
            let {data} = await this.$axios.get('https://bitpay.com/api/rates/BCH');
            if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].code === 'CNY') {
                        this.$store.commit('setBch_exchange_rates', data[i].rate)
                    }
                }
            }
        },
        logout (params) {
            MessageBox.close()
            MessageBox.alert(params.result, {
                title: this.$t('m.tips'),
                confirmButtonText: this.$t('m.ok')
            }).then(action => {
                this.$router.push({ path: '/login'})
                this.$store.commit('setToken', '')
                this.$store.commit('setUserInfo', '')
            })
        },
        checkIsLogout () {
            if (!this.$store.state.userInfo.ticket) {
                return;
            }
            if (this.checkTimer) {
                clearTimeout(this.checkTimer)
            }
            remote.check_login_status({ticket: this.$store.state.userInfo.ticket}).then(response => {
                if (response.data.code == 200) {
                    this.checkTimer = setTimeout(() => {
                        this.checkIsLogout()
                    }, 10000);
                } else {
                    this.logout(response.data)
                }
            }).catch(error => {
                //this.logout()
                //this.checkNetwork()
            })
        },
        checkNetwork() {
            document.addEventListener('netchange', () => {
                plusReady(() => {
                    let nt = window.plus.networkinfo.getCurrentType();
                    switch (nt){
                        case window.plus.networkinfo.CONNECTION_ETHERNET:
                        case window.plus.networkinfo.CONNECTION_WIFI:
                            this.networkStatus = 'normal';
                            break; 
                        case window.plus.networkinfo.CONNECTION_CELL2G:
                        case window.plus.networkinfo.CONNECTION_CELL3G:
                        case window.plus.networkinfo.CONNECTION_CELL4G:
                            this.networkStatus = 'cell';  
                            break; 
                        default:
                            this.networkStatus = 'break'; 
                        break;
                    }
                    if (this.networkStatus === 'normal') {
                        Toast({
                            message: '网络已链接',
                            position: 'middle',
                            duration: 3000
                        });
                        this.checkIsLogout();
                    } else if (this.networkStatus === 'cell') {
                        Toast({
                            message: '已切换到移动网络',
                            position: 'middle',
                            duration: 3000
                        });
                        this.checkIsLogout();
                    } else if (this.networkStatus === 'break') {
                        Toast({
                            message: '网络已中断',
                            position: 'middle',
                            duration: 3000
                        });
                    }
                })
            }, false);
        },
        initAlarm() {
            if (!this.userUid) {
                return;
            }
            let socket = socketio('ws://chaobi.lian2345.com:37017');         
            let wrangingPlayer = null;
            socket.emit('bigwranging', {method:'notifity',uid: this.userUid}); 
            socket.on(this.userUid, function (data) { 
                plusReady(() => {
                    if (wrangingPlayer) {
                        wrangingPlayer.stop()
                        wrangingPlayer = null;
                    }
                    if (data.alarm == 1) {
                        /*alert(plus.device.getVolume())*/
                        plus.device.setVolume( 0.88 );
                        wrangingPlayer = plus.audio.createPlayer('_www/' + 'myAll.mp3');
                        wrangingPlayer.play()
                        //plus.device.beep(2);
                        plus.device.vibrate(3000);
                    }
                    //弹出提示框
                    let title = '温馨提示';
                    let message = `您关注的${data.symbol} ${data.detail}`;
                    switch (data.type) {
                        case '1':
                            title = '涨跌预警提醒';
                            break;
                        case '2':
                            title = '价差预警提醒';
                            break;
                        case '3':
                            title = '大单买卖预警提醒';
                            break;
                        case '4':
                            title = '暴涨暴跌提醒';
                            break;
                        default:
                            
                    }
                    createAlertDialog({
                        title: title,
                        message: message,
                        callback: () => {
                            wrangingPlayer.stop();
                            wrangingPlayer = null;
                        }
                    });
                });
            });
        }
        // init() {
        //     // 获取gasPrice
        //     WEB3.get_gas_price((p) => {
        //         if (!p.isError) {
        //             this.$store.commit('setGasPrice', parseFloat(p.data))
        //         }
        //     })
        // }
    },
    watch: {
        '$store.state.userInfo': function() {
            this.checkNetwork();
            this.checkIsLogout();
            if (!this.userUid) {
                this.userUid = this.$store.state.userInfo.uid;
                this.initAlarm();
            }
        }
    }

})