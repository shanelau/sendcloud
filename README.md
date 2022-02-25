# sendcloud
NodeJS for sendcloud.sohu.com API 

sendcloud 的邮件发送功能。 [https://www.sendcloud.net/doc/email_v2/](https://www.sendcloud.net/doc/email_v2/)


## Usage


```
npm install sendcloud --save
```

Then 

```
var Sendcloud = require('sendcloud');

// init first
var sc = new Sendcloud('apiUser','[secretKey]','bigertech@qq.com','笔戈科技','bgdev_batch');

// send email
sc.send('liuxing@meizu.com','邮件测试','<h1>Hello world!<h1>').then(function(info){
	console.log(info);
});


```

## API 须知
1. 更多的参数传递. sendcloud 本身支持非常多的参数，包括 抄送(cc)、密送（bcc）等等，这些可选的参数都可以放在options 中传递给api 。
2. 所有模板都需要官方审核，如果你发邮件时，返回的信息为 sample not match ，你应该先去检查样本是否通过审核了
3. Sendcloud 本身为一个对象，该对象包含了基本发送邮件的函数，还包含以下的 对象
	* EmailList	 地址列表操作，包含一些操作的api
	* ListMember	列表成员操作
	* 邮件标签、邮件模板等等api 还没有开发



## API

### Sendcloud(apiUser,apiKey,from,name,apiUserBatch)
构造函数初始化配置 apiUser  apiUser 见sendcloud 的文档 

 * apiKey  apiKey 
 * from  发送方的邮件地址
 * name  发送方姓名				   可选
 * apiUserBatch  option 批量用户名  可选

###send(to,subject,html,options)

HTTP请求的方式发送Email

 * 收件人地址. 多个地址使用';'分隔,
 * subject 标题. 不能为空
 * html  邮件的内容.
 * options 可选的参数 http://sendcloud.sohu.com/doc/email/send_email/
 * return 成功：`{"message":"success"}`，失败：错误原因


###sendEmail(to,subject,data)
SMTP 发送邮件

 * to 收件人邮箱
 * subject 邮件主题
 * data  邮件正文
 * {Promise}

### sendByTemplate(to,subject,templateName,sub,options)
根据模板名称发送邮件

 * to Array 发送方邮件列表
 * subject 主题
 * templateName 模板名称
 * sub Object 需要替换的变量,如果没有sub ,请传递 {}
 * options 可选参数 http://sendcloud.sohu.com/doc/email/send_email/#_2
 * @returns {bluebird} 
 
 data 格式说明,sub中的数据为模板中需要的参数
 {"to":数组, "sub":{key1:数组1, key2:数组2}, ....}，
 
####Example

```

var subject = '账号激活',
    to =  ['liuxing@meizu.com'],
    sub = {
      name: ['狂飙蜗牛'],
      url: ['<a href="http://www.bigertech.com">hello world</a>']
    };
      sendcloud.sendByTemplate(to,subject,'email_bind',sub).then(function(info){
    console.log(info);
});
```

 在sendcloud中新建模板如下
 
 ```
 Hi %name%。
 点击以下按钮激活
 
 ```

### templateToOne

 * 使用触发账号，发送邮件。 发给某一个用户
 * @param to    邮件接收者，
 * @param subject 主题
 * @param templateName  模板名
 * @param sub     参数  sub = {
                                    '%name%': ['狂飙蜗牛'],
                                     '%url%': ['http://www.bigertech.com']
                                  };
 * @param options   其他可选参数
 * @returns {bluebird}

####Example

```
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
```

## 邮件列表API
### createEmailList
创建邮件列表

 * address  列表别称地址, 使用该别称地址进行调用
 * name     列表名称
 * options  其他可选参数 http://sendcloud.sohu.com/doc/email/list_do/#_2



```
var sendcloud = require('sendcloud');
var mailList = new Sendcloud('').EmailList;  

mailList.createEmailList('handsome@sulihuang.com', 'handsome').then(function (info) {
				console.log(info);
			});

```

### getEmailList
邮件列表查询

 * options  可选参数 http://sendcloud.sohu.com/doc/email/list_do/#_1



```

mailList.getEmailList()
	.then(function (info) {
		console.log(info);	
	});

```

### updataEmailList
邮件列表更新

 * address  列表别称地址, 使用该别称地址进行调用
 * options  其他可选参数 http://sendcloud.sohu.com/doc/email/list_do/#_3
 	* toAddress 修改后的别称地址
 	* name 修改后的列表名称
 	* description 修改后的描述信息 
  

```
mailList.updateEmailList('handsome@sulihuang.com',{toAddress:'sulh@maillist.sendcloud.org'})
	.then(function (info) {
		console.log(info);
	});

```

### deleteEmailList
邮件列表删除

* address  列表地址


```

mailList.deleteEmailList('sulihuang@maillist.sendcloud.org')
	.then(function (info) {
		console.log(info);
	});

```
## 列表成员API
初始化sendcloud 对象后，获取到 ListMember 对象

```
var sendcloud = require('sendcloud');
var listMember = new Sendcloud('').ListMember;  

```
### addListMember

创建列表成员

 * mail_list_addr  列表地址
 * member_addr     需添加成员的地址, 多个地址使用分号;分开
 * options  其他可选参数 http://sendcloud.sohu.com/doc/email/list_do/#_6
 	* name(string,地址所属人名称, 与member_addr一一对应, 多个名称用;分隔)
 	* vars(string,模板替换的变量, 与member_addr一一对应, 变量格式为{'%money%':1000}, 多个用;分隔)
	* description(string,对列表的描述信息)
	* upsert(string(false,true),是否允许更新, 当为true时, 如果该member_addr存在, 则更新; 为false时,



```
var email = 'sulihuang@maillist.sendcloud.org';

mailList.addListMember(email, 'tiancai@qq.com', options)
	.then(function (info) {
		console.log(info);
	});

```

### getListMember

列表成员查询

 * mail_list_addr  列表地址
 * options  可选参数 http://sendcloud.sohu.com/doc/email/list_do/#_5
 	*  member_addr(string,需要查询信息的地址) 如果不包含member_addr参数, 返回查询地址列表的所有地址信息; 反之, 只返回该member_addr地址的信息
    *  start（int,查询起始位置）
    *  limit（int,查询个数）



```

var email = 'sulihuang@maillist.sendcloud.org';

mailList.getListMember(email)
	.then(function (info) {
		console.log(info.members);	
	});	

```

### updataListMember
列表成员更新

* mail_list_addr  列表地址
* member_addr     需要更新成员的地址, 多个地址使用分号;分开
* options  其他可选参数 http://sendcloud.sohu.com/doc/email/list_do/#_6
 	* name(string,地址所属人名称, 与member_addr一一对应, 多个名称用;分隔)
 	* vars(string,模板替换的变量, 与member_addr一一对应, 变量格式为{'%money%':1000}, 多个用;分隔)
	

  

```
mailList.updateListMember(email, '111@qq.com;222@qq.com')
	.then(function (info) {
		console.log(info);
	});

```

### deleteListMember
列表成员删除

* mail_list_addr  列表地址
* member_addr     删除成员的地址, 多个地址使用分号;分开


```

mailList.deleteListMember(email, '111@qq.com')
	.then(function (info) {
		console.log(info);
	});

```


##Test  100%

```
mocha test/unit/

```

