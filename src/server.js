import express from "express";
import {ENV} from "./config/env.js";
import {db} from "./config/db.js";
import { productsTable } from "./db/schema.js";
import { eq } from "drizzle-orm";


const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({status: "true"});
});

app.post("/api/createProduct", async (req, res) => {
    try {
        const {productName,description} = req.body;
        
        if (!productName) {
            return res.status(400).json({error: "productName is required"});
        }   

        const newProduct = await db
        .insert(productsTable)
        .values({
            name: productName,
            description
        }).returning(); 

        res.status(201).json(newProduct[0]);
    } catch (error) {
       console.error("Error creating product:", error);
       res.status(500).json({error: "Failed to create product", details: error.message});
    }   
});
app.delete("/api/deleteProduct/:id", async (req, res) => {
    try {
        const {id} = req.params;                
        const deletedProduct = await db
        .delete(productsTable)
        .where(eq(productsTable.id, Number(id)))
        .returning();
        if (deletedProduct.length === 0) {
            return res.status(404).json({error: "Product not found"});
        }
        res.status(200).json(deletedProduct[0]);
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({error: "Failed to delete product", details: error.message});
    }   
});
app.get("/api/getProducts/:productId", async (req, res) => {
    try {
        const {productId} = req.params;
        const products =  await db
        .select().from(productsTable)
        .where(eq(productsTable.id, Number(productId)));
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({error: "Failed to fetch products", details: error.message});
    }
});

app.listen(PORT, () => {
    console.log("Server started on port:", PORT);
});