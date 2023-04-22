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
  const prompt = `Please summarize the following text into a list of detailed, concise key takeaways. Each takeaway must be in 50 words or less. Prompt is as follows:\n\n${text}\n\t`;

  try {
    const response = await openai.complete({
      engine: 'text-davinci-002',
      prompt: prompt,
      maxTokens: 500,
      temperature: 0.5,
      n: 1,
      stop: '\n ',
    });

    console.log(response);
    const summary = response.data.choices[0].text.trim();

    // split the summary by newline character
    let statements = summary.split('\n-');
    
    // remove the first character of each string that starts with a `-`
    statements = statements.map(statement => {
      if (statement.startsWith('-')) {
        return statement.substring(1).trim();
      } else {
        return statement.trim();
      }
    });
    
    // create the list
    const listItems = statements.map(statement => `<li>${statement}</li>`).join('');
    
    // send the list as the response
    const responseHtml = `<ul>${listItems}</ul>`;
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



// // Server processes request and responds to client.
// app.post('/summarize', async (req, res) => {
//     const text = req.body.text;
//     const summarizedText = await summarizeText(text);
//     res.send(summarizedText);
// });
  
// async function summarizeText(text) {
//     const response = await openai.api({
//       engine: 'davinci',
//       prompt: text,
//       maxTokens: 60,
//       n: 1,
//       temperature: 0.7,
//     }, { headers: { Authorization: `Bearer ${apiKey}` } });
//     return response.choices[0].text;
//   }

// // RUN SERVER
// app.listen(port, function () {
//     console.log("Server running on port " + port + "!");
// });
