/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/3/19
 * @description
 *
 */

var should = require('should');
var mailList  = require('../../lib/mailList');



describe('EmailList', function(){

    beforeEach(function(done){
        mailList.init('bigertech_dev','qS8D4vEr0ZOwbJL8','bigertech@qq.com','笔戈科技','bgdev_batch');
        done();
    });

    describe('#EmailList()', function(){
        it('test create method ', function(done){

            mailList.emailList('create',{address:'slh@maillist.sendcloud.org',name:'slh'}).then(function(info){
                console.log(info);
                done();
            });
        });
    });

    describe.skip('#EmailList()', function(){
        it('test get method ', function(done){

            mailList.emailList('get').then(function(info){
                console.log(info);
                done();
            });
        });
    });

    describe.skip('#EmailList()', function(){
        it('test update method ', function(done){

            mailList.emailList('update',{address:'sulihuang@maillist.sendcloud.org',toAddress:'slh@maillist.sendcloud.org'}).then(function(info){
                console.log(info);
                done();
            });
        });
    });

    describe.skip('#EmailList()', function(){
        it('test delete method ', function(done){

            mailList.emailList('delete',{address : 'sulihuang@maillist.sendcloud.org'}).then(function(info){
                console.log(info);
                done();
            });
        });
    });


});