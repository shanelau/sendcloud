/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/8/4
 * @description
 *
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _nodemailerSendcloudTransport = require("nodemailer-sendcloud-transport");

var _nodemailerSendcloudTransport2 = _interopRequireDefault(_nodemailerSendcloudTransport);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _configMail = require("../config/mail");

var _configMail2 = _interopRequireDefault(_configMail);

var _EmailList = require("./EmailList");

var _EmailList2 = _interopRequireDefault(_EmailList);

var _ListMember = require("./ListMember");

var _ListMember2 = _interopRequireDefault(_ListMember);

/**
 *
 * @param apiUser  apiUser 见sendcloud 的文档
 * @param apiKey  apiKey
 * @param from  发送方的邮件地址
 * @param fromName  发送方的邮件地址
 * @param fromName  发送方姓名
 * @param apiUserBatch  option 批量用户名
 */

var SendCloud = (function () {
  function SendCloud(apiUser, apiKey, from, fromName, apiUserBatch) {
    _classCallCheck(this, SendCloud);

    this.emailConfig = {
      apiUser: apiUser,
      apiUserBatch: apiUserBatch,
      apiKey: apiKey,
      from: from,
      name: fromName || ''
    };
    this.emailList = new _EmailList2["default"](apiUser, apiKey);
    this.listMember = new _ListMember2["default"](apiUser, apiKey);

    this.transporter = _nodemailer2["default"].createTransport((0, _nodemailerSendcloudTransport2["default"])({
      auth: {
        api_user: apiUser,
        api_key: apiKey
      }
    }));
  }

  _createClass(SendCloud, [{
    key: "send",

    /**
     * HTTP请求的方式发送Email
     * @param to  收件人地址. 多个地址使用';'分隔,
     * @param subject 标题. 不能为空
     * @param html  邮件的内容.
     * @param options 可选的参数 http://sendcloud.sohu.com/doc/email/send_email/
     */
    value: function send(to, subject, html, options) {
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
      data = _lodash2["default"].merge(data, options);
      return new _bluebird2["default"](function (resolve, reject) {
        var info = {
          url: _configMail2["default"].api.send,
          form: data
        };
        _request2["default"].post(info, function (err, res, body) {
          if (err) {
            reject(err);
          }
          try {
            var sendInfo = JSON.parse(body);
            resolve(sendInfo);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  }, {
    key: "sendEmailSmtp",

    /**
     *
     * 使用 smtp 的方式发送邮件
     * @param to 收件人邮箱
     * @param subject 邮件主题
     * @param data  邮件正文
     * @returns {bluebird}
     */
    value: function sendEmailSmtp(to, subject, data) {
      var transporter = this.transporter;
      var mail = {
        from: this.emailConfig.from,
        to: to || [],
        subject: subject,
        html: data
      };
      return new _bluebird2["default"](function (resolve, reject) {
        transporter.sendMail(mail, function (err, info) {
          if (err) {
            reject(err);
          }
          resolve(info);
        });
      });
    }
  }, {
    key: "templateToOne",

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
    value: function templateToOne(to, subject, templateName, sub, options) {
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
      data = _lodash2["default"].merge(data, options);
      return new _bluebird2["default"](function (resolve, reject) {
        _request2["default"].post({ url: _configMail2["default"].api.send_template, form: data }, function (err, res, body) {
          if (err) {
            reject(err);
          }
          try {
            var sendInfo = JSON.parse(body);
            resolve(sendInfo);
          } catch (error) {
            reject(error);
          }
        });
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
  }, {
    key: "sendByTemplate",
    value: function sendByTemplate(to, subject, templateName, sub, options) {
      var data = {
        api_user: this.emailConfig.apiUserBatch,
        api_key: this.emailConfig.apiKey,
        from: this.emailConfig.from,
        template_invoke_name: templateName,
        subject: subject,
        substitution_vars: JSON.stringify({
          to: to,
          sub: sub || {}
        })
      };
      data = _lodash2["default"].merge(data, options);
      return new _bluebird2["default"](function (resolve, reject) {
        _request2["default"].post({ url: _configMail2["default"].api.send_template, form: data }, function (err, res, body) {
          if (err) {
            reject(err);
          }
          try {
            var sendInfo = JSON.parse(body);
            resolve(sendInfo);
          } catch (error) {
            reject(error);
          }
        });
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
  }, {
    key: "sendByMailList",
    value: function sendByMailList(to, subject, templateName, options) {
      var data = {
        api_user: this.emailConfig.apiUserBatch,
        api_key: this.emailConfig.apiKey,
        from: this.emailConfig.from,
        template_invoke_name: templateName,
        subject: subject,
        use_maillist: 'true',
        to: to
      };
      data = _lodash2["default"].merge(data, options);
      return new _bluebird2["default"](function (resolve, reject) {
        var info = {
          url: _configMail2["default"].api.send_template,
          form: data,
          proxyHeaderExclusiveList: []
        };

        _request2["default"].post(info, function (err, res, body) {
          if (err) {
            reject(err);
          }
          resolve(JSON.parse(body));
        });
      });
    }
  }, {
    key: "EmailList",
    get: function get() {
      return this.emailList;
    }
  }, {
    key: "ListMember",
    get: function get() {
      return this.listMember;
    }
  }]);

  return SendCloud;
})();

exports["default"] = SendCloud;
module.exports = exports["default"];