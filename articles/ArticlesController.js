//criando router - controller
const express = require("express");
const router = express.Router();
const Category = require("../categories/category");
const Articles = require("./Articles");
const Slugify = require("slugify");


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

router.get("/admin/articles/edit",(req,res)=>{
    Articles.findAll().then(articles => {
        res.render("admin/articles/edit", {articles: articles})
    })

});



module.exports = router;