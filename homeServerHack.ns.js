let STATUS_FILE_NAME = 'status_multivector.txt';
let SERVER_FILE_NAME = 'servers.txt';
let ATTACK_SCRIPT = 'target-hack.ns';
let HOME = 'home';

export async function main (ns) {
  let threads = getThreads(HOME, ns) - 10;
  if (threads > 0) {
    let victimArg = ns.args[0];
    let victim;
    let serverFileLines = readServerFile(ns);

    if (victimArg) { victim = victimArg; } else { victim = serverFileLines[0].split(' ')[2]; }
    ns.run(ATTACK_SCRIPT, getThreads(HOME, ns) - 10, 'homeAttack', victim);
  }
}

function getThreads (target, ns) {
  let freeRam = ns.getServerMaxRam(target) - ns.getServerUsedRam(target);
    // log(freeRam);
  let attackScriptRam = ns.getScriptRam(ATTACK_SCRIPT);
  if (attackScriptRam <= 0) {
    log('Alert: attack script RAM is less than 0');
    return 0;
  }
    // log(attackScriptRam);
  const threads = Math.floor(freeRam / attackScriptRam);
    // log("threads: " + threads);
  return threads;
}

function readServerFile (ns) {
    // log('check file');
  let statusFileContents = ns.read(SERVER_FILE_NAME);
  let statusFileLines = statusFileContents.split('\n');
  return statusFileLines;
}
