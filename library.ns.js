export async function main(ns) {

}

export function breach(target, ns) {
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
        //log("nuking",ns);
        // Get root access to target server
        ns.nuke(target);

        //log("Root access available",ns);
    }
}

export function getThreads(target, attackScript, ns) {
    var serverRamData = ns.getServerRam(target);
    //log(serverRamData,ns);
    var freeRam = serverRamData[0] - serverRamData[1];
    //log(freeRam,ns);
    var attackScriptRam = ns.getScriptRam(attackScript);
    if (attackScriptRam <= 0) {
        log("Alert: attack script RAM is less than 0");
        return 0;
    }
    //log(attackScriptRam);
    var threads = Math.floor(freeRam / attackScriptRam);
    //log("threads: " + threads,ns);
    return threads;
}



export function compareArray(a, b) {
    var lengthEqual = a.length === b.length;
    //log("length equality: " + lengthEqual,ns);
    if (!lengthEqual) {
        return false;
    }
    for (i = 0; i < a.length; i++) {
        //log("a[" + i + "]: " + a[i],ns);
        //log("b[" + i + "]: " + b[i],ns);
        if (a[i] != b[i]) { return false; }
    }

    return true;
}

export function log(msg, ns) {
    ns.print(msg);
    //tprint(msg);
    return;
}