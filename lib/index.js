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
    data,
    transporter;

/**
 *
 * @param apiUser  apiUser 见sendcloud 的文档
 * @param apiKey  apiKey
 * @param from  发送方的邮件地址
 * @param fromname  发送方的邮件地址
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
  data = {
    api_user: emailConfig.apiUser,
    api_key: emailConfig.apiKey
  };
  transporter  = nodemailer.createTransport(smtpPool({
    auth: {
      api_user: emailConfig.apiUser,
      api_key: emailConfig.apiKey
    }
  }));
  return emailConfig;
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
      resolve(JSON.parse(body));
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
      resolve(JSON.parse(body));
    })
  });
}

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
var templateToOne = function (to,subject,templateName,sub,options) {
  var data = {
    api_user: emailConfig.apiUser,
    api_key: emailConfig.apiKey,
    from: emailConfig.from,
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
      resolve(JSON.parse(body));
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
function sendByMailList(to,subject,templateName,options) {
  if (!emailConfig.apiUserBatch) {
    throw new Error(' The param apiUserBatch is necessary. run init() first');
  }
  var data = {
    api_user: emailConfig.apiUserBatch,
    api_key: emailConfig.apiKey,
    from: emailConfig.from,
    template_invoke_name: templateName,
    subject: subject,
    use_maillist : 'true',
    to : to
  };
  data = _.merge(data,options);
  return new Promise(function (resolve, reject) {
    request.post({url:config.api.send_template,form:data}, function (err, res, body) {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(body));
    })
  });
}







function requestByUrl(url, data) {
  return new Promise(function (resolve, reject) {
    request.post({url: url, form: data}, function (err, res, body) {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(body));
    })
  });
}


/**
 * 获取所有列表信息
 * @param options
 *              start（int,查询起始位置）
 *              limit（int,查询个数
 * @returns {*}
 */
function getEmailList(options) {

  initCheck();

  data = _.merge(data, options);
  return requestByUrl(config.api.list_get, data);

}

/**
 * 创建列表
 *
 * @param address  列表别称地址, 使用该别称地址进行调用
 * @param name     列表名称
 * @param options
 *              description  对列表的描述信息
 * @returns {*}
 */
function createEmailList(address, name, options) {

  initCheck();

  var _data = data;
  _data.address = address;
  _data.name = name;

  _data = _.merge(_data, options);
  return requestByUrl(config.api.list_create, _data);
}


/**
 * 更新列表
 * @param address 列表别称地址
 * @param options
 *             toAddress(string,修改后的别称地址)
 *             name(string,修改后的列表名称)
 *             description(string,修改后的描述信息)
 * @returns {*}
 */
function updateEmailList(address, options) {

  initCheck();

  var _data = data;
  _data.address = address;


  _data = _.merge(_data, options);

  return requestByUrl(config.api.list_update, _data);

}


/**
 * 删除列表
 * @param address 列表别称地址
 * @returns {*}
 */
function deleteEmailList(address) {

  initCheck();

  var _data = data;
  _data.address = address;

  return requestByUrl(config.api.list_delete, _data);

}




function getListMemberData(mail_list_addr, member_addr, options) {

  initCheck();
  if(options){
    if(options.vars){
      options.vars = JSON.stringify(options.vars)
    }
  }
  var _data = data;
  _data.mail_list_addr = mail_list_addr;
  _data.member_addr = member_addr;
  _data = _.merge(_data, options);
  return _data;
}




/**
 * 获取列表中的成员信息
 * @param mail_list_addr (string) 地址列表名称
 * @param options ({})
 *           member_addr(string,需要查询信息的地址) 如果不包含member_addr参数, 返回查询地址列表的所有地址信息; 反之, 只返回该member_addr地址的信息
 *           start（int,查询起始位置）
 *           limit（int,查询个数）
 * @returns {*}
 */
function getListMember(mail_list_addr, options) {

  initCheck();

  var _data = data;
  _data.mail_list_addr = mail_list_addr;
  _data = _.merge(_data, options);
  return requestByUrl(config.api.member_get, _data);

}




/**
 *
 * @param mail_list_addr (string)      地址列表名称
 * @param member_addr (string)     需添加成员的地址, 多个地址使用分号;分开
 * @param options
 *          name(string,地址所属人名称, 与member_addr一一对应, 多个名称用;分隔)
 *          vars(string,模板替换的变量, 与member_addr一一对应, 变量格式为{'%money%':1000}, 多个用;分隔)
 *          description(string,对列表的描述信息)
 *          upsert(string(false,true),是否允许更新, 当为true时, 如果该member_addr存在, 则更新; 为false时, 如果成员地址存在, 将报重复地址错误, 默认为false)
 * @returns {*}
 */
function addListMember(mail_list_addr, member_addr, options) {

  var _data = getListMemberData(mail_list_addr, member_addr, options);

  return requestByUrl(config.api.member_add, _data);
}

/**
 *
 *
 * @param mail_list_addr (string) 地址列表名称
 * @param member_addr (array)  更新的成员的地址, 多个地址使用分号;分开
 * @param options
 *           name(string,地址所属人名称, 与member_addr一一对应, 多个名称用;分隔)
 *          vars(string,模板替换的变量, 与member_addr一一对应, 变量格式为{'%money%':1000}, 多个用;分隔)
 * @returns {*}
 */

function updateListMember(mail_list_addr, member_addr, options) {
  var _data = getListMemberData(mail_list_addr, member_addr, options);
  return requestByUrl(config.api.member_update, _data);
}


/**
 *
 * @param mail_list_addr  (string)地址列表名称
 * @param member_addr (array)  要删除的邮件数组
 * @returns {*}
 */
function deleteListMember(mail_list_addr, member_addr) {

  initCheck();

  var _data = data;
  _data.mail_list_addr = mail_list_addr;
  _data.member_addr = member_addr;

  return requestByUrl(config.api.member_delete, _data);

}

module.exports = {
  sendByTemplate: sendByTemplate,
  templateToOne: templateToOne,
  sendEmail: sendEmail,
  sendByMailList:sendByMailList,
  send:send,
  init: init,
  mailList: {
    getEmailList: getEmailList,
    createEmailList: createEmailList,
    updateEmailList: updateEmailList,
    deleteEmailList: deleteEmailList,
    getListMember: getListMember,
    addListMember: addListMember,
    updateListMember: updateListMember,
    deleteListMember: deleteListMember
  }
}
