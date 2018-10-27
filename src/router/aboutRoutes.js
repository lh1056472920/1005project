import About from '../components/about/about.vue'
import MyAuthorization from '../components/about/myAuthorization.vue'
import authorize from '../components/about/authorize.vue'
import myAuthorizationList from '../components/about/myAuthorizationList.vue'
import editLoginPassword from '../components/about/editLoginPassword.vue'
import bindEmail from '../components/about/bindEmail.vue'
import safeCenter from '../components/about/safeCenter.vue'
import Setting from './../components/about/setting.vue'
import SetLanguage from '../components/about/setLanguage.vue'
import SetCurrency from '../components/about/setCurrency.vue'
import profitDetail from './../components/about/profitDetail.vue'
import putForwardDetail from './../components/about/putForwardDetail.vue'
import vipDetail from './../components/about/vipDetail.vue'
import apprentice from './../components/about/apprentice.vue'
import activityRule from './../components/about/activityRule.vue'
import invite from './../components/about/invite.vue'
import AboutUs from '../components/about/aboutUs.vue'
import inviteCode from './../components/about/inviteCode.vue'
import openVip from './../components/about/openVip.vue'
import profitVip from './../components/about/profitVip.vue'

const aboutRoutes = [{
        path: '/About',
        name: About,
        component: About
    },
    {
        path: '/MyAuthorization',
        name: MyAuthorization,
        component: MyAuthorization
    },
    {
        path: '/authorize',
        name: authorize,
        component: authorize
    },
    {
        path: '/myAuthorizationList',
        name: myAuthorizationList,
        component: myAuthorizationList
    },
    {
        path: '/safeCenter',
        name: safeCenter,
        component: safeCenter
    },
    {
        path: '/setting',
        component: Setting,
        meta: {
            BarBackground: '#FFFFFF',
            BarStyle: 'dark' //light 白色  dark 黑色
        }
    },
    {
        path: '/setLanguage',
        component: SetLanguage,
        meta: {
            BarBackground: '#FFFFFF',
            BarStyle: 'dark' //light 白色  dark 黑色
        }
    },
    {
        path: '/setCurrency',
        component: SetCurrency,
        meta: {
            BarBackground: '#FFFFFF',
            BarStyle: 'dark' //light 白色  dark 黑色
        }
    },
    {
        path: '/editLoginPassword',
        name: editLoginPassword,
        component: editLoginPassword
    },
    {
        path: '/bindEmail',
        name: bindEmail,
        component: bindEmail
    },
    {
        path: '/profitDetail',
        name: 'profitDetail',
        component: profitDetail
    },
    {
        path: '/putForwardDetail',
        name: 'putForwardDetail',
        component: putForwardDetail
    },
    {
        path: '/vipDetail',
        name: 'vipDetail',
        component: vipDetail
    },
    {
        path: '/apprentice',
        name: apprentice,
        component: apprentice
    },
    {
        path: '/activityRule',
        name: activityRule,
        component: activityRule
    },
    {
        path: '/invite',
        name: 'invite',
        component: invite
    },
    {
        path: '/aboutUs',
        component: AboutUs,
        meta: {
            BarBackground: '#FFFFFF',
            BarStyle: 'dark' //light 白色  dark 黑色
        }
    },
    {
        path: '/inviteCode',
        name: 'inviteCode',
        component: inviteCode,
        meta: {
            BarBackground: '#FFFFFF',
            BarStyle: 'dark'
        }
    },
    {
        path: '/openVip',
        name: 'openVip',
        component: openVip,
        meta: {
            BarBackground: '#FFFFFF',
            BarStyle: 'dark'
        }
    },
    {
        path: '/profitVip',
        name: 'profitVip',
        component: profitVip,
        meta: {
            BarBackground: '#FFFFFF',
            BarStyle: 'dark'
        }
    }
]

export default aboutRoutes