import express from 'express';
import bodyParser from 'body-parser';
import m from 'mongoose';
import dot from 'dotenv';
import fs from 'fs';
import appSrc from './app.js';
import CORS from './CORS.js';
import UserModel from './models/User.js';
import UserController from './routes/UserController.js';

dot.config({ path: './.env' });
const { URL } = process.env;
const User = UserModel(m);
const app = appSrc(express, bodyParser, fs, CORS, User, UserController);

try {
    await m.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    app.listen(process.env.PORT ?? 4321);
} catch(e) {
    console.log(e.codeName);
}