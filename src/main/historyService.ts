import { app } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * 弹幕记录接口
 */
export interface BarrageRecord {
  /** Unix 时间戳（毫秒） */
  timestamp: number;
  /** 用户名称 */
  username: string;
  /** 弹幕内容 */
  content: string;
  /** 平台来源 */
  platform: string;
  /** 弹幕类型 */
  type?: 'danmu' | 'gift' | 'enter' | 'superchat';
  /** 弹幕颜色 */
  color?: string;
}

class HistoryService {
  private _historyDir: string | null = null;

  /**
   * 懒获取 history 文件夹路径（在 app.whenReady 后首次调用时初始化）
   */
  private get historyDir(): string {
    if (this._historyDir === null) {
      this._historyDir = path.join(app.getPath('userData'), 'history');
      this.ensureDir();
    }
    return this._historyDir;
  }

  /**
   * 确保 history 文件夹存在
   */
  private ensureDir() {
    const dir = this._historyDir!;
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`[HistoryService] 创建历史弹幕文件夹: ${dir}`);
      } else {
        console.log(`[HistoryService] 历史弹幕文件夹已存在: ${dir}`);
      }
    } catch (err) {
      console.error(`[HistoryService] 确保文件夹失败: ${dir}`, err);
    }
  }

  /**
   * 获取当前日期的字符串格式 年-月-日
   */
  public getDateStr(date?: Date): string {
    const d = date || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 获取文件的完整路径
   */
  private getFilePath(dateStr: string): string {
    return path.join(this.historyDir, `${dateStr}.json`);
  }

  /**
   * 保存一条弹幕记录（追加写入当天的文件）
   * 使用 NDJSON 格式：每行一个 JSON 对象，便于追加写入
   * @param record 弹幕记录（不包含 timestamp）
   */
  saveRecord(record: Omit<BarrageRecord, 'timestamp'>): void {
    const dateStr = this.getDateStr();
    const filePath = this.getFilePath(dateStr);

    const fullRecord: BarrageRecord = {
      ...record,
      timestamp: Date.now(),
    };

    console.log('start save record');

    try {
      const line = JSON.stringify(fullRecord) + '\n';
      console.log(`filePath: ${filePath}`);
      console.log(`line: ${line}`);
      fs.appendFileSync(filePath, line, 'utf-8');
    } catch (err) {
      console.error('[HistoryService] 保存弹幕失败:', err);
    }
  }

  /**
   * 批量保存弹幕记录
   */
  saveRecords(records: Omit<BarrageRecord, 'timestamp'>[]): void {
    const dateStr = this.getDateStr();
    const filePath = this.getFilePath(dateStr);

    try {
      const lines = records
        .map(
          (r) =>
            JSON.stringify({
              ...r,
              timestamp: Date.now(),
            }) + '\n'
        )
        .join('');
      fs.appendFileSync(filePath, lines, 'utf-8');
    } catch (err) {
      console.error('[HistoryService] 批量保存弹幕失败:', err);
    }
  }

  /**
   * 获取指定日期的所有历史弹幕记录
   * @param dateStr 日期字符串 年-月-日，例如 "2026-07-05"
   */
  getRecords(dateStr: string): BarrageRecord[] {
    const filePath = this.getFilePath(dateStr);

    if (!fs.existsSync(filePath)) {
      return [];
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const records: BarrageRecord[] = [];
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) {
          try {
            records.push(JSON.parse(trimmed));
          } catch {
            console.warn(
              `[HistoryService] 跳过格式错误的行: ${trimmed.slice(0, 50)}`
            );
          }
        }
      }
      return records;
    } catch (err) {
      console.error('[HistoryService] 读取弹幕失败:', err);
      return [];
    }
  }

  /**
   * 获取所有有历史记录的日期列表（倒序排列）
   */
  getAvailableDates(): string[] {
    if (!fs.existsSync(this.historyDir)) {
      return [];
    }

    try {
      return fs
        .readdirSync(this.historyDir)
        .filter((file) => file.endsWith('.json'))
        .map((file) => file.replace('.json', ''))
        .sort()
        .reverse();
    } catch (err) {
      console.error('[HistoryService] 获取日期列表失败:', err);
      return [];
    }
  }

  /**
   * 获取 history 文件夹路径
   */
  getHistoryDirPath(): string {
    return this.historyDir;
  }

  /**
   * 获取捕获弹幕的 JS 注入脚本
   * 根据不同云平台的 DOM 结构注入对应的 MutationObserver 监听器
   * @param cloudSource 云平台来源（bilibili | blc | others 等）
   */
  getCaptureScript(cloudSource: string): string {
    const captureCode = `
      // 捕获弹幕并发送到主进程保存
      function captureBarrage(username, content, platform, type) {
        window.electron && window.electron.sentSaveBarrageHistory({
          username: username || '匿名用户',
          content: content || '',
          platform: platform || '${cloudSource}',
          type: type || 'danmu',
        });
      }
    `;

    switch (cloudSource) {
      case 'bilibili':
        return `
          ${captureCode}
          // B站直播弹幕监听
          if (typeof barrageObserver === 'undefined') {
            var barrageObserver = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                  if (node.nodeType === 1) {
                    var nameEl = node.querySelector('.chat-item-name, .user-name, .danmaku-author');
                    var textEl = node.querySelector('.chat-item-content, .danmaku-content, .danmaku-text');
                    if (nameEl && textEl) {
                      captureBarrage(
                        nameEl.textContent.trim(),
                        textEl.textContent.trim(),
                        'bilibili',
                        'danmu'
                      );
                    }
                  }
                });
              });
            });
            barrageObserver.observe(document.body, { childList: true, subtree: true });
          }
        `;

      case 'blc':
        return `
          ${captureCode}
          // BLC直播弹幕监听
          if (typeof barrageObserver === 'undefined') {
            var barrageObserver = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                  if (node.nodeType === 1) {
                    var nameEl = node.querySelector('#author-name');
                    var textEl = node.querySelector('#message');
                    if (nameEl && textEl) {
                      captureBarrage(
                        nameEl.textContent.trim(),
                        textEl.textContent.trim(),
                        'blc',
                        'danmu'
                      );
                    }
                  }
                });
              });
            });
            barrageObserver.observe(document.body, { childList: true, subtree: true });
          }
        `;

      default:
        return `
          ${captureCode}
          // 通用捕获（其他平台）
          console.log('[HistoryService] 弹幕捕获已注入 (' + '${cloudSource}' + ')');
        `;
    }
  }
}

// 导出单例
export const historyService = new HistoryService();
