export default function tweetLinks(text) {
    return text
    .replace(/(#.*?)(?=$|\W)/g, function(result, match) {
        return `<a>${match}</a>`;
    })
    .replace(/(@.*?)(?=$|\W)/g, function(result, match) {
        return `<a>${match}</a>`;
    });
}