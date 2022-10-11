// Node Modules
const express = require('express');
var path = require("path");
var bodyParser = require('body-parser');
var mysql = require("mysql");
const res = require('express/lib/response');
const { home } = require('nodemon/lib/utils');
const req = require('express/lib/request');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { redirect } = require('express/lib/response');
const app = express();

// Configurations Locals
app.use(bodyParser.urlencoded({extended:true}));


// Set Cookie Parser, sessions and flash
app.use(cookieParser('NotSoSecret'));
app.use(session({
  secret : 'something',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: false
}));
app.use(flash());

app.set('views', './views')
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1001',
    database : 'pharm'
});

conn.connect((error) => {
    if (error) throw error;
    console.log("database connected");
});

var isConnected  = false;

// Pages
// Page du tableau de bord
app.get('/', (req, res) => {
    var sql = 'SELECT * FROM user';

        conn.query(sql, (error, result) => {
            if (error) {
                console.log("Err: "+error.toString());
                req.flash('error', "Erreur de connexion");
                res.redirect('/login')
            }if(isConnected  == false && result.length == 0){
                console.log("Aucun Utilisateur enregistré");
                res.redirect('/register')
            }else if(isConnected  == false && result.length != 0){
                console.log(result);
            
                res.redirect('/login')
            }else if(isConnected  == true && result.length != 0) {
                res.redirect('/dashboard')
            };
          
        }) 
})

// Page de connexion
app.get('/login', (req, res) => {
    const error = req.flash('error');
    res.render('login.ejs', {items: ["Connexion", error]})
})

app.get('/dashboard', (req, res) => {
    var sql = 'SELECT * FROM pharmacies';
    conn.query(sql, (error, result) =>{
        if (error) {
            console.log(error);
        } else {
            res.render('index.ejs', {items: ["Gestion des pharmacies et des gardes", result]})
        };
    })

})


// Page d'inscription
app.get('/register', (req, res) => {
    res.render('register.ejs', {items: ["Enregistrement"]})
})

// Page d'ajout de personnel
app.get('/add-pharmacy', (req, res) => {
    res.render('formulaire.ejs', {items: ["Ajouter des personnes"]})
})

app.get('/add-products/:id', (req, res) => {
    res.render('productsAddForm.ejs', {items: ["Ajouter des produits", req.params.id]})
})

//Modifier 
app.get('/edit-pharmacy/:id', (req, res) => {

    var sql = "SELECT * FROM pharmacies WHERE ph_id = ?";
    
    conn.query(sql,[req.params.id], function (err, result) {
        if (err) {
            console.log("Error: " + err);
        } else{
            console.log("Informations mises à jour: " + result[0].p_id);
            res.render('edit_pharmacy.ejs', {items: ["Editer une pharmacie", result[0]]})
        };
    });
})

app.get('/edit-products/:id', (req, res) => {

    var sql = "SELECT * FROM produits WHERE pr_id = ?";
    
    conn.query(sql,[req.params.id], function (err, result) {
        if (err) {
            console.log("Error: " + err);
        } else{
            console.log("Informations mises à jour: " + result[0].p_id);
            res.render('productsForm.ejs', {items: ["Editer un produit", result[0]]})
        };
    });
})


app.get('/set-guard/:id', (req, res) => {

    var sql = "SELECT * FROM pharmacies WHERE ph_id = ?";
    
    conn.query(sql, [req.params.id], function (err, result) {
        if (err) {
            console.log("Error: " + err);
        } else{
            console.log("Informations - pharmacies: " + result[0].ph_id);
            res.render('edit_guard.ejs', {items: ["Editer une garde", result[0]]})
        };
    });
})


// Page de la liste du personnel
app.get('/list-pharmacy-guard', (req, res) => {

    var sql = 'SELECT * FROM pharmacies WHERE status = "OUI"';
    conn.query(sql, (error, result) =>{
        if (error) {
            console.log(error);
        } else {
            res.render('tableau.ejs', {items: ["Pharmacies de garde", result]})
        }
    })
    
})


// Vue client
app.get('/client/list', (req, res) => {

    var sql = 'SELECT * FROM pharmacies WHERE status = "OUI"';
    conn.query(sql, (error, result) =>{
        if (error) {
            console.log(error);
        } else {
            res.render('client/index.ejs', {items: ["Pharmacies de garde", result]})
        }
    })
    
})

app.get('/client/list-products/:id', (req, res) => {

    var sql = 'SELECT * FROM pharmacies, produits WHERE pharmacies.ph_id = ? AND pharmacies.ph_id = produits.ph_id ;';
    
    conn.query(sql,[req.params.id], (error, result) =>{
        if (error) {
            console.log(error);
        } else {
            res.render('client/product_list_client.ejs', {items: ["Liste de produits", result, req.params.id]})
        }
    })
    
})
//Supprimer
app.get('/delete-pharmacy/:id', (req, res) =>{

    var sql = "DELETE FROM pharmacies WHERE ph_id = ?";

    conn.query(sql,[req.params.id], function (err, result) {
        if (err) {
            console.log("Error: " + err);
        } else{
            console.log("Personne supprimée: " + result.affectedRows);
            res.redirect("/dashboard");
        };
    });
})

