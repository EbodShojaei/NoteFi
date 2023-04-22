const textArea = document.getElementById('text-input');
const wordCount = document.getElementById('word-count');

textArea.addEventListener('input', () => {
  const text = textArea.value.trim();
  const numWords = text ? text.split(/\s+/).length : 0;
  wordCount.innerText = `Word count: ${numWords}`;
});
