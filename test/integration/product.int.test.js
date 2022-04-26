const request = require("supertest")
const app = require("../../server")
const newProduct = require("../../test/new-product.json")

let firstProduct

it("POST /products", async () => {
    const response = await request(app).post("/products").send(newProduct) //post 로 /products경로에 newProduct를 json으로 보내는걸 테스트한다.
    expect(response.statusCode).toBe(201) //status 코드는 201 이여야 한다.
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description)
})

it("POST /products로 보냈을때 에러코드를 500을 주냐?", async () => {
    const response = await request(app).post("/products").send({ name: "phone" })
    expect(response.statusCode).toBe(500) //name 만 보내면 500에러를 내뱉는다.
    expect(response.body).toStrictEqual({ message: "Product validation failed: description: Path `description` is required." }) //에러 메세지를 확인 하고 해당 메세지를 붙여서 맞는지 확인한다.
})

it("GET/products가 잘 실행되는 가?", async () => {
    const response = await request(app).get("/products")
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy() //response.body가 Array인지 확인
    expect(response.body[0].name).toBeDefined() //response body에 첫번째 값의 name이 undifined가 아닌지 확인
    expect(response.body[0].description).toBeDefined()
    firstProduct = response.body[0]
})

it("GET/:productId가 잘 실행되는가?", async () => {
    const response = await request(app).get("/" + firstProduct._id)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe(firstProduct.name)
    expect(response.body.description).toBe(firstProduct.description)
})

it("GET/:productId에 해당하는 값이 없을때", async () => {
    const response = await request(app).get("/6266834cec2df13aab7c7asd54") //조금만 수정해서 적용해야한다 404가 뜨는게 아니라 mongodb가 잘못된것을 감지하여 500에러를 내뱉는다.
    expect(response.statusCode).toBe(500)
})

it("PUT/productId", async () => {
    const res = await request(app)
        .put("/" + firstProduct._id)
        .send({ name: "updated name1", description: "updated description1" })
    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe("updated name1")
    expect(res.body.description).toBe("updated description1")
})

it("PUT/productId 가 존재하지 않을 때 404를 내뱉는가?", async () => {
    await request(app).put("/6266834cec2df13aab7c7e0g").send({ name: "updated name1", description: "updated description1" })
    expect(500)
})

it("DELETE/:products", async () => {
    const res = await request(app)
        .delete("/" + firstProduct._id)
        .send()
    expect(res.statusCode).toBe(200)
})

it("DELETE/:productId 가 존재하지 않을때 404를 내뱉는가?", async () => {
    const res = await request(app)
        .delete("/" + firstProduct._id)
        .send()
    expect(res.statusCode).toBe(404)
})
