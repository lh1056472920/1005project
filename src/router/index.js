import Vue from 'vue'
import Router from 'vue-router'

// 交易
import cbAccredit from '../components/cbLicensingDeals/cbAccredit.vue'
import cbBourseAccredit from '../components/cbLicensingDeals/cbBourseAccredit.vue'
import cbBourseAccreditA from '../components/cbLicensingDeals/cbBourseAccreditA.vue'
import cbDealBuy from '../components/cbLicensingDeals/cbDealBuy.vue'
import cbDealBuyone from '../components/cbLicensingDeals/cbDealBuyone.vue'
import cbLicensingTutorial from '../components/cbLicensingDeals/cbLicensingTutorial.vue'
import cbhistory from '../components/cbLicensingDeals/cbhistory.vue'
import cbUnsettled from '../components/cbLicensingDeals/cbUnsettled.vue'
import cbCourse from '../components/cbLicensingDeals/cbCourse.vue'
import safetyAnalysis from '../components/cbLicensingDeals/safetyAnalysis.vue'
// 交易之币安 okex zb 授权页面路由
import cbBourseAccreditBian from '../components/cbLicensingDeals/cbBourseAccreditBian.vue'
import cbBourseAccreditOkex from '../components/cbLicensingDeals/cbBourseAccreditOkex.vue'
import cbBourseAccreditZB from '../components/cbLicensingDeals/cbBourseAccreditZB.vue'
import cbBourseAccreditO from '../components/cbLicensingDeals/cbBourseAccreditO.vue'
import cbBourseAccreditB from '../components/cbLicensingDeals/cbBourseAccreditB.vue'
import cbDealBuyoneBian from '../components/cbLicensingDeals/cbDealBuyoneBian.vue'
import cbDealBuyoneOkex from '../components/cbLicensingDeals/cbDealBuyoneOkex.vue'
import cbDealBuyoneZB from '../components/cbLicensingDeals/cbDealBuyoneZB.vue'
import cbhistoryBian from '../components/cbLicensingDeals/cbhistoryBian.vue'
import cbhistoryOkex from '../components/cbLicensingDeals/cbhistoryOkex.vue'
import cbhistoryZB from '../components/cbLicensingDeals/cbhistoryZB.vue'
import cbUnsettledBian from '../components/cbLicensingDeals/cbUnsettledBian.vue'
import cbUnsettledOkex from '../components/cbLicensingDeals/cbUnsettledOkex.vue'
import cbUnsettledZB from '../components/cbLicensingDeals/cbUnsettledZB.vue'
//交易之委托解释
import Plansentrustment from '../commons/components/Plansentrustment.vue'
import Pointsentrustment from '../commons/components/Pointsentrustment.vue'
import arbitragemodel from '../commons/components/arbitragemodel.vue'
//交易vip功能小调查页面
import vipfunc from '../commons/components/vipfunc.vue'

//提醒
import price from '../components/pricetips/price.vue'
import priceRemind from '../components/pricetips/priceremind.vue'
import historyWarning from '../components/pricetips/historywarning.vue'
import historyInflation from '../components/pricetips/historyInflation.vue'
import addRemind from '../components/pricetips/addRemind.vue'
import floatSearch from '../components/pricetips/floatSearch.vue'
import anomaly from '../components/pricetips/anomaly.vue'
import explain from '../components/pricetips/explain.vue'
import bigUnit from '../components/pricetips/bigunit.vue'
import boomOrSlump from '../components/pricetips/boomOrSlump.vue'
import remind from '../components/pricetips/remind.vue'
//三大委托历史详情
import chalk from '../components/entrust/chalk.vue'
import plan from '../components/entrust/plan.vue'
import straddle from '../components/entrust/straddle.vue'

//代币持仓
import queryToken from '../components/tokenPositon/queryToken.vue'
import tokenDel from '../components/tokenPositon/tokenDel.vue'
import githubList from '../components/tokenPositon/githubList.vue'
import githubDetails from '../components/tokenPositon/githubDetails.vue'

