# 通用工具类

`@ExceptionMapper`设计的初衷，是将异常与错误码关联起来，用户只需要抛异常，不需要再关注异常与错误码的对应关系。

部分用户反馈，希望在不自定义新异常类的情况下，也能可以按照预期返回错误码和异常信息，因此从`2.1`版本开始，新增了`GracefulResponseException`异常类，用户只需要抛出该异常即可。

```java
public class Service {
  
  public void method() {
    throw new GracefulResponseException("自定义的错误码","自定义的错误信息");
  }
}
```
为简化使用，从`2.1`版本开始提供了`GracefulResponse`通用工具类，在需要抛出`GracefulResponseException`时，只需要调用`raiseException`方法即可。 这样做的目的是将用户的关注点从异常转移到错误码。

示例如下：

```java
public class Service {

    public void method() {
        //当condition==true时，抛出GracefulResponseException异常，返回自定义的错误码和错误信息
        if (condition) {
            GracefulResponse.raiseException("自定义的错误码", "自定义的错误信息");
        }
    }
}
```

部分用户希望抛异常时也返回数据，可以采用以下方法：

```java
GracefulResponse.wrapAssert("code",data,() -> Assert.isTrue(id == 1, "id不等于1"));
```
其中，code是要返回的错误码，data是要返回的数据，`() -> Assert.isTrue(id == 1, "id不等于1")`是抛异常的断言，注意书写格式。
