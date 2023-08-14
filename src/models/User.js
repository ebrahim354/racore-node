const { query } = require('../db');

// users schema
const users_columns = [
	'id BIGSERIAL PRIMARY KEY',
	'username VARCHAR(20) UNIQUE NOT NULL',
	'email VARCHAR(50) UNIQUE NOT NULL',
	'password text NOT NULL',
	'profile_picture text',
	'cover_picture text',
	'"desc" VARCHAR(256)',
	'city VARCHAR(50)',
	'"from" VARCHAR(50)',
	'relationship INT',
	'created_at TIMESTAMP NOT NULL default now()',
	'updated_at TIMESTAMP NOT NULL default now()',
	'last_visit TIMESTAMP default now()',
];

const createUsersTable = () => {
	return query(`CREATE TABLE IF NOT EXISTS users(${users_columns.join(',')});`);
};


module.exports = {
	createUsersTable
};
