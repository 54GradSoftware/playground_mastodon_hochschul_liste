import {readFile} from 'fs';
import express from "express"
import cors from "cors"
import { queries } from './queries.js';

const allKeys = queries.map((query) => query.key);

const app = express()
app.options('*', cors())
app.use(cors())

app.get('/*', (req, res) => {
    const { url } = req;
    const requestKey = url.split('/')[1];
    const isValidKey = allKeys.includes(requestKey);
    if (!isValidKey) {
        res.status(404).json({ error: 'Invalid key' });
        return;
    }else{
        readFile(`./data/wikidata-mastodon-${requestKey}.json`, (err, json) => {
            let obj = JSON.parse(json);
            res.json(obj);
        });
    }
});

app.listen(3002)