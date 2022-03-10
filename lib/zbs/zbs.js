const { transfer, broadcast, seedUtils } = require('@0bsnetwork/zbs-transactions')


window.zbs = {
    createSeed : function() { return seedUtils.Seed.create(15) }
}



// const nodeUrl = 'https://node1.testnet-0bsnetwork.com';
// broadcast(signedTranserTx, nodeUrl).then(resp => document.getElementById('main').innerHTML = JSON.stringify(resp))