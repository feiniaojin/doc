# 自定义Response格式

Graceful Response内置了两种风格的响应格式，并通过`graceful-response.response-style`进行配置

- graceful-response.response-style=0，或者不配置（默认情况）

将以以下的格式进行返回：

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

- graceful-response.response-style=1

将以以下的格式进行返回：

```json
{
  "code": "1404",
  "msg": "not found",
  "data": {
  }
}
```

- 自定义响应格式
  如果以上两种格式均不能满足业务需要，可以通过自定义。

例如以下响应：

```java
public class CustomResponseImpl implements Response {

    private String code;

    private Long timestamp = System.currentTimeMillis();

    private String msg;

    private Object data = Collections.EMPTY_MAP;

    @Override
    public void setStatus(ResponseStatus statusLine) {
        this.code = statusLine.getCode();
        this.msg = statusLine.getMsg();
    }

    @Override
    @JsonIgnore
    public ResponseStatus getStatus() {
        return null;
    }

    @Override
    public void setPayload(Object payload) {
        this.data = payload;
    }

    @Override
    @JsonIgnore
    public Object getPayload() {
        return null;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Long getTimestamp() {
        return timestamp;
    }
}
```

> 注意，不需要返回的属性可以返回null或者加上@JsonIgnore注解

- 配置`graceful-response.response-class-full-name`

将CustomResponseImpl的全限定名配置到`graceful-response.response-class-full-name`属性。

```yaml
graceful-response:
  response-class-full-name: com.feiniaojin.gracefuresponse.example.config.CustomResponseImpl
```

**注意**：graceful-response.response-class-full-name后，graceful-response.responseStyle将不再生效。
