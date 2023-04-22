console.log("client.js loaded.");

// Client listens for submission of text to send request to server.
const summarizeForm = document.getElementById('summarize-form');
const summaryDiv = document.getElementById('summary');

summarizeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(summarizeForm);
    const text = formData.get('text');

    // Send a request to the server to summarize the text
    console.log('Sending request to /summarize');
    const response = await fetch('/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
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