const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function readJson(fileName) {
  const filePath = path.join(__dirname, 'data', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeDealership(dealer) {
  return {
    id: dealer.id,
    city: dealer.city,
    state: dealer.state,
    address: dealer.address,
    zip: dealer.zip,
    lat: dealer.lat,
    long: dealer.long,
    short_name: dealer.short_name,
    full_name: dealer.full_name,
  };
}

function deriveSentiment(reviewText) {
  const text = String(reviewText || '').toLowerCase();
  const positiveWords = ['great', 'good', 'excellent', 'amazing', 'awesome', 'love', 'best', 'recommend'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'hate', 'worst', 'disappointing', 'horrible'];

  const positiveScore = positiveWords.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
  const negativeScore = negativeWords.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);

  if (positiveScore > negativeScore) {
    return 'positive';
  }
  if (negativeScore > positiveScore) {
    return 'negative';
  }
  return 'neutral';
}

let reviews = readJson('reviews.json').reviews.map((review) => ({
  ...review,
  sentiment: review.sentiment || deriveSentiment(review.review),
}));

const dealerships = readJson('dealerships.json').dealerships.map(normalizeDealership);

app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API');
});

app.get('/fetchReviews', async (req, res) => {
  try {
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const dealerId = Number(req.params.id);
    const documents = reviews.filter((review) => Number(review.dealership) === dealerId);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealers', async (req, res) => {
  try {
    res.json(dealerships);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const state = String(req.params.state || '').trim();
    if (!state || state.toLowerCase() === 'all') {
      res.json(dealerships);
      return;
    }

    const documents = dealerships.filter(
      (dealer) => dealer.state === state || dealer.short_name === state || dealer.full_name === state,
    );
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealerId = Number(req.params.id);
    const documents = dealerships.filter((dealer) => Number(dealer.id) === dealerId);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.post('/insert_review', async (req, res) => {
  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const nextId = reviews.length > 0 ? Math.max(...reviews.map((review) => Number(review.id))) + 1 : 1;
    const savedReview = {
      id: nextId,
      name: data.name,
      dealership: Number(data.dealership),
      review: data.review,
      purchase: Boolean(data.purchase),
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: Number(data.car_year),
      sentiment: deriveSentiment(data.review),
    };

    reviews.push(savedReview);
    res.json({ status: 200, review: savedReview });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
