//var target;

export async function main(ns) {
    let target = ns.args[0];
    if (!target) ns.exit();

    // // // Defines how much money a server should have before we hack it
    // In this case, it is set to 75% of the server's max money
    let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
     ns.tprint('moneyThresh: '+moneyThresh);

    // Defines the maximum security level the target server can
    // have. If the target's security level is higher than this,
    // we'll weaken it before doing anything else
    let securityThresh = ns.getServerMinSecurityLevel(target) + 10;
    ns.tprint('security thresh: '+securityThresh);
}