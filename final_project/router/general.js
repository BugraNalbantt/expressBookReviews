const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Görev 6: Yeni Kullanıcı Kaydı
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        // Kullanıcının mevcut olup olmadığını kontrol et
        let usersWithSameName = users.filter((user) => {
            return user.username === username;
        });

        if (usersWithSameName.length === 0) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Kullanıcı başarıyla kaydedildi. Artık giriş yapabilirsiniz." });
        } else {
            return res.status(409).json({ message: "Bu kullanıcı adı zaten mevcut!" });
        }
    }
    return res.status(400).json({ message: "Kayıt başarısız. Lütfen hem kullanıcı adı hem de şifre giriniz." });
});

// Görev 1: Tüm Kitapları Listeleme
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Görev 2: ISBN'e Göre Kitap Detaylarını Alma
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Kitap bulunamadı" });
    }
});
  
// Görev 3: Yazar Adına Göre Kitap Detaylarını Alma
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksKeys = Object.keys(books);
    const matchingBooks = [];
    
    booksKeys.forEach(key => {
        if (books[key].author === author) {
            matchingBooks.push(books[key]);
        }
    });
    
    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "Bu yazara ait kitap bulunamadı" });
    }
});

// Görev 4: Başlığa Göre Kitap Detaylarını Alma
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksKeys = Object.keys(books);
    const matchingBooks = [];
    
    booksKeys.forEach(key => {
        if (books[key].title === title) {
            matchingBooks.push(books[key]);
        }
    });
    
    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "Bu başlığa sahip kitap bulunamadı" });
    }
});

// Görev 5: Kitap İncelemelerini (Review) Alma
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Kitap bulunamadı" });
    }
});

module.exports.general = public_users;
// ==========================================
// GÖREV 10-13: AXIOS İLE ASYNC/AWAIT & PROMISE UYGULAMALARI
// ==========================================

// Görev 10: Tüm kitapların listesini Async-Await ve Axios kullanarak alma
const getAllBooks = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("Görev 10 - Tüm Kitaplar:", response.data);
    } catch (error) {
        console.error("Görev 10 Hatası:", error);
    }
};

// Görev 11: ISBN'e göre kitap detaylarını Promise geri çağırmaları (then/catch) ile alma
const getBookByISBN = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(`Görev 11 - ISBN ${isbn} Detayları:`, response.data);
        })
        .catch(error => {
            console.error("Görev 11 Hatası:", error);
        });
};

// Görev 12: Yazar adına göre kitap detaylarını Async-Await kullanarak alma
const getBookByAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Görev 12 - Yazar '${author}' Kitapları:`, response.data);
    } catch (error) {
        console.error("Görev 12 Hatası:", error);
    }
};

// Görev 13: Başlığa göre kitap detaylarını Promise geri çağırmaları (then/catch) ile alma
const getBookByTitle = (title) => {
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            console.log(`Görev 13 - Başlık '${title}' Detayları:`, response.data);
        })
        .catch(error => {
            console.error("Görev 13 Hatası:", error);
        });
};

// Fonksiyonları test etmek için aşağıdaki satırların yorum satırını kaldırabilirsiniz:
// getAllBooks();
// getBookByISBN(1);
// getBookByAuthor("Chinua Achebe");
// getBookByTitle("Things Fall Apart");