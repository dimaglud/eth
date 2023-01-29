const Web3 = require('web3');
const InputDataDecoder = require('ethereum-input-data-decoder');

const PROVIDER_ADDRESS = 'wss://mainnet.infura.io/ws/v3/54a7c55e93554d3eb31f17b84ad3a8ee';

module.exports = class EventsListener {
    constructor (contractAddress, dbSaver, ...abis) {
        this.contractAddress = contractAddress;
        this.dbSaver = dbSaver;

        this.decoders = [];
        for (let abi of abis) {
            const decoder = new InputDataDecoder(JSON.stringify(abi));
            this.decoders.push(decoder);
        }

        this.web3 = new Web3(new Web3.providers.WebsocketProvider(PROVIDER_ADDRESS));
    }

    startListener() {
        const web3 = this.web3;
        const decoders = this.decoders;
        const saver = this.dbSaver;

        web3.eth.subscribe('logs', {
            address: this.contractAddress
        })
        .on('data', function(event){
            //console.log('-------Event received-------');
            //console.log(event);

            saver.findEvent(event.transactionHash)
                .then((savedCall) => {
                    if (savedCall) {
                        // THIS DOES NOT WORK
                        console.log("EventsListener: Event was already saved", savedCall);
                    }
                    else {
                        web3.eth.getTransaction(event.transactionHash)
                            .then( function(tx){
                                //console.log('-------Transaction-------');
                                //console.log(tx);
                
                                let isSaved = false;
                                for (let decoder of decoders) {
                                    const result = decoder.decodeData(tx.input);
                                    if (result.method) {
                                        saver.saveEvent(tx, result);
                                        isSaved = true;
                                        break;
                                    }    
                                }
                
                                if (!isSaved) {
                                    const result = { 
                                        method: 'UNKNOWN'
                                    }
                                    saver.saveEvent(tx, result);
                                }
                            });            
                    };
                });
        });

        console.log('LISTENING STARTED');
    }
}