const Parser = require('rss-parser')
const service = require('../service/v1/rss')
const news = require('../service/v1/news')
const iconv = require('iconv-lite')
const mail = require('./mail')
const Firebase = require('./firebase')
const notifications = require('../service/v1/notifications')

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
    this.updateRss()
  }

  async getRssList() {
    try {
      const data = await service.getRssList()
      if (data) {
        this.rssList = data?.map((item) => item.link) || []
      }
    } catch (error) {
      console.error(error)
    }
  }

  async updateRss() {
    try {
      const targets = await notifications.getAlarmTargets()
      console.log(targets)
      const targetMailList = targets.map((item) => item.user_id)
      for (let i = 0; i < this.rssList.length; i += 1) {
        try {
          const updatedFeeds = []
          const feed = await this.parser.parseURL(this.rssList[i])

          mail.sendWithTargetList(
            targetMailList,
            feed.title,
            feed.title + '테스트 입니다.'
          )

          // Feed 등록
          // const savedFeed = await news.saveFeed({
          //   link: feed.link,
          //   title: feed.title,
          //   created_date: `${new Date()}`,
          // })

          // const message = {
          //   data: {
          //     title: "새로운 뉴스피드가 등록 되었습니다.",
          //     body: feed.title,
          //   },
          // }

          // await Firebase.sendToTargets(message)

          // Feed 아이템 등록
          // Promise.all(
          //   feed.items.map(
          //     async (item) =>
          //       await news.saveNews({
          //         title: item.title,
          //         content: item.content,
          //         link: item.link,
          //         feedId: savedFeed['last_insert_rowid()'],
          //         created_date: `${new Date()}`,
          //         author: item.author,
          //       })
          //   )
          // )

          // updatedFeeds.push(savedFeed['last_insert_rowid()'])
          // return updatedFeeds
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

module.exports = new RssParser().init()
