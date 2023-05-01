const User = require('../database/models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { port } = require('../config')

class AuthController {
    showRegister(req, res) {
        res.render('pages/auth/register', {
          title: 'Rejestracja'
        });
    }

    async register(req, res) {
        const mongoose = require('mongoose');
        const id = mongoose.Types.ObjectId();
        console.log(id)

        const output = `
          <style>
            body{
              border: 1px solid #E2EAEB;
              font-family: "Arial", sans-serif;
              margin: 0;
              padding: 0;
            }

            div {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 20px;
              background-color: white;  
              margin: 0px auto; 
              padding: 2rem;
              border: 1px solid rgb(108, 117, 125);
              border-radius: 1rem;
            }

            h2 {
              margin: 1rem;
            }

            button {
              background-color: #565e64;
              border: 1px solid #565e64;
              color: white;
              font-weight: 700 !important;
              padding: 1.5rem !important;
              line-height: 1.5;
              text-align: center;
              text-decoration: none;
              vertical-align: middle;
              border-radius: 1rem;
            }

          </style>
          <div>
            <h2>Witamy w aplikacji LingvoLernado! 👋</h2>
            <h4>Twój adres e-mail: ${req.body.email}</h4>
            <p>Kliknij poniższy przycisk, aby aktywować swoje konto w LingvoLernado.</p>
            <a href="https://lingvolernado.onrender.com/activate/${id}">
            <button>Aktywuj konto</button>
            </a>
          </div>
        `;
    
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
          // tls:{
          //   rejectUnauthorized:false
          // }
        });
    
        const mailOptions = {
          // from: req.body.email, // sender address
          from: '"LingvoLernado" <lingvolernado@email.com>', // sender address
          to: req.body.email, // list of receivers
          subject: "Witamy w LingvoLernado 🥰", // Subject line
          // text: req.body.message, // plain text body
          html: output, // html body
        };

          const user = new User({
            _id: id,
            email: req.body.email,
            password: req.body.password
          });

        try {

          transporter.sendMail(mailOptions, (error, info) => {
              if(error){
                console.log(error);
                // res.render('index',{msg: "Wystąpił błąd, nie udało się wysłać wiadomości. Spróbuj ponownie."});
              } else {
                console.log("Email sent: " + info.response);
                console.log('success');
                // res.render('pages/home',{msg: "Wiadomość została wysłana."});
              }
          });
    
        
          await user.save();
          req.flash('success_msg', `Przesłano link aktywacyjny na email ${req.body.email}`);
          res.redirect('/');
        } catch (e) {
          console.log(e);
          res.render('pages/auth/register', {
            errors: e.errors,
            form: req.body
          })
        }
      }
    
      showLogin(req, res) {
        res.render('pages/auth/login', {
          title: 'Logowanie'
        });
      }
      
      async login(req, res) {

        try {
          const user = await User.findOne({ email: req.body.email });
          if (!user) {
            throw new Error('Nie znaleziono usera');
          }
    
          const userActivated = user.activated;
          if (!userActivated) {
            console.log('Konto aktywowane: ' + userActivated);
            throw new Error('Konto nie zostało aktywowane');
          }

          const isValidPassword = user.comparePassword(req.body.password);
          if (!isValidPassword) {
            throw new Error('Nieprawidłowe hasło');
          }

          const words = user.wordlist.length;
   

          console.log(words);

          //login
          req.session.user = user;
          req.flash('success_msg', 'Poprawnie zalogowano do systemu.');
          res.redirect('/');
    
        } catch (e) {

          res.render('pages/auth/login', {
            form: req.body,
            errors: e // by wyświetlić napis błędu jak wyżej np.:'Error: Nie znaleziono usera'.
            // errors: true // by wyświetlić napis 'Błędny email lub hasło'.
          })
        }
      }

      async activateAccount(req, res) {
        const userId = req.params.id;
        let user = await User.findById(userId);
        const userEmail = user.email;
        try {
            if(user.activated == false){
              user.activated = true;
              console.log(`Konto użytkownika o emailu: ${userEmail} zostało aktywowane`);
              
              await user.save();
              req.flash('success_msg', `Konto użytkownika o emailu: ${userEmail} zostało aktywowane.`);
              res.redirect(`/zaloguj`)
            } else {
              req.flash('success_msg', `Konto użytkownika o emailu: ${userEmail} zostało już aktywowane.`);
              res.render(`errors/info`, {
                msg: `Twoje konto jest już aktywne!`,
              })
              console.log(`Konto użytkownika o emailu: ${userEmail} zostało już aktywowane`);
            }
            
        } catch (error) {
            (user == null)
            ? res.send('Wystąpił błąd, spróbuj ponownie')
            : res.redirect('/zaloguj');
        }
      }
    
      logout(req, res) {
        if (req.session) {
            req.session = null;
            res.redirect('/');
        } else {
            res.redirect('/zaloguj');
        }
      }

}

module.exports = new AuthController();
