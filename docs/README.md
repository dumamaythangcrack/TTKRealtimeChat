# 🚀 ChatTTK - Hướng Dẫn Cài Đặt và Sử Dụng Chi Tiết

## 👋 Giới Thiệu

ChatTTK là một ứng dụng chat enterprise cấp độ GOD++ với khả năng mở rộng vô hạn, được xây dựng trên nền tảng Firebase Serverless và Google Cloud. Ứng dụng tích hợp đầy đủ các tính năng hiện đại: real-time messaging, video calls, livestream, stories, AI assistant, blockchain integration, và hệ thống quản trị mạnh mẽ.

### ✨ Tính Năng Chính

- **💬 Real-time Messaging**: Chat 1-1 và nhóm với khả năng xử lý hàng nghìn tin nhắn mượt mà
- **📹 Video Calls & Livestream**: Video call nhóm, livestream với chat overlay
- **📸 Stories 24h**: Tạo và xem stories tự động xóa sau 24 giờ
- **🤖 AI Integration**: AI assistant, smart replies, sentiment analysis, content moderation
- **👥 Social Features**: Friend system, groups, mentions, hashtags
- **🛒 E-Commerce**: In-app shop, payment integration, subscription tiers
- **🔐 Security**: End-to-end encryption, 2FA, rate limiting, DDoS protection
- **👑 Admin Panel**: Dashboard analytics, user management, content moderation
- **⛓️ Blockchain**: NFT profile pictures, crypto payments, token-gated communities

---

## 📋 Yêu Cầu Hệ Thống

Trước khi bắt đầu, bạn cần cài đặt các công cụ sau:

### 1. Node.js và npm

- **Node.js**: Phiên bản >= 20.0.0
- **npm**: Phiên bản >= 10.0.0

**Cách cài đặt:**

