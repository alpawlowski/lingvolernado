const Lesson = require('../database/models/Lesson');
const User = require('../database/models/User');

class LessonController {

    async showLessons(req, res) {
        const { q, sort, level } = req.query;
        const page = req.query.page || 1;
        const perPage = 3;
    
        const where = {};
    
        // search
        if (q) { 
          where.name = { $regex: q || '', $options: 'i' };
        }

        // filters
        if (level) {
            where.level = {};
            if (level === 'Wybierz poziom trudności') where.level = {};
            if (level) where.level.$eq = level;
        }


        let query = Lesson.find(where);
    
        // pagination
        query = query.skip((page - 1) * perPage);
        query = query.limit(perPage);
    
        // sorting
        if(sort) {
          const s = sort.split('_');
          query = query.sort({ [s[0]] : s[1] });
        }
    
        // exec - pobranie faktyczych wyników
        const lessons = await query.exec();
        const resultsCount = await Lesson.find(where).count();
        const lessonsCount = await Lesson.find({}).count();
        const pagesCount = Math.ceil(resultsCount / perPage);
    
        res.render('pages/lesson/all', {
          lessons: lessons,
          page: page,
          pagesCount: pagesCount,
          resultsCount: resultsCount,
          lessonsCount: lessonsCount
        })
      };
    
    async showLessonWordlist(req, res) {

        const { name } = req.params;

        const lesson = await Lesson.findOne({ slug: name });

        const wordlist = lesson.wordlist;

        res.render('pages/lesson/show', {
            lesson: lesson,
            wordlist: wordlist,
        });
    }

    async flipcardLesson(req, res) {

        const { name } = req.params;

        const lesson = await Lesson.findOne({ slug: name });

        const words = lesson.wordlist;
        const count_words = lesson.wordlist.length;

        res.render('pages/lesson/flipcard', {
            lesson: lesson,
            words: words,
            count_words,
        });
    }
    
    async qwertyLesson(req, res) {

        const { name } = req.params;

        const lesson = await Lesson.findOne({ slug: name });

        const words = lesson.wordlist;
        const count_words = lesson.wordlist.length;

        res.render('pages/lesson/qwerty', {
            lesson: lesson,
            words: words,
            count_words,
        });
    }

    async doTestFromLesson(req, res) {

        const { name } = req.params;

        const lesson = await Lesson.findOne({ slug: name });

        const words = lesson.wordlist;
        const count_words = lesson.wordlist.length;

        res.render('pages/lesson/test', {
            lesson: lesson,
            words: words,
            count_words,
        });
    }
    
    async checkTestFromLesson(req, res) {

        const { form_data } = req.body;
        console.log('form_data: ' + form_data);
        const user = await User.findById(req.session.user._id);
        console.log('score: ' + user.score);
        user.score = form_data;
        console.log('score: ' + user.score);
        
        try {
            await user.save();
            req.session.user = user;
            console.log('score: ' + user.score);
            res.redirect('/lekcje');
        } catch (error) {
            res.redirect('/login');
        }
    }

    async addNewLesson(req, res) {     

        try {
            const lesson = new Lesson({
                slug: 'owoce',
                name: 'Owoce',
                img_url: 'pexels-trang-doan-1132047.jpg',
                level: 1,
                language: 'en',
                wordlist: [ 
                    {
                        name: "Apple",
                        name_en: "apple",
                        name_pl: "jabłko",
                        img: 'pexels-trang-doan-1132047.jpg',
                    },
                    {
                        name: "Cherry",
                        name_en: "cherry",
                        name_pl: "wiśnia",
                        name_pl_bez: "wisnia",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Pear",
                        name_en: "pear",
                        name_pl: "gruszka",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Pineapple",
                        name_en: "pineapple",
                        name_pl: "ananas",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Strawberry",
                        name_en: "strawberry",
                        name_pl: "truskawka",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Grapes",
                        name_en: "grapes",
                        name_pl: "winogrona",
                        name_pl_bez: "winogron",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Orange",
                        name_en: "orange",
                        name_pl: "pomarańcza",
                        name_pl_bez: "pomarancza",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Coconut",
                        name_en: "coconut",
                        name_pl: "kokos",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Watermelon",
                        name_en: "watermelon",
                        name_pl: "arbuz",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Peach",
                        name_en: "peach",
                        name_pl: "brzoskwinia",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Currant",
                        name_en: "currant",
                        name_pl: "porzeczka",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Plum",
                        name_en: "plum",
                        name_pl: "śliwka",
                        name_pl_bez: "sliwka",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Gooseberry",
                        name_en: "gooseberry",
                        name_pl: "agrest",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Berry",
                        name_en: "berry",
                        name_pl: "jagoda",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Banana",
                        name_en: "banana",
                        name_pl: "banan",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Wild strawberry",
                        name_en: "wild strawberry",
                        name_pl: "poziomka",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Raspberry",
                        name_en: "raspberry",
                        name_pl: "malina",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Lemon",
                        name_en: "lemon",
                        name_pl: "cytryna",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Lime",
                        name_en: "lime",
                        name_pl: "limonka",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Grapefruit",
                        name_en: "grapefruit",
                        name_pl: "grejpfrut",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                    {
                        name: "Fruits",
                        name_en: "fruits",
                        name_pl: "owoce",
                        img: 'pexels-trang-doan-1132047.jpg',
                    }, 
                ],

            });
            await lesson.save();

            res.send('Dodano nową lekcję!');
            console.log('Dodano nową lekcję!');
            
        } catch (error) {
            console.log(error);
        }
    }


} // LessonController
module.exports = new LessonController();