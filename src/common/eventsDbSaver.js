const Sequelize = require('sequelize')

class ContractCall extends Sequelize.Model { }

module.exports = class EventsDBSaver {
	constructor(dbName, user, password) {
		this.sequelize = new Sequelize(
			dbName,
			user,
			password,
			{
				dialect: 'postgres',
			}
		)

		this.initDB();

		this.sequelize
			.authenticate()
			.then(() => this.sequelize.sync())
			.catch((err) => console.error('Connection error: ', err));
	}

	initDB() {
		this.ContractCallsTable = this.sequelize.define("contractCall", {
			id: {
				type: Sequelize.BIGINT,
				primaryKey: true,
				autoIncrement: true
			},
			fromAddress: {
				type: Sequelize.STRING,
				allowNull: false
			},
			toAddress: {
				type: Sequelize.STRING,
				allowNull: false
			},
			transactionHash: {
				type: Sequelize.STRING,
				allowNull: false
			},
			methodName: {
				type: Sequelize.STRING,
			},
			parameters: {
				type: Sequelize.TEXT,
			},
			timestamp: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
		});

	}

	async lock() {
		let resFunc = null;
		let prevAwaiter = this.awaiter;
		this.awaiter = new Promise((resolve, reject) => {
			resFunc = resolve;
		});	

		if (prevAwaiter) {
			await prevAwaiter;
		}
		return resFunc;	
	}

	async checkAndSaveEvent(transaction, call) {
		let pulse = await this.lock();

		let addedEvent = await this.findEvent(transaction.hash);
		if (!addedEvent) {
			await this.saveEvent(transaction, call);

			console.log("EventsDBSaver: Method call was saved", call);
		}
		else {
			console.log("EventsDBSaver: Method call is already in DB", call);
		}

		pulse();
	}
	
	async saveEvent(transaction, call) {
		try {
			await this.ContractCallsTable.create({
				fromAddress: transaction.from,
				toAddress: transaction.to,
				transactionHash: transaction.hash,
				methodName: call.method,
				parameters: JSON.stringify(call.inputs),
			});
		}
		catch (error) {
			console.log(error);
		}
	}

	async findEvent(hash) {
		try {
			let call = await this.ContractCallsTable.findOne({
				where: { transactionHash: hash },
			});		

			return call; 
		}
		catch (error) {
			console.log(error);
			return null; 
		}
	}
}