1. Truy cập [nodejs.org](https://nodejs.org/)
2. Tải về phiên bản LTS (Long Term Support)
3. Chạy file installer và làm theo hướng dẫn
4. Mở Terminal/PowerShell và kiểm tra:
   ```bash
   node --version
   npm --version
   ```

### 2. Firebase CLI

Firebase CLI là công cụ dòng lệnh để quản lý Firebase project.

**Cách cài đặt:**

```bash
npm install -g firebase-tools
```

**Đăng nhập Firebase:**

```bash
firebase login
```

Làm theo hướng dẫn trên trình duyệt để đăng nhập.

### 3. Git

- Truy cập [git-scm.com](https://git-scm.com/)
- Tải về và cài đặt Git
- Kiểm tra: `git --version`

---

## 🔥 Thiết Lập Firebase Project

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click nút **"Add project"** (Thêm dự án)
3. Nhập tên project (ví dụ: `chatttk-production`)
4. Chọn Google Analytics (tùy chọn - có thể bỏ qua)
5. Click **"Create project"** và đợi Firebase tạo project

### Bước 2: Cấu Hình Authentication

1. Trong Firebase Console, vào **Authentication** > **Sign-in method**
2. Bật các providers sau:
   - ✅ **Email/Password**: Click "Enable" và "Save"
   - ✅ **Google**: Click "Enable", nhập OAuth client ID (xem hướng dẫn bên dưới)
   - ✅ **Facebook**: Click "Enable" (tùy chọn)
   - ✅ **Apple**: Click "Enable" (tùy chọn)

**Cấu hình Google Sign-In:**

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn
3. Vào **APIs & Services** > **Credentials**
4. Click **"Create Credentials"** > **"OAuth client ID"**
5. Chọn **"Web application"**
6. Thêm **Authorized redirect URIs**: 
   ```
   https://your-project.firebaseapp.com/__/auth/handler
   ```
7. Copy **Client ID** và **Client Secret**
8. Quay lại Firebase Console và paste vào

### Bước 3: Enable Firestore Database

1. Vào **Firestore Database** > **Create database**
2. Chọn **"Start in production mode"** (sẽ cấu hình rules sau)
3. Chọn location: **asia-southeast1** (Singapore) - gần Việt Nam nhất
4. Click **"Enable"**

### Bước 4: Enable Realtime Database

1. Vào **Realtime Database** > **Create database**
2. Chọn location: **asia-southeast1**
3. Click **"Enable"**

### Bước 5: Enable Storage

1. Vào **Storage** > **Get started**
2. Chọn **"Start in production mode"**
3. Chọn location: **asia-southeast1**
4. Click **"Done"**

### Bước 6: Lấy Firebase Config

1. Vào **Project Settings** (biểu tượng bánh răng) > **General**
2. Scroll xuống phần **"Your apps"**
3. Click icon **Web** (`</>`) để tạo web app
4. Nhập tên app (ví dụ: "ChatTTK Web")
5. Copy các giá trị config:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - `databaseURL` (từ Realtime Database)

### Bước 7: Tải Service Account Key

1. Vào **Project Settings** > **Service accounts**
2. Click **"Generate new private key"**
3. Lưu file JSON vào `functions/service-account-key.json`
4. **QUAN TRỌNG**: Thêm vào `.gitignore` để không commit lên Git:
   ```
   functions/service-account-key.json
   ```

---

## ⚙️ Cấu Hình Environment Variables

### Frontend Environment Variables

1. Tạo file `.env` trong thư mục `frontend/`:

```bash
cd frontend
cp .env.example .env
```

2. Mở file `.env` và cập nhật các giá trị:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# FCM Configuration (Optional - for push notifications)
VITE_FCM_VAPID_KEY=your-vapid-key-here

# API Keys (Optional - for AI features)
VITE_OPENAI_API_KEY=your-openai-key
VITE_ANTHROPIC_API_KEY=your-anthropic-key

# Feature Flags
VITE_USE_EMULATORS=false
VITE_ENABLE_AI=true
```

**Lấy FCM VAPID Key:**

1. Vào Firebase Console > **Project Settings** > **Cloud Messaging**
2. Scroll xuống **"Web configuration"** > **Web Push certificates**
3. Click **"Generate key pair"** nếu chưa có
4. Copy key và paste vào `.env`

### Functions Environment Variables

1. Tạo file `.env` trong thư mục `functions/`:

```bash
cd functions
cp .env.example .env
```

2. Mở file `.env` và cập nhật:

```env
# OpenAI (for AI chatbot)
OPENAI_API_KEY=your-openai-api-key

# SendGrid (for emails)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@chatttk.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Lấy API Keys:**

- **OpenAI**: https://platform.openai.com/api-keys
- **SendGrid**: https://app.sendgrid.com/settings/api_keys

3. Set environment variables cho Cloud Functions:

```bash
firebase functions:config:set \
  openai.api_key="your-openai-api-key" \
  sendgrid.api_key="your-sendgrid-api-key" \
  frontend.url="https://your-domain.com"
```

---

## 👑 Cấu Hình Super Admin (CRITICAL)

### Cơ Chế Auto Admin Grant

Hệ thống tự động nhận diện và cấp quyền **GOD MODE** cho email:
- **Email**: `khangnek705@gmail.com`
- **Password mặc định**: `Khang11222013@#`

### Cách Hoạt Động

1. Khi user đăng ký với email `khangnek705@gmail.com`, trigger `onUserCreate` sẽ:
   - Set Custom Claims: `{ admin: true, godMode: true, role: 'owner', permissions: ['*'] }`
   - Update Firestore user document với các quyền tương ứng
   - Log action vào `admin_logs`

2. Custom Claims được tự động refresh khi user đăng nhập lại

### Test Super Admin

1. Đăng ký với email `khangnek705@gmail.com`
2. Đăng nhập
3. Kiểm tra Firestore: Vào **Firestore Database** > collection `users` > document của bạn
4. Bạn sẽ thấy:
   ```json
   {
     "isAdmin": true,
     "godMode": true,
     "role": "owner",
     "permissions": ["*"]
   }
   ```
5. Truy cập `/admin` - bạn sẽ thấy Admin Panel

### Thêm/Xóa Admin (God Mode only)

**Thêm Admin:**

Sử dụng Cloud Functions hoặc Admin SDK:

```typescript
// Trong Cloud Functions
await auth.setCustomUserClaims(userId, {
  admin: true,
  godMode: false, // hoặc true cho god mode
  role: 'admin',
  permissions: ['*'],
});
```

**Xóa Admin:**

```typescript
await auth.setCustomUserClaims(userId, {
  admin: false,
  godMode: false,
  role: 'user',
  permissions: [],
});
```

---

## 🚀 Cài Đặt và Chạy Dự Án

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd chatttkrealtimev5
```

### Bước 2: Cài Đặt Dependencies

**Root dependencies:**

```bash
npm install
```

**Frontend dependencies:**

```bash
cd frontend
npm install
```

**Functions dependencies:**

```bash
cd ../functions
npm install
```

### Bước 3: Cấu Hình Firebase Project

1. Link Firebase project:

```bash
firebase use --add
```

Chọn project của bạn từ danh sách.

2. Update `.firebaserc` nếu cần:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### Bước 4: Deploy Firestore Rules và Storage Rules

```bash
firebase deploy --only firestore:rules,storage
```

### Bước 5: Build và Deploy Cloud Functions

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

**Lưu ý:** Lần đầu deploy có thể mất 5-10 phút.

### Bước 6: Chạy Frontend (Development)

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

---

## 🧪 Test Hệ Thống

### Test 1: Đăng Ký và Auto Admin Grant

1. Mở http://localhost:5173
2. Click **"Đăng ký"**
3. Đăng ký với email `khangnek705@gmail.com`
4. Sau khi đăng ký, kiểm tra:
   - Firestore: User document có `isAdmin: true`, `godMode: true`
   - UI: Hiển thị thông báo "👑 Bạn có quyền ADMIN!"

### Test 2: Đăng Nhập

1. Đăng xuất (nếu đang đăng nhập)
2. Đăng nhập lại với email `khangnek705@gmail.com`
3. Kiểm tra:
   - Đăng nhập thành công
   - Có nút "Admin Panel" trên navbar
   - Truy cập `/admin` thành công

### Test 3: Admin Panel

1. Truy cập `/admin`
2. Kiểm tra:
   - Dashboard hiển thị
   - Có thông báo "⚡ GOD MODE: Bạn có toàn quyền truy cập hệ thống"

---

## 🌐 Deploy Lên Production

### Deploy Backend (Firebase)

```bash
# Deploy tất cả
firebase deploy

# Hoặc deploy từng phần
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### Deploy Frontend (Vercel)

1. **Cài đặt Vercel CLI:**

```bash
npm install -g vercel
```

2. **Login Vercel:**

```bash
vercel login
```

3. **Deploy:**

```bash
cd frontend
vercel --prod
```

4. **Cấu hình Environment Variables trên Vercel:**

- Vào Vercel Dashboard > Project Settings > Environment Variables
- Thêm tất cả các biến từ `frontend/.env`

5. **Custom Domain (Optional):**

- Vào Project Settings > Domains
- Add domain của bạn
- Follow DNS instructions

---

## 🔧 Troubleshooting (Xử Lý Lỗi)

### Lỗi 1: Firebase Emulator không start

**Problem:** Emulator không start được

**Solution:**

```bash
# Kill existing processes
# Windows PowerShell:
Get-Process -Name node | Stop-Process -Force

# Mac/Linux:
lsof -ti:8080 | xargs kill -9
lsof -ti:9099 | xargs kill -9
lsof -ti:5001 | xargs kill -9

# Restart emulators
npm run emulators
```

### Lỗi 2: Build Errors

**Problem:** TypeScript errors khi build

**Solution:**

```bash
cd frontend
npx tsc --noEmit

# Fix errors hoặc update tsconfig.json
```

### Lỗi 3: Functions Deploy Failed

**Problem:** Functions deploy failed

**Solution:**

```bash
# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools@latest

# Retry deploy
firebase deploy --only functions
```

### Lỗi 4: Permission Denied (Firestore Rules)

**Problem:** Firestore rules deny access

**Solution:**

1. Check Firestore rules trong `firestore/firestore.rules`
2. Verify user authentication
3. Check Custom Claims (admin, godMode)
4. Test rules trong Firebase Console > Firestore > Rules > Rules Playground

### Lỗi 5: Admin không được cấp quyền

**Problem:** Đăng ký với `khangnek705@gmail.com` nhưng không có quyền admin

**Solution:**

1. Kiểm tra trigger `onUserCreate` đã deploy chưa:
   ```bash
   firebase functions:list
   ```

2. Kiểm tra logs:
   ```bash
   firebase functions:log --only onUserCreate
   ```

3. Manually set admin (nếu cần):
   - Vào Firebase Console > Authentication
   - Tìm user
   - Sử dụng Admin SDK để set custom claims

---

## 📚 Tài Liệu Tham Khảo

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra lại các bước cài đặt
2. Xem phần Troubleshooting
3. Tạo issue trên GitHub repository

---

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**Made with ❤️ by ChatTTK Team**

