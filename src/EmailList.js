/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/8/10
 * @description
 *
 */
import config  from "../config/mail";
import request  from "request";

class EmailList {
  constructor (apiUser, apiKey){
    this.apiUser = apiUser;
    this.apiKey = apiKey;
  }

   getData (url, data) {
    data.api_key = this.apiKey;
    data.api_user = this.apiUser;
    return new Promise(function (resolve, reject) {
      request.post({url: url, form: data}, function (err, res, body) {
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
   * 获取所有列表信息
   * @param options
   *              start（int,查询起始位置）
   *              limit（int,查询个数
   * @returns {*}
   */
  getEmailList (options) {
    options = options || {};
    return this.getData(config.api.list_get, options);
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
  createEmailList (address, name, options) {
    options = options || {};
    options.address = address;
    options.name = name;
    return this.getData(config.api.list_create, options);
  }

   static getListMemberData (mail_list_addr, member_addr, name, options) {
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

  updateListMember (mail_list_addr, member_addr, name, options) {
    options = options || {};
    var _data = getListMemberData(mail_list_addr, member_addr, name,options);
    return this.getData(config.api.member_update, _data);
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
  updateEmailList (address, options) {
    options = options || {};
    options.address = address;
    return this.getData(config.api.list_update, options);
  }
}

export default EmailList;
