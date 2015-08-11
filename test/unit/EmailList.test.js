/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/3/19
 * @description
 *
 */

var should = require('should');
var Sendcloud = require('../../lib/Sendcloud');
var listMember;


describe('EmailList', function () {

	beforeEach(function (done) {
		listMember = new Sendcloud('bigertech_dev', 'your passport', 'bigertech@qq.com', '笔戈科技', 'bgdev_batch').EmailList;
		done();
	});

	describe.skip('#createEmailList()', function () {
		it('test create method ', function (done) {
			listMember.createEmailList('all123@wan.bigertech.com', 'all_wan').then(function (info) {
				(info.message === 'success').should.equal(true);
				done();
			}).catch(function(err){
			  console.error(err);
			});
		});
	});

	describe.skip('#EmailList()', function () {
		it('test get method ', function (done) {
			listMember.getEmailList().then(function (info) {
				(info.message === 'success').should.equal(true);
				done();
			});
		});
	});

	describe('#EmailList()', function () {
		it('test update method ', function (done) {
			listMember.updateEmailList('all123@wan.bigertech.com', {toAddress: 'sulh@maillist.sendcloud.org'}).then(function (info) {
				(info.message === 'success').should.equal(true);
				done();
			});
		});
	});

	describe.skip('#EmailList()', function () {
		it('test delete method ', function (done) {
			listMember.deleteEmailList('sulihuang@maillist.sendcloud.org').then(function (info) {
				(info.message === 'success').should.equal(true);
				done();
			});
		});
	});
});