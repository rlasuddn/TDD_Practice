const express = require("express")
const router = express.Router()
const Controller = require("./controller/product")
router.post("/products", Controller.createProduct)
router.get("/products", Controller.getProducts)
router.get("/:productId", Controller.getProductById)
router.put("/:productId", Controller.updateProduct)
router.delete("/:productId", Controller.deleteProduct)

module.exports = router
