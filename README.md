# GBP予約投稿・LINE連携 統合システム

社内担当者向けのGoogleビジネスプロフィール(GBP)投稿予約・LINE通知システム

## 機能

- **ユーザー管理**: 社内担当者の認証・セッション管理
- **顧客管理**: 顧客マスタCRUD
- **店舗管理**: 店舗情報CRUD、GBP認証状態管理
- **投稿管理**: 投稿作成・編集・削除、タイプ選択
- **予約機能**: 予約スケジュール設定・ジョブキュー管理
- **LINE連携**: 通知テンプレート管理
- **メトリクス**: GBP日次パフォーマンス収集・表示

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | React 18 + TypeScript + MUI |
| バックエンド | Node.js 18+ / Express.js + TypeScript |
| データベース | PostgreSQL 14+ / Prisma ORM |
| ジョブキュー | Bull + Redis 6+ |
| 認証 | JWT |
| コンテナ | Docker / docker-compose |

## セットアップ

### 前提条件

- Docker & Docker Compose
- Node.js 18+（ローカル開発時）

### 1. 環境変数設定

```bash
cp .env.example .env
# .envファイルを編集してJWT_SECRET等を設定
```

### 2. Docker起動

```bash
docker-compose up -d
```

### 3. データベースマイグレーション

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
```

### 4. アクセス

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3000
- ヘルスチェック: http://localhost:3000/health

## デフォルトログイン

- Email: `admin@example.com`
- Password: `password123`

## 開発コマンド

```bash
# バックエンド開発サーバー
cd backend && npm run dev

# フロントエンド開発サーバー
cd frontend && npm run dev

# Prisma Studio（DBブラウザ）
cd backend && npx prisma studio

# ビルド
cd backend && npm run build
cd frontend && npm run build
```

## APIエンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| POST | /api/auth/login | ログイン |
| GET | /api/auth/me | 現在のユーザー |
| GET | /api/customers | 顧客一覧 |
| POST | /api/customers | 顧客作成 |
| GET | /api/stores | 店舗一覧 |
| POST | /api/stores | 店舗作成 |
| GET | /api/posts | 投稿一覧 |
| POST | /api/posts | 投稿作成 |
| GET | /api/schedules | 予約一覧 |
| POST | /api/schedules | 予約作成 |
| GET | /api/metrics | メトリクス |
| GET | /health | ヘルスチェック |

## ディレクトリ構造

```
crm-gbp-line/
├── docker-compose.yml
├── .env.example
├── README.md
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── app.ts
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── jobs/
│   │   ├── integrations/
│   │   ├── auth/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   └── utils/
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── pages/
        ├── hooks/
        ├── contexts/
        └── types/
```

## ライセンス

Private - All rights reserved
