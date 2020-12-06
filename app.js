const { log } = console;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers'
// 'Access-Control-Allow-Headers': 'x-test, Content-Type, Accept, Access-Control-Allow-Headers'
};
const hhtml = { 'Content-Type': 'text/html; charset=utf-8' , ...CORS };
const htxt = { 'Content-Type': 'text/plain; charset=utf-8' , ...CORS };

export default (express, bodyParser, fs, User, m, mstore, session) => {
    const app = express();
    const db = m.connection;
    const MongoStore = mstore(session);
    const protect = (r, res, next) => {
        if (r.session.name === 'admin') return next();
        res.redirect('/denied');
    };
    app
    .use( (r, res, next) => res.set(htxt) && next() )
    .use(bodyParser.urlencoded({ extended: true }))
    .use(session({ 
        secret: 'mysecret', 
        resave: true, 
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: db }) 
    }))
  
    .get('/login/', (req, res) => res.send('eliasgoss'))   
    .get('/user/', async (req, res) => res.json(await User.find()) )
    .get('/user/:login', async (req, res) => {
        const { login } = req.params;
        res.json(await User.find({ login }));
    })
    .get('/code/', (req, res) => fs.createReadStream(import.meta.url.substring(7)).pipe(res))
    .get('/denied', r => r.res.status(403).send('Доступ запрещён'))
    .get('/prune', r => {
        log(r);
        let str1 = 'str1 ' + Object.keys(r) + '\n'; // 'r ' + JSON.stringify(r) +'\n';
        let str2 = 'res ' + Object.keys(r.res) +'\n';
        let str3 = 'req ' + Object.keys(r.res.req) +'\n';
        log(str1 + str2 + str3);
        delete r.session.name;
        r.res.send(`Очищено!\n` + str1 + str2 + str3);
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
