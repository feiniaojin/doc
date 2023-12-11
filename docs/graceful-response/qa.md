# Q&A

## 1. 为什么不对String类型的结果进行处理

>来源： https://github.com/feiniaojin/graceful-response/issues/2

我们不建议直接返回String，这个并不是技术上实现不了，而是业务逻辑上每个团队都有自己的处理方案。

- 第一种

有的团队会直接返回

```json
{
  "code": "1",
  "msg": "ok",
  "data": "abcdefg"
}
```

不推荐这种返回方式，如果需要只返回一个字符串，推荐返回一个单key的Map
```java
@RequestMapping("/kv")
public Map<String,Object> kv(){
    return Collections.singletonMap("key","value");    
}
```
客户端得到的结果：
```json
{
  "code": "1",
  "msg": "ok",
  "data": {
    "key": "value"
  }
}
```

- 第二种

如果字符串是json字符串，例如`{"key":"value"}`

有的团队会说，我给啥你就返回什么，所以你必须返回以下的结果：

```json
{
  "code": "1",
  "msg": "ok",
  "data": "{\"key\":\"value\"}"
}
```
- 第三种

如果字符串是json字符串，例如`{"key":"value"}`

有的团队会说，这是个json，所以你必须先反序列化，然后填充到响应中，返回以下的结果：

```json
{
  "code": "1",
  "msg": "ok",
  "data": {
    "key": "value"
  }
}

```

正是由于String场景的结果，存在诸多不确定性，所以我们不对String进行处理，留给Graceful Response的用户自己实现。

大家如果用过HTTP 的Header，想必从来没有直接将Header设置为：

```
Response Headers: application/json
```
而是会在Response Headers下指定具体的Header，哪怕只有一个也会进行指定：

```
Response Headers:
    Content-Type: application/json;charset=UTF-8
```
