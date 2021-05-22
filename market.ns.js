//Requires access to the TIX API and the 4S Mkt Data API

let fracL = 0.1; //Fraction of assets to keep as cash in hand
let fracH = 0.2;
let commission = 100000; //Buy or sell commission
let numCycles = 2; //Each cycle is 5 seconds

function refresh(ns, stocks, myStocks) {
    let corpus = ns.getServerMoneyAvailable("home");
    myStocks.length = 0;
    for (let i = 0; i < stocks.length; i++) {
        let sym = stocks[i].sym;
        stocks[i].price = ns.getStockPrice(sym);
        stocks[i].shares = ns.getStockPosition(sym)[0];
        stocks[i].buyPrice = ns.getStockPosition(sym)[1];
        stocks[i].vol = ns.getStockVolatility(sym);
        stocks[i].prob = 2 * (ns.getStockForecast(sym) - 0.5);
        stocks[i].maxShares = ns.getStockMaxShares(sym);
        stocks[i].expRet = stocks[i].vol * stocks[i].prob / 2;
        corpus += stocks[i].price * stocks[i].shares;
        if (stocks[i].shares > 0) myStocks.push(stocks[i]);
    }
    stocks.sort(function(a, b) { return b.expRet - a.expRet; });
    return corpus;
}

function buy(ns, stock, numShares) {
    var status = ns.buyStock(stock.sym, numShares);
    ns.print(`Status ${status}`);
    ns.print(`Bought ${stock.sym} for ${format(numShares * stock.price)}`);
}

function sell(ns, stock, numShares) {
    let profit = numShares * (stock.price - stock.buyPrice) - 2 * commission;
    ns.print(`Sold ${stock.sym} for profit of ${format(profit)}`);
    var status = ns.sellStock(stock.sym, numShares);
    ns.print(`Status ${status}`);
}

function format(num) {
    let symbols = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
    let i = 0;
    for (;
        (num >= 1000) && (i < symbols.length); i++) num /= 1000;

    return ((Math.sgn(num) < 0) ? "-$" : "$") + num.toFixed(3) + symbols[i];
}


export async function main(ns) {
    //Initialise
    ns.disableLog("ALL");
    let stocks = [];
    let myStocks = [];
    let corpus = 0;
    let stockCount = 1;
    ns.purchase4SMarketData();
    ns.purchase4SMarketDataTixApi();
    for (let i = 0; i < ns.getStockSymbols().length; i++)
        stocks.push({ sym: ns.getStockSymbols()[i] });

    while (true) {
        corpus = refresh(ns, stocks, myStocks);

        //Sell underperforming shares
        for (let i = 0; i < myStocks.length; i++) {
            if (stocks[Math.min(stockCount + 5, stocks.length - 1)].expRet > myStocks[i].expRet || myStocks[i].expRet < 0) {
                sell(ns, myStocks[i], myStocks[i].shares);
                corpus -= commission;
            }
        }
        //Sell shares if not enough cash in hand
        for (let i = 0; i < myStocks.length; i++) {
            if (ns.getServerMoneyAvailable("home") < (fracL * corpus)) {
                let cashNeeded = (corpus * fracH - ns.getServerMoneyAvailable("home") + commission);
                let numShares = Math.floor(cashNeeded / myStocks[i].price);
                sell(ns, myStocks[i], numShares);
                corpus -= commission;
            }
        }

        //Buy shares with cash remaining in hand
        for (let i = 0; i < Math.min(stocks.length, stockCount); i++) {
            let cashToSpend = ns.getServerMoneyAvailable("home") - (fracH * corpus);
            let numShares = Math.floor((cashToSpend - commission) / stocks[i].price);
            numShares = Math.min(numShares, stocks[i].maxShares - stocks[i].shares);
            if ((numShares * stocks[i].expRet * stocks[i].price * numCycles) > commission)
                buy(ns, stocks[i], numShares);
            if (stocks[i].maxShares - stocks[i].shares < 1)
                stockCount++;
        }
        await ns.sleep(5 * 1000 * numCycles + 200);
    }
}