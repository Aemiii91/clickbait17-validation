export default function tweetLinks(text) {
    return text
    .replace(/(^|\s)(@|#)(.*?)(?=$|\W)/g, function(result, m1, m2, m3) {
        return `${m1}<a href="https://twitter.com/${(m2 == "#" ? "hashtag/":"") + m3}" target="_blank">${m2 + m3}</a>`;
    });
}