// Cloudflare Workers 免费档 bundle 上限 1MiB。twikoo-func 依赖里的三个包
// （jsdom / tencentcloud-sdk-nodejs / nodemailer）在 Workers 运行时里本来就
// 用不了（nodejs_compat 不完整），但会被一起打包、把 bundle 顶爆。
// twikoo-cloudflare README 的部署步骤要求手工清空它们；这里把这件事脚本化，
// 让 npm install 后自动执行，Git 构建时也能走同一条路径。
import { writeFileSync } from 'node:fs';

const targets = [
  'node_modules/jsdom/lib/api.js',
  'node_modules/tencentcloud-sdk-nodejs/tencentcloud/index.js',
  'node_modules/nodemailer/lib/nodemailer.js',
];

for (const t of targets) {
  try {
    writeFileSync(t, '');
    console.log(`trimmed ${t}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`skip (not installed): ${t}`);
    } else {
      throw err;
    }
  }
}
