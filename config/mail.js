/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/3/19
 * @description
 *
 */
  
 module.exports = {
   api: {
     send: 'http://sendcloud.sohu.com/webapi/mail.send.json',
     send_template: 'http://sendcloud.sohu.com/webapi/mail.send_template.json'
   },
   list: {
       list_get    : 'http://sendcloud.sohu.com/webapi/list.get.json',
       list_create : 'http://sendcloud.sohu.com/webapi/list.create.json',
       list_update : 'http://sendcloud.sohu.com/webapi/list.get.json',
       list_delete : 'http://sendcloud.sohu.com/webapi/list.delete.json',

       member        : 'http://sendcloud.sohu.com/webapi/list_member.get.json',
       member_add    : 'http://sendcloud.sohu.com/webapi/list_member.add.json',
       member_update : 'http://sendcloud.sohu.com/webapi/list_member.update.json',
       member_delete :   'http://sendcloud.sohu.com/webapi/list_member.delete.json'
   }
 }