const { query, pool } = require(".");
const { objectToParams } = require("./utils/dynamicSql");

const createProduct = async ({ description, img, name, price }) => {
  if (!img) img = "";
  if (!description) description = "";
  const client = await pool.connect();
  try {
    await client.query("begin");
    const {
      rows: [post],
    } = await client.query(
      `insert into products(name, price, description, image) values($1, $2, $3, $4) returning *`,
      [name, price, description, img ? img : ""]
    );
    await client.query(`commit`);
    return post;
  } catch (err) {
    console.log("create product", err);
    await client.query(`rollback`);
    throw new Error("Invalid input");
  } finally {
    await client.release();
  }
};

const updateProduct = async (productId, updates) => {
  try {
    updates.updated_at = new Date();
    const [result, vals, counter] = objectToParams(updates);
    console.log(result, vals);
    const {
      rows: [product],
    } = await query(
      `update products set ${result} where id = $${counter} returning *;`,
      [...vals, productId]
    );
    return product;
  } catch (err) {
    throw new Error("Invalid input");
  }
};

const getOneProduct = async (productId) => {
  try {
    const { rows } = await query(`select * from products where id = $1;`, [
      productId,
    ]);
    if (!rows[0]) throw new Error("product is not found!");
    return rows[0];
  } catch (err) {
    throw new Error("product is not found!");
  }
};

const getProducts = async () => {
  const { rows } = await query(`select * from products;`);
  return rows;
};

const deleteProduct = async (productId) => {
  console.log(productId);
  try {
    const { rowCount } = await query(
      `delete from products p where p.id = $1;`,
      [productId]
    );
    return !!rowCount;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getOneProduct,
  getProducts,
  deleteProduct,
};
