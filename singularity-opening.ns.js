var player;

export async function main (ns) {
  while (true) {
    player = ns.getPlayer();

    if (portCount() < 5) {
      purchaseTools();
    }

    if (player.hacking_skill < 30) {
      studyHacking();
    }
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

function purchaseTools () {

}

function studyHacking () {}
