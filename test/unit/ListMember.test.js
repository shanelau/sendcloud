/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/3/19
 * @description
 *
 */

var should = require('should');
var email = 'sulh@maillist.sendcloud.org';
var Sendcloud = require('../../lib/Sendcloud');
var listMember;

describe('ListMember', function () {
	beforeEach(function (done) {
		listMember = new Sendcloud('bigertech_dev', 'xxx', 'bigertech@qq.com', '笔戈科技', 'bgdev_batch').ListMember;
		done();
	});

	describe('#listMember()', function () {
		it('test add method ', function (done) {
			var hehe = 'ldadd';
			var dsda = 'dsada';

			var options = {
				name : 'suluallalalal',
				vars : {'%domain%' : hehe,'%hello%'  : dsda}
			};
			listMember.addListMember(email, '44444@qq.com', options).then(function (info) {
				console.log(info);
				done();
			});
		});

		it.skip('test get method ', function (done) {
			listMember.getListMember(email).then(function (info) {
				console.log(info.members);
				done();
			});
		});
	});
});