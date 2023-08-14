const { query } = require("../db");
const { objectToParams } = require("./utils/dynamicSql");

const userExists = async ({ username, email }) => {
  const {
    rows: [user],
  } = await query(
    "select username from users where username = $1 or email = $2",
    [username, email]
  );
  return user;
};

const insertUser = async ({ username, email, password }) => {
  try {
    const {
      rows: [user],
    } = await query(
      "insert into users(username, password, email) values($1, $2, $3) returning *",
      [username, password, email]
    );
    user.friends = [];
    user.friendRequests = [];
    return user;
  } catch (err) {
    throw err;
  }
};

const getFullUser = async ({ username, email, id }) => {
  let filter = {};
  if (username) filter = { where: "where u1.username = $1", val: username };
  else if (email) filter = { where: "where u1.email = $1", val: email };
  else if (id) filter = { where: "where u1.id = $1", val: id };
  else throw new Error("Invalid input");

  const {
    rows: [user],
  } = await query(`select * from users u1 ${filter.where};`, [filter.val]);
  return user;
};

const updateUser = async (id, updates) => {
  try {
    updates.updated_at = new Date();
    const [result, vals, counter] = objectToParams(updates);
    const {
      rows: [user],
    } = await query(
      `update users set ${result} where id = $${counter} returning *;`,
      [...vals, id]
    );
    delete user.password;
    return user;
  } catch (err) {
    throw err;
  }
};

const deleteUser = async (id) => {
  try {
    const { rowCount } = await query(`delete from users where id = $1`, [id]);
    return !!rowCount;
  } catch (err) {
    throw err;
  }
};

const getSimpleUser = async (id) => {
  const {
    rows: [user],
  } = await query("select * from users where id = $1;", [id]);
  delete user.password;
  delete user.updated_at;
  delete user.created_at;
  return user;
};

module.exports = {
  userExists,
  insertUser,
  getFullUser,
  updateUser,
  deleteUser,
  getSimpleUser,
};
