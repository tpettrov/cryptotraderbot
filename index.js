const bot = require('./app/traderBot');
const readline = require('readline');
const helpers = require('./app/helpers');
const options = require('./config/options');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Paste your API-key: ', (answer) => {
    const key = answer;
    console.log(`API-key saved.`);

    rl.question('Paste your API-secret: ', (answer) => {
        const secret = answer;
        console.log(`API-secret saved.`);
        rl.close();

        const traderBot = new bot(key, secret);
(async () => {
    console.log(await traderBot.api('AddOrder'));
})();

    });

});

/*const traderBot = new bot(key, secret);*/

async function getTickerLastTrade() {
    await traderBot.api('Ticker', {pair: 'usdtzusd'})
        .then((res) => console.log(res.USDTZUSD.c[0]))
        .catch((rej) => console.log(rej));
}

// gets any open orders

async function getOpenOrders() {
    await traderBot.api('OpenOrders')
        .then((res) => console.log(res))
        .catch((rej) => console.log(rej));
}

// returns true if any open order or false

async function haveOpenOrders() {

    await traderBot.api('OpenOrders')
        .then((res) => result = !helpers.isEmptyObject(res.open))
        .catch((rej) => console.log('Грешка!'));
    return result;
}

async function getBalance() {
    await traderBot.api('Balance')
        .then((res) => console.log(res.ZEUR))
        .catch((rej) => console.log(rej));
}

async function getAssetPairs() {
    await traderBot.api('AssetPairs')
        .then((res) => console.log(res))
        .catch((rej) => console.log(rej));
}

/*eb = equivalent balance (combined balance of all currencies)
tb = trade balance (combined balance of all equity currencies)
m = margin amount of open positions
n = unrealized net profit/loss of open positions
c = cost basis of open positions
v = current floating valuation of open positions
e = equity = trade balance + unrealized net profit/loss
mf = free margin = equity - initial margin (maximum margin available to open new positions)
ml = margin level = (equity / initial margin) * 100*/

async function getTradeBalance() {
    await traderBot.api('TradeBalance', {asset: 'ETH'})
        .then((res) => console.log(res))
        .catch((rej) => console.log(rej));
}

async function placeBuyOrder() {
    await traderBot.api('AddOrder',
        {
            pair: 'usdtzusd',
            type: 'buy',
            ordertype: 'limit',
            price: options.prices.buyPrice,
            volume: 100
        })
        .then((res) => console.log(res))
        .catch((rej) => console.log(rej));
}

async function placeSellOrder() {
    await traderBot.api('AddOrder',
        {
            pair: 'usdtzusd',
            type: 'sell',
            ordertype: 'limit',
            price: options.prices.sellPrice,
            volume: 100
        })
        .then((res) => console.log(res))
        .catch((rej) => console.log(rej));
}

// setInterval(getTickerLastTrade, 10000);

/*
placeSellOrder();*/
