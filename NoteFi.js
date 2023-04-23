// REQUIRES
const OpenAI = require("openai-api");

// Set up your OpenAI API key
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;
const fs = require('fs');

// Mapping file system paths to the app's virtual paths
app.use('/js', express.static('./public/js'));
app.use('/css', express.static('./public/css'));
app.use('/img', express.static('./public/img'));
app.use('/font', express.static('./public/font'));

// Use CORS middleware
app.use(cors());

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Use JSON parser middleware
app.use(express.json());

// Responds with index.html
app.get("/", function (req, res) {
  let doc = fs.readFileSync("./app/html/index.html", "utf8");

  // Send the HTTP response
  res.send(doc);
});

// Define summary endpoint
app.post('/summarize', async (req, res) => {
  const text = req.body.text;

  // Slider value dictates length of notes
  const sliderValue = parseInt(req.body.sliderValue);
  console.log(sliderValue);

  const numWords = parseInt(req.body.numWords);

  console.log(typeof numWords);
  console.log(numWords);
  console.log(sliderValue);

  switch (sliderValue) {
    case 1:
      console.log('Setting 1 selected: Max 3 statements');

      if (numWords >= 300) {
        var maxWords = (Math.floor(numWords * 0.25) + 50);
        var minWords = (Math.floor(numWords * 0.25) - 100);
        var num = 3;
        var minNum = 3;
      } else {
        var maxWords = (numWords + 50);
        var minWords = numWords;
        var num = 3;
        var minNum = 3;
      }

      break;
    case 2:
      console.log('Setting 2 selected: Max 7 statements');

      if (numWords >= 300) {
        var maxWords = (Math.floor(numWords * 0.50) + 50);
        var minWords = (Math.floor(numWords * 0.50) - 100);
        var num = 7;
        var minNum = 6;
      } else if (numWords >= 150) {
        var maxWords = (numWords + 50);
        var minWords = numWords;
        var num = 5;
        var minNum = 4;
      } else {
        var maxWords = (numWords + 50);
        var minWords = numWords;
        var num = 3;
        var minNum = 2;
      }

      break;
    case 3:
      console.log('Setting 3 selected: Max 11 statements');

      if (numWords >= 300) {
        var maxWords = (Math.floor(numWords * 0.75) + 50);
        var minWords = (Math.floor(numWords * 0.75) - 100);
        var num = 11;
        var minNum = 10;
      } else if (numWords >= 150) {
        var maxWords = (numWords + 50);
        var minWords = numWords;
        var num = 7;
        var minNum = 5;
      } else {
        var maxWords = (numWords + 50);
        var minWords = numWords;
        var num = 3;
        var minNum = 2;
      }

      break;
    default:
      console.log('Invalid setting selected');
      var num = 0;
      var maxWords = 0;
      break;
  }

  console.log(maxWords);

  const prompt = `In this new request, summarize the following text into a new complete list that must always have between ${minNum} to ${num} detailed, concise key takeaways that are each complete sentences less than 50 words, where the total word count of the entire list is always between ${minWords} and ${maxWords}; it is crucial that the list always has at least ${minNum} total list items and at most ${num} list items. The text is as follows:\n\n${text}\n\t`;

  try {
    const response = await openai.complete({
      engine: 'text-davinci-002',
      prompt: prompt,
      maxTokens: maxWords,
      temperature: 0.5,
      n: 3,
      stop: '\n ',
    });

    console.log(response);
    const summary = response.data.choices[0].text.trim();

    // split the summary by newline character
    let statements = summary.split('\n');

    // remove numbered and hyphen bullet points from start of each statement
    statements = statements.map(statement => {
      const regex = /^\s*(?:\d+\.|-)\s*/g; // matches numbered bullet points and hyphen bullet points at the start of each line
      return statement.trim().replace(regex, '').trim();
    });

    // create the list and if more than 7 items, disregard the last item.
    if (statements.length > 7) {
      statements = statements.slice(0, -1);
    }

    const listItems = statements.map(statement => `<li>${statement}</li>`).join('');

    // send the list as the response
    const responseHtml = `<ul id="output">${listItems}</ul>`;
    res.send(responseHtml);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// For page not found (i.e., 404)
app.use(function (req, res, next) {
  res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
