var sanitizeHtml = require('sanitize-html');

module.exports = {
    sanitizeHtml: function (html) {
        return sanitizeHtml(html, {
            allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span', 'u', 'font'],
            allowedAttributes: {
                '*': ['style', 'color', 'class']
            }
        });
    }
};