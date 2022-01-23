const router = require('express').Router()
const Product = require('../model/Product')

// Require Controller
const productController = require('../controller/productController')

router.get('/', productController.getAllproduct);
router.post('/add', productController.createProduct);
router.put('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)


module.exports = router;