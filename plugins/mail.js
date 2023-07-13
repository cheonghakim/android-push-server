const nodemailer = require('nodemailer')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

/**
 * Mail 템플릿을 만들고 발송
 */
class Mail {
  constructor() {
    this.sender = process.env.MAIL_SENDER
    // SMTP 설정 (Gmail 사용)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.sender, // Gmail 계정 이메일 주소
        pass: process.env.MAIL_PW, // Gmail 계정 비밀번호
      },
    })
  }

  /**
   * 메일을 발송한다
   * @param {string} title
   * @param {string} content
   * @param {string} receiver
   * @returns {Promise<*>}
   * @throws {Promise<Error>}
   */
  async sendMail(title, content, receiver) {
    try {
      // 이메일 옵션
      const mailOptions = {
        from: this.sender, // 발신자 이메일 주소
        to: receiver, // 수신자 이메일 주소
        subject: title, // 이메일 제목
        text: content,
        // html: content, // 이메일 본문 (HTML 형식)
      }
      // 이메일 발송
      return await this.transporter.sendMail(mailOptions)
    } catch (error) {
      await Promise.reject(error)
    }
  }

  /**
   * 타겟 리스트를 받아 순회하면서 메일을 발송합니다.
   * @param {Array<string>} targetList - 타겟 이메일 주소 리스트
   * @param {string} title - 메일 제목
   * @param {Array<News>} newsList - 뉴스 리스트
   * @returns {void}
   * @throws {Promise<Error>} - 에러 객체의 프라미스
   *
   * @typedef {Object} News - 뉴스 객체
   * @property {string} title - 뉴스 제목
   * @property {string} content - 뉴스 내용
   * @property {string} link - 뉴스 링크
   */
  async sendWithTargetList({ targetList, title, newsList }) {
    try {
      // 템플릿 생성
      const html = await this.getTemplate(newsList)
      for (let i = 0; i < targetList?.length; i++) {
        // 이메일 옵션
        const mailOptions = {
          from: this.sender,
          to: targetList[i],
          subject: title,
          html,
        }
        // 이메일 발송
        await this.transporter.sendMail(mailOptions)
      }
    } catch (error) {
      await Promise.reject(error)
    }
  }

  /**
   * 템플릿을 생성한다
   * @param {Array<news>} newsList
   * @returns {Promise<string>}
   * @throws {Promise<Error>}
   *
   * @typedef {news}
   * @property {string} title
   * @property {string} content
   * @property {string} link
   */
  async getTemplate(newsList) {
    try {
      const readFileAsync = promisify(fs.readFile)
      const template = await readFileAsync('views/mail.ejs', 'utf8')
      const html = await ejs.render(template, { newsList })
      return html
    } catch (error) {
      await Promise.reject(error)
    }
  }
}

module.exports = Mail
