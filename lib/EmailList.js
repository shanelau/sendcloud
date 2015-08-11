/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/8/10
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

var _configMail = require("../config/mail");

var _configMail2 = _interopRequireDefault(_configMail);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var EmailList = (function () {
  function EmailList(apiUser, apiKey) {
    _classCallCheck(this, EmailList);

    this.apiUser = apiUser;
    this.apiKey = apiKey;
  }

  _createClass(EmailList, [{
    key: "getData",
    value: function getData(url, data) {
      data.api_key = this.apiKey;
      data.api_user = this.apiUser;
      return new Promise(function (resolve, reject) {
        _request2["default"].post({ url: url, form: data }, function (err, res, body) {
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
     * 获取所有列表信息
     * @param options
     *              start（int,查询起始位置）
     *              limit（int,查询个数
     * @returns {*}
     */
  }, {
    key: "getEmailList",
    value: function getEmailList(options) {
      options = options || {};
      return this.getData(_configMail2["default"].api.list_get, options);
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
  }, {
    key: "createEmailList",
    value: function createEmailList(address, name, options) {
      options = options || {};
      options.address = address;
      options.name = name;
      return this.getData(_configMail2["default"].api.list_create, options);
    }
  }, {
    key: "updateListMember",

    /**
     *
     *
     * @param mail_list_addr (string) 地址列表名称
     * @param member_addr (array)  更新的成员的地址, 多个地址使用分号;分开
     * @param  name
     * @param options
     *           name(string,地址所属人名称, 与member_addr一一对应, 多个名称用;分隔)
     *          vars(string,模板替换的变量, 与member_addr一一对应, 变量格式为{'%money%':1000}, 多个用;分隔)
     * @returns {*}
     */

    value: function updateListMember(mail_list_addr, member_addr, name, options) {
      options = options || {};
      var _data = getListMemberData(mail_list_addr, member_addr, name, options);
      return this.getData(_configMail2["default"].api.member_update, _data);
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
  }, {
    key: "updateEmailList",
    value: function updateEmailList(address, options) {
      options = options || {};
      options.address = address;
      return this.getData(_configMail2["default"].api.list_update, options);
    }
  }], [{
    key: "getListMemberData",
    value: function getListMemberData(mail_list_addr, member_addr, name, options) {
      if (options) {
        if (options.vars) {
          options.vars = JSON.stringify(options.vars);
        }
      }
      options.mail_list_addr = mail_list_addr;
      options.member_addr = member_addr;
      options.name = name;
      return options;
    }
  }]);

  return EmailList;
})();

exports["default"] = EmailList;
module.exports = exports["default"];