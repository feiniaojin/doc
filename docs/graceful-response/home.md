# Graceful Response 项目主页

## 1. 项目介绍

Graceful Response是一个Spring Boot技术栈下的优雅响应处理组件，可以帮助开发者完成响应数据封装、异常处理、错误码填充等过程，提高开发效率，提高代码质量。

![使用示例](/graceful-response/use-gr.png)

代码仓库如下，欢迎star！

```text
https://github.com/feiniaojin/graceful-response
```

# 2. 功能列表

- 统一返回值封装
- void 返回类型封装
- 全局异常处理
- 自定义响应体：适应不同项目的响应格式需求
- 参数校验错误码：为参数校验的异常指定错误码，支持全局的参数校验错误码
- 断言增强：执行断言时填充错误码和异常信息到 Response
- 异常别名：适配外部异常，通过注解或者配置文件的方式，为外部异常指定错误码
- 例外请求放行：支持根据路径、返回值、注解、配置等多种方式进行放行，无须担心框架冲突
- 第三方组件适配：目前已完成 Swagger、springdoc、actuator、FastJson 等框架或者组件的适配
- RESTful 支持：可以指定异常的 HTTP 状态码，并且支持统一指定
- 错误码枚举：支持定义错误码枚举，避免创建过多的异常类

# 3.交流和反馈

欢迎通过以下二维码联系作者、并加入Graceful Response用户交流群，申请好友时请备注“GR”。

<div><img src="/qr.jpg" style="width: 50%"/></div>

公众号: 悟道领域驱动设计

<div><img src="/gzh.jpg" style="width: 50%"/></div>





