# API Token 驗證和權限管理使用指南

## 架構概述

### 1. **Token 自動添加到請求頭**

`api/index.js` 中的請求攔截器會自動為所有 API 請求添加 token：

```javascript
Authorization: Bearer <token>
```

### 2. **登入流程**

```javascript
import { useLoginStore } from "@/stores/loginData";

const authStore = useLoginStore();
await authStore.login({ email: "user@example.com", password: "123456" });

// API 返回的響應應包含：
// { token: "xxx", id: 1, name: "John", email: "user@example.com", memberType: "Admin" }
```

### 3. **存儲管理**

- `token` - 自動存儲在 `localStorage` 中
- `userData` - 包含 id, name, email, memberType，自動存儲在 `localStorage` 中
- 頁面刷新時會自動恢復

## 使用示例

### 初始化應用（在 main.js 或 App.vue 中）

```javascript
import { useLoginStore } from "@/stores/loginData";

const authStore = useLoginStore();
authStore.initializeAuth(); // 恢復已保存的認證信息
```

### 在組件中檢查權限

```javascript
<script setup>
import { useLoginStore } from "@/stores/loginData";
import { isAdmin } from "@/utils/authGuard";

const authStore = useLoginStore();

// 檢查是否登入
if (authStore.isLoggedIn) {
  console.log("用戶已登入");
}

// 檢查是否為 Admin
if (authStore.isAdmin) {
  console.log("用戶是 Admin");
}

// 或使用工具函數
if (isAdmin()) {
  console.log("可以訪問管理員功能");
}
</script>
```

### 調用需要權限的 API

#### 1. **獲取所有會員（需要 Admin 權限）**

```javascript
import { fetchAllMembers } from "@/api/auth";
import { executeWithAdminCheck } from "@/utils/authGuard";

try {
  // 方法 1：使用權限檢查包裝
  const members = await executeWithAdminCheck(fetchAllMembers);

  // 方法 2：手動檢查
  import { isAdmin } from "@/utils/authGuard";
  if (isAdmin()) {
    const response = await fetchAllMembers();
    console.log(response.data);
  } else {
    console.error("權限不足");
  }
} catch (error) {
  console.error("獲取會員列表失敗:", error.message);
}
```

#### 2. **獲取特定會員資料（需要 token 驗證）**

```javascript
import { fetchMemberById } from "@/api/auth";
import { executeWithAuthCheck } from "@/utils/authGuard";

try {
  const member = await executeWithAuthCheck(fetchMemberById, [1]);
  console.log(member.data);
} catch (error) {
  console.error("獲取會員失敗:", error.message);
}
```

#### 3. **更新會員資料（需要 token 驗證）**

```javascript
import { updateMember } from "@/api/auth";

try {
  const response = await updateMember(1, {
    name: "New Name",
    email: "new@example.com",
  });
  console.log("更新成功:", response.data);
} catch (error) {
  console.error("更新失敗:", error.message);
}
```

#### 4. **刪除會員（需要 Admin 權限）**

```javascript
import { deleteMember } from "@/api/auth";
import { executeWithAdminCheck } from "@/utils/authGuard";

try {
  await executeWithAdminCheck(deleteMember, [1]);
  console.log("刪除成功");
} catch (error) {
  console.error("刪除失敗:", error.message);
}
```

## 路由守衛（推薦）

如果你要在路由級別保護某些頁面，可以在 `router/index.js` 中添加：

```javascript
import { useLoginStore } from "@/stores/loginData";

router.beforeEach((to, from, next) => {
  const authStore = useLoginStore();

  // 如果路由需要認證
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next("/login");
    return;
  }

  // 如果路由需要 Admin 權限
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next("/");
    return;
  }

  next();
});
```

在路由定義中：

```javascript
{
  path: "/admin",
  component: AdminView,
  meta: { requiresAuth: true, requiresAdmin: true }
}
```

## 登出

```javascript
const authStore = useLoginStore();
authStore.logout(); // 清除 token 和用戶信息
```

## API 響應錯誤處理

- **401 Unauthorized** - Token 無效或過期，自動清除存儲的數據
- **403 Forbidden** - 權限不足（通常用於 Admin 檢查）
- **其他錯誤** - 由應用層處理

## 注意事項

1. **Token 存儲** - 使用 localStorage，適合大多數場景。如果需要更高的安全性，考慮使用 HttpOnly Cookie
2. **Token 刷新** - 如果 API 返回新 token，確保在登入或刷新時更新
3. **跨域** - 確保後端配置了正確的 CORS 策略
