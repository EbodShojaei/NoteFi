console.log("client.js loaded.");

let sliderValue = 1;

// Client listens for submission of text and slider value to send request to server.
const summarizeForm = document.getElementById('summarize-form');
const summaryDiv = document.getElementById('summary');
const sliderDiv = document.getElementById('slider');
const loader = document.getElementById('loader');

sliderDiv.addEventListener('input', (event) => {
    console.log('Slider value:', event.target.value);

    // update the slider value
    sliderValue = event.target.value;
});

// Function to hide the loader element
show = false;

function toggleLoader(show) {
    if (show === true) {
        loader.style.display = 'block';
        summaryDiv.style.display = 'none'
    } else {
        loader.style.display = 'none';
        summaryDiv.style.display = 'block';
    }
}

// Function to remove the generated list when user resubmits request
function removeGeneratedList() {
    const generatedList = document.getElementById('output');
    if (generatedList) {
        generatedList.remove();
    }
}

summarizeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    toggleLoader(true);
    removeGeneratedList();

    const formData = new FormData(summarizeForm);
    const text = formData.get('text')
        .replace(/[\n\r]+/g, '') // remove line breaks
        .replace(/\s+/g, '%20') // replace spaces with %20
        .trim(); // remove leading/trailing spaces

    const numWords = getWordCount();

    if (numWords > 600) {
        toggleLoader(false);
        summaryDiv.innerHTML = 'Word count above 600. Please summarize a shorter text.';

    } else if (numWords < 100) {
        toggleLoader(false);
        summaryDiv.innerHTML = 'Word count below 100. Please summarize a longer text.';

    } else {
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
            toggleLoader(false);
            summaryDiv.innerHTML = summary;
        } else {
            toggleLoader(false);
            summaryDiv.innerHTML = 'An error occurred while summarizing the text.';
        }
    }
});
