const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Kullanıcının oturumunda yetkilendirme (authorization) verisi var mı kontrol et
    if (req.session.authorization) {
        
        // Token'ı oturum verisinden al
        let token = req.session.authorization['accessToken'];
        
        // JWT'yi doğrula (Buradaki "access" şifresi, token oluşturulurken kullanılan şifreyle aynı olmalıdır)
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Token geçerliyse bir sonraki adıma (rotaya) geçişe izin ver
            } else {
                return res.status(403).json({ message: "Kullanıcı yetkilendirilmedi (Geçersiz Token)" });
            }
        });
    } else {
        return res.status(403).json({ message: "Kullanıcı giriş yapmamış" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
