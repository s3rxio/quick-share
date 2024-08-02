# Quick share

Quick Share - это сервис для быстрого обмена файлами.

Этот README содержит описание основных функций сервиса и инструкции по запуску.

## Посмотреть демку (пока нет демки)

:x: Web - https://demo.share.s3rxio.ru/

:x: API - https://demo.share.s3rxio.ru/api

## На чем работает сервис?

### API

- Фреймворк: NestJS
- ORM и СУБД: TypeORM, PostgreSQL
- Тестирование: Jest
- Документация: Пока нет
- S3: @aws-sdk/client-s3
- Аутентификация: Jwt, bcrypt

### Web

- UI: React
- UIKit: Пока нет
- Сборка: Vite
- Тестирование: Vitest

## TODO

### API

1. Сделать документацию
2. Response
   - [ ] Сделать BaseResponse
3. User
   - [x] Создание нового пользователя
   - [x] Изменение пользователя
   - [x] Удаление пользователя
   - [x] Манипуляции с текущем пользователем(/users/me)
4. Share
   - [x] Создание нового обмена
   - [x] Просмотр обмена
   - [x] Скачивание обмена
   - [x] Удаление обмена
   - [x] Удаление обмена по истечении срока
   - [x] Добавление новых файлов
   - [ ] Изменение срока истечения
5. Authentication
   - [x] Регистрация
   - [x] Авторизация
   - [ ] Подтверждение почты
   - [ ] Добавить аунтификацию через сервисы (Google, Vk ID, GitHub)
   - [ ] Сделать refresh токены
6. Authorization
   - [x] Временная реализация на ролях
   - [ ] Создать CRUD permissions
   - [ ] Сделать enum со всеми ресурсами (/users/, /files/, /shares/)
   - [ ] Сделать добавление permissions к ресурсам в ролях
   - [ ] Сделать Perms decorator где будут передаваться ресурсы
7. Streaming
   - [ ] Сделать деление на чанки
   - [ ] Добавить возможность просмотра видео, а также аудио

### Web

1. [ ] Начать работу...

## Быстрый старт

```sh
git clone https://github.com/s3rxio/quick-share.git # Клонируем репозиторий
cd quick-share
pnpm install # Устанавливаем зависимости
cp apps/backend/.env.example apps/backend/.env # создаем .env и дальше в нем настраиваем все по своему вкусу
nx serve backend --prod # Запускаем API
nx serve frontend --prod # Запускаем Web
```
