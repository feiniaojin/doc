# 自定义异常和错误码

Graceful Reponse提供@ExceptionMapper注解，用于进行自定义异常、指定错误码和异常信息。

## 1. @ExceptionMapper注解属性

- code: Response中的错误码
- msg: Response中的错误提示
- msgReplaceable：错误提示是否可替换，默认为false

仅当msgReplaceable==ture，且异常实例的message不为空时才能替换。

msgReplaceable配置需要版本>=3.3.0。

## 2. 基本使用

创建自定义异常，采用 `@ExceptionMapper`注解修饰，注解的 `code`属性为返回码，`msg`属性为错误提示信息

```java

@ExceptionMapper(code = "1007", msg = "有内鬼，终止交易")
public static final class RatException extends RuntimeException {

}
```

Service执行具体逻辑，需要抛异常的时候直接抛出去即可，不需要再关心异常与错误码关联的问题

```java
public class Service {
    public void illegalTransaction() {
        //需要抛异常的时候直接抛
        if (hasRat()) {
            logger.error("有内鬼终止交易");
            throw new RatException();
        }
        doIllegalTransaction();
    }
}

```

Controller调用Service

```java
public class Controller {
    @RequestMapping("/test3")
    public void test3() {
        logger.info("test3: RuntimeException");
        //Controller中不会进行异常处理，也不会手工set错误码，只关心核心操作，其他的通通交给Graceful Response
        exampleService.illegalTransaction();
    }
}

```

在浏览器中请求controller的/test3方法，有异常时将会返回：

```json
{
  "status": {
    "code": 1007,
    "msg": "有内鬼，终止交易"
  },
  "payload": {
  }
}
```

## 3. 异常信息替换

创建自定义异常，采用 `@ExceptionMapper`注解修饰，注解的 `code`属性为返回码，`msg`属性为错误提示信息，`msgReplaceable`设置为true

并且，重新其构造方法，提供包含message的入参。

```java
@ExceptionMapper(code = "1007", msg = "有内鬼，终止交易", msgReplaceable = true)
public class RatException extends RuntimeException {
    public RatException() {
    }

    public RatException(String message) {
        super(message);
    }

    public RatException(String message, Throwable cause) {
        super(message, cause);
    }

    public RatException(Throwable cause) {
        super(cause);
    }

    public RatException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
```
由于msgReplaceable被设置为true，如果创建异常时指定了错误提示，如以下伪代码：

```java
public class Service {
    public void illegalTransaction() {
        //需要抛异常的时候直接抛
        if (hasRat()) {
            logger.error("有内鬼终止交易");
            throw new RatException("创建异常时自定义了异常信息");
        }
        doIllegalTransaction();
    }
}

```

最终接口将返回

```json
{
  "status": {
    "code": 1007,
    "msg": "创建异常时自定义了异常信息"
  },
  "payload": {
  }
}
```
