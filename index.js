import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors'

import { loginValidation, postCreateValidation, registerValidation } from "./validations/auth.js";
import {checkAuth, handleValidationError} from './utils/index.js'
import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB - OK!");
  })
  .catch((e) => {
    console.log("DB", e);
  });

const app = express();

const storage = multer.diskStorage({
   destination: (_,__,cb) => {
      cb(null,'uploads')
   },
   filename: (_,file,cb) => {
      cb(null,file.originalname)
   }
})

const upload = multer({ storage })

app.use(express.json());
app.use('/uploads' , express.static('uploads'))
app.use(cors());

app.post("/auth/register", registerValidation, handleValidationError, UserController.register);
app.post("/auth/login", loginValidation, handleValidationError, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
   res.json({
      url: `/uploads/${req.file.originalname}`,
   })
})

app.get('/posts',  PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.get('/tags',  PostController.getLastTags)
app.get('/users',  UserController.getAllUsers)

app.post('/posts', checkAuth, postCreateValidation, handleValidationError, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.deleteOne)
app.patch('/posts/:id', checkAuth,handleValidationError, PostController.update)

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
