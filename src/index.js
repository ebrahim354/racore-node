const { PORT } = require('./utils/config');
const initDB = require('./models/init');

const App = require('./App');
const http = require('http');
const server = http.createServer(App);

const main = async () => {
	console.log('port: ', PORT);
	await initDB();

	server.listen(PORT, () => {
		console.log(`listening on port ${PORT}`);
	});
};

main();
