console.log("client.js loaded.");

let sliderValue = 1; 

// Client listens for submission of text and slider value to send request to server.
const summarizeForm = document.getElementById('summarize-form');
const summaryDiv = document.getElementById('summary');
const sliderDiv = document.getElementById('slider');

sliderDiv.addEventListener('input', (event) => {
    console.log('Slider value:', event.target.value);
    // do something with the slider value
    sliderValue = event.target.value;
  });

summarizeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(summarizeForm);
    const text = formData.get('text')
        .replace(/[\n\r]+/g, '') // remove line breaks
        .replace(/\s+/g, '%20') // replace spaces with %20
        .trim(); // remove leading/trailing spaces
      
    const numWords = getWordCount();

    // Send a request to the server to summarize the text
    console.log('Sending request to /summarize');
    const response = await fetch('/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text, sliderValue: sliderValue, numWords: numWords })
    }).catch(err => {
        console.error('Error fetching /summarize:', err);
    });

    if (response.ok) {
        // Display the summarized text on the page
        const summary = await response.text();
        summaryDiv.innerHTML = summary;
    } else {
        summaryDiv.innerHTML = 'An error occurred while summarizing the text.';
    }
});
