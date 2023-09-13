require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs/promises");

app.use(express.json());

app.get("/products", async(req, res) => {
    const {page = 1, limit = 10} = req.query;
    const targetProduct = [];
    const product = JSON.parse(await fs.readFile("./products.json", "utf-8")); 
    if(+page > 0 && +limit > 0){
        for(let i = (+page * +limit) - limit; i < (+page * +limit); i++){
            targetProduct.push(product[i]);
        }
        res.status(200).send(targetProduct);
    }else {
        res.status(404).send({message: "page or limit not found."});
    };
});


app.delete("/products/:id", async(req, res) => {
    const id = req.params.id;
    const product = JSON.parse(await fs.readFile("./products.json", "utf-8")); 
    // const deletedProduct = JSON.parse(await fs.readFile("./deleted.json", "utf-8")); 
    try{
        const targetProduct = product.find(x => x.id === +id);
        if(targetProduct){
        const newProduct = JSON.stringify(product.filter(x => x.id !== +id));
        await fs.writeFile("./products.json", newProduct);
        const deletedProduct = JSON.parse(await fs.readFile("./deleted.json", "utf-8")); 
        const newProductDeleted = product.filter(x => x.id === +id);
        const newDeleteProduct = JSON.stringify([...deletedProduct, ...newProductDeleted]);
        await fs.writeFile("./deleted.json", newDeleteProduct);
        res.status(204).send();
    }else {
        res.status(404).send({message: "product not found."});
    };
    } catch (err) {
        await fs.writeFile("./deleted.json", JSON.stringify([]));
        const targetProduct = product.find(x => x.id === +id);
        if(targetProduct){
        const newProduct = JSON.stringify(product.filter(x => x.id !== +id));
        await fs.writeFile("./products.json", newProduct);
        const deletedProduct = JSON.parse(await fs.readFile("./deleted.json", "utf-8")); 
        const newProductDeleted = product.filter(x => x.id === +id);
        const newDeleteProduct = JSON.stringify([...deletedProduct, ...newProductDeleted]);
        await fs.writeFile("./deleted.json", newDeleteProduct);
        res.status(204).send();
    }else {
        res.status(404).send({message: "product not found."});
    };
    };
});

app.get("/products/price", async(req, res) => {
    const {start = 1, end = 1500} =  req.query;
    const product = JSON.parse(await fs.readFile("./products.json", "utf-8")); 
    const targetProduct = [];
    if(+start > 0 && +end > 0){
        product.map(x => x.price >= +start && x.price <= +end ? targetProduct.push(x) : x);
        res.status(200).send(targetProduct);
    }else {
        res.status(404).send({message: "price not found."});
    };
})

let port = process.env.PORT || 8000;
app.listen(port, () => console.log("server on ", port))