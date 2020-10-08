const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

// app.get('/url:id', (req, res) => {
//   //Todo: get short url by id
// });
// app.get('/:id', (req,res) => {
//     //Todo: redirect to url
// });

// app.get('/url', (req,res) => {
//     //Todo: create a short url
// });


const port = process.env.PORT || 6464;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});