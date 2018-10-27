import remote from './../../lib/js/remote.js'
//okex深度图数据
let okexdepth 
function Okexdepth(symbol){
     remote.OKEX_DEPTH_DATA({
        symbol:symbol
    }).then(res=>{
        okexdepth=JSON.parse(res.data.list)
    })
    return okexdepth
}
let okexticker
function Okextircker(symbol){
     remote.OKEX_TICKER_DATA({
        symbol:symbol
    }).then(res=>{
        okexticker=JSON.parse(res.data.list);
    })
    return okexticker
}

export {
    Okexdepth,
    Okextircker
}