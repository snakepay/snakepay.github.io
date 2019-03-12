const handleRegister = (req, res, db, bcrypt) => {
    //desestruturação; pega os dados vindo da requisição do front!
    const { email, name, password} = req.body;    

    //valida a informação vindo do frontend
    if(!email || !name || !password) {
        return res.status(400).json('Incorrect form submission!');  
    }
    
    const hash = bcrypt.hashSync(password);

    //essa transaction garante a SQL se for preciso fazer 2 coisas ao msm tempo! se algo der errado nada é executo e é revertido! 
    //salvando dados do usuario e no login ao mesmo tempo para alimentar as tabelas juntas
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register!'));
    
    /*
    db('users')
        .returning('*')//aqui retorna todos os campos dessa tabela dps do insert
        .insert({
            name: name,
            email: email,
            joined: new Date()
    })
    //aqui pega o retorno que veio de returning
    .then(user => {
        //res envia para o front o usuario cadastrado via JSON
        res.json(user[0]); 
    })
    //caso dê algum erro deve retornar algo escrito sobre o erro, mas nunca o erro em sí pois nao pode ser mostrado para o cliente
    .catch(err => res.status(400).json('Unable to register!'));*/

}

module.exports = {
    handleRegister: handleRegister
}