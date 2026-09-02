# CardioMind AI Lab 官网内容发布指南

首页的活动轮播、团队动态、社交账号、视频、文章和产品统一维护在 [`_data/homepage.yml`](_data/homepage.yml)。修改这个文件并合并到 `main` 后，GitHub Actions 会自动构建和发布网站，不需要修改 HTML。

## 最快发布流程

1. 在 GitHub 仓库中打开 `_data/homepage.yml`，点击编辑按钮。
2. 在对应栏目复制一条现有记录，修改内容，并为它设置一个不重复的 `id`。
3. 新内容先保持 `enabled: false`，通过 Pull Request 预览和检查。
4. 确认链接、日期、图片和移动端显示无误后，改为 `enabled: true` 并合并。
5. 在仓库的 **Actions → Deploy site** 查看发布状态。通常几分钟内更新。

活动轮播使用 `announcements`，简短进展使用 `updates`，账号入口使用 `social_accounts`，讲解/访谈使用 `videos`，长文与外部推文使用 `articles`，工具与服务使用 `products`。

## 图片与视频

- 内容图片放在 `assets/img/content/`，建议使用 WebP/JPEG；单张尽量小于 500 KB。
- 活动与文章封面建议为 16:9，推荐 1600 × 900 px。
- 产品标识建议使用透明背景的 SVG 或 PNG。
- `image_alt`、`cover_alt`、`logo_alt` 应描述图片内容，不能写“图片”或留空。
- 视频无需上传到 GitHub。`watch_url` 填公开视频页面；只有确认平台允许嵌入时才填写 `embed_url`。
- 微信文章可作为 `articles` 发布，把 `source` 填为“微信公众号”，`url` 填文章永久链接。

## 字段约定

- `enabled`: 唯一发布开关。`true` 显示，`false` 保留为草稿。
- `featured`: 优先显示。精选内容仍受首页各栏目数量上限控制。
- `date` / `published_at`: 必须加引号，格式为 `YYYY-MM-DD`。
- `url`: 站内链接以 `/` 开头；站外链接必须使用完整 `https://` 地址。没有目标页面时留空，不要使用 `#`。
- `id`: 只使用小写英文字母、数字和连字符，例如 `research-talk-2026-09`；发布后不要更改。
- `status_key`: 产品可使用 `concept`、`beta`、`active`、`archived`，用于前端显示统一状态样式。

首页读取数据时，应先筛选 `enabled == true`；链接为空时应隐藏按钮。所有站内资源路径应通过 Jekyll 的 `relative_url` 过滤器生成，例如：

```liquid
{% assign announcements = site.data.homepage.announcements | where: 'enabled', true %}
{% for item in announcements limit: site.data.homepage.settings.section_limits.announcements %}
  <img src="{{ item.image | relative_url }}" alt="{{ item.image_alt | escape }}">
  {% if item.url != '' %}
    <a href="{{ item.url | relative_url }}">{{ item.cta }}</a>
  {% endif %}
{% endfor %}
```

注意：使用 Liquid 的页面顶部必须有两行 Front Matter：

```yaml
---
---
```

## 发布前检查

- 标题、日期、嘉宾/作者和活动状态准确；不发布未经核实的团队规模、合作机构或成果数据。
- 外部链接可公开访问，微信链接不是临时预览链接。
- 图片已获得公开使用授权，不含患者隐私或未脱敏资料。
- 同一内容没有重复 `id`，YAML 缩进使用两个空格且不用 Tab。
- `enabled: true` 的内容不存在“待定”“示例”或空的必要信息。
- Pull Request 的 Jekyll 构建和链接检查通过。

## GitHub Pages 地址

当前仓库属于 `CardioMind-AI` 组织，仓库名是 `CardioMind-AILab.github.io`，因此它是项目站点：

`https://cardiomind-ai.github.io/CardioMind-AILab.github.io/`

配置已对应为：

```yaml
url: https://cardiomind-ai.github.io
baseurl: /CardioMind-AILab.github.io
```

若希望使用组织根地址 `https://cardiomind-ai.github.io/`，需要把仓库重命名为 `CardioMind-AI.github.io`，再把 `baseurl` 改为空字符串。若绑定独立域名，则添加 `CNAME` 并把 `url` 改为独立域名，同时把 `baseurl` 改为空字符串。

仓库 **Settings → Pages** 应将 Source 设为 **Deploy from a branch**，分支选择 `gh-pages` 的根目录；当前 `Deploy site` 工作流会构建 `_site` 并推送到该分支。工作流已经监听 `**.yml` 与 `assets/**`，所以编辑内容数据或上传封面都会自动触发部署。
