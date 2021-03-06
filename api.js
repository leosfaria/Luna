var config = require('./config')

const unirest = require('unirest')
const ENDPOINT_API = 'https://api.bitvalor.com/v1/'

const mock_BitcoinFirstValue = 21000
var mock_BitcoinCurrent = mock_BitcoinFirstValue
var mock_Counter = 0
var mock_flip = 1
var mock_BitcoinFlowPercent

var BitcoinValor = function () {
}

BitcoinValor.prototype = {

    ticker: function (success) {
        this.call('ticker', success);
    },

    orderBook: function (success) {
        this.call('order_book', success);
    },

    call: function (method, success) {
        var endpoint = ENDPOINT_API + method + '.json'

        unirest.get(endpoint)
            .headers('Accept', 'application/json')
            .end(function (response) {
                try{
                    success(JSON.parse(response.raw_body));
                }
                catch(ex){ console.log(ex)}
        });
    },

    mock: function(success, action, bitcoinFlowPercent) {
        if (mock_Counter > 0) {
            switch(action) {
                case 'UP':
                    mock_BitcoinCurrent = mock_BitcoinCurrent + ( mock_BitcoinCurrent * mock_BitcoinFlowPercent )
                    break;
                case 'DOWN':
                    mock_BitcoinCurrent = mock_BitcoinCurrent - ( mock_BitcoinCurrent * mock_BitcoinFlowPercent )
                    if(value <= 0) value = 0
                    break;
                case 'STAIRS_SMALL':
                    if (mock_Counter % 5 > 0 && mock_flip > 0) {
                        mock_BitcoinCurrent = mock_BitcoinCurrent + ( mock_BitcoinCurrent * mock_BitcoinFlowPercent )    
                    }

                    if (mock_Counter % 5 > 0 && mock_flip < 0) {
                        mock_BitcoinCurrent = mock_BitcoinCurrent - ( mock_BitcoinCurrent * mock_BitcoinFlowPercent )    
                    }

                    if (mock_Counter % 5 == 0) mock_flip = mock_flip * -1

                    break;
                case 'STAIRS_BIG':
                    if (mock_Counter % 10 > 0 && mock_flip > 0) {
                        mock_BitcoinCurrent = mock_BitcoinCurrent + ( mock_BitcoinCurrent * mock_BitcoinFlowPercent )    
                    }

                    if (mock_Counter % 10 > 0 && mock_flip < 0) {
                        mock_BitcoinCurrent = mock_BitcoinCurrent - ( mock_BitcoinCurrent * mock_BitcoinFlowPercent )    
                    }

                    if (mock_Counter % 10 == 0) mock_flip = mock_flip * -1

                    break;
                case 'UP_AND_STAY':
                    if(mock_Counter < 4) {
                        mock_BitcoinCurrent = mock_BitcoinCurrent + ( mock_BitcoinCurrent * mock_BitcoinFlowPercent )    
                    }
                    break;
                default:
                    mock_BitcoinCurrent = mock_BitcoinCurrent + ( 1 * (mock_Counter % 2) )  
                    break;
            }
        } else {
            mock_BitcoinFlowPercent = bitcoinFlowPercent ? bitcoinFlowPercent : Math.random()
        }

        mock_Counter++

        success(JSON.parse('{"ticker_1h": {"exchanges": {"FOX": {"last": ' + mock_BitcoinCurrent + '}}}}')) 
    }
}

var BlinkTradeRest = require("blinktrade").BlinkTradeRest;
var BlinkTrade = new BlinkTradeRest({
    prod: true,
    key: config.foxbit.key,
    secret: config.foxbit.secret,
    currency: "BRL",
    "MsgType": "U2",
    "BalanceReqID": 1
});

// WebSocket Transport
//var BlinkTradeWS = require("blinktrade").BlinkTradeWS;
//var blinktrade = new BlinkTradeWS({ prod: false });

var BitcoinTrade = function () {
}

BitcoinTrade.prototype = {

    tricker: function (success) {
        BlinkTrade.ticker().then(function(ticker) {
            console.log(ticker)
            success(ticker)
        });
    },

    orderBook: function (success) {
        BlinkTrade.orderbook().then(function(orderbook) {
            console.log(orderbook);
            success(orderbook)
        });  
    },

    myBalance: function (success) {
        BlinkTrade.balance().then(function(balance) {
            console.log(balance);
        });   
    },

    mock: function(success, action, bitcoinFlowPercent) {
    }
}

module.exports = {BitcoinValor, BitcoinTrade}
