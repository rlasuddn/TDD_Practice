const productModel = require("../models/product")

async function createProduct(req, res, next) {
    try {
        const createdProduct = await productModel.create(req.body) //실제 사용되는 함수
        res.status(201).json(createdProduct)
    } catch (err) {
        next(err) //error가 있으면 next로 error를 보내준다 =>server.js
        //비동기 처리이므로 next를 사용한다.
    }
}

async function getProducts(req, res, next) {
    try {
        const allProducts = await productModel.find({})
        res.status(200).json(allProducts)
    } catch (err) {
        next(err)
    }
}

async function getProductById(req, res, next) {
    try {
        const product = await productModel.findById(req.params.productId)
        if (product) return res.status(200).json(product)
        if (!product) return res.status(404).json()
    } catch (err) {
        next(err)
    }
}

async function updateProduct(req, res, next) {
    try {
        let updatedProduct = await productModel.findByIdAndUpdate(req.params.productId, req.body, { new: true })
        if (updatedProduct) {
            return res.status(200).json(updatedProduct)
        } else {
            return res.status(404).json()
        }
    } catch (err) {
        next(err)
    }
}

async function deleteProduct(req, res, next) {
    try {
        let deltedProduct = await productModel.findByIdAndDelete(req.params.productId)
        if (deltedProduct) {
            res.status(200).json(deltedProduct)
        } else {
            res.status(404).json()
        }
    } catch (err) {
        next(err)
    }
}
module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct }
