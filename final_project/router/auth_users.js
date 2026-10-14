const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

// Görev 7: Login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Kullanıcı adı veya şifre eksik" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username }
        return res.status(200).send("Kullanıcı başarıyla giriş yaptı");
    } else {
        return res.status(208).json({ message: "Geçersiz giriş. Kullanıcı adı veya şifre hatalı" });
    }
});

// Görev 8: İnceleme Ekleme/Güncelleme
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Kitap bulunamadı" });
    }
    if (!review) {
        return res.status(400).json({ message: "İnceleme metni gereklidir" });
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: `ISBN ${isbn} için inceleme başarıyla eklendi/güncellendi.`, reviews: books[isbn].reviews });
});

// Görev 9: İnceleme Silme
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Kitap bulunamadı" });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: `İncelemeniz başarıyla silindi.`, reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: "Bu kitap için size ait bir inceleme bulunamadı." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;