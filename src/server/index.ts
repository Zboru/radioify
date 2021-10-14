import {Request, RequestHandler, Response} from "express";
const path = require('path')
const cors = require('cors');
const express = require('express');
require('dotenv').config()
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json())

const port: number = Number(process.env.PORT) || 4444;

const distPath = path.resolve(`${__dirname}../../../dist`);
app.use(express.static(distPath));

import routes from "./routes"
app.use(routes)

app.get('/*', (req: Request, res: Response) => {
    res.sendFile(distPath + '/index.html');
});

app.listen(port);
console.log(`App listening on ${port}`);
