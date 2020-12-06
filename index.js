import express from 'express';
import bodyParser from 'body-parser';
import m from 'mongoose';
import mstore from 'connect-mongo';
//import dot from 'dotenv';
import session from 'express-session';
import fs from 'fs';
import appSrc from './app.js';
import UserModel from './models/User.js';
import UserController from './routes/UserController.js';

// dot.config({ path: './.env' });
// const { URL } = process.env;
URL = 'mongodb+srv://readwriter:Fagku3Kuf4@cluster0.a6m0m.mongodb.net/mongodemo?retryWrites=true&w=majority';
const User = UserModel(m);
const app = appSrc(express, bodyParser, fs, m, mstore, session);

try {
    await m.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    app.listen(process.env.PORT ?? 3000);
} catch(e) {
    console.log(e.codeName);
}
