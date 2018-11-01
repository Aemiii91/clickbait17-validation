import q from "./query";
import tweetLinks from "./tweet-links";

export default function viewArticle(item) {
    var container = q("#targetContainer");
    var content = q("#targetContent");

    var mediaTag = "";

    if (item.postMedia.length > 0) {
        mediaTag = `<figure class="media"><img src="${item.postMedia[0]}"></figure>`;
    }

    var captionTags = "";

    item.targetCaptions.forEach(function(caption, i, captions) {
        if (captions.indexOf(caption) == i) {
            captionTags+= `<span>${caption}</span>`;
        }
        else {
            console.log('double!', caption);
        }
    });

    content.innerHTML = `
        ${mediaTag}
        <section>
            <h1 class="article-header">${item.targetTitle}</h1>
            <div class="article-body"></div>
            <footer>${captionTags}</footer>
        </section>
    `;

    var articleBody = content.querySelector(".article-body");

    item.targetParagraphs.forEach(function(text) {
        var paragraph = document.createElement("p"),
            wordCount = text.split(/\s+/).length,
            wordCountClass = "";

        if (text.replace(/\s+/g, '') === "") wordCount = 0;

        if (wordCount > 100) wordCountClass = "long";
        else if (wordCount > 50) wordCountClass = "normal";
        else if (wordCount > 10) wordCountClass = "short";
        else if (wordCount > 1) wordCountClass = "snippet";
        else if (wordCount > 0) wordCountClass = "single-word";
        else wordCountClass = "empty";

        paragraph.innerHTML = tweetLinks(text);
        paragraph.setAttribute("data-word-count", wordCount);
        paragraph.classList.add("paragraph-" + wordCountClass);

        articleBody.appendChild(paragraph);
    });

    document.body.classList.add("overlay-visible");
    container.scrollTop = 0;
}

function closeArticle(event) {
    var container = q("#targetContainer"),
        closeButton = q("#closeButton");

    if (event.target === container || event.target === closeButton) {
        document.body.classList.remove("overlay-visible");
    }
}

q("#targetContainer").addEventListener("click", closeArticle);