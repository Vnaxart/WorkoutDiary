# 🏋️ Дневник тренировок

Веб-приложение для домашних тренировок.

## 🚀 Быстрый старт

### 1. Установите необходимое ПО
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [MySQL Server 8.0+](https://dev.mysql.com/downloads/mysql/)

### 2. Создайте базу данных
Откройте MySQL Workbench или командную строку и выполните:

```sql
CREATE DATABASE WorkoutDiaryDB;
```

### 3. Запустите бэкенд

```bash
cd backend/WorkoutDiary.Api
dotnet restore
dotnet ef database update
dotnet run
```

Сервер запустится на `http://localhost:5090`

### 4. Запустите фронтенд (в новом терминале)

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`

## 📱 Функционал

- ✅ Управление упражнениями (создание, редактирование, удаление)
- ✅ Создание пресетов (повторения / на время)
- ✅ Проведение тренировки по шагам с таймером
- ✅ История тренировок с фильтром по датам
- ✅ Правильное склонение слов (подход/подхода/подходов)

## 🛠️ Технологии

- **Backend:** ASP.NET Core 8, Entity Framework Core, MySQL
- **Frontend:** React, Vite
