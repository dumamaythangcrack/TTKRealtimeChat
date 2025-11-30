# 🚀 ChatTTK - GOD++ EDITION (V14 - ULTRA UPGRADED)

## 👤 Giới Thiệu

ChatTTK là một ứng dụng chat enterprise cấp độ GOD++ với khả năng scale vô hạn, được xây dựng trên nền tảng Firebase Serverless và Google Cloud. Ứng dụng tích hợp đầy đủ các tính năng hiện đại: real-time messaging, video calls, livestream, stories, AI assistant, và hệ thống quản trị mạnh mẽ.

### ✨ Tính Năng Chính

- **💬 Real-time Messaging**: Chat 1-1 và nhóm với khả năng xử lý 15,000+ tin nhắn mượt mà
- **📹 Video Calls & Livestream**: Video call nhóm, livestream với chat overlay
- **📸 Stories 24h**: Tạo và xem stories tự động xóa sau 24 giờ
- **🤖 AI Integration**: AI assistant, smart replies, sentiment analysis
- **👥 Social Features**: Friend system, groups, mentions, hashtags
- **🛒 E-Commerce**: In-app shop, payment integration, subscription tiers
- **🛡️ Security**: End-to-end encryption, 2FA, rate limiting, DDoS protection
- **👑 Admin Panel**: Dashboard analytics, user management, content moderation

### 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript (Strict Mode)
- Vite + TailwindCSS v4 + DaisyUI
- Zustand (State Management) + TanStack Query v5
- TanStack Virtual (Virtualization)
- WebRTC (Video Calls), HLS.js (Livestream)
- PWA Support (Workbox)

**Backend:**
- Firebase Functions Gen 2 (Node.js 20)
- Firestore (Database) + Realtime Database (Presence)
- Firebase Storage (Media)
- Firebase Auth (Email, Google, GitHub, Discord, Apple)
- Vertex AI, OpenAI, Claude, Gemini (AI)
- Cloud Video Intelligence API
- SendGrid (Email), Twilio (SMS)

---

## 📋 Prerequisites & Setup

### Yêu Cầu Hệ Thống

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0
- **Firebase CLI**: >= 12.0.0
- **Git**: Latest version

### Cài Đặt Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### Clone Repository

```bash
git clone <repository-url>
cd chatttk-god-v14-ultra
```

### Cài Đặt Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install functions dependencies
cd ../functions
npm install
```

---

## 🔥 Thiết Lập Firebase Chi Tiết

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Nhập tên project (ví dụ: `chatttk-production`)
4. Chọn Google Analytics (tùy chọn)
5. Click "Create project"

### Bước 2: Cấu Hình Authentication

1. Vào **Authentication** > **Sign-in method**
2. Enable các providers:
   - **Email/Password**: Enable
   - **Google**: Enable (cần OAuth client ID)
   - **GitHub**: Enable (cần OAuth app)
   - **Discord**: Enable (cần OAuth app)
   - **Apple**: Enable (cần Apple Developer account)

#### Cấu hình Google Sign-In:
- Vào [Google Cloud Console](https://console.cloud.google.com/)
- Tạo OAuth 2.0 Client ID
- Thêm authorized redirect URIs: `https://your-project.firebaseapp.com/__/auth/handler`
- Copy Client ID và Client Secret vào Firebase

#### Cấu hình GitHub Sign-In:
- Vào GitHub Settings > Developer settings > OAuth Apps
- Tạo OAuth App mới
- Authorization callback URL: `https://your-project.firebaseapp.com/__/auth/handler`
- Copy Client ID và Client Secret vào Firebase

### Bước 3: Enable Firestore Database

1. Vào **Firestore Database** > **Create database**
2. Chọn **Start in production mode** (sẽ cấu hình rules sau)
3. Chọn location: **asia-southeast1** (Singapore)
4. Click "Enable"

### Bước 4: Enable Realtime Database

1. Vào **Realtime Database** > **Create database**
2. Chọn location: **asia-southeast1**
3. Click "Enable"

### Bước 5: Enable Storage

1. Vào **Storage** > **Get started**
2. Chọn **Start in production mode**
3. Chọn location: **asia-southeast1**
4. Click "Done"

### Bước 6: Setup Firebase Emulator (Local Development)

1. Cài đặt emulator suite:
```bash
firebase init emulators
```

2. Chọn các emulators:
   - Authentication
   - Firestore
   - Functions
   - Storage
   - Realtime Database

3. Chạy emulators:
```bash
npm run emulators
```

Emulators sẽ chạy tại:
- Auth: http://localhost:9099
- Firestore: http://localhost:8080
- Functions: http://localhost:5001
- Storage: http://localhost:9199
- UI: http://localhost:4000

### Bước 7: Tải Service Account Key