//行情
import QuotationIndex from '../components/quotation/index.vue'
import QuotationDet from '../components/quotation/quotationDet.vue'
import QuotationSearch from '../components/quotation/quotationSearch.vue'
import Optional from '../components/quotation/optional.vue'
import EditOptional from '../components/quotation/editOptional.vue'
import Bian from '../components/quotation/bian.vue'
import Huobi from '../components/quotation/huobi.vue'
import Okex from '../components/quotation/okex.vue'
import Zb from '../components/quotation/zb.vue'


//登录
import Login from '../components/login/index.vue'
import loginRoutes from './loginRoutes'
//个人中心
import About from './../components/about/index.vue'
import disclaimer from './../commons/components/disclaimer.vue'
import aboutRoutes from './aboutRoutes'
//二维码
import QR from '../commons/components/QR-code.vue'
Vue.use(Router)
export default new Router({
    routes: [{
            path: '/',
            redirect: '/QuotationIndex'
        },
        {
            path: '/login',
            component: Login,
            meta: {
                passAuth: true, // 添加此字段表示不启用登录拦截
                BarBackground: '#2B2D5C',
                BarStyle: 'light' //白色  dark为黑色
            },
            children: loginRoutes
        },
        {
            path: '/about',
            component: About,
            meta: {
                passAuth: true,
                BarBackground: '#181A2A',
                BarStyle: 'light' //白色  dark为黑色
            },
            children: aboutRoutes
        }, 
        {
            path: '/githubDetails',
            name: 'githubDetails',
            component: githubDetails
        },
        {
            path: '/QuotationIndex',
            redirect: '/Bian',
            name: 'QuotationIndex',
            meta: {
                isQuit: true
            },
            component: QuotationIndex,
            children: [
                {
                    path: '/Optional',
                    name: Optional,
                    component: Optional,
                    meta: {
                        isQuit: true
                    }
                },
                {
                    path: '/Bian',
                    component: Bian,
                    meta: {
                        isQuit: true
                    }
                },
                {
                    path: '/Huobi',
                    name: Huobi,
                    component: Huobi,
                    meta: {
                        isQuit: true
                    }
                },
                {
                    path: '/Okex',
                    //   name: Okex,
                    component: Okex,
                    meta: {
                        isQuit: true
                    }
                },
                {
                    path: '/Zb',
                    //   name: Zb,
                    component: Zb,
                    meta: {
                        isQuit: true
                    }
                }
            ]

        },
        {
            path: '/EditOptional',
            component: EditOptional
        },

        {
            path: '/cbAccredit',
            name: 'cbAccredit',
            component: cbAccredit
        },
        {
            path: '/cbBourseAccredit',
            name: 'cbBourseAccredit',
            component: cbBourseAccredit
        },
        {
            path: '/cbCourse',
            name: 'cbCourse',
            component: cbCourse
        },
        {
            path: '/safetyAnalysis',
            name: 'safetyAnalysis',
            component: safetyAnalysis
        },
        {
            path: '/cbBourseAccreditA',
            name: 'cbBourseAccreditA',
            component: cbBourseAccreditA
        },
        {
            path: '/cbBourseAccreditBian',
            name: 'cbBourseAccreditBian',
            component: cbBourseAccreditBian
        },
        {
            path: '/cbBourseAccreditZB',
            name: 'cbBourseAccreditZB',
            component: cbBourseAccreditZB
        },
        {
            path: '/cbBourseAccreditB',
            name: 'cbBourseAccreditB',
            component: cbBourseAccreditB
        },
        {
            path: '/cbBourseAccreditOkex',
            name: 'cbBourseAccreditOkex',
            component: cbBourseAccreditOkex
        },
        {
            path: '/cbBourseAccreditO',
            name: 'cbBourseAccreditO',
            component: cbBourseAccreditO
        },
        {
            path: '/cbDealBuy',
            name: 'cbDealBuy',
            meta: {
                isQuit: true
            },
            component: cbDealBuy,
            children: [{
                    path: '/cbUnsettled',
                    name: 'cbUnsettled',
                    component: cbUnsettled,
                    meta: {
                        cbBuy: true
                    }
                },
                {
                    path: '/cbhistory',
                    name: 'cbhistory',
                    component: cbhistory,
                    meta: {
                        cbBuy: true
                    }
                },
                {
                    path: '/cbDealBuyone',
                    name: 'cbDealBuyone',
                    component: cbDealBuyone,
                    meta: {
                        cbBuy: true
                    }
                },
                {
                    path: '/cbUnsettledBian',
                    name: 'cbUnsettledBian',
                    component: cbUnsettledBian,
                    meta: {
                        cbBuy: true
                    }
                },
                {
                    path: '/cbhistoryBian',
                    name: 'cbhistoryBian',
                    component: cbhistoryBian,
                    meta: {
                        cbBuy: true
                    }
                },
                {
                    path: '/cbDealBuyoneBian',
                    name: 'cbDealBuyoneBian',
                    component: cbDealBuyoneBian,
                    meta: {
                        cbBuy: true
                    }
                },
                {
                    path: '/cbUnsettledOkex',
                    name: 'cbUnsettledOkex',
                    component: cbUnsettledOkex,
                    meta: {
                        cbBuy: true
                    }
                },
                {
                    path: '/cbhistoryOkex',
                    name: 'cbhistoryOkex',
                    component: cbhistoryOkex,
                    meta: {
                        cbBuy: true
                    }
                },
                {
                    path: '/cbDealBuyoneOkex',
                    name: 'cbDealBuyoneOkex',
                    component: cbDealBuyoneOkex,
                    meta: {
                        cbBuy: true
                    }
                },
                {
                    path: '/cbUnsettledZB',
                    name: 'cbUnsettledZB',
                    component: cbUnsettledZB,
                    meta: {
                        cbBuy: true
                    }
                },
                {
                    path: '/cbhistoryZB',
                    name: 'cbhistoryZB',
                    component: cbhistoryZB,
                    meta: {
                        isQuit: true
                    }
                },
                {
                    path: '/cbDealBuyoneZB',
                    name: 'cbDealBuyoneZB',
                    component: cbDealBuyoneZB,
                    meta: {
                        isQuit: true
                    }
                },
            ]
        },

        {
            path: '/cbLicensingTutorial',
            name: 'cbLicensingTutorial',
            component: cbLicensingTutorial
        },
        {
            path: '/price',
            name: 'price',
            component: price
        }, {
            path: '/bigUnit',
            name: 'bigUnit',
            component: bigUnit
        },
        {
            path: '/remind',
            name: 'remind',
            component: remind
        }, {
            path: '/explain',
            name: 'explain',
            component: explain
        }, {
            path: '/anomaly',
            name: 'anomaly',
            component: anomaly
        }, {
            path: '/boomOrSlump',
            name: boomOrSlump,
            component: boomOrSlump
        }, {
            path: '/priceRemind',
            name: priceRemind,
            component: priceRemind
        }, {
            path: '/historyWarning',
            //   name: historyWarning,
            component: historyWarning
        }, {
            path: '/historyInflation',
            component: historyInflation
        }, {
            path: '/addRemind',
            //   name: addRemind,
            component: addRemind
        }, {
            path: '/floatSearch',
            //   name: addRemind,
            component: floatSearch
        },
        //行情
        {
            path: '/QuotationSearch',
            //   name: QuotationSearch,
            component: QuotationSearch
        },
        {
            path: '/QuotationDet',
            //   name: QuotationDet,
            component: QuotationDet
        },
        {
            path: '/queryToken',
            name: queryToken,
            component: queryToken
        },
        {
            path: '/tokenDel',
            name: tokenDel,
            component: tokenDel
        },
        {
            path: '/githubList',
            name: githubList,
            component: githubList
        },
        {
            path: '/QR',
            name: QR,
            component: QR,
        },
        {
            path: '/Pointsentrustment',
            component: Pointsentrustment,
        },
        {
            path: '/arbitragemodel',
            component: arbitragemodel,
        },
        {
            path: '/Plansentrustment',
            component: Plansentrustment,
        },
        {
            path: '/vipfunc',
            name: vipfunc,
            component: vipfunc,
        },
        {
            path: '/chalk',
            name: chalk,
            component: chalk,
        },
        {
            path: '/plan',
            name: plan,
            component: plan,
        },
        {
            path: '/straddle',
            name: straddle,
            component: straddle,
        },
        {
            path: '/disclaimer',
            name: disclaimer,
            component: disclaimer,
        },

    ],
    scrollBehavior(to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})