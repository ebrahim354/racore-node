const { query, pool } = require('../db');

const destroy = async () => {
	const tables = [
		'users',
		'products',
		'orders',
		'orders_products',
	];

	for (let table of tables) {
		try {
			await query(`drop table if exists ${table};`);
		} catch (err) {
			console.log(err);
			console.log('error!');
		}
		console.log('dropped table: ', table);
	}
	await pool.end();
};

destroy();

module.exports = destroy;
