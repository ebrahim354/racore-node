const router = require('express').Router();
const loggedIn = require('../utils/loggedIn');
const createToken = require('../utils/createToken');
const { getFullUser } = require('../db/userService');

//login
router.post('/login', async (req, res, next) => {
	if (loggedIn(req.token)) {
		return res.send('you are already loggedin');
	}
	const data = req.body;
	if ((!data.username || !data.email) && !data.password)
		return res.status(400).send('Invalid request!');

	try {
		const user = await getFullUser({
			username: data.username,
			email: data.email,
		});
		if (!user) {
			res.status(400).send('invalid username or password');
			return;
		}
		const passwordMatch = (data.password == user.password);
		if (!passwordMatch) {
			res.status(400).send('invalid username or password');
			return;
		}
		delete user.password;
		const token = createToken(user.id);
		res.status(200).json({
			token,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
