import tweetLinks from "./tweet-links";

function renderItem(item) {
    var el = document.createElement('div');

    var mediaTag = "";

    if (item.postMedia.length > 0) {
        mediaTag = `<figure class="media"><img src="${item.postMedia[0]}"></figure>`;
    }

    el.innerHTML = `<article class="card ${item.truth.class}" data-index="${item.index}">
    <div class="tweet">
        <header>
            <div class="author"><b class="username"><span class="striked-text">${randBlankString(20, 40)}</span></b><span class="tag"><span class="striked-text">${randBlankString(12, 24)}</span></span></div>
            <p class="message">${tweetLinks(item.postText[0])}</p>
        </header>
        <section class="target" data-item="${item.index}">
            ${mediaTag}
            <div class="summary">
                <h2 class="title" title="${item.targetTitle}">${item.targetTitle}</h2>
                <p class="description">${item.targetDescription}</p>
                <a class="sharedlink"><span class="striked-text">${randBlankString(24, 36)}</span></a>
            </div>
        </section>
        <time class="timestamp" datetime="${item.timestamp.format()}">${item.timestamp.format("h:mm A - MMM Do YYYY")}</time>
    </div>
    <footer>
        <p class="align-right"><code class="entry-id">${item.id}</code></p>
        <progress class="truth" title="${item.truth.text}" max=1 value=${item.truth.mean}></progress>
    </footer>
</article>`;

    return el;
}

function randBlankString(min, max) {
    var count = min + Math.round(Math.random()*(max-min));
    return (new Array(count)).join('\u00a0');
}

export default renderItem