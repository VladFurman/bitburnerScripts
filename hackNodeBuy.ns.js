let ns;
let hn;
let count;
let minMoney = 100000;
let moneyRatio = 0.4;
let maxLevel = 200;
let maxRam = 64;
let maxCore = 16;

export async function main(nets) {
    ns = nets;
    hn = ns.hacknet;

    //ns.disableLog("getServerMoneyAvailable");
    //ns.disableLog("sleep");

    count = hn.numNodes();

    maxNodes();
    primaryLoop();
}


async function primaryLoop() {
    while (true) {
        count = hn.numNodes();
        var primaryNode = hn.getNodeStats(0);
        curLevel = primaryNode.level;
        curRam = primaryNode.ram;
        curCores = primaryNode.cores;

        equalizeNodes();
        await ns.sleep(100000);
    }
}


function maxNodes() {
    var i;
    for (i = 0; i < count; i++) {
        maxNode(i);
    }
}

async function maxNode(i) {
    log("maxing node: " + i);
    var nodeInfo = hn.getNodeStats(i);

    while (hn.getNodeStats(i).level < maxLevel) {
        upgradeLevel(i);
        await ns.sleep(10000);
    }
    while (hn.getNodeStats(i).ram < maxRam) {
        upgradeRam(i);
        await ns.sleep(10000);
    }
    while (hn.getNodeStats(i).cores < maxCore) {
        upgradeCore(i);
        await ns.sleep(10000);
    }

}

async function upgradeLevel(i) {
    if (hn.getLevelUpgradeCost(i) > (myMoney() * moneyRatio)) {
        log("Out of money at level: " + myMoney());
        log(hn.getLevelUpgradeCost(i));
        await ns.sleep(10000);
        return;
    }
    hn.upgradeLevel(i, 1);

    log("Upgrade level of " + i);
}

async function upgradeRam(i) {
    if (hn.getRamUpgradeCost(i) > (myMoney() * moneyRatio)) {
        log("Out of money at ram: " + myMoney());
        log(hn.getRamUpgradeCost(i));
        await ns.sleep(10000);
        return;
    }
    hn.upgradeRam(i, 1);

    log("Upgrade ram of " + i);
}

async function upgradeCore(i) {
    if (hn.getCoreUpgradeCost(i) > (myMoney() * moneyRatio)) {
        log("Out of money at core: " + myMoney());
        log(hn.getCoreUpgradeCost(i));
        await ns.sleep(10000);
        return;
    }
    hn.upgradeCore(i, 1);
    log("Upgrade core of " + i);
}

function calculateOptimalUpgrade(i) {
    var nodeInfo = hn.getNodeStats(i);
    var nodeLevel = nodeInfo.level;
    var nodeRam = nodeInfo.ram;
    var nodeCores = nodeInfo.cores;

    var levelC = hn.getLevelUpgradeCost(i);
    var ramC = hn.getRamUpgradeCost(i);
    var coreC = hn.getCoreUpgradeCost(i);

    var levelUp = calculateEarnings(nodeLevel + 1, nodeRam, nodeCores) / hn.getLevelUpgradeCost(i);
    var ramUp = calculateEarnings(nodeLevel, nodeRam * 2, nodeCores) / hn.getRamUpgradeCost(i);
    var coresUp = calculateEarnings(nodeLevel, nodeRam, nodeCores + 1) / hn.getCoreUpgradeCost(i);

    if (levelC) { levelUp = 0; }
    if (isNan(ramUp)) { ramUp = 0; }
    if (isNan(coresUp)) { coresUp = 0; }
    log("levelUp: " + levelUp);
    log("ramUp: " + ramUp);
    log("coresUp: " + coresUp);

    if (levelUp >= ramUp && levelUp >= coresUp) {
        return "level";
    }
    if (ramUp >= coresUp)
        return "ram";
    return "core";

}

function calculateEarnings(level, ram, cores) {
    var HacknetNodeMoneyGainPerLevel = 1.6;
    // var hacknetNodeMoneyMult;
    //var hacknetNodeMoney;
    var moneyGainRatePerSecond =
        (level * HacknetNodeMoneyGainPerLevel) *
        Math.pow(1.035, ram - 1) *
        ((cores + 5) / 6);

}

async function myMoney() {
    var money = ns.getServerMoneyAvailable("home");
    if (money < minMoney) {
        log("Out of money: " + money);
        await ns.sleep(10000);

    }
    return ns.getServerMoneyAvailable("home");
}

function log(s) {
    ns.tprint(s);
    ns.print(s);
}