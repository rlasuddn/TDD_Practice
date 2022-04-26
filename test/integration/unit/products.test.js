const productController = require("../../../controller/product")
const productModel = require("../../../models/product")
const httpMocks = require("node-mocks-http")
const newProduct = require("../../new-product.json") // 페이크 데이터를 가져온다.
const allProducts = require("../../../all-products.json")

productModel.create = jest.fn() //productModel.create은 무조건 적으로 작동하기 때문에 mock function을 사용
productModel.find = jest.fn()
productModel.findById = jest.fn()
productModel.findByIdAndUpdate = jest.fn()
productModel.findByIdAndDelete = jest.fn()

const productId = "5asd1asdas5asd"
const updatedProduct = { name: "updated name", description: "update description" }
// beforeEach 여러개의 테스트에 공통된 Code가 있다면 beforeEach안에 넣어서 반복을 줄여줄 수 있다. 전역으로 설정한 beforeEach
let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
    next = jest.fn() //어떤것과 실행이 되고, 얼마나 실행되는지 알기 위해 Mocks 함수 사용
})

describe("CREATE에 관련한 테스트케이스", () => {
    //생성에 관련된 테스트케이스 안에서 req.body = newProduct가 적용이 된다.
    beforeEach(() => {
        req.body = newProduct //req.body 안에 페이크 데이터를 넣어준다.
    })
    it("createProduct가 함수인가?", () => {
        expect(typeof productController.createProduct).toBe("function")
    })

    it("product.create가 호출이 되는가?", async () => {
        await productController.createProduct(req, res, next) //req에는 페이크 데이터가 있고
        expect(productModel.create).toBeCalledWith(newProduct) //해당 함수의 인자로 newProduct가 있는지 확인 한다.
    })

    it("201 response 가 잘 오는가?", async () => {
        await productController.createProduct(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy() //send가 잘 전달되고 있는지 확인 할 수 있다.
    })
    it("json으로 resoponse가 잘 가는가?", async () => {
        productModel.create.mockReturnValue(newProduct) //mockReturnValue은 productModel.create라는 가짜 함수가 newProduct값을 리턴하라고 설정한다.
        await productController.createProduct(req, res, next) //productController에 createProduct함수 실행
        expect(res._getJSONData()).toStrictEqual(newProduct) //response 의 jsonData 와 newProduct가 같은지
    })
    it("에러 핸들링", async () => {
        const errorMessage = { message: "에러다 에러!!!" } //errormessage 생성
        const rejectedPromise = Promise.reject(errorMessage) //비동기의 결과값이기 때문에 Promise 이고 실패하기때문에 reject
        productModel.create.mockReturnValue(rejectedPromise) //productModel.create에 rejectedPromise값을 리턴하라고 설정
        await productController.createProduct(req, res, next)
        expect(next).toBeCalledWith(errorMessage) //next 함수가 errorMessage 와 같이 실행되는지
    })
})
describe("READ 관련 테스트케이스", () => {
    it("getProduct가 함수인가?", () => {
        expect(typeof productController.getProducts).toBe("function")
    })
    it("ProductModel.find({})가 잘 되는가?", async () => {
        await productController.getProducts(req, res, next)
        expect(productModel.find).toHaveBeenCalledWith({}) //find 할때 {} 와 같이 실행된다.
    })
    it("status 200코드가 잘 오는가?", async () => {
        await productController.getProducts(req, res, next) //productController.getProducts 함수 실행
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled).toBeTruthy()
    })
    it("body로 json형식의 response가 잘 내려가는가?", async () => {
        productModel.find.mockReturnValue(allProducts) //find를 하면 allProducts 리턴 하도록 설정
        await productController.getProducts(req, res, next) //함수 실행
        expect(res._getJSONData()).toStrictEqual(allProducts) //json 데이터형식과 allProducts 같은지
    })
    it("에러 핸들러", async () => {
        const errorMessage = { message: "porduct data 를 찾는 과정에서 에러 발생" }
        const rejectedPromise = Promise.reject(errorMessage)
        productModel.find.mockReturnValue(rejectedPromise) //find 가 rejectedPromise를 리턴하라고 설정
        await productController.getProducts(req, res, next) //함수 실행
        expect(next).toHaveBeenCalledWith(errorMessage) //next에 errorMessage가 담긴다.
    })
})

