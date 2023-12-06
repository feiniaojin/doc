# 例外请求放行

有用户反馈引入Graceful Response后，所有的controller方法均被处理了，他们希望能配置一些例外的情况。

Graceful Response从 3.2.0版本开始，提供了两种方式实现controller方法例外排除。

## 1. 单个方法例外排除

针对某个Controller方法，我们可以添加@ExcludeFromGracefulResponse注解，声明该方法不需要进行统一的包装。

```java
/**
 * @author lihao3
 * @date 2023/6/30 10:10
 */
@Api("用户相关接口")
@Slf4j
@RestController
@RequestMapping("system/user")
@RequiredArgsConstructor
public class SysUserController {

  private final SysUserService service;

  @ApiOperation("删除")
  @DeleteMapping("{id}")
  @ExcludeFromGracefulResponse
  public String delete(@PathVariable Long id) {
    service.delete(id);
    return "删除成功";
  }

}
```

这样配置就会直接返回"删除成功"，不再进行统一返回值的封装。

## 2. 包级别的例外处理

用户可以通过配置`graceful-response.exclude-packages`，声明某些包需要跳过不进行处理。

该配置项支持*和**，例如

```yaml
graceful-response:
  exclude-packages:
    - com.lizhiadmin.pro.module.*
```
该配置表明com.lizhiadmin.pro.module包下的所有controller均不会被Graceful Response进行自动处理。

详细案例见example工程的`ExcludeController`类，该类下的test方法由于在application.yaml文件中配置了`graceful-response.exclude-packages`，因此Graceful Response将不会对其进行统一结果封装。
```
https://github.com/feiniaojin/graceful-response-example/blob/3.2.0-boot2/src/main/java/com/feiniaojin/gracefuresponse/example/controller/exclude/ExcludeController.java
```
