# CRM GBP LINE Frontend

React + TypeScript + Vite + Material-UI で構築されたフロントエンドアプリケーション

## 技術スタック

- React 18.2
- TypeScript 5.3
- Vite 5.0
- Material-UI (MUI) 5.15
- React Router 6.21
- Axios 1.6
- Day.js 1.11

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーして編集:

```bash
cp .env.example .env
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは http://localhost:5173 で起動します。

## ビルド

### プロダクションビルド

```bash
npm run build
```

### ビルドのプレビュー

```bash
npm run preview
```

## Docker

### Dockerイメージのビルド

```bash
docker build -t crm-gbp-line-frontend .
```

### Dockerコンテナの実行

```bash
docker run -p 80:80 crm-gbp-line-frontend
```

## プロジェクト構造

```
frontend/
├── src/
│   ├── api/              # API クライアント
│   ├── components/       # React コンポーネント
│   │   ├── Layout/      # レイアウトコンポーネント
│   │   └── common/      # 共通コンポーネント
│   ├── contexts/        # React Context
│   ├── hooks/           # カスタムフック
│   ├── pages/           # ページコンポーネント
│   ├── App.tsx          # ルーティング設定
│   └── main.tsx         # エントリポイント
├── public/              # 静的ファイル
├── index.html           # HTMLテンプレート
├── package.json         # 依存関係
├── tsconfig.json        # TypeScript設定
├── vite.config.ts       # Vite設定
└── Dockerfile           # Docker設定
```

## 機能

- 認証機能（ログイン/ログアウト）
- ダッシュボード
- レスポンシブデザイン（モバイル対応）
- 日本語対応
- MUIテーマカスタマイズ

## 開発ガイドライン

- TypeScriptの型定義を必ず行う
- コンポーネントは再利用可能な形で作成
- MUIのコンポーネントを優先的に使用
- APIクライアントは `src/api/` に集約
- 認証が必要なページは `PrivateRoute` でラップ
