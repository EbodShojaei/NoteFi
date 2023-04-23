const textArea = document.getElementById('text-input');
const wordCount = document.getElementById('word-count');

function getWordCount() {
  const text = textArea.value.trim();
  const numWords = text ? text.split(/\s+/).length : 0;
  return numWords;
}

textArea.addEventListener('input', () => {
  const numWords = getWordCount();
  wordCount.innerText = `Word count: ${numWords}`;
});