describe("GetById로 가져와지나?", () => {
    it("getProductById를 가지고 있나?", () => {
        expect(typeof productController.getProductById).toBe("function")
    })
    it("productModel.findById 가 잘 불러와지나?", async () => {
        req.params.productId = productId //params 로 productId
        await productController.getProductById(req, res, next) //함수 실행
        expect(productModel.findById).toBeCalledWith(productId) // productModel.findById와 productId가 같이 실행되는지
    })
    it("body로 json형식의 response와 status code 200이 잘 내려가는가?", async () => {
        productModel.findById.mockReturnValue(newProduct)
        await productController.getProductById(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(newProduct)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it("findById 에 해당하는게 없으면 404를 띄우나? ", async () => {
        productModel.findById.mockReturnValue(null)
        await productController.getProductById(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled).toBeTruthy()
    })
    it("에러 핸들러", async () => {
        const errorMessage = { message: "error" }
        const rejectedPromise = Promise.reject(errorMessage)
        productModel.findById.mockReturnValue(rejectedPromise) //find 가 rejectedPromise를 리턴하라고 설정
        await productController.getProductById(req, res, next) //함수 실행
        expect(next).toHaveBeenCalledWith(errorMessage) //next에 errorMessage가 담긴다.
    })
})

describe("Product Controller Update 잘되나?", () => {
    it("updateProduct function 이 잘 실행되는가?", () => {
        expect(typeof productController.updateProduct).toBe("function")
    })
    it("updateProduct 가 잘 실행되나?", async () => {
        req.params.productId = productId //파라미터로 productId 가 간다.
        req.body = { name: "updated name", description: "update description" } //body 로는 { name: "updated name", description: "update description" } 값이 간다.
        await productController.updateProduct(req, res, next) // productController.updateProduct 실행
        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(productId, updatedProduct, { new: true }) //같이 실행이 됬는지 new:true를 해줘야 업데이트 된 값이 리턴된다.
    })
    it("body로 json형식의 response와 status code 200이 잘 내려가는가?", async () => {
        req.params.productId = productId
        req.body = updatedProduct //업데이트 할 값
        productModel.findByIdAndUpdate.mockReturnValue(updatedProduct) //productModel.findByIdAndUpdate함수에 updatedProduct리턴하도록 설정
        await productController.updateProduct(req, res, next) //함수 설정
        expect(res._isEndCalled).toBeTruthy() //response가 잘 실행되는지
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(updatedProduct)
    })
    it("update할 데이터가 없을때 404가 잘뜨니?", async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null)
        await productController.updateProduct(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it("에러 핸들러", async () => {
        const errorMessage = { message: "error" }
        const rejectedPromise = Promise.reject(errorMessage)
        productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
        await productController.updateProduct(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})
describe("Product Controller Delete 가 잘 되나?", () => {
    it("deleteProduct가 함수인가?", () => {
        expect(typeof productController.deleteProduct).toBe("function")
    })
    it("ProductModel.findByIdAndDelete", async () => {
        req.params.productId = productId
        await productController.deleteProduct(req, res, next)
        expect(productModel.findByIdAndDelete).toBeCalledWith(productId)
    })
    it("200 을 잘 보내는가?", async () => {
        let deletedProduct = {
            name: "delteProduct",
            description: "deleteDescription",
        }
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct)
        await productController.deleteProduct(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(deletedProduct)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it("삭제할 데이터가 없으면 404를 내뱉는가?", async () => {
        productModel.findByIdAndDelete.mockReturnValue(null)
        await productController.deleteProduct(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it("에러 핸들러", async () => {
        const errorMessage = { message: "error" }
        const rejectedPromise = Promise.reject(errorMessage)
        productModel.findByIdAndDelete.mockReturnValue(rejectedPromise)
        await productController.deleteProduct(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})
