# Simplified Movie Website

## Основные эндпоинты

### Заполнить бд из json файла

```
POST http://localhost:3000/fill-db

```

### JWT

### Тело запроса

```
{
    "email": "test@mail.ru",
    "password": "testpass",
}
```

### Создать пользователя с ролью "admin" для тестирования

```
POST http://localhost:3000/create-test-admin
```

### Регистрация

```
POST http://localhost:3000/registration
```

### Авторизация

```
POST http://localhost:3000/login
```

### Google OAuth (На выходе jwt токен)

```
GET http://localhost:3000/google
```

### Получить пользователя по ID

```
GET http://localhost:3000/user/:id
```

### Фильмы

### Создать фильм

```
POST http://localhost:3000/films

```

### Получить все фильмы

```
GET http://localhost:3000/films

```

### Получить фильм по id

```
GET http://localhost:3000/films/:id

```

### Обновить фильм (id указывается в теле запроса {id: number})

```
GET http://localhost:3000/film-update

```

### Удалить фильм по id

```
GET http://localhost:3000/films/:id

```

### Жанры

```
{
    "name": "test",
}
```

### Создать жанр 

```
POST http://localhost:3000/genre

```

### Получить все жанры

```
GET http://localhost:3000/genres

```

### Получить жанр по id

```
GET http://localhost:3000/genres/:id

```

### Обновить жанр (id указывается в теле запроса {id: number})

```
GET http://localhost:3000/genre-update

```

### Удалить жанр по id

```
GET http://localhost:3000/genres/:id

```

### Участники

```
{
    "name": "test",
}
```

### Создать

```
POST http://localhost:3000/staffs

```

### Получить все

```
GET http://localhost:3000/staffs

```

### Получить по id

```
GET http://localhost:3000/staffs/:id

```

### Обновить (id указывается в теле запроса {id: number})

```
GET http://localhost:3000/staff-update

```

### Удалить по id

```
GET http://localhost:3000/staffs/:id

```

### Страны

```
{
    "name": "test",
}
```

### Создать

```
POST http://localhost:3000/countries

```

### Получить все

```
GET http://localhost:3000/countries

```

### Получить по id

```
GET http://localhost:3000/countries/:id

```

### Обновить (id указывается в теле запроса {id: number})

```
GET http://localhost:3000/country-update

```

### Удалить по id

```
GET http://localhost:3000/countries/:id

```
