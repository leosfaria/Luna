const unirest = require('unirest')
const ENDPOINT_API = 'https://api.bitvalor.com/v1/'

const mock_BitcoinFirstValue = 21000
var mock_BitcoinCurrent = mock_BitcoinFirstValue
var mock_Counter = 0
var mock_flip = 1

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

    mock: function(success, action) {
        if (mock_Counter > 0) {
            switch(action) {
                case 'UP':
                    mock_BitcoinCurrent = mock_BitcoinCurrent + ( mock_BitcoinCurrent * 0.2 )
                    break;
                case 'DOWN':
                    mock_BitcoinCurrent = mock_BitcoinCurrent - ( mock_BitcoinCurrent * 0.2 )
                    if(value <= 0) value = 0
                    break;
                case 'STAIRS':
                    if (mock_Counter % 5 > 0 && mock_flip > 0) {
                        mock_BitcoinCurrent = mock_BitcoinCurrent + ( mock_BitcoinCurrent * 0.2 )    
                    }

                    if (mock_Counter % 5 > 0 && mock_flip < 0) {
                        mock_BitcoinCurrent = mock_BitcoinCurrent - ( mock_BitcoinCurrent * 0.2 )    
                    }

                    if (mock_Counter % 5 == 0) mock_flip = -1

                    break;
                case 'UP_AND_STAY':
                    if(mock_Counter < 4) {
                        mock_BitcoinCurrent = mock_BitcoinCurrent + ( mock_BitcoinCurrent * 0.2 )    
                    }
                    break;
                default:
                    mock_BitcoinCurrent = mock_BitcoinCurrent + ( 1 * (mock_Counter % 2) )  
                    break;
            }
        }

        mock_Counter++

        success(JSON.parse('{"ticker_1h": {"exchanges": {"FOX": {"last": ' + mock_BitcoinCurrent + '}}}}')) 
    }
}

module.exports = {BitcoinValor}