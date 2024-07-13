import 'dotenv/config';
import express from "express";
import CORS from 'cors';
import connectDB from './config/database.js';
import { allowedOrigins } from './config/config.js';
import routes from './routes/routes.js'

const PORT = process.env.PORT || process.env.SERVER_PORT;

//Setting up Express Application
const app = express()

//------------Middlewares----------

//Parse Request Body
app.use(express.json())

//Handle CORS Policy
// app.use(CORS({}))
app.use(CORS({ 
        origin: allowedOrigins, 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], 
        allowedHeaders: ['Content-Type']
    })
)

//Cookies
// app.use(cookieParser());

//Routes
app.use('/', routes)

//--------------------------Database Connection----------------------------
connectDB().then((res) => {
    if(res == true) app.listen(PORT, () => console.log(`App is listening to port: ${PORT}`));
    else {
        console.log('Database connection failed');
        process.exit(0)
    }
})