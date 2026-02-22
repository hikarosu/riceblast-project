import express from "express";
import dotenv from "dotenv";
import connectionInstance from "../../Database/connectDB.js";

dotenv.config({
    path:".env"
})

const app = express();

app.use(express.json());

await connectionInstance();

app.listen(process.env.PORT,
    ()=>{
        console.log(`connection successful on port ${process.env.PORT}`);
    }
)