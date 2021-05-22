export async function main(ns) {
    ns.run("autocontract.ns");
    ns.run("hunter.ns");
    await ns.sleep(100);
    ns.run("multivector.ns");
    breach("foodnstuff", ns);
    let threads = getThreads("home", ns) - 10;
    if (threads > 0)
        ns.run("foodnstuff-hack.ns", getThreads("home", ns) - 10, "start0");

    ns.run("market.ns");
}


function breach(target, ns) {
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

function getThreads(target, ns) {
    let serverRamData = ns.getServerRam(target);
    //log(serverRamData);
    let freeRam = serverRamData[0] - serverRamData[1];
    //log(freeRam);
    let attackScriptRam = ns.getScriptRam(ns.getScriptName());
    if (attackScriptRam <= 0) {
        log("Alert: attack script RAM is less than 0");
        return 0;
    }
    //log(attackScriptRam);
    let threads = Math.floor(freeRam / attackScriptRam);
    //log("threads: " + threads);
    return threads;
}