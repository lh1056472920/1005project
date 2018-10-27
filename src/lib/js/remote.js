import axios from 'axios'
axios.defaults.baseURL = 'http://chaobi.lian2345.com'

//老张测试接口
const laozhang = 'http://chaobi.lian2345.com'
// const laozhang = 'http://192.168.1.250:9998'
//const server = 'http://192.168.31.222:9999'
// const server = 'http://192.168.1.158:9999'
const server = 'https://www.blockgdex.com'
const server_online = 'https://www.blockgdex.com'
// const goodsurl = 'http://192.168.1.250:9998';
const goodsurl = 'http://chaobi.lian2345.com';
const aboutServer = 'http://chaobi.lian2345.com';
const kLineServer = 'http://chaobis.lian2345.com';

const request = {
    REGISTER: '/user/register',
    LOGIN: '/chaobi/vip/registerbyphone',
    CHECK_USER_LEGALITY: '/user/check',
    CREATE_WALLET: '/user/createwallert',
    FIND_WALLET: '/user/findwallert',
    MARKETS: '/api/market/markets',
    CHECK_USER_COIN_TYPE: '/api/market/currcncys',
    SEND_SMS: '/chaobi/sms/send_sms',
    ADD_MARKET: '/market/addMarket',
    DELETE_MARKET: '/market/deleteMarket',
    QUERY_USER: '/user',
    FIND_LOGIN_PASSWORD: '/user/findLoginPassword',
    SET_TRANSACTION_RECORD: '/api/market/addOrder',
    GET_TRANSACTION_RECORD: '/api/market/orderList',
    MODIFY_WALLERT_PASSWORD: '/user/modifyWallertPassword',
    SAVE_CONTACTS: '/api/market/saveContacts',
    GET_CONTACTS: '/api/market/contacts',
    FIND_WALLET_BY_KEYSTORE: '/user/findstoreKeyByWallert/',
    FIND_WALLET_BY_PRIVATE: '/user/findPrivatyKeyByWallert',
    BIND_EMAIL_PHONE: '/user/bindEmailOrTelephone',
    MARKET_WALLET: '/api/market/eos/wallert_',
    SEARCH_PEOPLE: '/api/market/eos/searchPeoplewallert_',
    SEARCH_WALLET: '/api/market/eos/searchwallert_',
    SAVE_REMIND: 'kpl/wallert/remind/save',
    DELETE_REMIND: 'kpl/wallert/remind/delete',
    SELECT_ALL: 'kpl/wallert/remind/selectAll',
    REMIND_OR_NOT: 'kpl/wallert/remind/remindOrNot',
    ALARM_OR_NOT: '/kpl/wallert/remind/alarmOrNot',
    ALARM_OR_NOT_LIST: '/kpl/wallert/remind/alarmOrNotByList',
    VIP_OR_NOT: '/kpl/wallert/remind/vipOrNot',
    SELECT_MARKET: 'kpl/wallert/remind/selectExceptMarket',
    WARNING_1H: 'kpl/wallert/push/bigWarning1h',
    WARNING_15M: 'kpl/wallert/push/bigWarning15min',
    WARNING_1M: 'kpl/wallert/push/bigWarning1min',
    SELECT_HISTORY: 'kpl/wallert/remind/selectAllHistory',
    GET_SELECTSYMBOL: '/kpl/wallert/remind/selectSymbol',
    SYMBOL_SEARCH: '/kpl/wallert/remind/search',
    GET_SEARCH: '/kpl/wallert/search',
    GET_FLUCTUATE: '/kpl/wallert/http/selectmoreshort',
    POST_GITHUBDATA: '/api/chaobi/deal/github/getall',
    POST_GITHUB_SEARCH: '/api/chaobi/deal/github/search',
    POST_DETAILS: '/api/chaobi/deal/github/detail',
    POST_CASH_DATA: '/api/chaobi/deal/ethereum/getall',
    POST_CASH_SEARCH: '/api/chaobi/deal/ethereum/getall/search',
    POST_CASH_DETAIL: '/api/chaobi/deal/ethereum/getall/detail',
    GET_GOODS: '/api/chaobi/deal/goods/all',
    GET_PAYURL: '/api/chaobi/deal/kpl/aibei/ipay/h5orPCpayOrder',
    CHECK_UPDATE: '/api/chaobi/deal/market/version',
    GET_USER_INFO: '/chaobi/vip',
    CHECK_VIP: '/chaobi/vip/selectone',
    GET_WALLET_RECORD: '/chaobi/incomerecord/selectrecord',
    GET_WALLET_BALANCE: '/chaobi/account/selectacc',
    GET_APPRENTICE_RECORD: '/chaobi/viprecord/selectrecord',
    GET_USER_ACCOUNT: '/chaobi/viprecord/selectrecord',
    REGISTER_VIP: '/chaobi/vip/registervip',
    CREATE_INVITECODE: '/chaobi/invitation/add',
    SET_INVITECODE: '/chaobi/vip/addfid',
    GET_INVITECODE: '/chaobi/vip/yaoqingma',
    GET_MY_RANK: '/chaobi/viprecord/selectrankbyphone',
    GET_ALL_RANK: '/chaobi/viprecord/selectrank',
    CHECK_USER_PROFIT: '/api/chaobi/deal/plain/shareMoney',
    APPLY_ROLLOUT: '/chaobi/withdraw/apply',
    GET_ROLLOUT_DETAIN: '/chaobi/withdraw/selectdetail',
    CHECK_LOGIN_STATUS: '/chaobi/vip/queryticket',
    GET_KLINE_DATA: '/noteskpl/cachek',
    GET_DEPTH_DATA: '/noteskpl/cacheDepth',
    //交易页面接口
    POST_AllId:"/api/chaobi/deal/plain/selectAllOrderIds",//获取所有历史成交id
    POST_AGINId:"/api/chaobi/deal/huobi/ordersDetail/dfdsafadf",//根据订单id查找订单详情（火币）
    POST_AGINIdBA:"/api/chaobi/deal/binance/ordersDetail/dfdsafadf",//根据订单id查找订单详情（币安）
    POST_AGINIdokex:"/api/chaobi/deal/okex/ordersDetail/dfdsafadf",//根据订单id查找订单详情（okex）
    POST_AGINIdzb:"/api/chaobi/deal/zb/ordersDetail/dfdsafadf",//根据订单id查找订单详情（zb）
    selectAll:"/api/chaobi/deal/plain/selectAll",//查询历史未成交记录
    deleteByPrimaryKey:"/api/chaobi/deal/plain/deleteByPrimaryKey",//撤销数据库记录
    stoptaoli:"/api/chaobi/deal/plainissto",//停止套利
    selectAll:"/api/chaobi/deal/plain/selectAll",
    insert:"/api/chaobi/deal/plain/insert",//三大交易接口
    selectAllHistory:"/api/chaobi/deal/plain/selectAllHistory",//查找数据库历史下单记录
    OKEX_DEPTH_DATA:'/api/chaobi/deal/oken/depth/4122162120983352',//获取okex深度如数据
    OKEX_TICKER_DATA:'/api/chaobi/deal/oken/ticker/4122162120983352',//获取okex最新一笔交易记录
    huobisouquan:""
}

