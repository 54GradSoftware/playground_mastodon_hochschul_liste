import {readFile} from 'fs';
import express from "express"
import cors from "cors"

const app = express()
app.options('*', cors())
app.use(cors())

app.get('/institute-de', (req, res) => {
    readFile('./data/wikidata-mastodon-institute-de.json', (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
    });
});
app.get('/', (req, res) => {
    readFile('./data/wikidata-mastodon-hochschulen-de.json', (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
    });
});

app.listen(3002)