//Liste produits
app.get('/list-products/:id', (req, res) => {

    var sql = 'SELECT * FROM pharmacies, produits WHERE pharmacies.ph_id = ? AND pharmacies.ph_id = produits.ph_id ;';
    
    conn.query(sql,[req.params.id], (error, result) =>{
        if (error) {
            console.log(error);
        } else {
            res.render('listProducts.ejs', {items: ["Produits disponibles", result, req.params.id]})
        }
    })
    
})

//Modifier une table
app.get('/update-table/:id', (req, res) =>{

    var sql = "UPDATE user SET u_name = ? , u_username = ? , u_email = ? , u_phone = ? , u_mdp = ? , u_gender = ? , u_role = ? WHERE u_id = ?";

    conn.query(sql,[req.params.id], function (err, result) {
        if (err) {
            console.log("Error: " + err);
        } else{
            console.log("Informations mises à jour: " + result.affectedRows);
            res.redirect("/dashboard");
        };
    });
})
//Se deconnecter
app.get('/disconnect', (req, res)=>{
    isConnected = false
    res.redirect("/")
})


     // Recupération données

// Inscription
app.post('/register', (req, res) =>{
    var s_name = req.body.rname;
    var s_username = req.body.username;
    var s_email = req.body.email;
    var s_phone = req.body.phone;
    var s_pwd = req.body.password;

    console.log(s_name, s_username, s_email, s_phone, s_pwd);

    var data = {u_name: s_name, u_username: s_username, u_email: s_email, u_phone: s_phone, u_mdp: s_pwd, u_role: "Admin"};
    var sql = "INSERT INTO user SET ?";

    conn.query(sql, data, (error, result) => {
        if (error) throw error;
        console.log("Enregistré");
        res.redirect('/login')
    })
  

});

// Connection
app.post('/login', (req, res) =>{
    var s_username = req.body.username;
    var s_pwd = req.body.pass;
    var s_role = "Admin";

    console.log(s_username, s_pwd);

    var sql = 'SELECT * FROM user WHERE u_username=? && u_mdp = ? && u_role = ?';

        conn.query(sql, [s_username, s_pwd, s_role], (error, result) => {
            if (error) {
                console.log("Err: "+error.toString());
                req.flash('error', "Erreur de connexion");
                res.redirect("/");
            }if(result.length == 0){
                console.log("Utilisateur ou mot de passe incorrect");
                req.flash('error', "Nom d'utilisateur ou mot de passe erroné");
                res.redirect("/login");
            }else {
                console.log(result);
                isConnected  = true;
                res.redirect('/dashboard');
            };
          
        }) 

});

// Enregistrement personnel
app.post('/add-pharmacy', (req,res) =>{
    var s_name = req.body.pname;
    var s_location = req.body.location;
    var s_email = req.body.email;
    var s_phone = req.body.phone;
    var s_lat = "null";
    var s_lng = "null";
    var s_createdeAt = Date().toString();
    var s_updateAt = Date().toString();
    var s_deleteAt = "null";
    var s_validateAt = Date().toString();
    var s_guardSAt = "null";
    var s_guardEAt = "null";


    console.log(s_name, s_location, s_email, s_phone, s_lat, s_lng, s_createdeAt, s_updateAt, s_deleteAt, s_validateAt, s_guardSAt, s_guardEAt);

    var data = {
        ph_name: s_name, ph_location: s_location, ph_phone: s_phone, ph_email: s_email, ph_lat: s_lat, ph_lng: s_lng, 
        create_at: s_createdeAt, update_at: s_updateAt, deleted_at: s_deleteAt, validate_at: s_validateAt, guard_start_at: s_guardSAt, guard_end_at: s_guardEAt
    };
    var sql = "INSERT INTO pharmacies SET ?";

    conn.query(sql, data, (error, result) => {
        if (error) throw error;
        console.log("Enregistré");
        res.redirect('/dashboard')
    })
  
})

app.post('/add-products', (req,res) =>{
    var s_name = req.body.prname;
    var s_prix = req.body.prix;
    var s_status = req.body.status;
    var s_tva = req.body.tva;
    
    var s_ph_id = req.body.ph_id;


    console.log(s_name, s_prix, s_status, s_tva,);

    var data = {
        pr_name: s_name, pr_prix_u: s_prix, status: s_status, tva: s_tva, ph_id: s_ph_id
    };
    var sql = "INSERT INTO produits SET ? ";

    conn.query(sql, data, (error, result) => {
        if (error) throw error;
        console.log("Enregistré");
        res.redirect('/list-products/'+ s_ph_id)
    })
  
})

