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
    count: 0,
    currentPage: -1,
    itemsPerPage: 50
};

var settings = JSON.parse(localStorage.getItem('settings')) || {
    currentPage: 1,
    scrollTop: 0
};

var scrollTimer;


function init() {
    q("#currentPage").value = settings.currentPage;

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
        container.appendChild(listContent);

        loadPage(settings.currentPage);

        document.documentElement.scrollTop = settings.scrollTop || 0;

        window.addEventListener("scroll", function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                saveSetting("scrollTop", Math.round(document.documentElement.scrollTop));
            }, 500);
        });

        q("#prevPageBtn").addEventListener("click", function() {
            loadPage(data.currentPage - 1);
        });
        q("#nextPageBtn").addEventListener("click", function() {
            loadPage(data.currentPage + 1);
        });
        q("#currentPage").addEventListener("change", function() {
            loadPage(this.value);
        });
        q("#currentPage").addEventListener("focus", function() {
            this.select();
        });

        document.body.addEventListener("mousedown", function() {
            var el = q(".card.active");
            if (el) el.classList.remove("active");
        });
        document.body.addEventListener("keydown", function(event) {
            if (event.ctrlKey && event.key === "g") {
                var index = prompt('Go to:');

                if (!isNaN(index)) {
                    var page = Math.ceil(index/data.itemsPerPage);
                    if (data.currentPage !== page) loadPage(page);

                    setTimeout(function() {
                        var el = q(".card#card_" + (index-1));

                        if (el) {
                            document.documentElement.scrollTop = el.offsetTop - 20;
                            el.classList.add("active");
                        }
                    }, 100);
                }

                event.preventDefault();
            }
            else if (event.keyCode === 27) { // ESC
                var el = q(".card.active");
                if (el) el.classList.remove("active");
                if (document.body.classList.contains("overlay-visible")) {
                    document.body.classList.remove("overlay-visible");
                    if (data.lastFocusedItem) data.lastFocusedItem.focus();
                }
                else {
                    document.activeElement.blur();
                }
            }
        });
    });
}

function loadPage(page) {
    var page_count = Math.ceil(data.count/data.itemsPerPage);
    if (page > page_count) page = page_count;
    if (page < 1) page = 1;

    document.body.classList.remove("overlay-visible");

    if (data.currentPage === page) return;

    data.currentPage = page;
    saveSetting("currentPage", page);

    q("#currentPage").value = page;
    q("#currentPage").setAttribute("max", page_count);
    q("#totalPagesCount").textContent = page_count;

    var listContent = q("#listContent");
    listContent.textContent = "";

    var startFrom = (page - 1) * data.itemsPerPage;

    for (var i = 0; i < data.itemsPerPage; i++) {
        var index = startFrom + i;
        if (index >= data.count) break;

        var el = renderItem(getItemData(index));

        listContent.appendChild(el);

        el.querySelector(".target").addEventListener("click", function(event) {
            viewArticle(getItemData(this.getAttribute("data-item")));
            event.preventDefault();
        });
        el.querySelector(".target").addEventListener("keydown", function(event) {
            if (event.keyCode === 13) {
                data.lastFocusedItem = this;
                viewArticle(getItemData(this.getAttribute("data-item")));
                event.preventDefault();
            }
        });
    }

    document.documentElement.scrollTop = 0;
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

function saveSetting(propName, propValue) {
    settings[propName] = propValue;
    localStorage.setItem('settings', JSON.stringify(settings));
}


init();