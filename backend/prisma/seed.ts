import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default staff user
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.staffUser.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      name: '管理者',
      isActive: true,
    },
  });

  console.log('Created admin user:', admin.email);

  // Create sample customers
  const customer1 = await prisma.customer.upsert({
    where: { id: 'sample-customer-1' },
    update: {},
    create: {
      id: 'sample-customer-1',
      name: '山田太郎',
      companyName: '株式会社サンプル',
      email: 'yamada@example.com',
      phone: '03-1234-5678',
      notes: 'サンプル顧客です',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 'sample-customer-2' },
    update: {},
    create: {
      id: 'sample-customer-2',
      name: '鈴木花子',
      companyName: '有限会社テスト',
      email: 'suzuki@example.com',
      phone: '06-9876-5432',
    },
  });

  console.log('Created customers:', customer1.name, customer2.name);

  // Create sample stores
  const store1 = await prisma.store.upsert({
    where: { id: 'sample-store-1' },
    update: {},
    create: {
      id: 'sample-store-1',
      customerId: customer1.id,
      name: 'サンプル店舗 渋谷店',
      address: '東京都渋谷区渋谷1-1-1',
      phone: '03-1111-2222',
      gbpLocationId: 'mock-location-1',
    },
  });

  const store2 = await prisma.store.upsert({
    where: { id: 'sample-store-2' },
    update: {},
    create: {
      id: 'sample-store-2',
      customerId: customer1.id,
      name: 'サンプル店舗 新宿店',
      address: '東京都新宿区新宿2-2-2',
      phone: '03-3333-4444',
      gbpLocationId: 'mock-location-2',
    },
  });

  const store3 = await prisma.store.upsert({
    where: { id: 'sample-store-3' },
    update: {},
    create: {
      id: 'sample-store-3',
      customerId: customer2.id,
      name: 'テスト店舗 大阪店',
      address: '大阪府大阪市中央区1-1-1',
      phone: '06-1111-2222',
      gbpLocationId: 'mock-location-3',
    },
  });

  console.log('Created stores:', store1.name, store2.name, store3.name);

  // Create sample LINE account
  const lineAccount = await prisma.lineAccount.upsert({
    where: { id: 'sample-line-account' },
    update: {},
    create: {
      id: 'sample-line-account',
      name: 'メイン通知チャネル',
      channelId: 'mock-channel-id',
      channelSecret: 'mock-channel-secret',
      accessToken: 'mock-access-token',
      isActive: true,
    },
  });

  console.log('Created LINE account:', lineAccount.name);

  // Create sample posts
  const post1 = await prisma.post.upsert({
    where: { id: 'sample-post-1' },
    update: {},
    create: {
      id: 'sample-post-1',
      title: '年末セールのお知らせ',
      content: '年末大感謝祭を開催します！全商品20%OFF！',
      postType: 'NEWS',
      imageUrl: 'https://example.com/sale.jpg',
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: 'sample-post-2' },
    update: {},
    create: {
      id: 'sample-post-2',
      title: 'クリスマスイベント',
      content: '12月24日・25日限定！クリスマス特別メニューをご用意しています。',
      postType: 'EVENT',
      eventStart: new Date('2025-12-24T10:00:00'),
      eventEnd: new Date('2025-12-25T22:00:00'),
    },
  });

  console.log('Created posts:', post1.title, post2.title);

  // Create sample settings
  await prisma.setting.upsert({
    where: { key: 'notification_template_success' },
    update: {},
    create: {
      key: 'notification_template_success',
      value: '✅ 投稿が完了しました\n店舗: {{storeName}}\n投稿: {{postTitle}}',
    },
  });

  await prisma.setting.upsert({
    where: { key: 'notification_template_failure' },
    update: {},
    create: {
      key: 'notification_template_failure',
      value: '❌ 投稿が失敗しました\n店舗: {{storeName}}\n投稿: {{postTitle}}\nエラー: {{errorMessage}}',
    },
  });

  console.log('Created settings');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
