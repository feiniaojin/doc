# 异常信息填充Response以及断言增强

版本要求>=3.3.0

## 异常信息填充Response

部分用户希望在抛异常时，直接将异常信息作为响应的错误提示。如以下伪代码。

```java

public class Service {
    public void command() {
        throw new RuntimeException("希望返回这里的信息作为错误提示");
    }
}
```

在3.3.0以前，如果异常没有被@ExceptionMapper修饰，将会直接返回默认的错误提示
例如以下配置，响应中的msg将被设置为`fail`。

```yaml
graceful-response:
  default-error-msg: fail
```

3.3.0版本开始，提供`graceful-response.origin-exception-using-detail-message`
配置，用于配置是否从异常信息中抽取其`detailMessage`作为响应提示。

配置`graceful-response.origin-exception-using-detail-message`后，

```yaml

graceful-response:
  origin-exception-using-detail-message: true
```

上面的异常将返回异常的detailMessage作为提示，例如：

```json
{
  "code": "1",
  "msg": "希望返回这里的信息作为错误提示",
  "data": {}
}
```

**注意！** **注意！** **注意！**

`origin-exception-using-detail-message`如果被配置为true，则全局的原生异常都会按照同样的逻辑进行处理，有可能某些异常信息并不是我们预期的，如下图，请开发者自行评估影响。

[![picD8Fx.png](https://z1.ax1x.com/2023/12/06/picD8Fx.png)](https://imgse.com/i/picD8Fx)

## 断言增强

在日常开发中我们经常使用断言来验证数据的准确性，例如：

```java
Assert.isTrue(id==1,"id不等于1");
```

由于断言的底层也是使用异常，如果`origin-exception-using-detail-message`被设置true，我们可以直接拿到message进行返回。

```java
public static void isTrue(boolean expression,String message){
    if(!expression){
        throw new IllegalArgumentException(message);
    }
}
```

而`origin-exception-using-detail-message`被设置false的情况下，我们可以使用`GracefulResponse.warpAssert()`完成对断言的增强。

- 不需要指定错误码

```java
@RequestMapping("/assert1")
@ResponseBody
public void assert1(Integer id){
    GracefulResponse.warpAssert(()->Assert.isTrue(id==1,"id不等于1"));
}
```

此时，Response的msg将被设置为断言的message，即上面的`id不等于1`。

- 指定错误码

```java
@RequestMapping("/assert2")
@ResponseBody
public void assert2(Integer id){
    GracefulResponse.warpAssert("1001",()->Assert.isTrue(id==1,"id不等于1"));
}
```

此时，Response的code为`1001`,msg为`id不等于1`。


