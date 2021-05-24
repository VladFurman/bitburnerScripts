let VERSION = '1.09';
let STATUS_FILE_NAME = 'status_multivector.txt';
let STATUS_FILE_CONTENTS = 'version: ' + VERSION;
let SERVER_FILE_NAME = 'servers.txt';
let attackScript;
// let attackArgs;

let portsOpenable;

let victim;

var ns;

export async function main (nets) {
  ns = nets;
  let victimArg = ns.args[0];
  attackScript = ns.args[1];

    // attackArgs = [victimArg, attackScript];

  let portsOpenable = portCount();

  if (!attackScript) { attackScript = 'target-hack.ns'; }

  while (true) {
    ns.run('hunter.ns');
    await ns.sleep(100);
    let serverFileLines = readServerFile();

    if (victimArg) { victim = victimArg; } else { victim = serverFileLines[0].split(' ')[2]; }

    log('victim: ' + victim);
    breach(victim);
    let servers = serverFileLines.slice(1);

    if (servers.length < 1) { servers = ns.scan(); }

    portsOpenable = portCount();
    if (ns.getServerRequiredHackingLevel(victim) > ns.getHackingLevel()) { return; }
    if (ns.getServerNumPortsRequired(victim) > portsOpenable) { return; }
    breach(victim);

    attackServers(servers);

        // log("writing file...");
        // writeStatusFile(servers);
    log('multivector attack done! zzzzzzzz');
    await ns.sleep(10000);
  }
}

function attack (target) {
  log('start attack...');

  let threads = getThreads(target);

  let runningScripts = ns.ps(target);

  breach(target);

  if (!targetNeedsAttackScript(threads, runningScripts)) {
    log(target + ' fully exploited');
    return;
  }
  ns.scp(attackScript, target);

  ns.killall(target);

  threads = getThreads(target);

    // threads = 1;
    // log("attacking with:\n\t" + attackScript + "\n\t" + target + "\n\t" + threads);
    // let attackStatus = exec(attackScript, target, threads);
  let attackStatus = ns.exec(attackScript, target, threads, VERSION, victim);

  log('Completed attack, status: ' + target + attackStatus);
}

function breach (target) {
  if (!ns.hasRootAccess(target)) {
        // If we have the BruteSSH.exe program, use it to open the SSH Port
        // on the target server
    if (ns.fileExists('BruteSSH.exe', 'home')) {
      ns.brutessh(target);
    }

    if (ns.fileExists('FTPCrack.exe', 'home')) {
      ns.ftpcrack(target);
    }
    if (ns.fileExists('relaySMTP.exe', 'home')) {
      ns.relaysmtp(target);
    }
    if (ns.fileExists('HTTPWorm.exe', 'home')) {
      ns.httpworm(target);
    }
    if (ns.fileExists('SQLInject.exe', 'home')) {
      ns.sqlinject(target);
    }
        // log("nuking");
        // Get root access to target server
    ns.nuke(target);

        // log("Root access available");
  }
}

function getThreads (target) {
  let serverRamData = ns.getServerRam(target);
    // log(serverRamData);
  let freeRam = serverRamData[0] - serverRamData[1];
    // log(freeRam);
  let attackScriptRam = ns.getScriptRam(attackScript);
  if (attackScriptRam <= 0) {
    log('Alert: attack script RAM is less than 0');
    return 0;
  }
    // log(attackScriptRam);
  let threads = Math.floor(freeRam / attackScriptRam);
    // log("threads: " + threads);
  return threads;
}

function targetNeedsAttackScript (threads, runningScripts) {
    // If any scripts are not the attack script, we need to attack
  log(runningScripts);
  let i;
  for (i = 0; i < runningScripts.length; i++) {
    let scriptInfo = runningScripts[i];
    if (scriptInfo.filename != attackScript) { log('scriptname mismatch'); return true; }
    let attackArgs = [VERSION, victim];
    if (!compareArray(scriptInfo.args, attackArgs)) {
      log('Version mismatch:');
      log('\trunning script: ' + scriptInfo.args);
      log('\tattack script: ' + attackArgs);
      return true;
    }
  }

    // if there's any room, we need to attack
  if (threads > 0) { return true; }

  return false;
}

function attackServers (servers) {
  log('Attacking servers...');
  log(servers);
  let target;

  let i;
  for (i = 0; i < servers.length; i++) {
    target = servers[i];
    if (!target) continue;

    log('Verifying target: ' + target);
    if (!target) continue;
    portsOpenable = portCount();
        // log("\ti:" + i);
    if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) { log('\tInsufficient Hacking Level'); continue; }
    if (ns.getServerNumPortsRequired(target) > portsOpenable) { log('\tNot enough ports'); continue; }
    log('\tCan hack');
        // if (getServerMaxMoney(target) < 100) { continue; }
    attack(target);
  }
}

function portCount () {
  let portCount = 0;
  if (ns.fileExists('BruteSSH.exe', 'home')) {
    portCount++;
  }
  if (ns.fileExists('FTPCrack.exe', 'home')) {
    portCount++;
  }
  if (ns.fileExists('relaySMTP.exe', 'home')) {
    portCount++;
  }
  if (ns.fileExists('HTTPWorm.exe', 'home')) {
    portCount++;
  }
  if (ns.fileExists('SQLInject.exe', 'home')) {
    portCount++;
  }

  return portCount;
}

/* eslint-disable no-unused-vars */
function checkStatusFile () {
    // log('check file');
  let statusFileContents = ns.read(STATUS_FILE_NAME);
  let statusFileLines = statusFileContents.split('\n');
  return statusFileLines;
}

function readServerFile () {
    // log('check file');
  let statusFileContents = ns.read(SERVER_FILE_NAME);
  let statusFileLines = statusFileContents.split('\n');
  return statusFileLines;
}

function writeStatusFile (servers) {
  let file = VERSION + '\n';
  let i;
  for (i = 0; i < servers.length; i++) {
    server = servers[i];
    file += (server + '\n');
  }
  ns.write(STATUS_FILE_NAME, file, 'w');
}

function compareArray (a, b) {
  let lengthEqual = a.length === b.length;
    // log("length equality: " + lengthEqual);
  if (!lengthEqual) {
    return false;
  }
  let i;
  for (i = 0; i < a.length; i++) {
        // log("a[" + i + "]: " + a[i]);
        // log("b[" + i + "]: " + b[i]);
    if (a[i] != b[i]) { return false; }
  }

  return true;
}

function log (msg) {
  ns.print(msg);
    // ns.tprint(msg);
  return;
}
