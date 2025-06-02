//script to handle the comments part in Themes.html

// When the window finishes loading
window.onload = () => {
  // Retrieve saved comments from localStorage or initialize with an empty array
  const savedComments = JSON.parse(localStorage.getItem('comments') || "[]");

  // Render each saved comment to the comment list
  savedComments.forEach(comment => renderComment(comment));
};

// Function to handle adding a new comment
function addComment() {
  // Get the textarea input element
  const input = document.getElementById('commentInput');

  // Get the trimmed text from the input
  const text = input.value.trim();

  // If input is empty, do nothing
  if (!text) return;

  // Create a new comment object with message and timestamp
  const comment = {
    message: text,
    date: new Date().toLocaleString()
  };

  // Display the new comment in the comment list
  renderComment(comment);

  // Retrieve existing comments from localStorage
  const existing = JSON.parse(localStorage.getItem('comments') || "[]");

  // Add the new comment to the array
  existing.push(comment);

  // Save updated comments array back to localStorage
  localStorage.setItem('comments', JSON.stringify(existing));

  // Clear the textarea input
  input.value = '';
}

// Function to display a comment in the comment list
function renderComment(comment) {
  // Get the comment list container
  const list = document.getElementById('commentList');

  // Create a new div for the comment
  const div = document.createElement('div');
  div.className = 'comment';

  // Replace line breaks in the message text with <br> elements for proper formatting
  const formattedMessage = comment.message.replace(/\n/g, '<br>');

  // Set the inner HTML of the comment div with message and date
  div.innerHTML = `<p>${formattedMessage}</p><small>${comment.date}</small>`;

  // Add the new comment to the top of the list
  list.prepend(div);
}

