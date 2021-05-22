//var ram = 32;

var VERSION = "1.07";
var STATUS_FILE_CONTENTS = "version: " + VERSION;
//var ATTACK_SCRIPT = "attack.script";
//var PORTS_OPEN = 2;
var attackScript = args[1];
if (!attackScript) exit();
var target = args[0];
if (!target) { exit(); }
var attackArgs = [VERSION];

var servers = getPurchasedServers();

var i;
for (i = 0; i < servers.length; i++) {
    var server = servers[i];
    scp(attackScript, server);
    killall(server);
    exec(attackScript, server, getThreads(server), VERSION, target);
}


function getThreads(server) {

    //log(serverRamData);
    var freeRam = getServerRam(server)[0];
    //log(freeRam);
    var attackScriptRam = getScriptRam(attackScript);
    if (attackScriptRam <= 0) {
        log("Alert: attack script RAM is less than 0");
        return 0;
    }
    //log(attackScriptRam);
    var threads = Math.floor(freeRam / attackScriptRam);
    //log("threads: " + threads);
    return threads;
}