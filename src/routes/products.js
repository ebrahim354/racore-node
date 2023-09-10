const router = require("express").Router();
const { BUCKET } = require('../utils/config');
const { validateToken } = require("../middleware/validation");
const { validatePost, updatesValidation } = require("../middleware/validation");

const multer = require("multer");
const {
  createProduct,
  updateProduct,
  getOneProduct,
  getProducts,
  deleteProduct,
} = require("../db/productService");
const path = require("path");
const aws = require('aws-sdk');
const s3 = new aws.S3();
const MulterS3 = require('multer-s3');

const multerS3 = MulterS3({
    s3: s3,
    bucket: BUCKET,
    key: function (req, file, cb) {
      console.log('filename', file.originalname);
      const imgPath = Date.now() + req.file.originalname;
      req.body.img = imgPath;
      cb(null, imgPath);
    }
  })

const upload = multer({
  storage: BUCKET ? multerS3 : null,
  dest: BUCKET ? null : path.join(__dirname, "../../public/post"),
});

//create a product
router.post(
  "/",
  validateToken,
  upload.single("file"),
  validatePost,
  async (req, res, next) => {
    const { description, img, name, price } = req.body;
    try {
      const product = await createProduct({ description, img, name, price });
      res.status(200).json({
        data: {
          product,
        },
        errors: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

//update a product
router.put("/:id", validateToken, updatesValidation, async (req, res, next) => {
  const productId = req.params.id;
  let updates = {};
  updates.name = req.body.updates.name;
  updates.price = req.body.updates.price;

  try {
    const product = await updateProduct(productId, updates);
    res.status(200).json({
      data: {
        product,
      },
      errors: null,
    });
  } catch (err) {
    next(err);
  }
});

//get a product
router.get("/:id", async (req, res, next) => {
  const productId = req.params.id;
  try {
    const product = await getOneProduct(productId);
    res.status(200).json({
      data: {
        product,
      },
      errors: null,
    });
  } catch (err) {
    next(err);
  }
});

//gets all products
router.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();
    res.status(200).json({
      data: {
        products,
      },
      errors: null,
    });
  } catch (err) {
    next(err);
  }
});

//delete a product
router.delete("/:id", validateToken, async (req, res, next) => {
  const productId = req.params.id;
  try {
    result = await deleteProduct(productId);
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
