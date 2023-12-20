# 参数校验异常错误码

在3.0版本以前，如果validation发生了校验异常，Graceful Response在默认情况下会捕获并返回code=1，参数校验发生的异常信息会丢失；如果使用异常别名功能，可以对大的校验异常返回统一的错误码，但是不够灵活并且依旧没有解决参数异常提示的问题。

Graceful Response从3.0版本开始，引入`@ValidationStatusCode`注解，可以非常方便地支持validation校验异常。

## 1. 取值顺序

`3.4.0`版本后，Graceful Response完善了`@ValidationStatusCode`的取值逻辑。

> Controller方法->Controller类->DTO入参属性->DTO入参类->配置文件默认参数码->默认错误码

该取值逻辑的设计思路如下：

- DTO可能被很多个Controller方法复用，因此我们优先取当前Controller方法上的`@ValidationStatusCode`；

- 如果Controller方法上没有找到该注解，则尝试从当前Controller类上获得该注解；

- 如果Controller所在的类也找不到`@ValidationStatusCode`，尝试从当前校验不通过的DTO字段上找；

- 如果校验不通过的字段也不包含该注解，则从**该字段所在的DTO类**上找；

- 如果配置了`default-validate-error-code`，则返回其配置的值

- 返回默认的错误码

## 2. 使用方法

`@ValidationStatusCode`注解目前只有一个`code`属性，用于指定参数校验异常时的错误码，错误提示则取自validation校验框架。

- 对入参类进行参数校验

```java
@Data
public class UserInfoQuery {

    @NotNull(message = "userName is null !")
    @Length(min = 6, max = 12)
    @ValidationStatusCode(code = "520")
    private String userName;
}
```
当`userName`字段任意一项校验不通过时，接口将会返回异常码`520`和校验注解中的`message`：
```json
{
  "status": {
    "code": "520",
    "msg": "userName is null !"
  },
  "payload": {}
}
```
详细见example工程ExampleController的validateDto方法
``
http://localhost:9090/example/validateDto
``
>注意：@ValidationStatusCode校验参数对象字段的情况，code取值顺序为：会先取字段上的注解，再去该属性所在对象的类（即UserInfoQuery类）上的注解，再取全局配置的参数异常码`gr.defaultValidateErrorCode`，最后取默认的全局默认的错误码（默认code=1）

- 直接在Controller中校验方法入参

直接在Controller方法中进行参数校验：

```java
public class ExampleController {

  @RequestMapping("/validateMethodParam")
  @ResponseBody
  @ValidationStatusCode(code = "1314")
  public void validateMethodParam(
          @NotNull(message = "userId不能为空") Long userId,
          @NotNull(message = "userName不能为空") Long userName){
      //省略业务逻辑
  }
}
```
当userId、或者userName校验不通过时，将会返回code=1314，msg为对应的校验信息。
```json
{
  "status": {
    "code": "1314",
    "msg": "userId不能为空"
  },
  "payload": {}
}
```

详细见example工程ExampleController的validateMethodParam方法
``
http://localhost:9090/example/validateMethodParam
``
