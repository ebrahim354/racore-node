const router = require("express").Router();
const { createOrder, getOrders, deleteOrder } = require("../db/orderService");
const { validateToken } = require("../middleware/validation");

//create an order

router.post("/", async (req, res, next) => {
  const { customerName, phoneNumber, items } = req.body;
  console.log("body", req.body);
  // items is an array of{ productId, size, amount }
  try {
    const result = await createOrder({ customerName, phoneNumber, items });
    res.status(200).json({
      data: {
        result,
      },
      errors: null,
    });
  } catch (err) {
    next(err);
  }
});

//gets all orders
router.get("/", validateToken, async (req, res, next) => {
  try {
    const orders = await getOrders();
    res.status(200).json({
      data: {
        orders,
      },
      errors: null,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", validateToken, async (req, res, next) => {
  const orderId = req.params.id;
  try {
    result = await deleteOrder(orderId);
    res.status(200).json({
      data: {
        result,
      },
      errors: null,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
