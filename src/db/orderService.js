const { query, pool } = require("../db");

const createOrder = async ({ customerName, phoneNumber, items }) => {
  const client = await pool.connect();
  // create an order enry get it's id then update the join table.
  try {
    await client.query(`begin`);
    const {
      rows: [order],
    } = await client.query(
      `insert into orders(customer_name, phone_number) values($1, $2) returning *`,
      [customerName, phoneNumber]
    );

    for (const item of items) {
      console.log("item", item);
      await client.query(
        `
          insert into orders_products(product_id, order_id, size, amount) values ($1, $2, $3, $4) on conflict do nothing;`,
        [item.id, order.id, item.size, item.quantity]
      );
    }
    await client.query(`commit`);
    return true;
  } catch (err) {
    await client.query(`rollback`);
    console.log("comment error: ", err);
    throw new Error("Invalid input");
  } finally {
    await client.release();
  }
};

const getOrders = async () => {
  const { rows } = await query(
    `select o.id, o.customer_name, o.phone_number, array_agg(
        json_build_object ('id', p.id,'name', p.name, 'image', p.image, 'price', p.price, 'size', op.size, 'amount', op.amount)
     ) items from orders o
     left outer join orders_products op on o.id = op.order_id
     left outer join products p on p.id = op.product_id
     group by o.id;`
  );
  for(const row of rows){
    row.customerName = row.customer_name;
    row.phoneNumber = row.phone_number;
    delete row.customer_name
    delete row.phone_number
  }
  console.log(rows);
  return rows;
};

const deleteOrder = async (orderId) => {
  try {
    const { rowCount } = await query(`delete from orders o where o.id = $1;`, [
      orderId,
    ]);
    return !!rowCount;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createOrder,
  getOrders,
  deleteOrder,
};
