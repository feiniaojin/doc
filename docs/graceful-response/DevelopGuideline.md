# 接口开发规范

## 1. 【推荐】如无必要，接口的Http响应状态码推荐使用200，即使接口处理发生异常，也建议使用200统一返回，通过业务自定义的错误码进行区分。

如以下伪代码：

```java

@RequestMapping("/")
@RestController
public class Controller {

    @Resource
    private Service service;

    @RequestMapping("/queryOne")
    public View queryOne(Query query) {
        try {
            //1. 参数校验
            if (query.getEntityId() == null) {
                throw new RuntimeException();
            }
            //2. 业务处理
            View view = service.queryOne(query);
            if (view == null) {
                throw new RuntimeException();
            }
        } catch (Exception e) {
            //3. 异常处理
            throw new RuntimeException(e);
        }
    }
}

```

在以上伪代码中，只要进入了Controller方法的处理逻辑，例如：

- 请求走到了参数校验的步骤，即使校验不通过，Http Status也设置为200，而不是400；
- 业务处理，查找不到目标对象，Http Status设置为200，而不是404；
- 收到了业务处理异常，Http Status也设置为200，而不是500

*注意*：如果http请求用于请求体和Controller入参不匹配，导致无法进入Controller方法，这种没有走到Controller处理逻辑的情况，会体现在Http状态码上的，如400。

为什么要这样做呢？主要原因有：

- Http是用于数据传输的技术协议，Http的状态码是通信层面的东西，而参数校验异常、查找不到目标对象、处理过程发生意料之外的异常，这些其实都是业务层面的东西。读者尝试思考一下，业务层是在技术层以上的上层，我们为什么在处理上层业务逻辑时，还要关注技术层的传输过程？这明显是不合理的。试问，在OSI七层模型中，哪位朋友手工控制过物理层的传输过程？

- Http预定的状态码有不少，首先这些都是针对技术层面定义的，而我们需要的状态码是业务层面的，根本不可能跟我们的业务错误码兼容。有的用户会问，我用http
  status 500+业务错误码行不行？好家伙，你都有自己的业务错误码了，你还要这500有何用？

- Http协议的职责是用来进行信息传输，请求被Controller接受并处理，就应该认为已经传输成功了，就应该返回200。以快递为例，作者老家在广西，家里人经常给我寄一些土特产，我在我门口（对应Controller方法的入口）确认签收之后，快递公司的责任是不是就结束了？假如我在处理这些土特产的时候（比如烹饪），不小心把盐放多了，请问我能把快递状态改成"500"（服务器遇到了不知道如何处理的情况）吗？

综上所述，Http协议的信息传输和业务逻辑处理是两个不同的过程，我们不应该将其耦合到一起。

那Http的状态码什么时候使用呢？

Http的状态码应该留给数据传输的过程，例如网关超时、服务器不支持请求数据的媒体格式等数据传输链路层面的异常。

## 2. 【推荐】接口的返回值应当为kv形式的对象，不应直接返回字符串。

Controller方法的返回值，推荐为kv形式的对象（Java Bean或者Map）。

不推荐直接返回String，如下面的格式：

```json
{
  "code": "0",
  "msg": "ok",
  "data": "1234567"
}
```

应将String的值通过Map进行返回：

```java
public class Controller {
    public Map<String, Object> kv() {
        return Collections.singletonMap("token", "1234567");
    }
}
```

最终被解析为：

```json
{
  "code": "0",
  "msg": "ok",
  "data": {
    "token": "1234567"
  }
}
```







