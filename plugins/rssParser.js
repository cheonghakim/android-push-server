const Parser = require('rss-parser')
const RssService = require('../service/v1/rss')
const NewsService = require('../service/v1/news')
const FeedService = require('../service/v1/feed')
const iconv = require('iconv-lite')
const htmlToText = require('html-to-text')

class RssParser {
  constructor() {
    this.parser = new Parser({
      headers: {
        Accept: 'application/rss+xml, application/xml',
      },
    })
    this.rssList = []
  }

  async init() {
    await this.getRssList()
  }

  async getRssList() {
    try {
      const data = await RssService.getRssList()
      if (data) {
        this.rssList = data?.map((item) => item.link) || []
      }
    } catch (error) {
      console.error(error)
    }
  }

  async updateRss() {
    try {
      for (let i = 0; i < this.rssList.length; i += 1) {
        try {
          const updatedFeeds = []
          const feed = await this.parser.parseURL(this.rssList[i])
          // Feed 등록
          const savedFeed = await FeedService.saveFeed({
            link: feed.link,
            title: htmlToText.htmlToText(feed.title),
            created_date: `${new Date()}`,
          })

          // Feed 아이템 등록
          await Promise.allSettled(
            feed.items.map(
              async (item) =>
                await NewsService.saveNews({
                  title: htmlToText.htmlToText(item.title),
                  content: htmlToText.htmlToText(item.content),
                  link: item.link,
                  feedId: savedFeed['last_insert_rowid()'],
                  created_date: `${new Date()}`,
                  author: item.author,
                })
            )
          )

          feed.feedId = savedFeed['last_insert_rowid()']
          updatedFeeds.push(feed)
          return updatedFeeds
        } catch (error) {
          console.error(error)
          continue
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  encoding(str) {
    const buffer = Buffer.from(str, 'utf-8')
    const decodedString = iconv.decode(buffer, 'utf-8')
    return decodedString
  }
}

module.exports = RssParser
