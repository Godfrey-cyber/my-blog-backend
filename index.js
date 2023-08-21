import express from "express"
import dotenv, { config } from "dotenv"
import cors from "cors"
import mongoose from 'mongoose'
import cookieParser from "cookie-parser"
import dns from "dns"

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// import morgan from "morgan"
// import helmet from "helmet"

//routes
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import categoryRoutes from "./routes/categories.js"

const app = express()
app.use(cors({ credentials: true, origin: "https://my-blog-frontend-kappa.vercel.app"} ))
app.use(express.json())
app.use(express.json({limit: '25mb'}));
// app.use(express.urlencoded({limit: '25mb'}));
app.use(cookieParser())
dotenv.config();
app.use("/uploads", express.static(__dirname + "/uploads"))

// connection to DB
const MONGO_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 8080

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => app.listen(PORT, () => console.log(`Success! Database running on port: ${PORT}`))).catch(error => console.log(error))

mongoose.connection.on("disconnected", () => {
    console.log("MongoDatabase disconnected")
})
app.use("/users", userRoutes)
app.use("/posts", postRoutes)
app.use("/categories", categoryRoutes)

// dns.resolve('safaricom.com', (err, value) => { 
//     if(err) { 
//         console.log(err); 
//         return; 
//     } 
//     console.log(value); 
// })
// console.log(dns.lookup)
// app.listen(4000)