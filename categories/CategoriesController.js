//criando router - controller
const express = require("express");
const router = express.Router();
const Category = require("./category");
const { default: slugify } = require("slugify");


router.get("/admin/categories/new", (req,res) => {
    res.render("admin/categories/new");
});                  

router.post("/categories/save",(req,res)=>{
    var title = req.body.title;

    //verificando dados nulos
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories")
        });
        
    }else{
        res.redirect("admin/categories/new");
    }

})

router.get("/admin/categories",(req,res) => {

    Category.findAll({raw: true}).then(categories=>{
        res.render("admin/categories/index",{categories: categories});
    });

    
})

router.post("/categories/delete",(req,res) => {

    var id = req.body.id;

    if(id != undefined){//e diferente de indefenido

        if(!isNaN(id)){ //se for um numero

            //deletando na base de dados
            Category.destroy({
                where: { id: id}
            }).then(() => {
                res.redirect("/admin/categories");
            })

        }else{//Não for numero
            res.redirect("/admin/categories");
        }

    }else{// e null
        res.redirect("/admin/categories");
    }

})

//get doa tela update
router.get("/admin/categories/edit/:id", (req,res) => {

    var id = req.params.id

    //verificando se o id não for um numero
    if(isNaN(id)){

        res.redirect("/admin/categories");

    }

    Category.findByPk(id).then(category => {


        if(category != undefined){

            res.render("admin/categories/edit",{category: category})

        }else{

            res.redirect("/admin/categories");

        }

    }).catch(err => {
        res.redirect("/admin/categories");
    })

})

//post de Update
router.post("/categories/update", (req, res) => {

    var id = req.body.id;
    var title = req.body.title;

    Category.update(
        
        {title: title, slug: slugify(title)},
        {where: { id: id}

    }).then(()=>{
        res.redirect("/admin/categories");
    })

})

module.exports = router;
