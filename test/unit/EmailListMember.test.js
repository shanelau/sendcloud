/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author Tracy
 * @date  15/4/1.
 * @description
 *
 */



var should = require('should');
var mailList  = require('../../lib/mailList');



describe('listMember', function(){

    beforeEach(function(done){
        mailList.init('bigertech_dev','qS8D4vEr0ZOwbJL8','bigertech@qq.com','笔戈科技','bgdev_batch');
        done();
    });

    describe('#listMember()', function(){
        it('test add method ', function(done){

            mailList.listMember('add',{mail_list_addr:'slh@maillist.sendcloud.org',member_addr:'1fdsdf22@qq.com;fsaa@qq.com',name:'1122;aaa'}).then(function(info){
                console.log(info);
                done();
            });
        });
    });

    describe('#listMember()', function(){
        it('test get method ', function(done){

            mailList.listMember('get',{mail_list_addr:'slh@maillist.sendcloud.org'}).then(function(info){
                console.log(info);
                done();
            });
        });
    });

    describe('#listMember()', function(){
        it('test update method ', function(done){

            mailList.listMember('update',{mail_list_addr:'slh@maillist.sendcloud.org',member_addr:'1122@qq.com',name:'ddd'}).then(function(info){
                console.log(info);
                done();
            });
        });
    });

    describe('#listMember()', function(){
        it('test delete method ', function(done){

            mailList.listMember('delete',{mail_list_addr:'slh@maillist.sendcloud.org',member_addr:'1122@qq.com'}).then(function(info){
                console.log(info);
                done();
            });
        });
    });


});