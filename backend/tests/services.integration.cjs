const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const url = new URL(process.env.TEST_DATABASE_URL || 'http://missing-test-database');
assert.ok(['localhost', '127.0.0.1'].includes(url.hostname) && url.pathname.endsWith('_test'), 'Use an isolated local *_test database');
process.env.DATABASE_URL = url.href;
const { prisma } = require('../dist/repositories/prisma');
const { customersService } = require('../dist/services/customers.service');
const { storesService } = require('../dist/services/stores.service');
const { postsService } = require('../dist/services/posts.service');
const { schedulesService } = require('../dist/services/schedules.service');
const { metricsService } = require('../dist/services/metrics.service');
const { settingsService } = require('../dist/services/settings.service');

test('services use the deployed Prisma model names, relationships and filters', async () => {
  let customer, store, post, schedule, metric, setting;
  try {
    customer = await customersService.createCustomer({ name: randomUUID(), companyName: 'Fixture company' });
    store = await storesService.createStore({ name: 'Fixture store', customerId: customer.id });
    assert.equal(store.customer.id, customer.id);
    const customers = await customersService.getCustomers({ page: 1, limit: 10, search: 'Fixture company', storeId: store.id });
    assert.ok(customers.data.some(item => item.id === customer.id));
    assert.equal((await customersService.getCustomer(customer.id)).stores[0].id, store.id);
    assert.equal((await storesService.getStores({ page: 1, limit: 10, search: store.name })).data[0].customer.id, customer.id);
    post = await postsService.createPost({ title: 'Fixture', content: 'Test content' });
    schedule = await schedulesService.createSchedule({ postId: post.id, storeId: store.id, scheduledAt: new Date(), status: 'PENDING' });
    assert.equal(schedule.post.id, post.id);
    assert.equal((await postsService.getPosts({ page: 1, limit: 10, storeId: store.id, status: 'PENDING' })).data[0].id, post.id);
    assert.equal((await postsService.getPosts({ page: 1, limit: 10, storeId: store.id, status: 'SUCCESS' })).data.length, 0);
    const schedules = await schedulesService.getSchedules({ page: 1, limit: 10, storeId: store.id, startDate: '2000-01-01', endDate: '2100-01-01' });
    assert.equal(schedules.data[0].id, schedule.id);
    await schedulesService.updateSchedule(schedule.id, { status: 'CANCELLED' });
    assert.equal((await schedulesService.getSchedule(schedule.id)).status, 'CANCELLED');
    metric = await metricsService.createMetric({ storeId: store.id, date: new Date('2026-10-23'), viewCount: 5 });
    assert.equal((await metricsService.getMetrics({ page: 1, limit: 10, storeId: store.id, startDate: '2026-10-23', endDate: '2026-10-23' })).data[0].viewCount, 5);
    await metricsService.updateMetric(metric.id, { viewCount: 6 });
    assert.equal((await metricsService.getMetric(metric.id)).viewCount, 6);
    setting = await settingsService.createSetting({ key: randomUUID(), value: 'fixture' });
    assert.ok((await settingsService.getSettings({ page: 1, limit: 100 })).data.some(item => item.id === setting.id));
    await settingsService.updateSetting(setting.id, { value: 'updated' });
    assert.equal((await settingsService.getSetting(setting.id)).value, 'updated');
    assert.equal(await customersService.updateCustomer(randomUUID(), { name: 'missing' }), null);
    assert.equal(await postsService.deletePost(randomUUID()), false);
  } finally {
    if (metric) await metricsService.deleteMetric(metric.id);
    if (schedule) await schedulesService.deleteSchedule(schedule.id);
    if (post) await postsService.deletePost(post.id);
    if (store) await storesService.deleteStore(store.id);
    if (customer) await customersService.deleteCustomer(customer.id);
    if (setting) await settingsService.deleteSetting(setting.id);
    await prisma.$disconnect();
  }
});
