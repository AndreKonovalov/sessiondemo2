const { log } = console;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers'
// 'Access-Control-Allow-Headers': 'x-test, Content-Type, Accept, Access-Control-Allow-Headers'
};
const hhtml = { 'Content-Type': 'text/html; charset=utf-8' , ...CORS };
const htxt = { 'Content-Type': 'text/plain; charset=utf-8' , ...CORS };

export default (express, bodyParser, fs) => {
    const app = express();
    app
    .use((r, res, next) => r.res.set(htxt) && next())
    .use(bodyParser.urlencoded({ extended: true }))
  
    .get('/login/', (req, res) => res.send('eliasgoss'))   
    .get('/code/', (req, res) => fs.createReadStream(import.meta.url.substring(7)).pipe(res))
    .get('/denied', r => r.res.status(403).send('Доступ запрещён'))
    .get('/prune', r => {
        let str1 = 'r ' + JSON.stringify(r) +'\n';
        let str2 = 'res ' + JSON.stringify(r.res) +'\n';
        log(str1 + str2);
//        delete r.session.name;
        r.res.send(`Очищено!`);  
        r.res.send(str1 + str2);  
    })
//     .get('/profile', protect, r => {
//         const { name } = r.session;
//         r.res.send(`Доступ открыт, ${name}!`);
//     })
//     .get('/set/:user', r => {
//         const { user } = r.params;
//         r.session = r.session || {};
//         r.session.name = user;
//         r.res.send(`Установлено: ${user}!`); 
//     })
    .all('/*', r => r.res.send('Работает!'));
   
    return app;
}
