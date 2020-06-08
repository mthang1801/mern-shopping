const Router = require("express").Router;
const db = require("../utils/database");
const Decimal128 = require("mongodb").Decimal128;
const ObjectId = require("mongodb").ObjectId;
const router = Router();

const products = [
  {
    _id: "fasdlk1j",
    name: "Stylish Backpack",
    description:
      "A stylish backpack for the modern women or men. It easily fits all your stuff.",
    price: 79.99,
    image: "http://localhost:3100/images/product-backpack.jpg",
  },
  {
    _id: "asdgfs1",
    name: "Lovely Earrings",
    description: " ",
    price: 129.59,
    image: "http://localhost:3100/images/product-earrings.jpg",
  },
  {
    _id: "askjll13",
    name: "Working MacBook",
    description:
      "Yes, you got that right - this MacBook has the old, working keyboard. Time to get it!",
    price: 1799,
    image: "http://localhost:3100/images/product-macbook.jpg",
  },
  {
    _id: "sfhjk1lj21",
    name: "Red Purse",
    description: "A red purse. What is special about? It is red!",
    price: 159.89,
    image: "http://localhost:3100/images/product-purse.jpg",
  },
  {
    _id: "lkljlkk11",
    name: "A T-Shirt",
    description:
      "Never be naked again! This T-Shirt can soon be yours. If you find that buy button.",
    price: 39.99,
    image: "http://localhost:3100/images/product-shirt.jpg",
  },
  {
    _id: "sajlfjal11",
    name: "Cheap Watch",
    description: "It actually is not cheap. But a watch!",
    price: 299.99,
    image: "http://localhost:3100/images/product-watch.jpg",
  },
];

// Get list of products products
router.get("/", async (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  const queryPage = req.query.page;

  const pageSize = 3;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  try {
    const products = [];
    await db
      .getDB()
      .db("shop")
      .collection("products")
      .find()
      .sort({ price: -1 })
      // .skip((queryPage - 1) * pageSize)
      // .limit(pageSize)
      .forEach((product) => {
        product.price = product.price.toString();
        products.push(product);
      });

    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server errors");
  }
});

// Get single product
router.get("/:id", async (req, res, next) => {
  try {
    let product = await db
      .getDB()
      .db("shop")
      .collection("products")
      .findOne({ _id: new ObjectId(req.params.id) });
    product.price = product.price.toString();
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
});

// Add new product
// Requires logged in user
router.post("", async (req, res, next) => {
  try {
    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
      image: req.body.image,
    };
    const result = await db
      .getDB()
      .db("shop")
      .collection("products")
      .insertOne(newProduct);
    return res
      .status(201)
      .json({ message: "Product added", productId: result.insertedId });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "An error occured" });
  }
});

// Edit existing product
// Requires logged in user
router.patch("/:id", async (req, res, next) => {
  try {
    const updatedProduct = {
      name: req.body.name,
      description: req.body.description,
      price: Decimal128.fromString(req.body.price.toString()),
      image: req.body.image,
    };
    let result = await db
      .getDB()
      .db("shop")
      .collection("products")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updatedProduct }
      );
    console.log(result);
    return res
      .status(200)
      .json({ message: "Product updated", productId: "DUMMY" });
  } catch (error) {
    console.log(error);
  }
});

// Delete a product
// Requires logged in user
router.delete("/:id", async (req, res, next) => {
  try {
    console.log(req.params.id);
    await db
      .getDB()
      .db("shop")
      .collection("products")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
