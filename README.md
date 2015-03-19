# sendcloud
NodeJS for sendcloud.sohu.com API 

sendcloud 的邮件发送功能。 [http://sendcloud.sohu.com/doc.html#sendEmail](http://sendcloud.sohu.com/doc.html)


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
sendcloud.sendEmail('liuxing@meizu.com','邮件测试','<h1>Hello world!<h1>').then(function(info){
	console.log(info);
});



```


## API

###init(apiUser,apiKey,from,name,apiUserBatch)
初始化配置


 * apiUser  apiUser 见sendcloud 的文档 
 * apiKey  apiKey 
 * from  发送方的邮件地址
 * name  发送方姓名				   可选
 * apiUserBatch  option 批量用户名  可选

###sendEmail(email,subject,data)
发送 HTML格式的邮件

 * email 收件人邮箱
 * subject 邮件主题
 * data  邮件正文
 * {Promise}

### sendByTemplate(name,data) 
根据模板名称发送邮件

* name  模板名
* data
 
 
 data 格式说明,sub中的数据为模板中需要的参数
 {"to":数组, "sub":{key1:数组1, key2:数组2}, ....}，

```
var data = {
    subject:'账号激活',
    to: ['liuxing@meizu.com'],
    sub:{
      '%name%': ['狂飙蜗牛'],
    }
  };
```


 在sendcloud中新建模板如下
 
 ```
 Hi %name%。
 点击以下按钮激活
 
 ```



- - - - -

Any question [shanelau](http://weibo.com/kissliux)  
or  
shanelau1021@gmail.com

