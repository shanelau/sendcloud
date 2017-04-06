/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/8/4
 * @description
 *
 */


import Promise  from "bluebird";
import nodemailer  from "nodemailer";
import smtpPool  from "nodemailer-sendcloud-transport";
import _  from "lodash";
import request  from "request";
import config  from "../config/mail";
import EmailList  from "./EmailList";
import ListMember  from "./ListMember";

/**
 *
 * @param apiUser  apiUser 见sendcloud 的文档
 * @param apiKey  apiKey
 * @param from  发送方的邮件地址
 * @param fromName  发送方的邮件地址
 * @param fromName  发送方姓名
 * @param apiUserBatch  option 批量用户名
 */
class SendCloud {
  constructor(apiUser, apiKey, from, fromName, apiUserBatch){
    this.emailConfig = {
      apiUser: apiUser,
      apiUserBatch: apiUserBatch,
      apiKey: apiKey,
      from: from,
      name: fromName || ''
    };
    this.emailList = new EmailList(apiUser, apiKey);
    this.listMember = new ListMember(apiUser, apiKey);

    this.transporter  = nodemailer.createTransport(smtpPool({
      auth: {
        api_user: apiUser,
        api_key: apiKey
      }
    }));
  }

  get EmailList() {
    return this.emailList;
  }

  get ListMember() {
    return this.listMember;
  }

  /**
   * HTTP请求的方式发送Email
   * @param to  收件人地址. 多个地址使用';'分隔,
   * @param subject 标题. 不能为空
   * @param html  邮件的内容.
   * @param options 可选的参数 http://sendcloud.sohu.com/doc/email/send_email/
   */
  send(to,subject,html,options){
    if (!to || !subject || !html) {
      throw new Error('The params is missed!');
    }
    var data = {
      api_user: this.emailConfig.apiUser,
      api_key: this.emailConfig.apiKey,
      from: this.emailConfig.from,
      fromname: this.emailConfig.name,
      to: to,
      subject: subject,
      html: html
    };
    data = _.merge(data,options);
    return new Promise(function (resolve, reject) {
      var info = {
        url: config.api.send,
        form: data
      };
      request.post(info, function (err, res, body) {
        if (err) {
          reject(err);
        }
        try {
          var sendInfo = JSON.parse(body);
          resolve(sendInfo);
        }
        catch(error) {
          reject(error)
        }
      })
    });
  };

  /**
   *
   * 使用 smtp 的方式发送邮件
   * @param to 收件人邮箱
   * @param subject 邮件主题
   * @param data  邮件正文
   * @returns {bluebird}
   */
  sendEmailSmtp (to,subject,data) {
    var transporter = this.transporter;
    var mail = {
      from    : this.emailConfig.from,
      fromname: this.emailConfig.name,
      to      : to || [],
      subject : subject,
      html    : data
    };
    return new Promise(function (resolve, reject) {
      transporter.sendMail(mail, function(err, info){
        if (err) {
          reject(err);
        }
        resolve(info);
      });
    });
  };

  /**
   * 使用触发账号，发送邮件。 发给某一个用户
   * @param to    邮件接收者，
   * @param subject 主题
   * @param templateName  模板名
   * @param sub     参数
   * @param options   其他可选参数  sub = {
              '%name%': ['狂飙蜗牛'],
               '%url%': ['http://www.bigertech.com']
            };
   * @returns {bluebird}
   */
  templateToOne (to,subject,templateName,sub,options) {
    var data = {
      api_user: this.emailConfig.apiUser,
      api_key: this.emailConfig.apiKey,
      from: this.emailConfig.from,
      fromname: this.emailConfig.name,
      template_invoke_name: templateName,
      subject: subject,
      substitution_vars: JSON.stringify({
        to: [to],
        sub: sub || {}
      })
    };
    data = _.merge(data,options);
    return new Promise(function (resolve, reject) {
      request.post({url:config.api.send_template,form:data}, function (err, res, body) {
        if (err) {
          reject(err);
        }
        try {
          var sendInfo = JSON.parse(body);
          resolve(sendInfo);
        }
        catch(error) {
          reject(error)
        }
      })
    });
  }

  /**
   * 根据模板发送邮件
   * 必须是合法的json格式{"to":数组, "sub":{key1:数组1, key2:数组2}, ....}，
   * 如：{"to": ["to1@sendcloud.org", "to2@sendcloud.org"], "sub" : { "%name%" : ["约翰", "林肯"], "%money%" : ["1000", "200"]} }
   *
   * @param to Array 发送方邮件列表
   * @param subject 主题
   * @param templateName 模板名称
   * @param sub Array 需要替换的变量
   * @param options 可选参数 http://sendcloud.sohu.com/doc/email/send_email/#_2
   * @returns {bluebird}
   */
  sendByTemplate  (to,subject,templateName,sub,options) {
    var data = {
      api_user: this.emailConfig.apiUserBatch,
      api_key: this.emailConfig.apiKey,
      from: this.emailConfig.from,
      fromname: this.emailConfig.name,
      template_invoke_name: templateName,
      subject: subject,
      substitution_vars: JSON.stringify({
        to: to,
        sub: sub || {}
      })
    };
    data = _.merge(data,options);
    return new Promise(function (resolve, reject) {
      request.post({url:config.api.send_template,form:data}, function (err, res, body) {
        if (err) {
          reject(err);
        }
        try {
          var sendInfo = JSON.parse(body);
          resolve(sendInfo);
        }
        catch(error) {
          reject(error)
        }
      })
    });
  }

  /**
   * 利用邮件模板给maillist中的用户发送邮件
   * @param to  邮件列表
   * @param subject 主题
   * @param templateName 模板名称
   * @param options 可选参数 http://sendcloud.sohu.com/doc/email/send_email/#_2
   * @returns {bluebird}
   */
  sendByMailList (to,subject,templateName,options) {
    var data = {
      api_user: this.emailConfig.apiUserBatch,
      api_key: this.emailConfig.apiKey,
      from: this.emailConfig.from,
      fromname: this.emailConfig.name,
      template_invoke_name: templateName,
      subject: subject,
      use_maillist : 'true',
      to : to
    };
    data = _.merge(data,options);
    return new Promise(function (resolve, reject) {
      var info = {
        url: config.api.send_template,
        form: data,
        proxyHeaderExclusiveList: []
      };

      request.post(info, function (err, res, body) {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(body));
      })
    });
  }
}

export default SendCloud;
