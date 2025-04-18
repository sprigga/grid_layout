# Grid Layout Manager

一個基於 ASP.NET Core MVC 的網格布局管理系統，使用 SQLite 數據庫來保存布局配置。

## 功能特點

- 直覺的拖放式網格布局編輯器
- 即時保存布局配置
- 響應式設計支持不同螢幕尺寸
- SQLite 本地數據存儲
- 基於 Bootstrap 5 的現代化 UI

## 技術棧

- ASP.NET Core 8.0
- Entity Framework Core
- SQLite
- jQuery UI (拖放功能)
- Bootstrap 5
- JavaScript/jQuery

## 前置要求

- .NET 8.0 SDK
- Visual Studio Code 或 Visual Studio 2022
- Node.js (可選，用於前端開發)

## 快速開始

1. 克隆專案
```bash
git clone https://github.com/sprigga/grid_layout_csharp.git
cd grid_layout_csharp
```

2. 還原相依套件
```bash
dotnet restore
```

3. 執行數據庫遷移
```bash
dotnet ef database update
```

4. 運行應用程序
```bash
dotnet run
```

5. 打開瀏覽器訪問
```
https://localhost:7253
```

## 配置說明

在 `appsettings.json` 中配置數據庫連接：

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=GridLayoutApp.db"
  }
}
```

## 開發指南

### 創建新的數據庫遷移

```bash
dotnet ef migrations add [遷移名稱]
dotnet ef database update
```

### 編譯並運行

```bash
dotnet build
dotnet run
```

## 目錄結構

```
grid_layout_csharp/
├── Controllers/          # MVC 控制器
├── Models/              # 數據模型
├── Views/               # 視圖文件
├── wwwroot/            # 靜態文件
│   ├── css/           # 樣式表
│   ├── js/            # JavaScript 文件
│   └── lib/           # 第三方庫
├── Data/               # 數據訪問層
└── Migrations/         # EF Core 遷移
```

## 主要功能使用說明

1. 網格布局編輯
   - 點擊並拖動網格單元進行位置調整
   - 使用調整手柄改變網格大小
   - 自動保存所有更改

2. 數據管理
   - 布局配置自動保存到 SQLite 數據庫
   - 支持匯入/匯出布局配置

## 貢獻指南

1. Fork 本專案
2. 創建您的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交您的更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 開啟一個 Pull Request

## 許可證

本專案採用 MIT 許可證 - 詳見 [LICENSE](LICENSE) 文件

## 作者

- pololin

## 問題回報

如果您發現任何問題或有改進建議，請在 GitHub 的 Issues 頁面提出。
