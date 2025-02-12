import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = "SFADSAsadasfas12314512fsa";

// Habilitamos CORS para todas las rutas
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
})
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

await mongoose.connect("mongodb+srv://vercel-admin-user-67ac17997d3a160f83df97e3:5xjBSnqWMJ0saq98@cluster0.gi73q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }

});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username }); // busco en la bd con User.findOne
    const passOk = bcrypt.compareSync(password, userDoc.password);

    // res.json(passOk);
    if (userDoc && passOk) {
        // logged in
        jwt.sign({ username, id: userDoc._id }, secret, {}, (error, token) => {
            console.log("cookie enviada enviada al cliente");
            if (error) throw error;
            res.cookie("jwtoken", token, { expires: new Date(Date.now() + 99999999) }).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json("wrong credentials");
    }
});

app.get("/profile", (req, res) => {
    const { jwtoken } = req.cookies;

    if (!jwtoken) {
        return res.status(401).json({ error: "Token not provided" });
    }
    jwt.verify(jwtoken, secret, {}, (error, info) => {
        if (error) throw error;
        res.json(info);
    });
})

app.post("/logout", (req, res) => {
    res.cookie("jwtoken", "").json("ok");
})

app.listen(4000, () => {
    console.log(`Escuchando el puerto ${4000}`);
});
// mongodb+srv://roco:Rolo9900992024@mern-blog-database.cjbux.mongodb.net/?retryWrites=true&w=majority&appName=mern-blog-database
// roco
// Rolo9900992024
