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
    sendcloud.init('bigertech_dev','xxx','bigertech@qq.com','笔戈科技','bgdev_batch');
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
  describe.only('#sendTemplateEmail()', function(){
    it('should return success ', function(done){

      var subject = '找回密码',
          to =  'liuxing@meizu.com',
          sub = {
              '%name%': ['狂飙蜗牛'],
               '%url%': ['http://www.bigertech.com']
            };
      sendcloud.templateToOne(to,subject,'reset-pw',sub).then(function(info){
        console.log(info);
        done();
      });
    });
  })

})