log("start attack script");

var target = args[0];
var attackScript = "generic-hack.script";
var version = "1.2";
var attackArgs = [version];
enableLog('ALL');

main();



function main() {
    breach(target);
    scp(attackScript, target);

    var threads = getThreads();

    var runningScripts = ps(target);

    if (!targetNeedsAttackScript(threads, runningScripts)) {
        log("Target fully exploited");
        exit();
    }

    // TODO Uncomment
    killall(target);

    threads = getThreads();

    //threads = 1;
    log("attacking with:\n\t" + attackScript + "\n\t" + target + "\n\t" + threads);
    //var attackStatus = exec(attackScript, target, threads);
    var attackStatus = exec(attackScript, target, threads, version);

    log("Completed attack, status: " + attackStatus);
}

function breach(target) {
    if (!hasRootAccess(target)) {
        // If we have the BruteSSH.exe program, use it to open the SSH Port
        // on the target server
        if (fileExists("BruteSSH.exe", "home")) {
            brutessh(target);
        }

        if (fileExists("FTPCrack.exe", "home")) {
            ftpcrack(target);
        }
        log("nuking");
        // Get root access to target server
        nuke(target);

        log("Root access available");
    }
}

function getThreads() {
    var serverRamData = getServerRam(target);
    //log(serverRamData);
    var freeRam = serverRamData[0] - serverRamData[1];
    //log(freeRam);
    var attackScriptRam = getScriptRam(attackScript);
    if (attackScriptRam <= 0) {
        log("Alert: attack script RAM is less than 0");
        return 0;
    }
    //log(attackScriptRam);
    var threads = Math.floor(freeRam / attackScriptRam);
    log("threads: " + threads);
    return threads;
}

function targetNeedsAttackScript(threads, runningScripts) {
    // If any scripts are not the attack script, we need to attack
    log(runningScripts);
    var i;
    for (i = 0; i < runningScripts.length; i++) {
        var scriptInfo = runningScripts[i];
        if (scriptInfo.filename != attackScript) { log("scriptname mismatch"); return true; }
        if (!compareArray(scriptInfo.args, attackArgs)) {
            //log("argument mismatch");
            //log("running script: " + scriptInfo.args);
            //log("attack script: " + attackArgs);
            return true;
        }
    }


    // if there's any room, we need to attack
    if (threads > 0) { return true; }
}

function compareArray(a, b) {
    var lengthEqual = a.length === b.length;
    log("length equality: " + lengthEqual);
    if (!lengthEqual) {
        return false;
    }
    for (i = 0; i < a.length; i++) {
        log("a[" + i + "]: " + a[i]);
        log("b[" + i + "]: " + b[i]);
        if (a[i] != b[i]) { return false; }
    }

    return true;
}

function log(msg) {
    print(msg);
    tprint(msg);
    return;
}