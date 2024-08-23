const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Load questions from questions.json
const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf8'));

// Endpoint to get questions
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});