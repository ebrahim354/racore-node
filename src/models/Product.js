// this code is used to create the posts table
const { query } = require("../db");

// the product schema
const products_columns = [
  "id BIGSERIAL PRIMARY KEY unique",
  "name text NOT NULL",
  "description VARCHAR(256)",
  "image text not null",
  "price int default 0",
  "created_at timestamp NOT NULL default now()",
  "updated_at timestamp NOT NULL default now()",
];

// the orders schema
const orders_columns = [
  "id BIGSERIAL PRIMARY KEY unique",
  "customer_name text NOT NULL",
  "phone_number VARCHAR(256) not null",
  "created_at timestamp NOT NULL default now()",
  "updated_at timestamp NOT NULL default now()",
];

// the orders schema
const orders_products_columns = [
  "id BIGSERIAL PRIMARY KEY unique",
  "product_id INT REFERENCES products(id) ON DELETE CASCADE",
  "order_id INT REFERENCES orders(id) ON DELETE CASCADE",
  "size text",
  "amount INT",
  "created_at timestamp NOT NULL default now()",
  "updated_at timestamp NOT NULL default now()",
];

const createProductsTable = () => {
  return query(
    `CREATE TABLE IF NOT EXISTS products(${products_columns.join(",")});`
  );
};
const createOrdersTable = () => {
  return query(
    `CREATE TABLE IF NOT EXISTS orders(${orders_columns.join(",")});`
  );
};

const createOrdersProductsTable = () => {
  return query(
    `CREATE TABLE IF NOT EXISTS orders_products(${orders_products_columns.join(
      ","
    )});`
  );
};

module.exports = {
  createProductsTable,
  createOrdersProductsTable,
  createOrdersTable,
};
