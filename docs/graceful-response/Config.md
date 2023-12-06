# 常用配置

```yaml
graceful-response:
  # 自定义Response类的全限定名，默认为空。 
  # 配置response-class-full-name后，response-style将不再生效
  response-class-full-name:
  # 是否打印异常日志，默认为false
  print-exception-in-global-advice: false
  # Response风格，不配置默认为0
  response-style: 0
  # 自定义的成功响应码，不配置则为0
  default-success-code: 0
  # 自定义的成功提示，默认为ok
  default-success-msg: ok
  # 自定义的失败响应码，默认为1
  default-error-code: 1
  # 自定义的失败提示，默认为error
  default-error-msg: error
  # 全局的参数校验错误码，默认等于default-error-code
  default-validate-error-code:
  # 例外包路径(支持数字, *和**通配符匹配)，该包路径下的controller将被忽略处理
  exclude-packages:
    - com.lizhiadmin.pro.module.*.controller
  # 设置是否将原生异常错误信息detailMessage字段填充到Response的msg中
  # 默认为false，即不打开
  origin-exception-using-detail-message: false 
```
