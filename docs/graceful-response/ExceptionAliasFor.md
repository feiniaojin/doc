# 异常别名

## 1. 异常别名的使用场景

异常别名主要针对外部异常的自定义错误码和错误提示。

以SpringBoot框架产生的`org.springframework.web.servlet.NoHandlerFoundException`异常(实际是Spring Webmvc中的异常)为例，当我们访问了不存在的路径时，Spring WebMVC框架会抛出该异常。此时，如果不使用异常别名，可能存在两种处理方案：

- 没开启GracefulResponse

没开启GracefulResponse，Spring为我们返回HTTP Status Code 404，且展示错误页，如下图。
[![pi2sdiR.png](https://z1.ax1x.com/2023/12/09/pi2sdiR.png)](https://imgse.com/i/pi2sdiR)

- 开启GracefulResponse

如果springboot按照以下配置抛出异常，将抛出`NoHandlerFoundException`异常。此时，如果开启了GracefulResponse，则默认会进行全局异常处理，最终返回code=1的错误码和框架的异常提示。

```yaml
# SpringBoot 2.7.x的版本，其他版本可能有差异
spring:
  mvc:
    throw-exception-if-no-handler-found: true
  web:
    resources:
      add-mappings: false
# 下面是graceful-response的配置
graceful-response:
  print-exception-in-global-advice: true
  response-style: 1
```

此时错误码和错误提示如下：

```json
{
  "code": "1",
  "msg": "error",
  "data": {}
}
```
假如我们开启了异常信息填充，如以下配置
```yaml
spring:
  mvc:
    throw-exception-if-no-handler-found: true
  web:
    resources:
      add-mappings: false
graceful-response:
  print-exception-in-global-advice: true
  response-style: 1
  origin-exception-using-detail-message: true
```
我们将得到：
```json
{
  "code": "1",
  "msg": "No handler found for GET /test/kv1",
  "data": {}
}
```
以上虽然最终捕获了异常，并且返回了错误码和错误提示，但还有以下问题：

- code错误码是默认的，我们希望能修改为其他的错误码

- msg异常提示是默认的，或者来自异常信息，对用户都不够友好，我们需要对用户更有好的提示

这种外部异常定制错误码和错误信息的场景，我们可以使用`异常别名`来支持。

通过异常别名，我们将返回HTTP状态码为200，且对用户友好的Response，如以下结果。

```json
{
  "code": "1404",
  "msg": "找不到对象",
  "data": {}
}
```

## 2. 基本使用

我们通过案例工程来讲解异常别名的使用方法，案例工程代码仓库地址如下。

```text
https://github.com/feiniaojin/graceful-response-example.git
```
### 2.1 创建异常别名

创建一个自定义的异常类，并用 `@ExceptionAliasFor`注解修饰，如下。

```java
@ExceptionAliasFor(code = "1404", msg = "not found", aliasFor = NoHandlerFoundException.class)
public class NotFoundException extends RuntimeException {
}
```
@ExceptionAliasFor包括三个属性：code、msg、aliasFor。

code:捕获异常时返回的错误码

msg:为提示信息

aliasFor:表示将成为哪个异常的别名，通过这个属性关联到对应异常。

### 2.2 注册异常别名

创建一个继承了AbstractExceptionAliasRegisterConfig的配置类，在实现的registerAlias方法中进行注册。

```java
@Configuration
public class GracefulResponseConfig extends AbstractExceptionAliasRegisterConfig {

    @Override
    protected void registerAlias(ExceptionAliasRegister aliasRegister) {
        //注册异常别名
        aliasRegister.doRegisterExceptionAlias(NotFoundException.class);
    }
}
```

### 2.3 验证

浏览器访问不存在的URL，例如

```text
http://localhost:9090/example/get2?id=1
```

服务端将返回以下json，正是在ExceptionAliasFor中定义的内容

```json
{
  "code": "1404",
  "msg": "not found",
  "data": {
  }
}
```
