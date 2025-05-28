window.onload = () => {
      const savedComments = JSON.parse(localStorage.getItem('comments') || "[]");
      savedComments.forEach(comment => renderComment(comment));
    };

    function addComment() {
      const input = document.getElementById('commentInput');
      const text = input.value.trim();
      if (!text) return;

      const comment = {
        message: text,
        date: new Date().toLocaleString()
      };

      renderComment(comment);

      const existing = JSON.parse(localStorage.getItem('comments') || "[]");
      existing.push(comment);
      localStorage.setItem('comments', JSON.stringify(existing));

      input.value = '';
    }

    function renderComment(comment) {
      const list = document.getElementById('commentList');
      const div = document.createElement('div');
      div.className = 'comment';

      // Convertir les sauts de ligne en <br>
      const formattedMessage = comment.message.replace(/\n/g, '<br>');

      div.innerHTML = `<p>${formattedMessage}</p><small>${comment.date}</small>`;
      list.prepend(div);
    }
