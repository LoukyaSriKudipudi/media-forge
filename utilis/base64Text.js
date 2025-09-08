function textToBase64(text) {
  const buffer = Buffer.from(text, 'utf8');
  const base64Text = buffer.toString('base64');
  return base64Text;
}
function base64ToText(base64Text) {
  const buffer = Buffer.from(base64Text, 'base64');
  const text = buffer.toString('utf8');
  return text;
}

module.exports = { textToBase64, base64ToText };
