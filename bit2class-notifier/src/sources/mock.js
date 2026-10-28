/**
 * 内置假数据：用于第一次跑通全流程，不需要任何真实接口。
 * 每次启动都以「当前时间」为基准生成，所以 `npm start` 后一两分钟内必然能收到一条提醒。
 */
export class MockSource {
  name = 'mock';

  constructor({ leadMinutes = 5 } = {}) {
    const now = Date.now();
    const at = (offsetMs) => new Date(now + offsetMs).toISOString();
    const minutes = (n) => n * 60_000;

    this.activities = [
      {
        id: 'mock-1',
        title: '【示范】前沿讲座：智能无人系统与具身智能',
        signupStart: at(minutes(2)),
        signupEnd: at(minutes(62)),
        eventStart: at(minutes(60 * 24 * 3)),
        url: 'https://example.com/activity/mock-1',
      },
      {
        id: 'mock-2',
        title: '【示范】志愿活动：社区科普服务（良乡校区）',
        signupStart: at(minutes(45)),
        signupEnd: at(minutes(60 * 26)),
        eventStart: at(minutes(60 * 24 * 5)),
        url: 'https://example.com/activity/mock-2',
      },
      {
        id: 'mock-3',
        title: '【示范】文体活动：秋季校园健康跑',
        signupStart: at(-minutes(1)),
        signupEnd: at(minutes(30)),
        eventStart: at(minutes(60 * 24 * 2)),
        url: 'https://example.com/activity/mock-3',
      },
      {
        id: 'mock-4',
        title: '【示范】长期招募：图书馆志愿服务岗',
        signupStart: null,
        signupEnd: null,
        eventStart: null,
        url: 'https://example.com/activity/mock-4',
      },
      {
        id: 'mock-5',
        title: '【示范】社会实践分享会：北理思源计划',
        signupStart: at(minutes(100)),
        signupEnd: at(minutes(60 * 30)),
        eventStart: at(minutes(60 * 24 * 7)),
        url: 'https://example.com/activity/mock-5',
      },
    ].map((activity) => ({ ...activity, raw: activity }));

    this.leadMinutes = leadMinutes;
  }

  async fetchActivities() {
    return this.activities;
  }
}
