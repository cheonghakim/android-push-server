const Parser = require("rss-parser");
const RssService = require("../service/v1/rss");
const NewsService = require("../service/v1/news");
const FeedService = require("../service/v1/feed");
const htmlToText = require("html-to-text");
const FeedModel = require("../model/feed");
const NewsModel = require("../model/news");

class RssParser {
  constructor() {
    this.parser = new Parser({
      headers: {
        Accept: "application/rss+xml, application/xml",
      },
    });
    this.rssList = [];
  }

  async init() {
    await this.getRssList();
  }

  async getRssList() {
    try {
      const data = await RssService.getRssList();
      if (data) {
        this.rssList = data?.map((item) => item.link) || [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async updateRss() {
    try {
      for (let i = 0; i < this.rssList.length; i += 1) {
        try {
          const updatedFeeds = [];
          const feed = await this.parser.parseURL(this.rssList[i]);
          // Feed 등록
          const feedModel = new FeedModel({
            link: feed.link,
            title: htmlToText.htmlToText(feed.title),
            createdDate: `${new Date()}`,
          });
          const savedFeed = await FeedService.saveFeed(feedModel);

          // Feed 아이템 등록
          await Promise.allSettled(
            feed.items.map(async (item) => {
              const newsModel = new NewsModel({
                title: htmlToText.htmlToText(item.title),
                content: htmlToText.htmlToText(item.content),
                link: item.link,
                feedId: savedFeed["last_insert_rowid()"],
                createdDate: `${new Date()}`,
                author: item.author,
              });
              return await NewsService.saveNews(newsModel);
            })
          );

          feed.feedId = savedFeed["last_insert_rowid()"];
          updatedFeeds.push(feed);
          return updatedFeeds;
        } catch (error) {
          console.error(error);
          continue;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = RssParser;