const stringify = (params) => {
    if ('object' !== typeof params) {
        return ''
    }
    let string = ''
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            string += '&' + key + '=' + params[key]
        }
    }
    return string.substr(1)
}
//获取okex最新一笔买单数据
const OKEX_TICKER_DATA=params=>{
    return axios.post(`${laozhang + request.OKEX_TICKER_DATA}`, stringify(params))
}
//获取okex深度如数据
const OKEX_DEPTH_DATA=params=>{
    return axios.post(`${laozhang + request.OKEX_DEPTH_DATA}`, stringify(params))
}
//查看历史记录订单ID
const selectAllOrderId= params => {
    return axios.post(`${laozhang + request.POST_AllId}`, stringify(params))
}
//查看历史数据库下单数据
const selectAllHistory= params => {
    return axios.post(`${laozhang + request.selectAllHistory}`, stringify(params))
}
//根据订单ID查详情（火币）
const selectinfoOrderId= params => {
    return axios.post(`${goodsurl + request.POST_AGINId}`, stringify(params))
}
//根据订单ID查详情（币安）
const selectinfoOrderIdBA= params => {
    return axios.post(`${goodsurl + request.POST_AGINIdBA}`, stringify(params))
}
//根据订单ID查详情（okex）
const selectinfoOrderIdoekx= params => {
    return axios.post(`${goodsurl + request.POST_AGINIdokex}`, stringify(params))
}
//根据订单ID查详情（zb）
const selectinfoOrderIdzb= params => {
    return axios.post(`${goodsurl + request.POST_AGINIdzb}`, stringify(params))
}
//查询历史未成交
const selectAll1= params => {
    return axios.post(`${goodsurl + request.selectAll}`, stringify(params))
}
//撤销数据库订单
const deleteByPrimaryKey= params => {
    return axios.post(`${goodsurl + request.deleteByPrimaryKey}`, stringify(params))
}
//停止套利
const stoptaoli= params => {
    return axios.post(`${goodsurl + request.stoptaoli}`, stringify(params))
}
const selectAll= params => {
    return axios.post(`${goodsurl + request.selectAll}`, stringify(params))
}
// 三大交易
const insert= params => {
    return axios.post(`${goodsurl + request.insert}`, stringify(params))
}
//检查版本号
const check_app_version = params => {
    return axios.post(`${laozhang + request.CHECK_UPDATE}`, stringify(params))
}
//搜索
const search = (param) => {
    return axios.get(`${server + request.GET_SEARCH}`, {
        params: param
    })
}

