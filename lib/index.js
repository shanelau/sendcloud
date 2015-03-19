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
var init = function (apiUser,apiKey,from,name,apiUserBatch) {
  if (!apiUser || !apiKey || !from) {
    throw new Error('apiUser、apiKey、from are necessary!');
  }
  emailConfig = {
    apiUser: apiUser,
    apiUserBatch: apiUserBatch,
    apiKey: apiKey,
    from: from,
    name: name || ''
  }
  transporter  = nodemailer.createTransport(smtpPool({
  auth:{
    api_user    : emailConfig.apiUser,
    api_key    : emailConfig.apiKey
  }
}));

};




/**
 *
 * @param email 收件人邮箱
 * @param subject 邮件主题
 * @param data  邮件正文
 * @returns {bluebird}
 */
var sendEmail = function (email,subject,data) {
  if (!emailConfig.apiKey || !emailConfig.apiUser) {
    throw new Error(' The param apiUser and apiKey are necessary. run init() first');
  }
  var mail = {
    from    : emailConfig.from,
    to      : email || [],
    subject : subject,
    html    : data
  };
  return new Promise(function (resolve, reject) {
    transporter.sendMail(mail, function(err, info){
      if (err) {
        sails.log.error(err);
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
 * @param name  模板名
 * @param data
 */
var sendByTemplate = function (name,data) {
  if (!emailConfig.apiUserBatch) {
    throw new Error(' The param apiUserBatch is necessary. run init() first');
  }
  var options = {
    api_user: emailConfig.apiUserBatch,
    api_key: emailConfig.apiKey,
    //use_maillist: true,
    fromname: emailConfig.name,
    from: emailConfig.from,
    template_invoke_name: name,
    subject: data.subject,
    substitution_vars: JSON.stringify({
      to: data.to,
      sub: data.sub
    })
  }
  return new Promise(function (resolve, reject) {
    request.post({url:config.api.send_template,form:options}, function (err, res, body) {
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
  init: init
};
