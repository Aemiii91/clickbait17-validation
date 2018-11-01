export default function fetchQueue(urls) {
    var queue = [],
        output = [];

    if (typeof urls === "string") urls = [urls];

    urls.forEach(function(url, index) {
        queue.push(
            fetch(url)
            .then(function(response) {
                return response.text();
            })
            .then(function(data) {
                output[index] = data;
            })
        );
    });

    return Promise.all(queue).then(function() {
        return output;
    });
}