# GridLayoutEditor

GridLayoutEditor is an ASP.NET Core MVC application that allows logged-in users to create, move, resize, and save draggable grid layouts on a background image. It supports multiple layout versions and uses ASP.NET Core Identity for user authentication, Entity Framework Core, and SQLite for data persistence.

## Features

- **User Authentication**: Uses ASP.NET Core Identity for registration and login.
- **Visual Editing**: Drag and resize grids on a background image.
- **Add/Delete Grids**: Dynamically add grids and delete them using the button in the top-right corner of each grid.
- **Automatic Overlap Avoidance**: Automatically finds an empty space when adding a new grid to avoid overlapping with existing grids.
- **Versioning**: Save multiple layout versions and load or delete specific versions. Each version is associated with a user.
- **Real-time Updates**: The version list updates automatically after saving or deleting a version.
- **Auto Load**: Automatically loads the user's latest layout version when the page loads.
- **Overlap Check**: Checks for overlaps with other grids when moving or resizing a grid.
- **Technology Stack**: ASP.NET Core MVC, ASP.NET Core Identity, Entity Framework Core, SQLite, jQuery, jQuery UI, Bootstrap.

## Project Structure

- `Controllers/`: Contains MVC controllers that handle HTTP requests (e.g., `LayoutController`).
- `Data/`: Contains the Entity Framework Core database context (`ApplicationDbContext`).
- `Models/`: Defines the application's data models (e.g., `LayoutVersion`, `GridItem`).
- `Views/`: Contains the application's Razor view files (mainly in `Views/Layout/Index.cshtml` and Identity-related views).
- `wwwroot/`: Stores static files like CSS, JavaScript, and images.
- `Migrations/`: Contains EF Core database migration files.
- `gridlayout.db`: The SQLite database file, containing layout data and Identity user data.

## Quick Start

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later.
- SQLite CLI (optional, for direct database manipulation).

### Setup Steps

1.  **Clone the repository** (if applicable) or download the project files.
2.  **Restore NuGet packages**:
    ```sh
    dotnet restore
    ```
3.  **Update the database**:
    Run EF Core migrations to create the database structure (including Identity tables and layout tables):
    ```sh
    dotnet ef database update
    ```
    This will create or update the `gridlayout.db` file based on the settings in the `Migrations` folder.
4.  **Register a new user**:
    After running the project, first register a new account using the "Register" link on the webpage.

### Running the Project

Open a terminal in the project root directory and run:
```sh
dotnet run
```
The application will start by default at `http://localhost:5154` or `https://localhost:7047` (or other specified ports, check `Properties/launchSettings.json`). Open this URL in your browser, register, and log in to start using the application.

## Main Features

- **Add Grid**: Click the "Add Grid" button, and the system will automatically find an empty space, avoiding overlap with existing grids.
- **Move/Resize**: Drag the grid or its borders directly. If it overlaps with other grids, it will automatically revert.
- **Delete Grid**: Click the red "×" button in the top-right corner of the grid.
- **Save Layout**: Click the "Save Layout" button, and the current grid layout on the screen will be saved as a new version associated with the currently logged-in user.
- **Load/Switch Version**: Select a version to load its layout, or delete a version (only versions created by the user).
- **Auto Load Latest Version**: Automatically loads the latest layout version for the currently logged-in user when the page loads.

## Author

- Lin Hung Chuan

## License

This project is licensed under the MIT License. See the `LICENSE` file for details (if available).