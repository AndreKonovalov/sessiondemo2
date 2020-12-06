export default (x, User) => {
    const router = x.Router();
    router
    .route('/')
    .get(async r => r.res.json(await User.find()))
    .post(async r => {
        const { login, password } = r.query;
        const newUser = new User({ login, password });
        try {
            await newUser.save();
            r.res.status(201).json({'Добавлено: ': login});
        } catch (e) {
            r.res.status(400).json({'Ошибка: ': 'Нет пароля!'});
        }
    });

    router
    .route('/:login')    
    .get(async r => {
        const { login } = r.params;
        r.res.json(await User.find({ login }));
    }) 
    return router;
};
