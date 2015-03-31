# sendcloud
NodeJS for sendcloud.sohu.com API 

sendcloud 的邮件发送功能。 [http://sendcloud.sohu.com/doc/](http://sendcloud.sohu.com/doc/)


## Usage



```
npm install sendcloud --save
```

Then 

```
var sendcloud = require('sendcloud');

// init first
sendcloud.init('apiUser','[secretKey]','bigertech@qq.com','笔戈科技','bgdev_batch');

// send email
sendcloud.send('liuxing@meizu.com','邮件测试','<h1>Hello world!<h1>').then(function(info){
	console.log(info);
});



```


## API

###init(apiUser,apiKey,from,name,apiUserBatch)
初始化配置 apiUser  apiUser 见sendcloud 的文档 

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
sendcloud.init('','','');

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
 * @param sub     参数
 * @param options   其他可选参数  sub = {
              '%name%': ['狂飙蜗牛'],
               '%url%': ['http://www.bigertech.com']
            };
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


##Test  100%

```
mocha test/unit/

```

- - - - -

Any question [shanelau](http://weibo.com/kissliux)  
or  
shanelau1021@gmail.com

