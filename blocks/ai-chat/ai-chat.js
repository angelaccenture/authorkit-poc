export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  // Build the chat UI structure
  const container = document.createElement('div');
  container.className = 'ai-chat-container';

  rows.forEach((row) => {
    const content = row.querySelector(':scope > div');
    if (!content) return;

    const heading = content.querySelector('h1, h2, h3');
    if (heading) {
      heading.classList.add('ai-chat-heading');
      container.append(heading);
      return;
    }

    // Check for text that looks like a placeholder (for input field)
    const text = content.textContent.trim();
    if (text && !content.querySelector('a') && !content.querySelector('ul, ol')) {
      // Check if this is a list of suggestions (comma-separated or multiple paragraphs)
      const paragraphs = content.querySelectorAll('p');
      if (paragraphs.length > 1) {
        // Multiple paragraphs = suggestion buttons
        const suggestions = document.createElement('div');
        suggestions.className = 'ai-chat-suggestions';
        paragraphs.forEach((p) => {
          const btn = document.createElement('button');
          btn.className = 'ai-chat-suggestion';
          btn.textContent = p.textContent.trim();
          btn.type = 'button';
          suggestions.append(btn);
        });
        container.append(suggestions);
      } else {
        // Single paragraph = input field placeholder
        const inputWrap = document.createElement('div');
        inputWrap.className = 'ai-chat-input-wrap';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'ai-chat-input';
        input.placeholder = text;
        input.setAttribute('aria-label', text);
        const sendBtn = document.createElement('button');
        sendBtn.className = 'ai-chat-send';
        sendBtn.type = 'button';
        sendBtn.setAttribute('aria-label', 'Send message');
        sendBtn.disabled = true;
        inputWrap.append(input, sendBtn);
        container.append(inputWrap);

        // Enable/disable send button based on input
        input.addEventListener('input', () => {
          sendBtn.disabled = !input.value.trim();
        });
      }
    }
  });

  el.textContent = '';
  el.append(container);
}
