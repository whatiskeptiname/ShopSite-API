var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const {URI} = require('./secrets'); // thsi should be replaced with env varaible

const MONGODB_URI = URI; // replace with your mongodb uri

mongoose.connect(MONGODB_URI);

var Product = require('./model/product');
var WishList = require('./model/wishList');

app.use(function(req, res, next) 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/product', function(request, response)
{
    Product.find({}, function(err, products)
    {
        if(err)
        {
            response.status(500).send({error: "Couldn't fetch products!!!"});
        }
        else
        {
            response.send(products);
        }
    })
});

app.get('/wishlist', function(request, response)
{
    WishList.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishLists)
    {
        if(err)
        {
            response.status(500).send({error:"Couldn't fetch wishlist!!!"});
        }
        else
        {
            response.status(200).send(wishLists);
        }
    })
});

app.post('/product', function( request, response)
{
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.imgUrl = request.body.imgUrl;
    product.save(function(err, savedProduct)
    {
        if(err)
        {
            response.status(500).send({error: "conuldn't save product!!!"})
        }
        else
        {
            response.status(200).send(savedProduct);
        }
    });

});

app.post('/wishlist', function(request, response)
{
    var wishList = new WishList();
    wishList.title = request.body.title;

    wishList.save(function(err, newWishList)
    {
        if(err)
        {
            response.status(500).send({error: " Couldn't create wishlist"});
        }
        else
        {
            response.send(newWishList);
        }
    })
});

app.put('/wishlist/product/add', function(request, response)
{
    Product.findOne({_id: request.body.productId}, function(err, product)
    {
        if(err)
        {
            response.status(500).send({error: "Couldn't add item to wishlist!!!"});
        }
        else
        {
            WishList.updateOne({_id:request.body.wishListId}, {$addToSet: {products: product._id}},
            function(err, wishList)
            {
                if(err)
                {
                    response.status(500).send({error: "Couldn't add item to wishlist!!!"});
                }
                else
                {
                    response.send("successfully added to wishlist");
                }
            });
        }
    })
});

app.delete('/product/remove', function(request, response)
{
    Product.deleteOne({"_id": request.body._id }, function(err, products)
    {
        if(err)
        {
            response.status(500).send({error: "Couldn't delete item from products!!!"});
        }
        else
        {
            response.send("Product removed successfully!!!");
        }
    })
});

app.delete('/wishlist/remove', function(request, response)
{
    WishList.deleteOne({"_id": request.body._id}, function(err, wishlist)
    {
        if(err)
        {
            response.status(500).send({error: "Couldn't delete item from products!!!"});
        }
        else
        {
            response.send("Wishlist removed successfully!!!");
        }
    })
});

app.listen(3004, function()
{
    console.log("ShopSite Server running on port: 3004!!!");
});