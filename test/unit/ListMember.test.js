/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/3/19
 * @description
 *
 */

var should = require('should');
var mailList = require('../../lib/mailList');
var sendcloud = require('../../index');


describe('listMember', function () {

	beforeEach(function (done) {
		var config = sendcloud.init('bigertech_dev', 'qS8D4vEr0ZOwbJL8', 'bigertech@qq.com', '笔戈科技', 'bgdev_batch');
		mailList.setConfig(config);
		done();
	});

	describe('#listMember()', function () {
		it('test add method ', function (done) {

			mailList.addListMember('sulihuang@maillist.sendcloud.org', ['1111@qq.com', '22222@qq.com'], {name: ['231', '2213']}).then(function (info) {
				console.log(info);
				done();
			});
		});
	});

	describe('#listMember()', function () {
		it('test get method ', function (done) {

			mailList.getListMember('sulihuang@maillist.sendcloud.org').then(function (info) {
				console.log(info);
				done();
			});
		});
	});

	describe('#listMember()', function () {
		it('test update method ', function (done) {

			mailList.updateListMember('sulihuang@maillist.sendcloud.org', ['111@qq.com', '222@qq.com'], {name: ['aa', 'bb']}).then(function (info) {
				console.log(info);
				done();
			});
		});
	});


	describe('#listMember()', function () {
		it('test delete method ', function (done) {

			mailList.deleteListMember('sulihuang@maillist.sendcloud.org', ['111@qq.com']).then(function (info) {
				console.log(info);
				done();
			});
		});
	});


});