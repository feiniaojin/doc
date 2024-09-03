# 例外请求放行

有用户反馈引入Graceful Response后，所有的controller方法均被处理了，他们希望能配置一些例外的情况。

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

## 3. 根据请求路径进行放行

用户可以通过配置`graceful-response.exclude-urls`，声明某些请求路径需要跳过不进行处理。

例如，对于 /a/b/c，假如要把路径中有/b/的请求进行放行，则可以配置为`/**/b/**`

## 4. 根据返回值类型进行放行

用户可以通过配置`graceful-response.exclude-return-types`，声明某些返回值类型需要跳过不进行处理。

```yaml
graceful-response:
  exclude-return-types: com.feiniaojin.gracefuresponse.example.dto.UserInfoView
```

## 5. 异常类放行

从5.0.0版本开始，可以通过**graceful-response.exclude-exception-types**放行某些异常。

```yaml
graceful-response:
  exclude-exception-types:
    - com.feiniaojin.gracefuresponse.example.exceptions.ExcludeException
```

## 6. 异常包路径放行

从5.0.0版本开始，可以通过**graceful-response.exclude-exception-packages**放行某些包路径下的异常。
```yaml
graceful-response:
  exclude-exception-packages:
    - "*.excludep.*"
```
