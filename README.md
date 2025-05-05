# GridLayoutEditor

GridLayoutEditor 是一個 ASP.NET Core MVC 應用程式，允許使用者在背景圖片上建立、移動、調整大小和儲存可拖曳的方格佈局。它支援多個佈局版本，並使用 Entity Framework Core 和 SQLite 進行資料持久化。

## 特色

- **視覺化編輯**：在背景圖片上拖曳和調整方格大小。
- **新增/刪除方格**：動態新增方格，並可透過方格右上角的按鈕刪除。
- **自動避開重疊**：新增方格時會自動尋找空位，避免與現有方格重疊。
- **版本控制**：儲存多個佈局版本，並可載入或刪除特定版本。
- **即時更新**：儲存或刪除版本後，版本列表會自動更新。
- **自動載入**：頁面載入時自動載入最新的佈局版本。
- **重疊檢查**：移動或調整方格大小時，會檢查是否與其他方格重疊。
- **技術棧**：ASP.NET Core MVC, Entity Framework Core, SQLite, jQuery, jQuery UI, Bootstrap。

## 專案結構

- `Controllers/`：包含處理 HTTP 請求的 MVC 控制器 (例如 `LayoutController`)。
- `Data/`：包含 Entity Framework Core 的資料庫上下文 (`ApplicationDbContext`)。
- `Models/`：定義應用程式的資料模型 (例如 `LayoutVersion`, `GridItem`)。
- `Views/`：包含應用程式的 Razor 視圖檔案 (主要在 `Views/Layout/Index.cshtml`)。
- `wwwroot/`：存放靜態檔案，如 CSS、JavaScript 和圖片。
- `Migrations/`：包含 EF Core 資料庫遷移檔案。
- `gridlayout.db`：SQLite 資料庫檔案。

## 快速開始

### 前置需求

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) 或更新版本。
- SQLite CLI (可選，用於直接操作資料庫)。

### 設定步驟

1.  **Clone 儲存庫** (如果適用) 或下載專案檔案。
2.  **還原 NuGet 套件**：
    ```sh
    dotnet restore
    ```
3.  **更新資料庫**：
    執行 EF Core 遷移以建立資料庫結構：
    ```sh
    dotnet ef database update
    ```
    這會根據 `Migrations` 資料夾中的設定建立或更新 `gridlayout.db` 檔案。
4.  **註冊新使用者**  
    請直接在網頁註冊頁面註冊帳號，系統會自動建立 Identity 使用者資料。

### 執行專案

在專案根目錄開啟終端機，執行：
```sh
dotnet run
```
應用程式預設會在 `http://localhost:5000` 或 `https://localhost:5001` (或其他指定埠號) 啟動。在瀏覽器中開啟該網址即可開始使用。

## 主要功能

- **新增方格**：點擊「新增方格」按鈕，系統會自動尋找空位，避免與現有方格重疊。
- **移動/調整大小**：直接拖曳方格或其邊框，若與其他方格重疊會自動還原。
- **刪除方格**：點擊方格右上角的紅色「×」按鈕。
- **儲存佈局**：點擊「儲存 Layout」按鈕，目前畫面上的方格會被存為一個新版本。
- **載入/切換版本**：選擇版本後可載入該佈局，或刪除版本。
- **自動載入最新版本**：頁面載入時自動載入最新的佈局版本。

## 授權

本專案採用 MIT 授權。詳情請見 `LICENSE` 檔案 (如果有的話)。