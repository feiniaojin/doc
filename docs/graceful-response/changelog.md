# 版本记录
## 版本号规则
版本号采用`x.y.z-platform`的规则，其中：
- x代表大版本号，一般是涉及到架构调整、配置项名称变更等，不保证API兼容的版本升级。
- y代表功能升级，一般是加入了新的功能，尽量确保逻辑、API不会发生变动，如果y升级后某些逻辑改变了，请到[issues](https://github.com/feiniaojin/graceful-response/issues)进行反馈，我们会尽快处理。
- z代表bug修复的版本
- platform代表平台版本，目前只有boot2和boot3
## 3.3.0
### Maven版本号
SpringBoot 3.x
```xml
<dependency>
    <groupId>com.feiniaojin</groupId>
    <artifactId>graceful-response</artifactId>
    <version>3.3.0-boot3</version>
</dependency>
```
SpringBoot 2.x
```xml
<dependency>
    <groupId>com.feiniaojin</groupId>
    <artifactId>graceful-response</artifactId>
    <version>3.3.0-boot2</version>
</dependency>
```

### Feature
- 新增**graceful-response.origin-exception-using-detail-message**配置项，用于设置是否将原生异常错误信息detailMessage字段填充到Response的msg中
```yaml
graceful-response:
  origin-exception-using-detail-message: true # 默认为false，即不打开
```
- `@ExceptionMapper`注解新增**msgReplaceable**字段，用于标识该异常的提示是否可以在创建异常时重新指定
- **GracefulResponse工具类**新增静态方法`warpAssert`，用于指定断言的错误码并提取断言提示信息到Response的msg字段，实现[issues/30 希望可以支持断言信息统一返回](https://github.com/feiniaojin/graceful-response/issues/30)

### Contributors

[feiniaojin](https://github.com/feiniaojin/)

[Aurorxa](https://github.com/Aurorxa)