1. Vào **Project Settings** > **Service accounts**
2. Click "Generate new private key"
3. Lưu file JSON vào `functions/service-account-key.json` (không commit file này!)
4. Thêm vào `.gitignore`:
```
functions/service-account-key.json
```

---

## ⚙️ Environment Configuration

### Frontend Environment Variables

1. Tạo file `.env` trong thư mục `frontend/`:
```bash
cd frontend
cp .env.example .env
```

2. Cập nhật các giá trị trong `.env`:
```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FCM_VAPID_KEY=your-fcm-vapid-key
VITE_USE_EMULATORS=true
```

**Lấy Firebase Config:**
- Vào Firebase Console > Project Settings > General
- Scroll xuống "Your apps" > Web app
- Copy các giá trị config

**Lấy FCM VAPID Key:**
- Vào Firebase Console > Project Settings > Cloud Messaging
- Scroll xuống "Web configuration" > Web Push certificates
- Generate key pair nếu chưa có

### Functions Environment Variables

1. Tạo file `.env` trong thư mục `functions/`:
```bash
cd functions
cp .env.example .env
```

2. Cập nhật các giá trị:
```env
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GEMINI_API_KEY=your-gemini-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@chatttk.com
FRONTEND_URL=http://localhost:3000
```

**Lấy API Keys:**
- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/
- **Gemini**: https://makersuite.google.com/app/apikey
- **SendGrid**: https://app.sendgrid.com/settings/api_keys

### Set Environment Variables cho Cloud Functions

```bash
firebase functions:config:set \
  openai.api_key="your-openai-api-key" \
  anthropic.api_key="your-anthropic-api-key" \
  sendgrid.api_key="your-sendgrid-api-key" \
  frontend.url="https://your-domain.com"
```

---

## 🚀 Deploy Backend Chi Tiết

### Bước 1: Build Functions

```bash
cd functions
npm run build
```

### Bước 2: Deploy Functions

```bash
# Deploy tất cả functions
firebase deploy --only functions

# Hoặc deploy function cụ thể
firebase deploy --only functions:onUserCreate
```

### Bước 3: Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Bước 4: Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

### Bước 5: Deploy Storage Rules

```bash
firebase deploy --only storage
```

### Test Functions Locally

```bash
# Chạy emulator
npm run emulators

# Trong terminal khác, test function
curl http://localhost:5001/your-project/asia-southeast1/users/me
```

---

## 👑 Cấu Hình Admin Tự Động

### Super Admin Email

Hệ thống tự động nhận diện và cấp quyền "GOD MODE" cho email:
- **Email**: `khangnek705@gmail.com`
- **Password mặc định**: `Khang11222013@#`

### Cơ Chế Hoạt Động

1. Khi user đăng ký với email `khangnek705@gmail.com`, trigger `onUserCreate` sẽ:
   - Set Custom Claims: `{ admin: true, godMode: true, role: 'owner', permissions: ['*'] }`
   - Update Firestore user document với các quyền tương ứng
   - Log action vào audit_logs

2. Custom Claims được tự động refresh khi user đăng nhập lại

### Thêm/Xóa Admin

**Thêm Admin (God Mode only):**
```typescript
// Trong Cloud Functions hoặc Admin SDK
await auth.setCustomUserClaims(userId, {
  admin: true,
  godMode: true,
  role: 'owner',
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

### Admin Permissions Breakdown

- **GOD MODE** (`godMode: true`):
  - Full quyền sinh sát
  - Access audit logs
  - System configuration
  - Bulk operations

- **ADMIN** (`admin: true`):
  - User management (ban/unban)
  - Content moderation
  - View analytics
  - Manage reports

---

## 💻 Chạy Frontend

### Development Mode

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

### Build Production

```bash
cd frontend
npm run build
```

Output sẽ ở thư mục `frontend/dist/`

### Preview Production Build

```bash
cd frontend
npm run preview
```

---

## 🌐 Deployment to Vercel

### Bước 1: Connect GitHub Repository

1. Vào [Vercel](https://vercel.com/)
2. Click "Add New Project"
3. Import GitHub repository
4. Chọn repository `chatttk-god-v14-ultra`

### Bước 2: Cấu Hình Build Settings

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Bước 3: Environment Variables

Thêm tất cả các biến từ `frontend/.env` vào Vercel:
- Vào Project Settings > Environment Variables
- Thêm từng biến một

### Bước 4: Deploy

Click "Deploy" và đợi build hoàn tất.

### Bước 5: Custom Domain (Optional)

1. Vào Project Settings > Domains
2. Add domain của bạn
3. Follow DNS instructions

---

## 🧪 Testing

### Unit Tests

```bash
cd frontend
npm run test:unit
```

### Integration Tests

```bash
# Start emulators first
npm run emulators

