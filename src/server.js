// src/server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Middleware
app.use(express.json());

// Function to fetch top headlines from newsapi.org
async function fetchTopHeadlines(country) {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
      params: {
        country,
        apiKey: NEWS_API_KEY
      }
    });

    if (!response.data || !response.data.articles || response.data.articles.length === 0) {
      throw new Error('No headlines found for the provided country');
    }

    return response.data.articles;
  } catch (error) {
    throw new Error('Error fetching top headlines: ' + error.message);
  }
}

// Routes
// Endpoint to fetch top headlines based on country
app.get('/top-headlines/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const articles = await fetchTopHeadlines(country);
    res.json(articles);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
