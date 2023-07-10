const nodemailer = require('nodemailer')
const ejs = require('ejs')
const fs = require('fs')

class Mail {
  constructor() {
    console.log(process.env.MAIL_SENDER, process.env.MAIL_PW)
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
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      await Promise.reject(error)
    }
  }

  async sendWithTargetList(targetList, title, content) {
    try {
      for (let i = 0; i < targetList?.length; i++) {
        // 이메일 옵션
        const mailOptions = {
          from: this.sender, // 발신자 이메일 주소
          to: targetList[i], // 수신자 이메일 주소
          subject: title, // 이메일 제목
          text: content,
          // html: content, // 이메일 본문 (HTML 형식)
        }
        // 이메일 발송
        await this.transporter.sendMail(mailOptions)
      }
    } catch (error) {
      await Promise.reject(error)
    }
  }

  getTemplate(mailList) {}
}

module.exports = new Mail()
