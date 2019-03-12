const express    = require('express');
const bodyParser = require('body-parser');//middleware pra permitir a troca de dados entre front e back
const cors       = require('cors');
const knex       = require('knex');

const register   = require('./controllers/register'); 
const signin     = require('./controllers/signin');
const profile    = require('./controllers/profile');
const image      = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'razor',
      password : '*razor*',
      database : 'smart-brain'
    }
});

/* Isso é uma promisse 
db.select('*').from('users').then( data => {
    console.log(data);
})*/

/* bcrypt é um pacote hash experimentado e testado, podemos armazenar com segurança as informações dos usuários, 
as senhas dos usuários em nosso banco de dados e ninguém, mesmo que eles - mesmo que os hackers acessem nosso banco de dados -
eles terão muita dificuldade em obter as senhas de usuário. Eles podem conseguir seus endereços de e-mail, 
mas nunca nossas senhas, e implementaremos isso em nosso banco de dados usando bcrypt.*/
const bcrypt     = require('bcrypt-nodejs');

const app = express();
//O express nao sabe oq recebe de requisição! e se for JSON esse 
//bodyparser manipula isso pro express entender os dados
app.use(bodyParser.json());
//app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(cors());


app.get('/', (req, res) => {
    //res.send('This is working');    
    res.send(database.users);
});

//Faz a parte do login - Aqui está sendo usado o "Currying" para passar esse função!
app.post('/signin',  signin.handleSignin(db, bcrypt)); 

//Cria um novo usuario
app.post('/register', (req, res) => { register.handleRegister( req, res, db, bcrypt ) });

//Retorna o ID do usuário
app.get('/profile/:id', (req, res) => { profile.handleProfileGet( req, res, db ) });

app.put('/image', (req, res) => { image.handleImage(  req, res, db ) });
app.post('/imageurl', (req, res) => { image.handleApiCall(  req, res ) });


//essa arrow function - faz executar o que tiver nela apos executar o listen
app.listen(3000, () => {
    console.log('app is running on port 3000');  
    
});


/* Rotas para criar no server

/                --> this is working
/signin          --> POST = success/fail
/register        --> POST = user
/profile/:userID --> GET = user
/image           --> PUT = user

*/