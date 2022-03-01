const User = require('../database/models/User');
const Lesson = require('../database/models/Lesson');

class UserController {

    showProfile(req, res) {
        res.render('pages/user/profile', {
            form: req.session.user,
            message: req.flash('info'),
        });
    };

    showSettings(req, res) {
        res.render('pages/user/settings', {
            form: req.session.user,
            message: req.flash('info'),
        });
    };

    async update(req, res) {
        const user = await User.findById(req.session.user._id);

        if (req.body.email) {user.email = req.body.email;}
        if (req.body.firstname) {user.firstname = req.body.firstname;}
        if (req.body.lastname) {user.lastname = req.body.lastname;}
        if (req.body.password) {user.password = req.body.password;}
        {user.wordlist.push({
            name: 'Blck',
            name_pl: 'czarny',
            name_en: 'black',
        })}

        try {
            await user.save();
            req.session.user = user;
            if (req.body.password) {
                req.flash('info', 'Hasło zostało zmienione');
            } else {
                req.flash('info', 'Dane konta zostały zapisane');
            }
            res.redirect('/profil/ustawienia');
            
        } catch (error) {
            res.render('pages/user/settings', {
                errors: error.errors,
                form: req.body
            })
            console.log(error);
        }
    }

    async showWordlist(req, res) {
        const { q } = req.query;
        let words;
        const user = await User.findById(req.session.user._id);
        let count_words = user.wordlist.length;

        if (q) { 
            words = user.wordlist.filter(function (word)
            {
                let regex = new RegExp(q, 'i');
                return word.name_en.match(regex);
            });
        } else {
            words = user.wordlist;
        }
        
        res.render('pages/user/wordlist', {
            message: req.flash('info'),
            words: words,
            count_words
        });
    };

    async showLessonlist(req, res) {

        const lessons = await Lesson.find({owner: req.session.user._id});
        const count_lessons = lessons.length;

        res.render('pages/user/lessonlist', {
            message: req.flash('info'),
            lessons: lessons,
            count_lessons: count_lessons,
        });
    };

    async addLesson(req, res) {

        let lessons;
        let count_lessons;
        const userId = req.session.user._id;

        try {
            const user = await User.findById(userId);
            lessons = await Lesson.find({owner: user._id});
            count_lessons = lessons.length;

            if (!req.body.name){
                console.log('Nowa lekcja musi mieć nazwę');
                throw new Error('Nowa lekcja musi mieć nazwę');
            }
            
            if (!req.body.level){
                console.log('Nowa lekcja musi mieć poziom trudności');
                throw new Error('Nowa lekcja musi mieć poziom trudności');
            }

            if (!userId){
                console.log('Nowa lekcja musi mieć właściciela');
                throw new Error('Nowa lekcja musi mieć właściciela');
            }
            let lesson;
            const name = req.body.name;
            let slug = name.trim().toLowerCase();
            slug = slug.replace(/ /g,"_");

            if (req.body.name && req.body.level && userId) {  
                
                lesson = new Lesson({
                    slug: slug,
                    name: name,
                    img_url: 'set_of_words.jpg',
                    level: req.body.level,
                    language: 'en',
                    owner: userId,
                    wordlist: [
                        {
                            name: "Apple",
                            name_en: "apple",
                            name_pl: "jabłko",
                            img: 'pexels-trang-doan-1132047.jpg',
                        },
                    ]
                })
            } 
                
            await lesson.save();
            // req.session.user = user;

            req.flash('info', `Dodano nową lekcję "${req.body.name}"`);
            res.redirect('/profil/lekcje');

        } catch (error) {
            res.render('pages/user/lessonlist', {
                message: req.flash('info'),
                errors: error,
                lessons: lessons,
                count_lessons
            });
        }
    };
    
    async chooseMethod(req, res) {

        const user = await User.findById(req.session.user._id);
        const words = user.wordlist;

        const all = words.length;
        
        if (all > 0) {
   
            res.render('pages/user/choose-method', {
                message: req.flash('info'),
            });

        } else { 
            
            res.render('pages/learn/not-enough-words', {
                message: req.flash('info'),
            });
        }
    };

    showAddWordForm(req, res) {
        res.render('pages/user/profile', {
            form: req.session.user,
            message: req.flash('info'),
        });
    };

