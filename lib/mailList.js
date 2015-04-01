/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author Tracy
 * @date  15/4/1.
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



module.exports = {
    emailList    : emailList,
    listMember   : listMember,
    init         : init

};


function init(apiUser,apiKey,from,fromname,apiUserBatch) {
    if (!apiUser || !apiKey || !from) {
        throw new Error('apiUser、apiKey、from are necessary!');
    }
    emailConfig = {
        apiUser: apiUser,
        apiUserBatch: apiUserBatch,
        apiKey: apiKey,
        from: from,
        name: fromname || ''
    };
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

function requestByUrl(url, data) {
    return new Promise(function (resolve, reject) {
        request.post({url:url,form:data}, function (err, res, body) {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(body));
        })
    });
}


/**
 * 封装sendcloud邮件列表的查询, 创建, 修改, 删除操作
 *
 *
 *
 * @param method  参数为 get,create,update,delete, 分别执行不同的操作
 *
 * @param options  options根据不同的操作需要传入不同的对象
 *
 *    get 操作，必要选项，可选选项:
 *                                  start（int,查询起始位置）
 *                                  limit（int,查询个数）
 *
 *    create操作，必要选项:
 *                      aderess(string,列表别称地址, 使用该别称地址进行调用, 格式为xxx@maillist.sendcloud.org)
 *                      name(string,列表名称)
 *               可选选项:
 *                      description(string,对列表的描述信息)
 *
 *    uodate操作，必要选项:
 *                      aderess(string,目标列表地址)
 *
 *               可选选项:
 *                      toAddress(string,修改后的别称地址)
 *                      name(string,修改后的列表名称)
 *                      description(string,修改后的描述信息)
 *    delete操作，必要选项:
 *                      aderess(string,删除列表的地址)
 *
 *
 */

function emailList(method,options) {

    initCheck();

    if(!method){
        throw new Error('method is null!');
    }
    var data = {
        api_user : emailConfig.apiUser,
        api_key  : emailConfig.apiKey
    };

    switch (method)
    {
        case 'get':
            return requestByUrl(config.list.list_get,data);
            break;
        case 'create':
            if (!options.address || !options.name) {
                throw new Error('The params is missed!');
            }
            data = _.merge(data,options);
            return requestByUrl(config.list.list_create,data);
            break;
        case 'update':
            if (!options.address) {
                throw new Error('The params is missed!');
            }
            data = _.merge(data,options);
            return requestByUrl(config.list.list_update,data);
            break;
        case 'delete':
            if (!options.address) {
                throw new Error('The params is missed!');
            }
            data = _.merge(data,options);
            return requestByUrl(config.list.list_delete,data);
            break;
        default :
            throw new Error('is not method to do it!');
            break
    }

}


/**
 * 封装sendcloud邮件列表中的member的查询, 创建, 修改, 删除操作

 *
 * @param method(string)  参数为 get,add,update,delete, 分别执行不同的操作
 *
 * @param options({})  options根据不同的操作需要传入不同的对象
 *
 *    get 操作，必要选项:
 *                      mail_list_addr(string,地址列表调用名称)
 *             可选选项:
 *                      member_addr(string,需要查询信息的地址) 如果不包含member_addr参数, 返回查询地址列表的所有地址信息; 反之, 只返回该member_addr地址的信息
 *                      start（int,查询起始位置）
 *                      limit（int,查询个数）
 *
 *    add操作，必要选项:
 *                      mail_list_addr(string,地址列表调用名称)
 *                      member_addr(string,需添加成员的地址, 多个地址使用分号;分开)
 *               可选选项:
 *                      name(string,地址所属人名称,与member_addr一一对应, 多个名称用;分隔)
 *                      vars(string,模板替换的变量, 与member_addr一一对应, 变量格式为{'%money%':1000}, 多个用;分隔)
 *                      description(string,对列表的描述信息)
 *                      upsert(string(false,true),是否允许更新, 当为true时, 如果该member_addr存在, 则更新; 为false时, 如果成员地址存在, 将报重复地址错误, 默认为false)
 *
 *    uodate操作，必要选项:
 *                      mail_list_addr(string,地址列表调用名称)
 *                      member_addr(string,需要更新的地址, 多个地址使用分号;分开)
 *
 *               可选选项:
 *                      name(string,需要更新的地址对应的名称,多个名称用;分隔)
 *                      vars(string,需要更新的地址对应的变量,变量格式为{'%money%':1000}, 多个用;分隔)
 *    delete操作，必要选项:
 *                      mail_list_addr(string,地址列表调用名称)
 *                      member_addr(string,需要删除的地址, 多个地址使用分号;分开)
 *
 *
 */

function listMember(method,options) {

    initCheck();

    if(!method){
        throw new Error('method is null!');
    }
    var data = {
        api_user : emailConfig.apiUser,
        api_key  : emailConfig.apiKey
    };

    switch (method)
    {
        case 'get':
            if (!options.mail_list_addr) {
                throw new Error('The params is missed!');
            }
            data = _.merge(data,options);
            return requestByUrl(config.list.member,data);
            break;
        case 'add':
            if (!options.member_addr || !options.mail_list_addr) {
                throw new Error('The params is missed!');
            }
            data = _.merge(data,options);
            return requestByUrl(config.list.member_add,data);
            break;
        case 'update':
            if (!options.member_addr || !options.mail_list_addr) {
                throw new Error('The params is missed!');
            }
            data = _.merge(data,options);
            return requestByUrl(config.list.member_update,data);
            break;
        case 'delete':
            if (!options.member_addr || !options.mail_list_addr) {
                throw new Error('The params is missed!');
            }
            data = _.merge(data,options);
            return requestByUrl(config.list.member_delete,data);
            break;
        default :
            throw new Error('is not method to do it!');
            break
    }

}