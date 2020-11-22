export default (express, bodyParser, fs, CORS, m, mstore, session) => {
    const app = express();
    const db = m.connection;
    const MongoStore = mstore(session);
    const protect = (r, res, next) => {
        if (r.session.name === 'admin') return next();
        res.redirect('/denied');
    };
    app
    .use((r, res, next) => r.res.set(CORS) && next())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(session({ 
        secret: 'mysecret', 
        resave: true, 
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: db }) 
    }))
  
    .get('/login/', (req, res) => res.send('eliasgoss'))   
    .get('/code/', (req, res) => fs.createReadStream(import.meta.url.substring(7)).pipe(res))
    .get('/denied', r => r.res.status(403).send('Доступ запрещён'))
    .get('/prune', r => {
        delete r.session.name;
        r.res.send(`Очищено!`);  
    })
    .get('/profile', protect, r => {
        const { name } = r.session;
        r.res.send(`Доступ открыт, ${name}!`);
    })
    .get('/set/:user', r => {
        const { user } = r.params;
        r.session = r.session || {};
        r.session.name = user;
        r.res.send(`Установлено: ${user}!`); 
    })
    .all('/*', r => r.res.send('Работает!'));
   
   
    return app;

}