//github榜单
const github_data = (param) => {
    return axios.post(`${laozhang + request.POST_GITHUBDATA}`, param)
}

//github搜索
const github_search = (param) => {
    return axios.post(`${laozhang + request.POST_GITHUB_SEARCH}`, param)
}

//github详情
const github_details = (param) => {
    return axios.post(`${laozhang + request.POST_DETAILS}`, param)
}

//持币
const cash_getData = (param) => {
    return axios.post(`${laozhang + request.POST_CASH_DATA}`, param)
}

//持币
const cash_getDetailData = (param) => {
    return axios.post(`${laozhang + request.POST_CASH_DETAIL}`, param)
}

//持币搜索
const cash_searchData = (param) => {
    return axios.post(`${laozhang + request.POST_CASH_SEARCH}`, param)
}

//查看对比平台
const select_market = (param) => {
    return axios.get(request.SELECT_MARKET, {
        params: param
    })
}

//查看短线波动
const select_fluctuate = (param) => {
    return axios.get(request.GET_FLUCTUATE, {
        params: param
    })
}

//交易所所有键值对
const select_getsymbol = (param) => {
    return axios.get(request.GET_SELECTSYMBOL, {
        params: param
    })
}

//搜索键值对
const select_symbol = (param) => {
    return axios.get(request.SYMBOL_SEARCH, {
        params: param
    })
}

//大单买卖1分钟均量
const wanning_1m = (param) => {
    return axios.post(request.WARNING_1M, param)
}

//大单买卖15分钟均量
const wanning_15m = (param) => {
    return axios.post(request.WARNING_15M, param)
}

//大单买卖1小时均量
const wanning_1h = (param) => {
    return axios.post(request.WARNING_1H, param)
}


//保存提醒
const save_remind = (param) => {
    return axios.post(request.SAVE_REMIND, param)
}

//删除提醒
const delete_remind = (param) => {
    return axios.delete(request.DELETE_REMIND, {
        params: param
    })
}

//查看所有提醒
const select_all = (param) => {
    return axios.get(request.SELECT_ALL, {
        params: param
    })
}

//查看历史提醒
const select_search = (param) => {
    return axios.get(request.SELECT_HISTORY, {
        params: param
    })
}

//是否提醒
const remind_or_not = (param) => {
    return axios.post(request.REMIND_OR_NOT, param)
}
//是否开启闹钟提醒
const alarm_or_not = (param) => {
    return axios.post(request.ALARM_OR_NOT, stringify(param))
}
//批量开启或关闭闹钟提醒
const alarm_or_not_list = (param) => {
    return axios.post(request.ALARM_OR_NOT_LIST, stringify(param))
}
//是否开启VIP提醒
const vip_or_not = (param) => {
    return axios.post(request.VIP_OR_NOT, stringify(param))
}
// 用户注册
const register = (params) => {
    return axios.post(`${server + request.REGISTER}`, stringify(params))
}

// 用户登录
const login = (params) => {
    // return axios.post('http://120.79.0.99/KplLoans_Iteration/user/logins', stringify(params), { timeout: 5000 })
    return axios.post(`${aboutServer + request.LOGIN}`, stringify(params), {
        timeout: 5000
    })
}

// 检查用户是否合法
const check_user_legality = (params) => {
    return axios.get(`${server + request.CHECK_USER_LEGALITY}/${params.param}/${params.type}`)
}

// 根据密码生成钱包
const create_wallet = (params, ticket) => {
    return axios.post(`${server + request.CREATE_WALLET}/${ticket}`, stringify(params))
}

