# Webis-Clickbait-17

*DISCLAIMER: This content was copied from https://webis.de/data/webis-clickbait-17.html (01-Nov-2018)

## Synopsis

The Webis Clickbait Corpus 2017 (Webis-Clickbait-17) comprises a total of 38,517 Twitter posts from 27 major US news publishers. In addition to the posts, information about the articles linked in the posts are included. The posts had been published between November 2016 and June 2017. To avoid publisher and topical biases, a maximum of ten posts per day and publisher were sampled. All posts were annotated on a 4-point scale \[not click baiting (0.0), slightly click baiting (0.33), considerably click baiting (0.66), heavily click baiting (1.0)\] by five annotators from Amazon Mechanical Turk. A total of 9,276 posts are considered clickbait by the majority of annotators. In terms of its size, this corpus outranges the [Webis Clickbait Corpus 2016](https://webis.de/data/corpus-webis-clickbait-16.html) by one order of magnitude. The corpus is divided into two logical parts, a training and a test dataset. The training dataset has been released in the course of the [Clickbait Challenge](http://www.clickbait-challenge.org/) and a download link is provided below. To allow for an objective evaulatuion of clickbait detection systems, the test dataset is available only through the Evaluation-as-a-Service platform [TIRA](http://www.tira.io/) at the moment. On TIRA, developers can deploy clickbait detection systems and execute them against the test dataset. The performance of the submitted systems can be viewed on the [TIRA page of the Clickbait Challenge](http://www.tira.io/task/clickbait-detection/dataset/clickbait17-test-170720/).

## Download

To download the corpus use the following links:

* [clickbait17-train-170630.zip](http://www.uni-weimar.de/medien/webis/corpora/corpus-webis-clickbait-17/clickbait17-train-170630.zip) (894 MiB, 19538 posts)
* clickbait17-test-170720.zip (892 MiB, 18979 posts, currently only accessible through [TIRA](http://www.tira.io/task/clickbait-detection/dataset/clickbait17-test-170720/), available as download after the next clickbait challenge)

Each corpus zip file comprises the following resources:

* `instances.jsonl`: A line delimited JSON file (JSON Lines). Each line is a JSON-Object containing the information extracted for a specific post and its target article. Have a look at the [dataset schema file](https://webis.de/data/clickbait17-dataset-schema.txt) for an overview of the available fields.
* `truth.jsonl`: A line delimited JSON file. Each line is a JSON-Object containing the crowdsourced clickbait judgements of a specific post. Have a look at the [dataset schema file](https://webis.de/data/clickbait17-dataset-schema.txt) for an overview of the available fields.
* `media/`: A folder that contains all the images referenced in the instances.jsonl file.

In addition to the corpus, we provide the original WARC archives of the articles that are linked in the posts:

* [archives-clickbait17-train-170630.zip](https://webis18.medien.uni-weimar.de/tmp/archives-clickbait17-train-170630.zip) (94.3 GiB)
* archives-clickbait17-test-170720.zip (available as soon as the test corpus can be downloaded)

The WARC archives may be used to redo the content analysis that we performed to provide information about the linked articles in the corpus. Each article archive zip file comprises a folder for each post in the respective corpus zip file. The folders are labeled with the id of the post they refer to. To avoid a single gigantic folder, each article folder is put into a parent folder according to the last two digits of its name. Each article folder contains:

* `original-url.txt` A text file that contains the url of the link that was stated in the respective post.
* *`id`*`.warc` The WARC archive recorded when requesting the link in the respective post.
* *`id`*`-live.png` A screenshot of the archived article.
* `url_`*`id`*`.html` The html file of the article that is contained, together with other resources, also in the WARC. Note that this file might differ from the version in the WARC archive.

## Software

To make working with the Webis Clickbait Corpus 2017 convenient, and to allow for its validation and replication, we are developing and sharing a number of software projects:

* [Corpus Viewer](https://github.com/webis-de/corpus-viewer). Our Django web service for exploring corpora. For importing the Webis Clickbait Corpus 2017 into the corpus viewer, we provide an appropriate [configuration file](https://webis.de/data/clickbait17-corpus-viewer-config.py).
* [MTurk Manager](https://github.com/webis-de/mturk-manager). Our Django web service for conducting sophisticated crowd sourcing tasks on Amazon Mechanical Turk. The service allows to manage projects, upload batches of HITS, apply custom reviewing interfaces, and more. To make the clickbait crowd-sourcing task replicable, we share the [worker template](https://webis.de/data/clickbait17-worker-template.html) that we used to instruct the workers and to display the tweets. Also shared is a [reviewing template](https://webis.de/data/clickbait17-review-template.html) that can be used to accept/reject assignments and to assess the quality of the received annotations quickly.
* [Web Archiver](https://github.com/webis-de/webis-web-archiver). Software for archiving web pages as WARC files and reproducing them later on. This software can be used to open the WARC archives provided above.

## Research

Clickbait refers to a certain kind of web content advertisement that is designed to entice its readers into clicking an accompanying link. Typically, it is spread on social media in the form of short teaser messages that may read like the following examples:

* A Man Falls Down And Cries For Help Twice. The Second Time, My Jaw Drops
* 9 Out Of 10 Americans Are Completely Wrong About This Mind-Blowing Fact
* Here’s What Actually Reduces Gun Violence

When reading such and similar messages, many get the distinct impression that something is odd about them; something unnamed is referred to, some emotional reaction is promised, some lack of knowledge is ascribed, some authority is claimed. Content publishers of all kinds discovered clickbait as an effective tool to draw attention to their websites. The level of attention captured by a website determines the prize of displaying ads there, whereas attention is measured in terms of unique page impressions, usually caused by clicking on a link that points to a given page (often abbreviated as “clicks”). Therefore, a clickbait’s target link alongside its teaser message usually redirects to the sender’s website if the reader is afar, or else to another page on the same site. The content found at the linked page often encourages the reader to share it, suggesting clickbait for a default message and thus spreading it virally. Clickbait on social media has been on the rise in recent years, and even some news publishers have adopted this technique. These developments have caused general concern among many outspoken bloggers, since clickbait threatens to clog up social media channels, and since it violates journalistic codes of ethics.

## People

* [Martin Potthast](http://www.uni-weimar.de/medien/webis/people/#potthast "Martin Potthast")
* [Tim Gollub](http://www.uni-weimar.de/medien/webis/people/#gollub "Tim Gollub")
* [Matti Wiegmann](http://www.uni-weimar.de/medien/webis/people/#wiegmann "Matti Wiegmann")
* [Benno Stein](http://www.uni-weimar.de/medien/webis/people/#stein "Benno Stein")
* [Matthias Hagen](http://www.uni-weimar.de/medien/webis/people/#hagen "Matthias Hagen")

Students: Kristof Komlossy, Sebstian Schuster, Erika P. Garces Fernandez.