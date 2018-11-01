function q(query) {
    return document.querySelector(query);
}

q.all = function(query) {
    return document.querySelectorAll(query);
}

export default q