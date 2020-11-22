export default (express, bodyParser, fs, CORS, User, UserController) => {
    const app = express();
    
    app
    .use((r, res, next) => r.res.set(CORS) && next())
    .use(bodyParser.urlencoded({ extended: true }))
    .use('/user', UserController(express, User))
    .get('/login/', (req, res) => res.send('eliasgoss'))   
    .get('/code/', (req, res) => fs.createReadStream(import.meta.url.substring(7)).pipe(res))
    .all('/*', r => r.res.send('Работает!'));
   
   
    return app;

}