// 根据助记词找回钱包
const find_wallet = (params) => {
    return axios.post(`${server + request.FIND_WALLET}/${params.ticket}`, stringify(params))
}

// 根据keystore找回钱包
const find_wallet_by_keystore = (params) => {
    return axios.post(`${server + request.FIND_WALLET_BY_KEYSTORE}/${params.ticket}`, stringify(params))
}

// 根据私钥找回钱包
const find_wallet_by_private = (params) => {
    return axios.post(`${server + request.FIND_WALLET_BY_PRIVATE}/${params.ticket}`, stringify(params))
}

// 以太坊各以太币种行情
const markets = () => {
    return axios.post(`${server + request.MARKETS}`, {})
}

// 根据ticket返回用户拥有的币种
const check_user_coin_type = (params) => {
    return axios.post(`${server + request.CHECK_USER_COIN_TYPE}/${params.ticket}`)
}

// 发送验证码
const send_sms = (params) => {
    return axios.post(`${ aboutServer + request.SEND_SMS}`, stringify(params))
}

// 添加资产
const add_market = (params) => {
    return axios.get(`${server + request.ADD_MARKET}/${params.number}/${params.ticket}`)
}

// 删除资产
const delete_market = (params) => {
    return axios.get(`${server + request.DELETE_MARKET}/${params.number}/${params.ticket}`)
}

// 查询用户对象
const query_user = (params) => {
    return axios.get(`${server + request.QUERY_USER}/${params.ticket}`)
}

// 找回密码 | 修改登录密码
const find_password = (params) => {
    return axios.post(`${server + request.FIND_LOGIN_PASSWORD}`, stringify(params))
}

// 增加交易记录
const set_transaction_record = (params) => {
    let ticket = params.ticket
    delete params.ticket
    return axios.post(`${server + request.SET_TRANSACTION_RECORD}/${ticket}`, stringify(params))
}

// 获取交易记录
const get_transaction_record = (params) => {
    let ticket = params.ticket
    delete params.ticket
    return axios.post(`${server + request.GET_TRANSACTION_RECORD}/${ticket}`, stringify(params))
}

// 修改钱包密码 {
const modify_wallert_password = (params) => {
    return axios.post(`${server + request.MODIFY_WALLERT_PASSWORD}/${params.ticket}`, stringify(params))
}

// 备份联系人
const save_contacts = (params) => {
    return axios.post(`${server + request.SAVE_CONTACTS}/${params.ticket}`, stringify(params))
}

// 取回联系人
const get_contacts = (params) => {
    return axios.post(`${server + request.GET_CONTACTS}/${params.ticket}`)
}

// 绑定手机
const bing_phone = (params) => {
    return axios.post(`${server + request.BIND_EMAIL_PHONE}/${params.param}/2/${params.ticket}`)
}

// 绑定邮箱
const bing_email = (params) => {
    return axios.post(`${server + request.BIND_EMAIL_PHONE}/${params.param}/3/${params.ticket}`)
}

// 查询行情
const get_market = (params) => {
    return axios.post(`${server_online + request.MARKET_WALLET}`, stringify(params))
}

// 大家都正在搜
const search_people = (params) => {
    return axios.get(`${server_online + request.SEARCH_PEOPLE}`)
}

// 搜索行情
const search_wallet = (params) => {
    return axios.post(`${server_online + request.SEARCH_WALLET}`, stringify(params))
}

