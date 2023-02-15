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

	async saveEvent(transaction, call) {
		try {
			await this.ContractCallsTable.create({
				fromAddress: transaction.from,
				toAddress: transaction.to,
				transactionHash: transaction.hash,
				methodName: call.method,
				parameters: JSON.stringify(call.inputs),
			});

			console.log("EventsDBSaver: Method call was saved", call);
		}
		catch (error) {
			console.log(error);
		}
	}

	async findEvent(hash) {
		let call = await this.ContractCallsTable.findOne({
			where: { transactionHash: hash },
		});		
		return call; 
	}
}

