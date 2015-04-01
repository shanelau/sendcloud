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
var email = 'all@wan.bigertech.com';

describe('listMember', function () {

	beforeEach(function (done) {
		var config = sendcloud.init('bigertech_dev', 'xxx', 'bigertech@qq.com', '笔戈科技', 'bgdev_batch');
		done();
	});

	describe('#listMember()', function () {
		it('test add method ', function (done) {

			mailList.addListMember(email, ['kissliux@qq.com', '45656812@qq.com'], {name: ['刘兴', '苏理煌']}).then(function (info) {
				(info.message === 'success').should.equal(true);
				done();
			});
		});

		it('test get method ', function (done) {

			mailList.getListMember(email).then(function (info) {
				(info.message === 'success').should.equal(true);
				done();
			});
		});

		it('test update method ', function (done) {

			mailList.updateListMember(email, ['111@qq.com', '222@qq.com'], {name: ['aa', 'bb']}).then(function (info) {
				(info.message === 'success').should.equal(true);
				done();
			});
		});

		it('test delete method ', function (done) {
			mailList.deleteListMember(email, ['111@qq.com']).then(function (info) {
				console.log(info);
				done();
			});
		});
	});


});