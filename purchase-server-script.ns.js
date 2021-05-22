import { breach, getThreads } from "library.ns";

var VERSION = "1.07";

export async function main(ns) {
    var attackScript = ns.args[1];
    ns.disableLog("getServerMoneyAvailable");
    if (!attackScript) {
        printUsage(ns);
        ns.exit();
    }

    var target = ns.args[0];
    if (!target) {
        printUsage(ns);
        ns.exit();
    }
    breach(target, ns);
    var attackArgs = [VERSION];
    //var maxRam = ns.getPurchasedServerMaxRam();

    var ram = getBestServer(ns);
    ns.tprint("best ram: " + ram);
    var hostname = ns.purchaseServer("pserv-" + ns.getPurchasedServers().length, ram);
    ns.scp(attackScript, hostname);
    ns.exec(attackScript, hostname, getThreads(hostname, attackScript, ns), VERSION, target);
}

function getBestServer(ns) {
    let maxRam = ns.getPurchasedServerMaxRam();
    var i;
    for (i = 8; i < maxRam; i *= 2) {
        //tprint("Checking RAM: " + i);
        if ((ns.getServerMoneyAvailable("home") * 0.95) < ns.getPurchasedServerCost(i)) {
            return i / 2;
        }
    }

    return maxRam;
}

function printUsage(ns) {
    ns.tprint("Usage: purchase-server-script.ns [target] [attackScript]");
}