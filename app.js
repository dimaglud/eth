const app = require('express')()
const Web3 = require('web3')

const host = '127.0.0.1'
const port = 7000

//const web3 = new Web3(new Web3.providers.HttpProvider("https://eth.llamarpc.com"));
const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/54a7c55e93554d3eb31f17b84ad3a8ee"));


var ABI = JSON.parse('[{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"totalSupply_","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]');

var myContract = new web3.eth.Contract(ABI, '0x4d224452801ACEd8B2F0aebE155379bb5D594381');

console.log('acc');
console.log(myContract.defaultAccount);


myContract.events.Transfer({
    fromBlock: 'latest'
}, function(error, event) {
    console.log('---------!!--------');
    console.log(event);
    console.log('-----------------');
})
.on("connected", function(subscriptionId){
    console.log('connected: ' + subscriptionId);
})
.on('data', function(event){
    console.log('event: ' + event); // same results as the optional callback above
})
.on('changed', function(event){
    console.log('changed: ' + event); // same results as the optional callback above
});

myContract.getPastEvents('allEvents', {
    fromBlock: 'latest'
})
.then(function(events){
    console.log('---------past--------');
    console.log(events) // same results as the optional callback above
})
.catch(err => { console.log(err) });

app.get('/home', (req, res) => {

    var myContract2 = new web3.eth.Contract(ABI, '0x4d224452801ACEd8B2F0aebE155379bb5D594381');
    
    console.log(myContract.transactionPollingInterval);
    console.log('-----------------');
    console.log('-----------------');
    /*
    web3.eth.getAccounts()
    .then((resp) => {
        res.status(200).type('text/plain');
        res.send(resp)    
    });
    */
})

app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`)
  })

/*
web3.eth.getCoinbase()
.then(console.log);
*/

console.log(web3.version);