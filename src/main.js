import moment from "moment";
import q from "./modules/query";
import fetchQueue from "./modules/fetch-queue";
import renderItem from "./modules/render-item";
import viewArticle from "./modules/view-article";


var data = {
    path: "clickbait17-train-170630/",
    filename: "instances.jsonl",
    text: "",
    lines: [],
    truth: { filename: "truth.jsonl", text: "", lines: [], items: [] },
    lookup: {},
    count: 0
};


function init() {
    fetchQueue([data.path+data.filename, data.path+data.truth.filename]).then(function(fileContents) {
        data.text = fileContents[0].replace(/(\n|\r|\s)+$/, '');
        data.lines = data.text.split(/\r?\n/);
        data.count = data.lines.length;

        data.truth.text = fileContents[1].replace(/(\n|\r|\s)+$/, '');
        data.truth.lines = data.truth.text.split(/\r?\n/);

        data.truth.items = parseLines(data.truth.lines);

        var container = q("#listContainer");
        container.textContent = "";

        var listContent = document.createElement("div");
        listContent.id = "listContent";
        listContent.classList.add("list-content");

        var segment = prompt(
`Choose where to start. 100 items will be viewed.
Click cancel to start from a random item.

Enter number (from 1 - ${data.count}):`, 1)
            || Math.round(Math.random()*data.count);

        // validate user input
        segment = (segment <= 0 ? 1 : (segment > data.count ? data.count : segment)) - 1;

        for (var i = 0; i < 100; i++) {
            var index = (segment + i);
            if (index >= data.count) break;

            var el = renderItem(getItemData(index));

            el.querySelector("section.target").addEventListener("click", function() {
                viewArticle(getItemData(this.getAttribute("data-item")));
            });

            listContent.appendChild(el);
        }

        container.appendChild(listContent);
    });
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

    item.index = index;

    if (item.postMedia.length > 0) {
        item.postMedia[0] = data.path + item.postMedia[0];
    }
    
    item.timestamp = moment(item.postTimestamp, "ddd MMM DD HH:mm:ss ZZ YYYY");

    var truthData = data.truth.items[data.lookup[item.id]];

    item.truth = {
        id: truthData.id,
        class: truthData.truthClass,
        mean: truthData.truthMean,
        median: truthData.truthMedian,
        mode: truthData.truthMode,
        judgments: truthData.truthJudgments
    };

    var score = Math.round(item.truth.median*3);

    switch (score) {
        case 0: item.truth.text = "Not click baiting";            break;
        case 1: item.truth.text = "Slightly click baiting";       break;
        case 2: item.truth.text = "Considerably click baiting";   break;
        case 3: item.truth.text = "Heavily click baiting";        break;
    }

    return item;
}


init();