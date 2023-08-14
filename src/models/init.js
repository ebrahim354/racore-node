const users = require('./User');
const products = require('./Product');

const operations = [
	users.createUsersTable,
	products.createOrdersTable,
	products.createProductsTable,
	products.createOrdersProductsTable,
];

const init = async () => {
	for (let func of operations) {
		try {
			const res = await func();
			if (res.command === 'CREATE') {
				console.log(`${func.name} called successfully!`);
			} else {
				console.log(res);
			}
		} catch (err) {
			console.log(err);
		}
	}
};

module.exports = init;
