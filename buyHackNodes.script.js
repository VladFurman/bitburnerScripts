var hn = hacknet;
var count;
var minMoney = 100000;
var moneyRatio = 0.9;
var maxLevel = 200;
var maxRam = 64;
var maxCore = 16;

main();

function main() {

    disableLog("getServerMoneyAvailable");
    disableLog("sleep");
    log("count: " + count);
    count = hn.numNodes();
    log("count: " + count);
    primaryLoop();
}


function primaryLoop() {
    while (true) {
        log("top of loop");
        count = hn.numNodes();

        for (i = 0; i < 10; i++) {
            upNodes();
        }
        purchaseNode();
    }
}

function upNodes() {
    var i;
    for (i = 0; i < count; i++) {
        if (hn.getNodeStats(i).level < maxLevel) {
            upgradeLevel(i);
        }
        if (hn.getNodeStats(i).level < maxLevel) {
            upgradeLevel(i);
        }
        if (hn.getNodeStats(i).level < maxLevel) {
            upgradeLevel(i);
        }
        if (hn.getNodeStats(i).level < maxLevel) {
            upgradeLevel(i);
        }
        if (hn.getNodeStats(i).level < maxLevel) {
            upgradeLevel(i);
        }
        if (hn.getNodeStats(i).level < maxLevel) {
            upgradeLevel(i);
        }
        if (hn.getNodeStats(i).ram < maxRam) {
            upgradeRam(i);
        }
        if (hn.getNodeStats(i).cores < maxCore) {
            upgradeCore(i);
        }
    }
}

function maxNodes() {
    var i;
    for (i = 0; i < count; i++) {
        maxNode(i);
    }
}

function maxNode(i) {
    log("maxing node: " + i);
    var nodeInfo = hn.getNodeStats(i);

    while (hn.getNodeStats(i).level < maxLevel) {
        upgradeLevel(i);
    }
    while (hn.getNodeStats(i).ram < maxRam) {
        upgradeRam(i);
    }
    while (hn.getNodeStats(i).cores < maxCore) {
        upgradeCore(i);
    }

}

function upgradeLevel(i) {
    if (hn.getLevelUpgradeCost(i) > (myMoney() * moneyRatio)) {
        log("Out of money at level: " + myMoney());
        log(hn.getLevelUpgradeCost(i));
        sleep(100000);
        return;
    }
    hn.upgradeLevel(i, 1);

    log("Upgrade level of " + i);
}

function upgradeRam(i) {
    if (hn.getRamUpgradeCost(i) > (myMoney() * moneyRatio)) {
        log("Out of money at ram: " + myMoney());
        log(hn.getRamUpgradeCost(i));
        sleep(100000);
        return;
    }
    hn.upgradeRam(i, 1);

    log("Upgrade ram of " + i);
}

function upgradeCore(i) {
    if (hn.getCoreUpgradeCost(i) > (myMoney() * moneyRatio)) {
        log("Out of money at core: " + myMoney());
        log(hn.getCoreUpgradeCost(i));
        sleep(100000);
        return;
    }
    hn.upgradeCore(i, 1);
    log("Upgrade core of " + i);
}


function myMoney() {
    var money = getServerMoneyAvailable("home");
    if (money < minMoney) {
        log("Out of money: " + money);
        sleep(100000);

    }
    return getServerMoneyAvailable("home");
}

function log(s) {
    //tprint(s);
    print(s);
}