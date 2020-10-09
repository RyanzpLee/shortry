const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid');

require('dotenv').config();

const db = monk(process.env.MONGO_URI);
const urls = db.get('urls');
urls.createIndex({ alias: 1 }, { unique: true }); // Index on name so we can search by names

const app = express();
app.enable('trust proxy');

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('./public'));

app.get('/id', async (req, res, next) => {
  const { id: alias } = req.params;
  try {
    const url = await urlsFindOne({ alias });
    if (url) {
      return res.redicrect(url.url);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

const schema = yup.object().shape({
  alias: yup
    .string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
});

app.post('/url', async (req, res, next) => {
  let { alias, url } = req.body;

  try {
    await schema.validate({
      alias,
      url,
    });

    if (!alias) {
      alias = nanoid(7);
    } else {
      const existing = await urls.findOne({ alias });
      if (existing) {
        throw new Error('Alias in use.');
      }
    }

    alias = alias.toLowerCase();
    const newUrl = {
      url,
      alias,
    };
    const created = await urls.insert(newUrl);
    res.json(created);
    res.end();
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  res.status(404).sendFile(notFoundPath);
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

const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
