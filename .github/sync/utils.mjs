import JSON5 from 'json5';
import { logger } from './config';

export function safeJsonParse(str, desc = '', silent = false) {
  if (!str) return {};
  try {
    return JSON5.parse(str.trim());
  } catch {
    try {
      str = str
        .replace(/^[ \t]*\/\/.*/gm, '')
        .replace(/[ \t]+\/\/[^"]+\n/gm, '')
        // .replace(/ *(".+" *: *(".*",|\d+|true|false),?)[ \t]*\/\/[^"]+\n/gm, '$1')
        .trim();
      return JSON5.parse(str);
    } catch (error) {
      if (!silent) console.error('[JSON.parse][error]', desc, error.message);
      return {};
    }
  }
}

async function checkoutRepo(repo, baseDir, debug = false) {
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

  try {
    const dirName = repo.replaceAll('/', '-');
    const dirpath = path.resolve(baseDir, dirName);
    if (fs.existsSync(dirpath)) {
      execSync(`git reset --hard && git pull`, { cwd: dirpath });
    } else {
      repo = debug ? `https://ghproxy.com/github.com/${repo}` : `https://github.com/${repo}.git`;
      execSync(`git clone --depth 1 ${repo} ${dirName}`, { cwd: baseDir });
    }
  } catch (error) {
    logger.error(`checkout ${repo} failed!`, error.message);
  }
}


