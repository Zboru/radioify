import * as cors from "cors";

require('dotenv').config()
import * as express from 'express';
import * as path from "path";
const app: express.Application = express();

app.use(cors());
app.use(express.urlencoded({extended: true}) as express.RequestHandler);
app.use(express.json() as express.RequestHandler)

const port: number = Number(process.env.PORT) || 4444;

const distPath = path.resolve(`${__dirname}../../../dist`);
app.use(express.static(distPath));

import routes from './routes'
app.use(routes)

app.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(distPath + '/index.html');
});

app.listen(port);
console.log(`App listening on ${port}`);


