# MC百科每日一条龙

一个 Tampermonkey 油猴脚本：打开 [MC百科任务页](https://center.mcmod.cn/#/task/) 后自动完成每日一条龙：

**签到 → 访问指定用户主页 → 推荐指定整合包 → 推荐指定 MOD → 点赞指定服务器 → 回到自己的主页**

## 安装

需要先安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展，然后任选一种方式：

- GitHub Raw（点开即弹出安装界面）：
  https://raw.githubusercontent.com/mustardwheat/mcmod-daily/main/mcmod.user.js
- 国内访问较慢时用 jsDelivr 镜像：
  https://cdn.jsdelivr.net/gh/mustardwheat/mcmod-daily@main/mcmod.user.js

## 配置（重要）

安装后**必须先修改脚本顶部的配置区**，把 4 个数字 ID 改成你自己的目标，否则会按作者示例里的 ID 执行：

| 变量 | 含义 | 示例 |
| --- | --- | --- |
| `TARGET_USER_ID` | 要访问的用户主页 ID | `187287` → `center.mcmod.cn/187287/` |
| `MODPACK_ID` | 要推荐的整合包 ID | `784` → `www.mcmod.cn/modpack/784.html` |
| `MOD_ID` | 要推荐的 MOD ID | `14106` → `www.mcmod.cn/class/14106.html` |
| `SERVER_ID` | 要点赞的服务器 ID（**设为 `1` 则跳过点赞服务器这一步**） | `20188561` → `play.mcmod.cn/sv20188561.html` |

ID 就是对应页面 URL 里的那串数字。

## 使用

1. 登录 MC百科
2. 打开 https://center.mcmod.cn/#/task/
3. 脚本自动跑完整条流程，期间不要手动操作页面
4. 每步都有 30 秒超时兜底；各步骤日志打印在浏览器控制台（F12 打开）

## 原理简介

- `center.mcmod.cn` 内用 `sessionStorage` 传递流程标记；跨子域（`www` / `play`）用 URL 参数 `?mcmod_flow=1` 接力
- 推荐/点赞按钮通过文案 + 图标空心态（`far`）判断是否已操作过，已操作则跳过，可重复执行无副作用

## 反馈

有问题请到 [Issues](https://github.com/mustardwheat/mcmod-daily/issues) 反馈。

## License

[MIT](LICENSE)
