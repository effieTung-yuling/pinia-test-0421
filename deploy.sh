#!/usr/bin/env sh

# 發生錯誤時停止執行
set -e

# 1. 編譯專案 (如果你 package.json 改了，也可以用 npm run build)
npm run build-only

# 2. 進入打包後的資料夾
cd dist

# 3. 移除舊的 .git 檔案 (關鍵：確保每次都是全新的 commit)
rm -rf .git

# 4. 初始化並提交
echo > .nojekyll
git init
git checkout -B main
git add -A
git commit -m 'deploy'

# 5. 推送到 GitHub (這裡請確認用 HTTPS 或 SSH，下面先改為 HTTPS 範例)
git push -f https://github.com/effieTung-yuling/pinia-test-0421.git main:gh-pages

# 6. 回到原本的目錄
cd -