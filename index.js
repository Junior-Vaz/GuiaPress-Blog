const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController')


//Importando Constrollers
const ArticlesController = require("./articles/ArticlesController");
const CategoryController = require("./categories/CategoriesController");
//Importando Models
const Articles = require("./articles/Articles");
const Category = require("./categories/category");

//carregando view engine

app.set('view engine','ejs');



//carregando arquivos estaticos - img/css/js ...
app.use(express.static('public'));



//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



//database - fazendo conexão
connection.authenticate()
.then(()=>{
    console.log("Conexão feita com sucesso!")
}).catch((err)=>{
    console.log(err)
})



//carregando controller
app.use("/",categoriesController)
app.use("/",articlesController)


//Rotas
app.get("/",(req,res)=>{

    Articles.findAll({
        include: [{model: Category}],
        order: [['id','DESC']]
    }).then((articles)=>{
        Category.findAll().then(categories => {
            res.render("index",{articles: articles, categories: categories});
        });
    })

});

app.get("/:slug",(req,res) => {

    var slug = req.params.slug;

    Articles.findOne({
        where:{slug: slug}
    }).then(articles => {
        if (articles != undefined){
            Category.findAll().then(categories => {
                res.render("articles",{articles: articles, categories: categories});
            });
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/");
    })

})

app.get("/category/:slug",(req,res)=>{
    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Articles}]
    }).then(category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("index",{ articles: category.articles,categories: categories})
            })

        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/")
    })
})


//criando servidor...
app.listen(4000,console.log("Servidor rodando..."))