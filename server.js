const express = require("express")
const RouterProducts = require("./route")
const PORT = process.env.PORT || 3000
const app = express()
const mongoose = require("mongoose")
const connect = () => {
    mongoose.connect("mongodb://localhost:27017/tdd_prac", { ignoreUndefined: true }).catch((err) => {
        //mogodb와 연결시 오류가 나면 콘솔창에 띄워준다.
        console.error(err)
    })
}
connect()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/", RouterProducts)
app.listen(PORT)
console.log("http://localhost:3000")

app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message }) //에러가 나면 이 미들웨어로 와서 에러메세지를 보내준다.
})
module.exports = app
