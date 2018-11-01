import moment from "moment";

var corpusPath = "clickbait17-train-170630";

var data = {
    url: corpusPath + '/instances.jsonl',
    text: null,
    truth: { url: corpusPath + '/truth.jsonl', text:null },
    lookup: {},
    count: 0
};


function init() {
    var queue = [];

    addToQueue(queue, data);
    addToQueue(queue, data.truth);

    Promise.all(queue)
    .then(function() {
        console.log('instances.jsonl lines:', data.lines.length);

        data.count = data.lines.length;

        data.truth.items = parseLines(data.truth.lines, 'truth');
        console.log('truth.jsonl items:', data.truth.items.length);

        var container = q("#listContainer");
        container.textContent = "";

        var listContent = document.createElement("div");
        listContent.id = "listContent";
        listContent.classList.add("list-content");

        var segment = prompt(
`Choose where to start. 100 items will be viewed.
Click cancel to start from a random item.

Enter number (from 1 - ${data.count}):`, 1) || Math.round(Math.random()*data.count);

        // validate user input
        segment = (segment <= 0 ? 1 : (segment > data.count ? data.count : segment)) - 1;

        for (var i = 0; i < 100; i++) {
            if ((segment + i) >= data.count) break;
            listContent.appendChild(renderItem(segment + i));
        }

        container.appendChild(listContent);
    });

    q("#targetContainer").addEventListener("click", closeArticle);
}


function addToQueue(queue, file) {
    queue.push(
        fetch(file.url)
        .then(function (response) {
            return response.text();
        })
        .then(function(text) {
            // replacing linefeeds and whitespace at end of file
            file.text = text.replace(/(\n|\r|\s)+$/, '');

            file.lines = file.text.split(/\r?\n/);
        })
    );
}

function parseLines(lines) {
    return lines.map(function(line, i) {
        var item = null;
        if (line) {
            item = JSON.parse(line);

            // add truth item to data.lookup
            if (item.hasOwnProperty("truthMean")) {
                data.lookup[item.id] = i;
            }
        }
        return item;
    });
}

function getItemData(index) {
    var stringData = data.lines[index];
    var item = JSON.parse(stringData);

    var truthData = data.truth.items[data.lookup[item.id]];

    item.truth = {
        id: truthData.id,
        class: truthData.truthClass,
        mean: truthData.truthMean,
        median: truthData.truthMedian,
        mode: truthData.truthMode,
        judgments: truthData.truthJudgments
    };
    item.timestamp = moment(item.postTimestamp, "ddd MMM DD HH:mm:ss ZZ YYYY");

    return item;
}

function renderItem(index) {
    var el = document.createElement('div');
    var item = getItemData(index);

    var mediaTag = "";

    if (item.postMedia.length > 0) {
        mediaTag = `<figure class="media"><img src="${corpusPath + "/" + item.postMedia[0]}"></figure>`;
    }

    var truthText = "", score = Math.round(item.truth.median*3);

    switch (score) {
        case 0: truthText = "Not click baiting";            break;
        case 1: truthText = "Slightly click baiting";       break;
        case 2: truthText = "Considerably click baiting";   break;
        case 3: truthText = "Heavily click baiting";        break;
    }

    el.innerHTML = `<article class="card ${item.truth.class}" data-index="${index}">
    <div class="tweet">
        <header>
            <div class="author"><b class="username"><span class="striked-text">${randBlankString(20, 40)}</span></b><span class="tag"><span class="striked-text">${randBlankString(12, 24)}</span></span></div>
            <p class="message">${addTweetLinks(item.postText[0])}</p>
        </header>
        <section class="target">
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
        <progress class="truth" title="${truthText}" max=1 value=${item.truth.mean}></progress>
    </footer>
</article>`;

    el.querySelector("section.target").addEventListener("click", function() {
        viewArticle(index);
    });

    return el;
}

function randBlankString(min, max) {
    var count = min + Math.round(Math.random()*(max-min));
    return (new Array(count)).join('\u00a0');
}

function addTweetLinks(text) {
    return text
    .replace(/(#.*?)(?=$|\W)/g, function(result, match) {
        return `<a>${match}</a>`;
    })
    .replace(/(@.*?)(?=$|\W)/g, function(result, match) {
        return `<a>${match}</a>`;
    });
}


function viewArticle(index) {
    var container = q("#targetContainer");
    var content = q("#targetContent");
    var item = getItemData(index);

    var mediaTag = "";

    if (item.postMedia.length > 0) {
        mediaTag = `<figure class="media"><img src="${corpusPath + "/" + item.postMedia[0]}"></figure>`;
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

        paragraph.innerHTML = addTweetLinks(text);
        paragraph.setAttribute("data-word-count", wordCount);
        paragraph.classList.add("paragraph-" + wordCountClass);

        articleBody.appendChild(paragraph);
    });

    container.classList.add("visible");
    container.scrollTop = 0;
}

function closeArticle(event) {
    var container = q("#targetContainer"),
        closeButton = q("#closeButton");

    if (event.target === container || event.target === closeButton) {
        container.classList.remove("visible");
        document.body.classList.remove("no-scroll");
    }
}


function q(query) {
    return document.querySelector(query);
}

function qa(query) {
    return document.querySelectorAll(query);
}


init();