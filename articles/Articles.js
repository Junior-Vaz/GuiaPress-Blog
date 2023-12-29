const Sequelize = require("sequelize");
const connection = require("../database/database")
const Category = require("../categories/category")

//Criando tabela / insert - create table em sequelize
const Articles = connection.define('articles',{

    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }

})

//ForKeys ---
//criando relacionamento 1 para 1 com methodo belong.to
Articles.belongsTo(Category); //Um artigo pertence a uma categoria

//criando relacionamento 1 para (n) muitos
Category.hasMany(Articles); //Uma Categoria tem muitos artigos

//Atualizando Base de dados
//Articles.sync({force: true}); //removido...

//exportando model
module.exports = Articles;