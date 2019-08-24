function replaceTextWithEmojiSpan(elem, s) {
  const text = document.createTextNode(s);
  let span = document.createElement('span');
  span.style.fontFamily = 'emoji';
  span.style.fontSize = '125%';
  span.appendChild(text);
  elem.replaceWith(span);
}


function replaceCodePointWithEmojiSpan(elem, hex) {
  const ord = parseInt(hex, 16);
  if (!isNaN(ord)) {
    replaceTextWithEmojiSpan(elem, String.fromCodePoint(ord));
  }
}


function fixEmoji() {
  // Hangouts
  for (const elem of document.querySelectorAll('span[data-emo], img[data-emo]')) {
    const text = elem.dataset['emo'];
    if (elem.parentNode.classList.contains('editable')) {
      elem.replaceWith(document.createTextNode(text));
    } else {
      replaceTextWithEmojiSpan(elem, text);
    }
  }
  // GitHub
  for (const elem of document.querySelectorAll('g-emoji img')) {
    const url = elem.parentNode.getAttribute('fallback-src').split('/');
    const hex = url[url.length - 1].split('.')[0];
    replaceCodePointWithEmojiSpan(elem.parentNode, hex);
  }
  // Slack (old)
  for (const elem of document.querySelectorAll('span.emoji-outer')) {
    const hex = elem.dataset['codepoints'].split('-')[0];
    replaceCodePointWithEmojiSpan(elem, hex);
  }
  // Slack (new)
  for (const elem of document.querySelectorAll('span.c-emoji')) {
    const img = elem.querySelector('img');
    if (img && img.src && img.src.includes('google')) {
      const hex = img.src.split('/').pop().split('@');
      replaceCodePointWithEmojiSpan(elem, hex);
    }
  }
};

const observer = new MutationObserver(fixEmoji);
observer.observe(document.body, { 'childList': true, 'subtree': true });
