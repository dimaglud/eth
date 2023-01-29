const EventsDbSaver = require('./common/eventsDbSaver');
const EventsListener = require('./common/eventsListener');

const apeCoinABI = require('./ABIs/apeCoin.json');
const apeCoinStakingABI = require('./ABIs/apeCoinStaking.json');

let saver = new EventsDbSaver('eth_db', 'user', "pas");
//let listener = new EventsListener('0x4d224452801ACEd8B2F0aebE155379bb5D594381', saver, './ABIs/apeCoin.json', './ABIs/apeCoinStaking.json');
let listener = new EventsListener('0x4d224452801ACEd8B2F0aebE155379bb5D594381', saver, apeCoinABI, apeCoinStakingABI);

listener.startListener();