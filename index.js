const CRAWLER_INTERVAL = 1000		//intervalo entre chamadas a api

const initValue = 200 //Valor em reais inicial de compra

const negotiationValue = 20
const controlValuePercent = 0.01
const controlRepetitionMax = 5

var controlRepetitionCounter = 0
var controlValue1, controlValue2, controlValue3
var transactions = [] //Array de todas as transações para teste
var valueRemaining = initValue

const BitcoinValor = require("./api.js").BitcoinValor
var infoApi = new BitcoinValor()

setInterval(() => 
   infoApi.mock((tick) => {
   	console.log("BitcoinValor: " + tick.ticker_1h.exchanges.FOX.last)
   	
   	var bitcoin = tick.ticker_1h.exchanges.FOX.last
   	
   	setControlValues(bitcoin)
   	
   	console.log("Control 1: " + controlValue1)
   	console.log("Control 2: " + controlValue2)
   	console.log("Control 3: " + controlValue3)
   	
   	var action = analyseNextAction();
   	
   	console.log("Investor said: " + action)

	trader(action, bitcoin)

	printStatus(bitcoin)
   }, 'STAIRS'),
   CRAWLER_INTERVAL
)

var printStatus = function(bitcoinValue) {
	var bitcoins = 0
	
	transactions.map((transaction) => { bitcoins += transaction.bitcoin })
	
	console.log("How we are going: valueRS - " + valueRemaining + ", valeBitcoin: " + bitcoins + ", TotalValue: " + (valueRemaining + (bitcoins * bitcoinValue)) ) 
}

var saveTransaction = function(action, bitcoinValue) {
	var transaction = {}
	transaction["action"] = action
	transaction["valueRS"] = negotiationValue
	transaction["bitcoin"] = negotiationValue / bitcoinValue

	transactions.push(transaction)
}

var trader = function(action, bitcoinValue) {

	if(action == "BUY") {
		if(valueRemaining <= 0) {
			console.log("Comprados todos os bitcoins possíveis")
			return
		}

		console.log("TODO: Comprar RS " + negotiationValue )
		valueRemaining -= negotiationValue 
		saveTransaction(action, bitcoinValue)		
	}

	if(action == "SELL") {
		if(transactions.length <= 0) {
			console.log("Vendidos todos os bitcoins possíveis")
			return
		}

		console.log("transactions before: " )
		transactions.map((transaction) => { console.log(transaction) })
		transactions = transactions.sort((a,b) => { (a.bitcoin > b.bitcoin) ? 1 : ( (a.bitcoin < b.bitcoin) ? -1 : 0) })
		console.log("transactions after: " )
		transactions.map((transaction) => { console.log(transaction) })
		
		console.log("TODO: Vender BS ")
		
	}

	if(action == "DO NOTHING") {
		console.log("Holding")
	}

	console.log("transaction: ")
	transactions.map((transaction) => { console.log(transaction) })
}

var analyseNextAction = function() {
	if(controlValue1 < controlValue2 && controlValue2 < controlValue3 && controlRepetitionCounter < controlRepetitionMax) {
		return "BUY"
	}

	if(controlValue1 > controlValue2 && controlValue2 > controlValue3 && controlRepetitionCounter < controlRepetitionMax) {
		return "SELL"
	}

	return "DO NOTHING"
}

var setControlValues = function(bitcoinValue) {
	if(controlValue1 == undefined) {
		controlValue1 = Number(bitcoinValue)
		controlValue2 = Number(bitcoinValue)
		controlValue3 = Number(bitcoinValue)
	}
		
	if(controlValue1 != undefined && hasChangedValue(bitcoinValue, controlValue3)) {
		controlValue1 = Number(controlValue2)
		controlValue2 = Number(controlValue3)
		controlValue3 = Number(bitcoinValue)

		controlRepetitionCounter = 0
	} else {
		controlRepetitionCounter++
	}
}

var hasChangedValue = function(bitcoinValue, controlValue) {
	return (bitcoinValue > controlValue + controlValue * controlValuePercent ||
			bitcoinValue < controlValue - controlValue * controlValuePercent)
}