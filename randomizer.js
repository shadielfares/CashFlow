const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/random-sentence', (req, res) => {
    const sentences = [];
    fs.createReadStream('./ideachunks/chunk_11.csv')
        .pipe(csv())
        .on('data', (row) => {
            sentences.push(row.sentence);
        })
        .on('end', () => {
            const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
            res.send(randomSentence);
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
