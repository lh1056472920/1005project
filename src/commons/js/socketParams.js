export default {
    '币安': {
        'url': 'ws://chaobis.lian2345.com:20003',
        '15分': {
            event: 'binance_symbols_k_15m',
            onEvent: 'binance_kline_15m'
        },
        '1小时': {
            event: 'binance_symbols_k_1h',
            onEvent: 'binance_kline_1h'
        },
        '4小时': {
            event: 'binance_symbols_k_4h',
            onEvent: 'binance_kline_4h'
        },
        '1天': {
            event: 'binance_symbols_k_1d',
            onEvent: 'binance_kline_1d'
        },
        '1分': {
            event: 'binance_symbols_k_1m',
            onEvent: 'binance_kline_1m'
        },
        '5分': {
            event: 'binance_symbols_k_5m',
            onEvent: 'binance_kline_5m'
        },
        '30分': {
            event: 'binance_symbols_k_30m',
            onEvent: 'binance_kline_30m'
        },
        '1周': {
            event: 'binance_symbols_k_1w',
            onEvent: 'binance_kline_1w'
        }
    },
    '火币': {
        'url': 'ws://chaobis.lian2345.com:20001',
        '15分': {
            event: 'huobiMarket',
            onEvent: 'huobi_5min'
        },
        '1小时': {
            event: 'huobiMarket',
            onEvent: 'huobi_60min'
        },
        '4小时': {/*无*/
            event: 'huobiMarket',
            onEvent: 'binance_kline_4h'
        },
        '1天': {
            event: 'huobiMarket',
            onEvent: 'huobi_1day'
        },
        '1分': {
            event: 'huobiMarket',
            onEvent: 'huobi_1min'
        },
        '5分': {
            event: 'huobiMarket',
            onEvent: 'huobi_5min'
        },
        '30分': {
            event: 'huobiMarket',
            onEvent: 'huobi_30min'
        },
        '1周': {
            event: 'huobiMarket',
            onEvent: 'huobi_1week'
        }
    },
    'Okex': {
        'url': 'ws://chaobis.lian2345.com:20002',
        '15分': {
            event: 'okexMarket',
            onEvent: 'okex_15min'
        },
        '1小时': {
            event: 'okexMarket',
            onEvent: 'okex_1hour'
        },
        '4小时': {
            event: 'okexMarket',
            onEvent: 'okex_4hour'
        },
        '1天': {
            event: 'okexMarket',
            onEvent: 'okex_day'
        },
        '1分': {
            event: 'okexMarket',
            onEvent: 'okex_1min'
        },
        '5分': {
            event: 'okexMarket',
            onEvent: 'okex_5min'
        },
        '30分': {
            event: 'okexMarket',
            onEvent: 'okex_30min'
        },
        '1周': {
            event: 'okexMarket',
            onEvent: 'okex_week'
        }
    },
    'ZB': {
        'url': 'ws://chaobis.lian2345.com:20002',
        '15分': {
            event: 'zbMarket',
            onEvent: 'zb_15min'
        },
        '1小时': {
            event: 'zbMarket',
            onEvent: 'zb_1hour'
        },
        '4小时': {
            event: 'zbMarket',
            onEvent: 'zb_4hour'
        },
        '1天': {
            event: 'zbMarket',
            onEvent: 'zb_1day'
        },
        '1分': {
            event: 'zbMarket',
            onEvent: 'zb_1min'
        },
        '5分': {
            event: 'zbMarket',
            onEvent: 'zb_5min'
        },
        '30分': {
            event: 'zbMarket',
            onEvent: 'zb_30min'
        },
        '1周': {
            event: 'zbMarket',
            onEvent: 'zb_1week'
        }
    }
};