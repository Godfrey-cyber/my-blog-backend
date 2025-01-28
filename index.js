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
app.use(cors({ credentials: true, origin: 'https://my-blog-frontend-kappa.vercel.app' }))
app.use(express.json())
app.use(express.json({limit: '25mb'}));
// app.use(express.urlencoded({limit: '25mb'}));
app.use(cookieParser())
dotenv.config();
app.use("/uploads", express.static(__dirname + "/uploads"));

// connection to DB
const MONGO_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 8080

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => app.listen(PORT, () => console.log(`Success! Database running on port: ${PORT}`))).catch(error => console.log(error))

mongoose.connection.on("disconnected", () => {
    console.log("MongoDatabase disconnected")
})
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/categories", categoryRoutes)

// dns.resolve('safaricom.com', (err, value) => { 
//     if(err) { 
//         console.log(err); 
//         return; 
//     } 
//     console.log(value); 
// })
// console.log(dns.lookup)
// app.listen(4000)

// System Design Principles: Deep understanding of designing complex systems, including modularity, scalability, flexibility, and maintainability.
// Architecture Patterns: Proficiency in architectural patterns like microservices, monolithic, serverless, and event-driven architectures, and choosing the appropriate one for the project’s needs. 
// DevOps Knowledge: Experience with Git deployment, automation of CI/CD pipelines, version control, containerization. 
// ODK Expertise: Experience in configuring, setting up, tweaking, and integrating ODK tools. 
// Database Skills: Proficiency in relational databases and SQL. In-depth knowledge of various databases (SQL, NoSQL, MysQL, MSSQL, caching) and when to use each based on the application’s requirements. 

// Developer at Medbook Kenya Limited
// Bachelor's degree in Computer Science, Software Engineering, or related fields (though not always a strict requirement).
// 2 – 4 years of experience in software development demonstrated with a portfolio of projects.
// Familiarity with front-end and back-end programming languages such as typescript (with Angular framework), PHP (with Laravel framework), or others as well as the use of 3rd party libraries.
// Basic understanding of software development principles, data structures, and algorithms.
// Basic understanding of database operations and database maintenance for common databases (MySQL, MariaDB, MS SQL server, etc.).
// Familiarity with version control systems (e.g., Bitbucket) and software development methodologies (e.g., Agile, Scrum).
// Problem-solving skills and the ability to work in a team-oriented environment.
// Strong communication skills to effectively collaborate with team members and stakeholders.
// Eagerness to learn and adapt to new technologies and concepts quickly.
// Attention to detail and a commitment to producing quality code and software solutions.
// Understanding of SEO practices.
// The Junior Developer will contribute to the growth and success of the projects they are involved in. He or she will have the opportunity to gain valuable experience and develop their technical skills while working alongside experienced professionals in the field.
// software developer at sofcalns
// Bachelor’s degree in Computer Science or a related field.
// Have some working knowledge in JavaScript, PostgreSQL, PHP, Laravel, React
// Be knowledgeable in Object oriented programming and web application development
// Knowledge of HTML, CSS, REST/SOAP messaging protocols, object-oriented programming concepts and relational databases.
// A solid understanding of how web applications work including security, session management, and best development practices
// Be a creative thinker and be self-driven
// Have excellent verbal and written communication skills, with the ability to work independently and as part of a team