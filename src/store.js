import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    //保存账号的apikey和secretkey
    // {
    //   apikey: 0,
    //   secretkey: 0,
    //   arroundId: 0,
    // },
    userkey: {},
    language: '',
    registerState: "",
    token: "",
    optionalList: [],
    bianList: [],
    huobiList: [],
    okexList: [],
    gateList: [],
    zbList: [],
    gasPrice: 0,
    userId: sessionStorage.getItem('userId'),
    OkexAssetList: [],
    BianAssetList: [],
    ZBAssetList: [],
    HuobiAssetList: [],
    bch_exchange_rates: 0,
    userInfo: JSON.parse(window.localStorage.getItem('user')) || ''
};
const getters = {
    currencySymbol(state) {
        switch (state.currency) {
            case RMB:
                return '￥'
            case DOLLAR:
                return '$'
        }
    }
}

const mutations = {
    // increment(state) {
    //   state.count++
    // },
    setLanguage(state, language) {
        state.language = language
    },
    setRegisterState(state, registerState) {
        state.registerState = registerState
    },
    setToken(state, token) {
        state.token = token
    },
    setOptionalList(state, optionalList) {
        state.optionalList = optionalList
    },
    setGasPrice(state, price) {
        state.gasPrice = price
    },
    setUserkey(state, userkey) {
        state.userkey = userkey
    },
    setBianList(state, bianList) {
        state.bianList = bianList
    },
    setHuobiList(state, huobiList) {
        state.huobiList = huobiList
    },
    setOkexList(state, okexList) {
        state.okexList = okexList
    },
    setGateList(state, gateList) {
        state.gateList = gateList
    },
    setZbList(state, zbList) {
        state.zbList = zbList
    },
    setOkexAssetList(state, OkexAssetList) {
        state.OkexAssetList = OkexAssetList
    },
    setBianAssetList(state, BianAssetList) {
        state.BianAssetList = BianAssetList
    },
    setZBAssetList(state, ZBAssetList) {
        state.ZBAssetList = ZBAssetList
    },
    setHuobiAssetList(state, HuobiAssetList) {
        state.HuobiAssetList = HuobiAssetList
    },
    setBch_exchange_rates(state, value) {
        state.bch_exchange_rates = value
    },
    setUserInfo(state, value) {
        window.localStorage.setItem(
            'user',
            JSON.stringify(value)
        );
        state.userInfo = value
    }
}
export default new Vuex.Store({
    state,
    getters,
    mutations
})