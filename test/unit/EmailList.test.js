/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/3/19
 * @description
 *
 */

var should = require('should');
var sendcloud = require('../../index');
var mailList = sendcloud.mailList;


describe('EmailList', function () {

	beforeEach(function (done) {
		var config = sendcloud.init('bigertech_dev', 'qS8D4vEr0ZOwbJL8', 'bigertech@qq.com', '笔戈科技', 'bgdev_batch');
		done();
	});

	describe.skip('#createEmailList()', function () {
		it('test create method ', function (done) {

			mailList.createEmailList('all@wan.bigertech.com', 'all_wan').then(function (info) {
				(info.message === 'success').should.equal(true);
				done();
			});
		});
	});

	describe('#EmailList()', function () {
		it('test get method ', function (done) {

			mailList.getEmailList().then(function (info) {
				console.log(info);
				done();
			});
		});
	});

	describe.skip('#EmailList()', function () {
		it('test update method ', function (done) {

			mailList.updateEmailList('suli@maillist.sendcloud.org', {toAddress: 'sulh@maillist.sendcloud.org'}).then(function (info) {
				console.log(info);
				done();
			});
		});
	});

	describe.skip('#EmailList()', function () {
		it('test delete method ', function (done) {

			mailList.deleteEmailList('sulihuang@maillist.sendcloud.org').then(function (info) {
				console.log(info);
				done();
			});
		});
	});


});