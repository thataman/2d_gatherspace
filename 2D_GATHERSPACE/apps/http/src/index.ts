import express from "express"
import { router as centralroute } from "./routes/centralroute"
const app = express()

app.use("/api/v1" , centralroute)



const port = process.env.port || 4444
app.listen(port ,()=>{
    console.log("listening to port");
    
})