    async addWord(req, res) {
        let words;
        let count_words;

        try {
            const user = await User.findById(req.session.user._id);
            words = user.wordlist;
            count_words = user.wordlist.length;

            if (!req.body.addName){
                console.log('Nowe słówko musi mieć nazwę');
                throw new Error('Nowe słówko musi mieć nazwę');
            }
            
            if (!req.body.addEn){
                console.log('Nowe słówko musi mieć angielskie znaczenie');
                throw new Error('Nowe słówko musi mieć angielskie znaczenie');
            }

            if (!req.body.addPl){
                console.log('Nowe słówko musi mieć polskie znaczenie');
                throw new Error('Nowe słówko musi mieć polskie znaczenie');
            }

            if (req.body.addName && req.body.addEn && req.body.addPl) {
                words.push({
                    name: req.body.addName,
                    name_en: req.body.addEn,
                    name_pl: req.body.addPl,
                });
            } 

            await user.save();
            req.session.user = user;

            req.flash('info', `Dodano nową parę słówkek ${req.body.addEn} - ${req.body.addPl} `);
            res.redirect('/profil/slowka');

        } catch (error) {
            res.render('pages/user/wordlist', {
                message: req.flash('info'),
                errors: error,
                words: words,
                count_words
            });
        }
    }

    async deleteWord(req, res) {
        
        const { id } = req.params;
        const user = await User.findById(req.session.user._id);
        const words = user.wordlist;
        
        try {

            user.wordlist.pull({ _id: id })
            await user.save();
            req.session.user = user;

            res.redirect('/profil/slowka');
        } catch (error) {
            req.flash('error', 'Nie udało się usunąć słówka');
            res.redirect('/profil/slowka');
            console.log(error);
        }
    }
    
    async deleteAllWords(req, res) {
        
        const user = await User.findById(req.session.user._id);
        const words = user.wordlist;
        
        try {
            words.splice(0, words.length)
            await user.save();
            req.session.user = user;

            req.flash('info', 'Poprawnie usunięto wszystkie słówka z tablicy');
            res.redirect('/profil/slowka');
        } catch (error) {
            req.flash('error', 'Nie udało się usunąć wszystkich słówek');
            res.redirect('/profil/slowka');
            console.log(error);
        }
    }

    async editWord(req, res) {

        let words;
        let count_words;
        const { id } = req.params;

        try {
            const user = await User.findById(req.session.user._id);
            words = user.wordlist;
            count_words = user.wordlist.length;

            if (!req.body.editName){
                console.log('Edytowane słówko musi mieć nazwę');
                throw new Error('Edytowane słówko musi mieć nazwę');
            }
            
            if (!req.body.editEn){
                console.log('Edytowane słówko musi mieć angielskie znaczenie');
                throw new Error('Edytowane słówko musi mieć angielskie znaczenie');
            }
            
            if (!req.body.editPl){
                console.log('Edytowane słówko musi mieć polskie znaczenie');
                throw new Error('Edytowane słówko musi mieć polskie znaczenie');
            }

            const element = user.wordlist.find(element => element._id == id );

            element.name = req.body.editName,
            element.name_en = req.body.editEn,
            element.name_pl = req.body.editPl

            await user.save();
            req.session.user = user;
            req.flash('info', 'Dokonano edycji pary słówek.');
            res.redirect('/profil/slowka');
            
        } catch (error) {
            res.render('pages/user/wordlist', {
                message: req.flash('info'),
                errors: error,
                words: words,
                count_words
            });
        }
    }

    async repeatWords(req, res) {

        const user = await User.findById(req.session.user._id);
        const words = user.wordlist;
        const count_words = user.wordlist.length;

        res.render('pages/user/repeat-words', {
            message: req.flash('info'),
            words: words,
            count_words
        });

    } 
    
    async deleteAccount(req, res) {

        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        try {
            req.session.destroy();
            // req.flash('success_msg', `Konto zostało usuniętne.`);
            res.render(`errors/delete_info`, {
              msg: `Twoje konto zostało usunięte!`,
            })
        } catch (error) {
            console.log(error);
            res.redirect('/profil/ustawienia');
        }
    }; 


    
}

module.exports = new UserController();