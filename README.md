<div align="center">

# 🔥 锋燃 FENGRAN

**一个 iOS 健身应用的高保真交互原型 + 落地页设计**

</div>

---

## 这是什么

锋燃 FENGRAN 是一个 iOS 健身应用的设计原型项目，包含两部分：

- **`ios-prototype/`** — 高保真交互原型。用纯 HTML/CSS/JS 构建（无框架、无构建工具），在浏览器里还原 iOS 原生应用的界面语言与手势交互：首页、动作库、训练记录/计划/统计、社区、AI 教练对话，支持导航栈 push/pop、半屏卡片、左滑返回手势等原生级交互。
- **`landing/`** — 产品营销落地页。深色品牌视觉 + GSAP 滚动动效（scroll pin、图片缩放渐隐）、横向手风琴训练计划展示、无限滚动的器械标签、社区反馈轮播。

两者共享同一套深色 + 橙色强调色的视觉系统，风格保持一致。

## 快速体验

```bash
# 交互原型
cd ios-prototype && python3 -m http.server 8934
# 浏览器打开 http://localhost:8934/index.html

# 落地页
cd landing && python3 -m http.server 8935
# 浏览器打开 http://localhost:8935/index.html
```

两个页面都可以直接双击 `index.html` 打开，不强制要求本地服务器。

## 数据来源

原型里的动作库数据（名称、目标肌群、器械、分步要领）是真实数据，采样自开源数据集
**[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)**（1,324 个动作、9 种语言）。
训练计划、日志、社区动态和 AI 教练对话均为演示用的虚构内容。

## 素材版权

原型和落地页中出现的动作缩略图与动画 GIF，直接以链接形式引用自
`hasaneyldrm/exercises-dataset` 仓库（`raw.githubusercontent.com`），并**未在本仓库内复制存储**。
这些素材版权归 **Gym visual**（[gymvisual.com](https://gymvisual.com/)）所有，使用需遵守其
[使用条款](https://gymvisual.com/content/3-terms-and-conditions-of-use)。本仓库不对这些素材本身
主张任何权利。

> © Gym visual — https://gymvisual.com/

`landing/assets/screens/` 下的截图是本项目自制的应用界面截图（用于展示交互原型的实际效果），
其中出现的动作插图同样来自上述数据集，版权归属不变。

## 许可协议

本仓库中的代码（HTML/CSS/JS）以 [MIT 许可](LICENSE) 发布。动作库数据与素材遵循其原始仓库的
许可条款，详见上方「数据来源」与「素材版权」。
