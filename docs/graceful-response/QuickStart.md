# 快速入门

## 1. 引入 Graceful Response

通过 Maven 依赖进行引入，GAV如下：

```xml

<dependency>
    <groupId>com.feiniaojin</groupId>
    <artifactId>graceful-response</artifactId>
    <version>{latest.version}</version>
</dependency>
```

**版本选择**：请到中央仓库选择最新的版本，boot2 和 boot3 有不用的 GAV。

> 仓库链接：<https://central.sonatype.com/artifact/com.feiniaojin/graceful-response>

## 2. 开启 Graceful Response

在启动类中引入@EnableGracefulResponse 注解，即可启用 Graceful Response 组件。

```java

@EnableGracefulResponse
@SpringBootApplication
public class ExampleApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExampleApplication.class, args);
    }
}
```

## 3.代码编写

### 3.1 Controller层

引入 Graceful Response 后，不需要再手工进行查询结果的封装，直接返回实际结果即可，Graceful Response 会自动完成封装的操作。

Controller 层示例如下。

```java

@Controller
public class Controller {
    @RequestMapping("/get")
    @ResponseBody
    public UserInfoView get(Long id) {
        return UserInfoView.builder().id(id).name("name" + id).build();
    }
}
```

在示例代码中，Controller 层的方法直接返回了 UserInfoView 对象，没有进行封装的操作，但经过 Graceful Response
处理后，还是得到了以下的响应结果。

```json
{
  "code": "0",
  "msg": "ok",
  "data": {
    "id": 1,
    "name": "name1"
  }
}
```

而对于命令操作（Command，即写操作）尽量不返回数据，因此写操作的方法的返回值应该是 void，Graceful
Response 对于对于返回值类型 void 的方法，也会自动进行封装。

```java
public class Controller {
    @RequestMapping("/command")
    @ResponseBody
    public void command() {
        //业务操作
    }
}
```

成功调用该接口，将得到：

```json
{
  "code": "0",
  "msg": "ok",
  "data": {}
}
```

不再需要在Controller中手工封装Result/Response进行返回。

### 3.2 Service 层

在引入 Graceful Response 前，有的开发者为了在接口中返回异常码，直接将 Service 层方法定义为 Response，淹没了方法的正常返回值，非常不优雅。

例如以下伪代码：

```java
/**
 * 直接返回Response的Service
 * 不规范
 */
public interface Service {
    Reponse commandMethod(Command command);
}
```

Graceful Response 通过多种机制，可以异常和错误码关联起来，这样 Service层方法就不需要再维护 Response 的响应码了，直接抛出业务异常即可。

- 方法一

使用@ExceptionMapper 注解修饰业务异常，提供错误码和错误提示，再由业务方法直接抛出该异常。

业务异常定义：

```java
/**
 * NotFoundException的定义，使用@ExceptionMapper注解修饰
 * code:代表接口的异常码
 * msg:代表接口的异常提示
 */
@ExceptionMapper(code = "1404", msg = "找不到对象")
public class NotFoundException extends RuntimeException {

}
```

Service 接口直接抛异常：

```java
public class QueryServiceImpl implements QueryService {
    @Resource
    private UserInfoMapper mapper;

    public UserInfoView queryOne(Query query) {
        UserInfo userInfo = mapper.findOne(query.getId());
        if (Objects.isNull(userInfo)) {
            //这里直接抛自定义异常
            throw new NotFoundException();
        }
        //……后续业务操作
    }
}
```

当 Service 层的 queryOne 方法抛出 NotFoundException 时，Graceful
Response 会进行异常捕获，并将 NotFoundException 对应的异常码和异常信息封装到统一的响应对象中，最终接口返回以下 JSON。

```json
{
  "code": "1404",
  "msg": "找不到对象",
  "data": {}
}
```

- 方法二

方法一有可能导致定义过多的业务异常类，还可以通过使用GracefulResponse工具类进行异常抛出。

```java

@GetMapping("/raiseException0")
public void raiseException0() {
    //直接指定错误码和提示信息
    GracefulResponse.raiseException("520", "测试手工异常0");
}


@GetMapping("/raiseException1")
public void raiseException1() {
    try {

    } catch (Exception e) {
        //包装异常并继续抛出
        GracefulResponse.raiseException("1314", "测试手工异常1", e);
    }
}


@GetMapping("/test0")
public void test0() {
    //抛出异常枚举
    GracefulResponse.raiseException(ExceptionEnum.CUSTOM_EXCEPTION);
}
```




