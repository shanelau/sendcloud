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


describe('SendCloud', function(){


  beforeEach(function(done){
    sendcloud.init('bigertech_dev','************','bigertech@qq.com','笔戈科技','bgdev_batch');
    done();
  });


  describe('#sendEmail()', function(){
    it('should return success ', function(done){
      sendcloud.sendEmail('liuxing@meizu.com','邮件测试','aaaa').then(function(info){
        console.log(info);
        done();
      });
    });
  });
  describe('#sendTemplateEmail()', function(){
    it('should return success ', function(done){

      var data = {
        subject:'账号激活',
        to: ['liuxing@meizu.com'],
        sub:{
          name: ['狂飙蜗牛'],
          url: ['<a href="http://www.bigertech.com">hello world</a>']
        }
      };
      sendcloud.sendByTemplate('email_bind',data).then(function(info){
        console.log(info);
        done();
      });
    });
  })
})