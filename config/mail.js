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
       send: 'http://api.sendcloud.net/webapi/mail.send.json',
       send_template: 'http://api.sendcloud.net/webapi/mail.send_template.json',

       list_get    : 'http://api.sendcloud.net/webapi/list.get.json',
       list_create : 'http://api.sendcloud.net/webapi/list.create.json',
       list_update : 'http://api.sendcloud.net/webapi/list.update.json',
       list_delete : 'http://api.sendcloud.net/webapi/list.delete.json',

       member_get    : 'http://api.sendcloud.net/webapi/list_member.get.json',
       member_add    : 'http://api.sendcloud.net/webapi/list_member.add.json',
       member_update : 'http://api.sendcloud.net/webapi/list_member.update.json',
       member_delete :   'http://api.sendcloud.net/webapi/list_member.delete.json'
   }
 }