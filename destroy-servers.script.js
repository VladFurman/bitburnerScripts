var servers = getPurchasedServers();

var i;
for(i=0;i<servers.length;i++){
    var server = servers[i];
    killall(server);
    deleteServer(server);
}

tprint("Destroyed all servers!");