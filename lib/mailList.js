/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author Tracy
 * @date  15/4/1.
 * @description
 *
 */


var Promise = require("bluebird"),
	_ = require('lodash'),
	request = require('request'),
	config = require('../config/mail'),
	emailConfig,
	data;



module.exports = {
	getEmailList: getEmailList,
	createEmailList: createEmailList,
	updateEmailList: updateEmailList,
	deleteEmailList: deleteEmailList,
	getListMember: getListMember,
	addListMember: addListMember,
	updateListMember: updateListMember,
	deleteListMember: deleteListMember,
	setConfig: setConfig
};


function setConfig(config) {
	emailConfig = config;
	data = {
		api_user: emailConfig.apiUser,
		api_key: emailConfig.apiKey
	};
}

function initCheck() {
	if (!emailConfig.apiKey || !emailConfig.apiUser) {
		throw new Error(' The param apiUser and apiKey are necessary. run init() first');
	}
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


/**
 * 获取列表中的成员信息
 * @param mail_list_addr(string) 地址列表名称
 * @param options({})
 *           member_addr_arr(array,需要查询信息的地址) 如果不包含member_addr参数, 返回查询地址列表的所有地址信息; 反之, 只返回该member_addr地址的信息
 *           start（int,查询起始位置）
 *           limit（int,查询个数）
 * @returns {*}
 */
function getListMember(mail_list_addr, options) {

	initCheck();
	if (options) {
		if (options.member_addr) {
			options.member_addr = options.member_addr.join(';');
		}
	}
	var _data = data;
	_data.mail_list_addr = mail_list_addr;
	_data = _.merge(_data, options);
	return requestByUrl(config.api.member_get, _data);

}

function getListMemberData(mail_list_addr, member_addr, options) {

	initCheck();
	// 将数组转化为中间为‘;’的字符串
	var member_addr_format = member_addr.join(';');

	if (options) {
		if (options.name) {
			options.name = options.name.join(';');
		}
		if (options.vars) {
			options.vars = options.name.vars(';');
		}
	}
	var _data = data;
	_data.mail_list_addr = mail_list_addr;
	_data.member_addr = member_addr_format;
	_data = _.merge(_data, options);
	return _data;
}
/**
 *
 * @param mail_list_addr (string)  地址列表名称
 * @param member_addr_arr (array)      要创建的邮件数组,例如['4545@qq.com','addfad@153.com']
 * @param options
 *          name(array,地址所属人名称,与member_addr一一对应,数组长度相等)
 *          vars(array,模板替换的变量, 与member_addr一一对应,数组长度相等， 变量格式为{'%money%':1000})
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
 * @param member_addr_arr (array)  要更新的邮件数组,例如['4545@qq.com','addfad@153.com']
 * @param options
 *           name(array,需要更新的地址对应的名称,与member_addr一一对应,数组长度相等)
 *           vars(array,需要更新的变量对应的名称, 与member_addr一一对应,数组长度相等， 变量格式为{'%money%':1000})
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
	var member_addr_format = member_addr.join(';');

	var _data = data;
	_data.mail_list_addr = mail_list_addr;
	_data.member_addr = member_addr_format;


	return requestByUrl(config.api.member_delete, _data);

}
