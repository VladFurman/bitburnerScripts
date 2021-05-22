let ns;
let serverSet;
let newServers;
let FILENAME = "servers.txt";
let CASHFILENAME = "cash_servers.txt";
let MAXPORTS = 0;
let largestServer = "";
let largestCash = 0;

export async function main(nets) {
    ns = nets;
    log("hunting...");
    serverSet = new Set();
    serverSet.add("home");
    largestServer = "";
    largestCash = 0;
    MAXPORTS = portCount();
    newServers = new Set(ns.scan());
    while (newServers.size > 0) {
        for (let server of newServers) {
            addNewServers(server);
        }
    }

    serverSet.delete("home");

    var fileContents = "Best Cash/time: " + largestServer + " , " + largestCash.toPrecision(3) + '\n';
    var cashData = "";
    for (let server of serverSet) {
        fileContents += (server + '\n');
        let cash = ns.getServerMaxMoney(server) / ns.getHackTime(server);
        if (canHack(server)) { cashData += (server.padEnd(20, ' ') + cash.toPrecision(3) + '\n'); }
    }

    ns.write(FILENAME, fileContents, "w");
    ns.write(CASHFILENAME, cashData, "w");

    log(serverSet.size);
}

function addNewServers(server) {
    var scannedServers = new Set(ns.scan(server));
    for (let scannedServer of scannedServers) {
        if (serverSet.has(scannedServer)) continue;
        newServers.add(scannedServer);
    }
    var serverMoney = ns.getServerMaxMoney(server) / ns.getHackTime(server);
    if (canHack(server) && serverMoney > largestCash) {
        largestCash = serverMoney;
        largestServer = server;
    }
    serverSet.add(server);
    newServers.delete(server);
}

function canHack(server) {
    if (ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel()) { return false; }
    if (ns.getServerNumPortsRequired(server) > MAXPORTS) { return false; }

    return true;
}

function log(s) {
    //ns.tprint(s);
    ns.print(s);
}

function portCount() {
    var portCount = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
        portCount++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        portCount++;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
        portCount++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        portCount++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        portCount++;
    }

    return portCount;
}