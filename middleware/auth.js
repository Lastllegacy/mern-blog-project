import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Неверный email').isEmail(),
    body('password', 'Пароль должен содержать минимум 5 символов').isLength({ min: 5 }),
    body('fullName', 'Имя должно быть больше 3 символов').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL()
]

export const loginValidation = [
    body('email', 'Неверный email').isEmail(),
    body('password', 'Пароль должен содержать минимум 5 символов').isLength({ min: 5 }),
]

export const postCreateValidation = [
    body('title', 'Введите название статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Укажите теги ').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
]