const check_login = (params) => {
    return axios.get(`${server + request.QUERY_USER}/${params.ticket}`)

    //  return axios.get(`http://120.79.0.99/KplLoans_Iteration/user/${params.ticket}`)
    // return axios.get(`${server + request.QUERY_USER}/${params.ticket}`)
    //  return axios.get(`http://120.79.0.99/KplLoans_Iteration/user/${params.ticket}`)
}
//获取商品列表
const get_goods = (params) => {
    return axios.get(`${goodsurl + request.GET_GOODS}`)
}
//获取支付地址
const get_payurl = (params) => {
    return axios.post(`${laozhang + request.GET_PAYURL}`, stringify(params))
}
//获取用户信息
const getUserInfo = (params) => {
    return axios.get(`${aboutServer + request.GET_USER_INFO}/${params.ticket}`, {
        params: params
    })
}
//检查用户是否是会员
const checkVip = (params) => {
    return axios.post(`${aboutServer + request.CHECK_VIP}`, stringify(params))
}
//查询钱包记录
const get_wallet_record = (params) => {
    return axios.get(`${aboutServer + request.GET_WALLET_RECORD}?uid=${params.uid}`)
}
//查询徒弟记录
const get_apprentice_record = (params) => {
    return axios.get(`${aboutServer + request.GET_APPRENTICE_RECORD}?fid=${params.fid}`)
}
//获取用户余额
const get_user_account = (params) => {
    return axios.get(`${aboutServer + request.GET_USER_ACCOUNT}/${params.uid}`)
}
//开通vip
const register_vip = (params) => {
    return axios.post(`${aboutServer + request.REGISTER_VIP}`, stringify(params))
}
//生成邀请码
const create_invitecode = (params) => {
    return axios.post(`${aboutServer + request.CREATE_INVITECODE}`, stringify(params))
}
//填写邀请码
const set_inviteCode = (params) => {
    return axios.post(`${aboutServer + request.SET_INVITECODE}`, stringify(params))
}
//获取钱包余额
const get_wallet_balance = (params) => {
    return axios.get(`${aboutServer + request.GET_WALLET_BALANCE}?uid=${params.uid}`)
}
//获取我的邀请码
const get_inviteCode = (params) => {
    return axios.get(`${aboutServer + request.GET_INVITECODE}?uid=${params.uid}`)
}
//获取我的排名
const get_my_rank = (params) => {
    return axios.get(`${aboutServer + request.GET_MY_RANK}?fphone=${params.fphone}`)
}
//获取总的排名
const get_all_rank = (params) => {
    return axios.get(`${aboutServer + request.GET_ALL_RANK}`)
}
//检查用户资产
const check_user_profit = (params) => {
    return axios.post(`${laozhang + request.CHECK_USER_PROFIT}`, stringify(params))
}
//申请提现
const apply_rollout = (params) => {
    return axios.post(`${aboutServer + request.APPLY_ROLLOUT}`, stringify(params))
}
//获取提现详情
const get_rollout_detain = (params) => {
    return axios.get(`${aboutServer + request.GET_ROLLOUT_DETAIN}?id=${params.id}`)
}
//检查登录状态
const check_login_status = (params) => {
    return axios.get(`${aboutServer + request.CHECK_LOGIN_STATUS}?ticket=${params.ticket}`)
}
//获取K线数据
const getKLineData = (params) => {
    return axios.get(`${kLineServer + request.GET_KLINE_DATA}/${params.type}/${params.symbol}/${params.time}/${params.size}`)
}
//获取深度数据
const getDepthData = (params) => {
    return axios.get(`${kLineServer + request.GET_DEPTH_DATA}/${params.type}/${params.symbol}`)
}
export default {
    register,
    login,
    check_user_legality,
    create_wallet,
    find_wallet,
    markets,
    check_user_coin_type,
    send_sms,
    add_market,
    delete_market,
    query_user,
    find_password,
    set_transaction_record,
    get_transaction_record,
    modify_wallert_password,
    find_wallet_by_keystore,
    find_wallet_by_private,
    save_contacts,
    get_contacts,
    bing_phone,
    bing_email,
    get_market,
    search_people,
    search_wallet,
    check_login,
    save_remind,
    delete_remind,
    select_all,
    remind_or_not,
    alarm_or_not,
    alarm_or_not_list,
    vip_or_not,
    select_market,
    wanning_1m,
    wanning_15m,
    wanning_1h,
    search,
    select_fluctuate,
    github_data,
    github_details,
    github_search,
    cash_getData,
    cash_getDetailData,
    select_search,
    cash_searchData,
    select_getsymbol,
    select_symbol,
    get_goods,
    get_payurl,
    check_app_version,
    getUserInfo,
    check_login_status,
    checkVip,
    get_wallet_record,
    get_apprentice_record,
    get_user_account,
    register_vip,
    create_invitecode,
    set_inviteCode,
    get_wallet_balance,
    get_inviteCode,
    get_my_rank,
    get_all_rank,
    check_user_profit,
    apply_rollout,
    get_rollout_detain,
    selectAllOrderId,
    selectinfoOrderId,
    selectinfoOrderIdBA,
    selectinfoOrderIdoekx,
    selectinfoOrderIdzb,
    selectAll1,
    deleteByPrimaryKey,
    stoptaoli,
    selectAll,
    insert,
    selectAllHistory,
    getKLineData,
    getDepthData,
    OKEX_DEPTH_DATA,
    OKEX_TICKER_DATA
}