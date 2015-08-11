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
var SUCCESS = 'success';
var sc;

describe('SendCloud', function () {

	beforeEach(function (done) {
		sc = new Sendcloud('bigertech_dev', 'x', 'bigertech@qq.com', '笔戈科技', 'bgdev_batch');
		done();
	});

	describe.only('#send()', function () {
		it('Send Email to some body', function (done) {
			var p = '<p>你太棒了！你已成功的从SendCloud发送了一封测试邮件，接下来快登录前台去完善账户信息吧！</p>';
			sc.send('shanejs@qq.com', '来自SendCloud的第一封邮件！', p, {
				cc: 'liuxing@meizu.com'
			}).then(function (info) {
				info.message.should.equal(SUCCESS);
				done();
			}).catch(function(err){
			  console.error(err);
			});
		});
	});

	describe('#sendEmail()', function () {
		it('sendEmail 使用 SMTP 的方式', function (done) {
			sc.sendEmailSmtp('liuxing@meizu.com', '来自SendCloud的第一封邮件！', '<p>你太棒了！你已成功的从SendCloud发送了一封测试邮件，接下来快登录前台去完善账户信息吧！</p>').then(function (info) {
				JSON.parse(info).message.should.equal(SUCCESS);
				done();
			});
		});
	});

	describe.skip('#templateToOne()', function () {
		it('should return success ', function (done) {
			var subject = '找回密码',
				to = 'liuxing@meizu.com',
				sub = {
					'%name%': ['狂飙蜗牛'],
					'%url%': ['http://www.bigertech.com']
				};
			sc.templateToOne(to, subject, 'reset-pw', sub).then(function (info) {
				info.message.should.equal(SUCCESS);
				done();
			});
		});
	});

	describe.only('#sendByTemplate()', function () {
		it('should return success ', function (done) {
			var subject = '找回密码',
					to = ['liuxing@meizu.com', 'shanejs@qq.com'],
					sub = {
						'%name%': ['狂飙蜗牛','abcs'],
						'%url%': ['http://www.bigertech.com','http://www.bigertech.com']
					};
			sc.sendByTemplate(to, subject, 'reset-pw', sub).then(function (info) {
				info.message.should.equal(SUCCESS);
				done();
			});
		});
	});

	describe.skip('#sendByMailList()', function () {
		it('should return success ', function (done) {
			var subject = '找回密码',
					to = 'bg_test@maillist.sendcloud.org';
			sc.sendByMailList(to, subject, 'reset-pw').then(function (info) {
				info.message.should.equal(SUCCESS);
				done();
			});
		});
	});
});