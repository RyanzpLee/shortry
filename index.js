const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid');

require('dotenv').config();

// mongodb+srv://ryan:dbShortRy@cluster0.minbk.mongodb.net/<dbname>?retryWrites=true&w=majority
MONGO_URI = 'mongodb+srv://ryan:dbShortRy@cluster0.minbk.mongodb.net/<dbname>?retryWrites=true&w=majority';
const db = monk(MONGO_URI);
const urls = db.get('urls');
urls.createIndex('name');

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

const schema = yup.object().shape({
  alias: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

app.get('/url', async (req, res) => {
  let { alias, url } = req.body;
  try {
    await schema.validate({
      slug,
      url,
    });
    if (!alias) {
      alias = nanoid(7);
    }
    alias = alias.toLowerCase();
    res.json({
      alias,
      url,
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.massage,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

const port = process.env.PORT || 6464;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
