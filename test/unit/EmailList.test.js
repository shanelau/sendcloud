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

		listMember = new Sendcloud('bigertech_dev', 'xxx', 'bigertech@qq.com', '笔戈科技', 'bgdev_batch').EmailList;
		done();
	});

	describe('#EmailList()', function () {
		it.skip('test create method ', function (done) {
			listMember.createEmailList('all123@wan.bigertech.com', 'all_wan').then(function (info) {
				(info.message === 'success').should.equal(true);
				done();
			}).catch(function(err){
			  console.error(err);
			});
		});

		it('test get method ', function (done) {
			listMember.getEmailList().then(function (info) {
				(info.message === 'success').should.equal(true);
				console.log(info);
				done();
			}).catch(function(err){
				console.error(err);
			});
		});

		it.skip('test update method ', function (done) {
			listMember.updateEmailList('sulh@meizu.com', {toAddress: 'sulihuang@meizu.com'}).then(function (info) {
				(info.message === 'success').should.equal(true);
				done();
			}).catch(function(err){
				console.error(err);
			});
		});

	});
});