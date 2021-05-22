var ns;
var attackScript;
var target;
var MAXRAM;
var VERSION = "1.09";

export async function main(nets) {
    //let ram = 32;
    //

    ns = nets;
    MAXRAM = ns.getPurchasedServerMaxRam();

    attackScript = ns.args[1];
    ns.disableLog("getServerMoneyAvailable");
    if (!attackScript) {
        ns.tprint("Need attack script");
        ns.exit();
    }
    target = ns.args[0];
    if (!target) {
        ns.tprint("Need target");
        ns.exit();
    }

    breach(target);


    await buyServers();

    ns.getPurchasedServers().forEach((server) => {
        let ram = ns.getServerMaxRam(server);
        if (ram < MAXRAM) {
            ns.killall(server);
            ns.deleteServer(server);

        }
    });

    await buyServers();

}

async function buyServers() {

    while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
        var cost = ns.getPurchasedServerCost(MAXRAM);
        if ((ns.getServerMoneyAvailable("home") * 0.95) < cost) {
            await ns.sleep(10000);
            continue;
        }

        let hostname = ns.purchaseServer("pserv-" + ns.getPurchasedServers().length, MAXRAM);
        ns.scp(attackScript, hostname);
        ns.exec(attackScript, hostname, getThreads(), VERSION, target);
    }

}

function getThreads() {

    //log(serverRamData);
    let freeRam = MAXRAM;
    //log(freeRam);
    let attackScriptRam = ns.getScriptRam(attackScript);
    if (attackScriptRam <= 0) {
        log("Alert: attack script RAM is less than 0");
        return 0;
    }
    //log(attackScriptRam);
    let threads = Math.floor(freeRam / attackScriptRam);
    //log("threads: " + threads);
    return threads;
}

function breach(target) {
    if (!ns.hasRootAccess(target)) {
        // If we have the BruteSSH.exe program, use it to open the SSH Port
        // on the target server
        if (ns.fileExists("BruteSSH.exe", "home")) {
            ns.brutessh(target);
        }

        if (ns.fileExists("FTPCrack.exe", "home")) {
            ns.ftpcrack(target);
        }
        if (ns.fileExists("relaySMTP.exe", "home")) {
            ns.relaysmtp(target);
        }
        if (ns.fileExists("HTTPWorm.exe", "home")) {
            ns.httpworm(target);
        }
        if (ns.fileExists("SQLInject.exe", "home")) {
            ns.sqlinject(target);
        }
        //log("nuking");
        // Get root access to target server
        ns.nuke(target);

        //log("Root access available");
    }
}