app.post('/edit-products', (req,res) =>{
    var s_name = req.body.prname;
    var s_prix = req.body.prix;
    var s_status = req.body.status;
    var s_tva = req.body.tva;
    var s_ph_id = req.body.ph_id;
    var s_pr_id = req.body.pr_id;


    console.log(s_status);

    var data = [s_status, s_pr_id]
    var sql = "UPDATE produits SET status = ? WHERE pr_id =? ";

    conn.query(sql, data, (error, result) => {
        if (error) throw error;
        console.log("Enregistré");
        res.redirect('/list-products/'+s_ph_id)
    })
  
})

app.post('/edit-pharmacy', (req,res) =>{
    var s_name = req.body.pname;
    var s_location = req.body.location;
    var s_email = req.body.email;
    var s_phone = req.body.phone;
    var s_updateAt = Date().toString();



    console.log(s_name, s_location, s_email, s_phone, s_updateAt, req.body.id);

    var data = [s_name, s_location, s_phone, s_email, s_updateAt, req.body.id];
    var sql = "UPDATE pharmacies SET ph_name = ? , ph_location = ? , ph_phone = ? , ph_email = ?, update_at = ? WHERE ph_id = ?";


    conn.query(sql, data, (error, result) => {
        if (error) throw error;
        console.log("Edité");
        res.redirect('/dashboard')
    })
  
})



app.post('/set-guard', (req,res) =>{
    var s_status = req.body.status;
    var s_updateAt = Date().toString();


    console.log(s_status, s_updateAt);

    var data = [s_status, s_updateAt, req.body.id];
    var sql = "UPDATE pharmacies SET status = ?, update_at = ? WHERE ph_id = ?";


    conn.query(sql, data, (error, result) => {
        if (error) throw error;
        console.log("Edité");
        res.redirect('/dashboard')
    })
  
})

// Personnel Admin
app.get('/add-person', (req, res) => {
    res.render('formulaire_perso.ejs', {items: ["Ajouter des personnes"]})
})


app.post('/ajout-person', (req,res) =>{
    var s_name = req.body.rname;
    var s_username = req.body.username;
    var s_email = req.body.email;
    var s_phone = req.body.phone;
    var s_pwd = req.body.password;
    var s_ville = req.body.ville;
    var s_genre = req.body.genre;
    var s_role = req.body.role;


    console.log(s_name, s_username, s_email, s_phone, s_pwd, s_genre, s_ville, s_role);

    var data = {u_name: s_name, u_username: s_username, u_email: s_email, u_mdp:s_pwd, u_phone: s_phone, u_gender: s_genre, u_role: s_role };
    var sql = "INSERT INTO user SET ?";

    conn.query(sql, data, (error, result) => {
        if (error) throw error;
        console.log("Enregistré");
        res.redirect('/list-persons')
    })
  
})

app.get('/list-persons', (req, res) => {

    var sql = 'SELECT * FROM user';
    conn.query(sql, (error, result) =>{
        if (error) {
            console.log(error);
        } else {
            res.render('tableau_perso.ejs', {items: ["Liste du personnel", result]})
        }
    })
    
})

app.get('/edit-user/:id', (req, res) => {

    var sql = "SELECT * FROM user WHERE u_id = ?";
    
    conn.query(sql,[req.params.id], function (err, result) {
        if (err) {
            console.log("Error: " + err);
        } else{
            console.log("Informations mises à jour: " + result[0].p_id);
            res.render('edit_user.ejs', {items: ["Editer des personnes", result[0]]})
        };
    });
})

app.post('/edit-user/:id', (req,res) =>{
    var s_name = req.body.rname;
    var s_username = req.body.username;
    var s_email = req.body.email;
    var s_phone = req.body.phone;
    var s_pwd = req.body.password;
    var s_ville = req.body.ville;
    var s_genre = req.body.genre;
    var s_role = req.body.role;


    console.log(s_name, s_username, s_email, s_phone, s_pwd, s_genre, s_ville,s_role);

    var data = [s_name, s_username, s_email, s_pwd, s_phone, s_genre, s_role , req.params.id];
    var sql = "UPDATE user SET u_name = ? , u_username = ? , u_email = ? , u_mdp = ?, u_phone = ?, u_gender = ? , u_role = ? WHERE u_id = ?";


    conn.query(sql, data, (error, result) => {
        if (error) throw error;
        console.log("Edité");
        res.redirect('/list-persons')
    })
  
})

app.get('/delete-user/:id', (req, res) =>{

    var sql = "DELETE FROM user WHERE u_id = ?";

    conn.query(sql,[req.params.id], function (err, result) {
        if (err) {
            console.log("Error: " + err);
        } else{
            console.log("Personne supprimée: " + result.affectedRows);
            res.redirect("/list-persons");
        };
    });
})




app.listen(8000, ()=>console.log("Connected: 8000..."));