// Web-framework to work insie node apps
import express from "express";
// Mongoose allows to Object Mapping between Node and MongoDB 
import mongoose from "mongoose";
// Middleware for handling `multipart/form-data` - multer
import multer from "multer";
// Cross-origin resource sharing allows web-pages to use resources from another domain
import cors from "cors";
import fs from 'fs'

import { loginValidation, postCreateValidation, registerValidation } from "./middleware/auth.js";
import {checkAuth, handleValidationError} from './utils/index.js'
import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://admin:qwer1234@cluster0.ptlvi3n.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB - OK!");
  })
  .catch((e) => {
    console.log("DB", e);
  });

const app = express();

const storage = multer.diskStorage({
   destination: (_,__,cb) => {
    if(!fs.existsSync('uploads')){
      fs.mkdirSync('uploads')
    }
    cb(null,'uploads') 
   },
   filename: (_,file,cb) => {
      cb(null,file.originalname)
   }
})

const upload = multer({ storage })

app.use(express.json());
app.use('/uploads' , express.static('uploads'))
app.use(cors())

app.post("/auth/register", registerValidation, handleValidationError, UserController.register);
app.post("/auth/login", loginValidation, handleValidationError, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
   res.json({
      url: `/uploads/${req.file.originalname}`,
   })
})

app.get('/tags', PostController.getLastTags)
app.get('/posts',  PostController.sortNewest)
app.get('/postsPopular',  PostController.sortPopularity)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationError, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.deleteOne)
app.patch('/posts/:id', checkAuth, handleValidationError, PostController.update)


app.listen(4444, (err) => {

  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
