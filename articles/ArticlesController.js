//criando router - controller
const express = require("express");
const router = express.Router();
const Category = require("../categories/category");
const Articles = require("./Articles");
const Slugify = require("slugify");
const { where } = require("sequelize");


router.get("/admin/articles", (req,res) => {
    Articles.findAll({
        include: [{model: Category}]
    }).then((articles)=>{
        res.render("admin/articles/index",{articles: articles});
    })
    
});


router.get("/admin/articles/new",(req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories})
    })
});

router.post("/articles/save",(req,res)=>{

    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Articles.create({
        title: title,
        slug: Slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles");
    })

})

router.post("/articles/delete",(req,res) => {

    var id = req.body.id;

    if(id != undefined){//e diferente de indefenido

        if(!isNaN(id)){ //se for um numero

            //deletando na base de dados
            Articles.destroy({
                where: { id: id}
            }).then(() => {
                res.redirect("/admin/articles");
            })

        }else{//Não for numero
            res.redirect("/admin/articles");
        }

    }else{// e null
        res.redirect("/admin/articles");
    }

})

router.get("/admin/articles/edit/:id",(req,res) => {
    
    var id = req.params.id;

    Articles.findByPk(id).then(article => {
        if (article != undefined) {

            Category.findAll().then(categories => {

                res.render("admin/articles/edit", {categories: categories, article: article})

            });

           
        }else{
            res.render("/");
        }
    }).catch(err => {
        res.redirect("/");
    })

});

router.post("/articles/update", (req, res)=>{ //update

    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.category

    Articles.update({
        title: title,
        body: body,
        categoryId: categoryId
    },
    {
        where: {
            id: id
        }
    }).then( () =>{

        res.redirect("/admin/articles")

    })


})

router.get("/articles/page/:num", (req, res)=>{
    //buscando parametros
    var page = req.params.num;
    var offset = 0;

    //verificando se e um numero 
    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = parseInt(page * 4)
    }

    //select de paginação
    Articles.findAndCountAll({
        limit: 4,
        offset: offset
    }).then( articles => {

        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = { next: next,
        articles: articles}

        res.json(result)

    })

})



module.exports = router;