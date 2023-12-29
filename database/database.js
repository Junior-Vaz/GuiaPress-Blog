//carregando sequelize para o mysql
const Sequelize = require("sequelize");

//criando conexão
const connection = new Sequelize('guiapress','root','0512',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00" //configurando tempo do sequelize
});


//exportando conexão 
module.exports = connection;