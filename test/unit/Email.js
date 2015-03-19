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
var fs = require('fs');

describe('SendCloud', function(){

  beforeEach(function(done){
    sendcloud.init('bigertech_dev','xxxx','bigertech@qq.com','笔戈科技','bgdev_batch');
    done();
  });

  describe('#send()', function(){
    it('should return success ', function(done){
      var p = '<p>感谢您注册笔戈智能硬件系统,点击以下链接激活邮箱</p>';
      var options = {
        fromname: '刘兴测试',
        //files: fs.createReadStream(__dirname+'Email.js')
      }
      sendcloud.send('liuxing@meizu.com','笔戈科技账号激活！',p,options).then(function(info){
        console.log(info);
        done();
      });
    });
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

      var subject = '账号激活',
          to =  ['liuxing@meizu.com'],
          sub = {
              name: ['狂飙蜗牛'],
               url: ['<a href="http://www.bigertech.com">hello world</a>']
            };
      sendcloud.sendByTemplate(to,subject,'email_bind',sub).then(function(info){
        console.log(info);
        done();
      });
    });
  })

})