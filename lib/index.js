/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/2/6
 * @description
 *
 */

var Promise     = require("bluebird");
var nodemailer  = require("nodemailer");
var smtpPool    = require("nodemailer-sendcloud-transport"),
    _           = require('lodash'),
    request     = require('request'),
    config      = require('../config/mail'),
    emailConfig = {},
    transporter;

/**
 *
 * @param apiUser  apiUser 见sendcloud 的文档
 * @param apiKey  apiKey
 * @param from  发送方的邮件地址
 * @param name  发送方姓名
 * @param apiUserBatch  option 批量用户名
 */
var init = function (apiUser,apiKey,from,fromname,apiUserBatch) {
  if (!apiUser || !apiKey || !from) {
    throw new Error('apiUser、apiKey、from are necessary!');
  }
  emailConfig = {
    apiUser: apiUser,
    apiUserBatch: apiUserBatch,
    apiKey: apiKey,
    from: from,
    name: fromname || ''
  }
  transporter  = nodemailer.createTransport(smtpPool({
  auth:{
    api_user    : emailConfig.apiUser,
    api_key    : emailConfig.apiKey
  }
}));

};

function initCheck(){
  if (!emailConfig.apiKey || !emailConfig.apiUser) {
    throw new Error(' The param apiUser and apiKey are necessary. run init() first');
  }
}

/**
 * HTTP请求的方式发送Email
 * @param to  收件人地址. 多个地址使用';'分隔,
 * @param subject 标题. 不能为空
 * @param html  邮件的内容.
 * @param options 可选的参数 http://sendcloud.sohu.com/doc/email/send_email/
 */
var send = function(to,subject,html,options){
  initCheck();
  if (!to || !subject || !html) {
    throw new Error('The params is missed!');
  }
  var data = {
    api_user: emailConfig.apiUserBatch,
    api_key: emailConfig.apiKey,
    from: emailConfig.from,
    to: to,
    subject: subject,
    html: html
  }
  data = _.merge(data,options);
  return new Promise(function (resolve, reject) {
    request.post({url:config.api.send,form:data}, function (err, res, body) {
      if (err) {
        reject(err);
      }
      resolve(body);
    })
  });
}


/**
 *
 * @param email 收件人邮箱
 * @param subject 邮件主题
 * @param data  邮件正文
 * @returns {bluebird}
 */
var sendEmail = function (to,subject,data) {
  initCheck();

  var mail = {
    from    : emailConfig.from,
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
}
/**
 * 根据模板发送邮件
 * 必须是合法的json格式{"to":数组, "sub":{key1:数组1, key2:数组2}, ....}，
 * 如：{"to": ["to1@sendcloud.org", "to2@sendcloud.org"], "sub" : { "%name%" : ["约翰", "林肯"], "%money%" : ["1000", "200"]} }
 * @param templateName  模板名
 * @param data
 */

/**
 *
 * @param to Array 发送方邮件列表
 * @param subject 主题
 * @param templateName 模板名称
 * @param sub Array 需要替换的变量
 * @param options 可选参数 http://sendcloud.sohu.com/doc/email/send_email/#_2
 * @returns {bluebird}
 */
var sendByTemplate = function (to,subject,templateName,sub,options) {
  if (!emailConfig.apiUserBatch) {
    throw new Error(' The param apiUserBatch is necessary. run init() first');
  }
  var data = {
    api_user: emailConfig.apiUserBatch,
    api_key: emailConfig.apiKey,
    from: emailConfig.from,
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
      resolve(body);
    })
  });
}



module.exports = {
  sendByTemplate: sendByTemplate,
  sendEmail: sendEmail,
  send:send,
  init: init
};
