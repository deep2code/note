#!/bin/bash

echo "=== 开始部署 MkDocs 网站 ==="

# 1. 本地构建
echo "1. 构建网站..."
mkdocs build

# 2. 切换到 gh-pages 分支
echo "2. 切换到 gh-pages 分支..."
git checkout gh-pages

# 3. 清空现有内容
echo "3. 清空现有内容..."
rm -rf *

# 4. 复制新构建的内容
echo "4. 复制新构建内容..."
cp -r site/* .

# 5. 提交并推送
echo "5. 提交并推送..."
git add .
git commit -m "Update site: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin gh-pages

# 6. 切换回 main 分支
echo "6. 切换回 main 分支..."
git checkout main

echo "=== 部署完成！==="