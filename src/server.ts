import App from './app';
import * as bodyParser from 'body-parser';
import {createConnection} from 'typeorm';
import UserController from './controllers/user/user.controller'

const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config()

async function main(){        

    await createConnection({
        "type": "postgres",
        "host": process.env.DATABASE_HOST,
        "port": parseInt(process.env.DATABASE_PORT),
        "username": process.env.DATABASE_USERNAME,
        "password": process.env.DATABASE_PASSWORD,
        "database": process.env.DATABASE_NAME,
        "synchronize": true,
        "logging": false,
        "entities": [ 
           __dirname + "/entities/*/*.entity."+`${process.env.ENVIROMENT == 'dev' ? 'ts' : 'js'}`
        ]
    })


    const app = new App({
        preRoute: process.env.PRE_ROUTE_PATH,
        port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
        controllers: [
            new UserController()
        ],
        middleWares: [
            cors(),
            bodyParser.json(),
            bodyParser.urlencoded({extended : false}),
            morgan(':method :url :status - :response-time ms')
        ]
    })
    app.listen() 
}

main()