# Run tests
npm run test:integration
```

### E2E Tests

```bash
cd frontend
npm run test:e2e:open  # Open Cypress UI
# hoặc
npm run test:e2e      # Run headless
```

---

## 🔧 Troubleshooting

### Lỗi Firebase Emulator

**Problem**: Emulator không start được
**Solution**:
```bash
# Kill existing processes
lsof -ti:8080 | xargs kill -9
lsof -ti:9099 | xargs kill -9
lsof -ti:5001 | xargs kill -9

# Restart emulators
npm run emulators
```

### Lỗi Build Errors

**Problem**: TypeScript errors khi build
**Solution**:
```bash
# Check TypeScript config
cd frontend
npx tsc --noEmit

# Fix errors hoặc update tsconfig.json
```

### Lỗi Deployment

**Problem**: Functions deploy failed
**Solution**:
```bash
# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools@latest

# Retry deploy
firebase deploy --only functions
```

### Lỗi Permission Denied

**Problem**: Firestore rules deny access
**Solution**:
1. Check Firestore rules trong `firestore/firestore.rules`
2. Verify user authentication
3. Check Custom Claims (admin, godMode)
4. Test rules trong Firebase Console > Firestore > Rules > Rules Playground

---

## 📚 Architecture Deep Dive

### Project Structure

```
chatttk-god-v14-ultra/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── app/          # Router, providers, layout
│   │   ├── components/    # UI components
│   │   ├── features/     # Feature modules
│   │   ├── lib/          # Utilities, Firebase config
│   │   ├── stores/       # Zustand stores
│   │   └── hooks/        # Custom hooks
│   └── package.json
├── functions/             # Cloud Functions
│   ├── src/
│   │   ├── triggers/     # Firestore triggers
│   │   ├── scheduled/    # Scheduled functions
│   │   ├── controllers/  # HTTP endpoints
│   │   ├── middleware/   # Auth, validation, error handling
│   │   └── utils/        # Utilities, AI service, moderation
│   └── package.json
├── firestore/            # Firestore rules & indexes
├── storage/             # Storage rules
└── firebase.json        # Firebase config
```

### Data Models

**Users:**
```typescript
{
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  isAdmin: boolean;
  godMode: boolean;
  role: 'owner' | 'admin' | 'moderator' | 'member' | 'user';
  permissions: string[];
  friends: string[];
  createdAt: string;
  updatedAt: string;
}
```

**Messages:**
```typescript
{
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'voice';
  reactions?: Record<string, Reaction>;
  createdAt: string;
  edited?: boolean;
  deleted?: boolean;
}
```

**Groups:**
```typescript
{
  id: string;
  name: string;
  description: string;
  privacy: 'public' | 'private' | 'invite_only';
  ownerId: string;
  admins: string[];
  members: string[];
  memberCount: number;
  createdAt: string;
}
```

### Security Considerations

1. **Firestore Rules**: Luôn verify authentication và ownership
2. **Custom Claims**: Sử dụng để check permissions server-side
3. **Rate Limiting**: Implement trong Cloud Functions
4. **Input Validation**: Sử dụng Zod schema validation
5. **XSS Protection**: Sanitize user input, CSP headers
6. **E2E Encryption**: Optional cho sensitive conversations

---

## 🎯 Features Guide (User)

### Đăng Ký/Đăng Nhập

1. Truy cập `/auth/register` hoặc `/auth/login`
2. Đăng ký với email/password hoặc social login
3. Nếu email là `khangnek705@gmail.com`, sẽ tự động được cấp quyền admin

### Bắt Đầu Chat

1. Vào `/chat`
2. Tạo conversation mới hoặc chọn conversation có sẵn
3. Gửi tin nhắn, hình ảnh, file, voice message
4. React với emoji, reply, forward, pin messages

### Video Calls

1. Trong conversation, click nút video call
2. Chọn 1-1 hoặc group call
3. Share screen, toggle mic/camera
4. Sử dụng virtual backgrounds, noise cancellation

### Tạo Stories

1. Vào `/stories`
2. Click "Create Story"
3. Upload ảnh/video, thêm text/sticker
4. Story tự động xóa sau 24h

### Admin Features

1. Truy cập `/admin` (chỉ admin mới thấy)
2. Dashboard: Xem statistics, analytics
3. User Management: Ban/unban users, view activity
4. Content Moderation: Review reports, moderate content
5. System Health: Monitor performance, errors

---

## 📞 Support & Contributing

### Reporting Issues

Tạo issue trên GitHub với:
- Mô tả chi tiết vấn đề
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (nếu có)

### Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Firebase team cho nền tảng serverless mạnh mẽ
- React team cho framework tuyệt vời
- Tất cả contributors và users của ChatTTK

---

**Made with ❤️ by ChatTTK Team**

