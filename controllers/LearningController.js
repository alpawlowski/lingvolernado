const User = require('../database/models/User');

class LearningController {
    
    async chooseMethod(req, res) {

        const user = await User.findById(req.session.user._id);
        const words = user.wordlist;

        const all = words.length;
        
        if (all > 0) {
   
            res.render('pages/learn/choose', {
                message: req.flash('info'),
            });

        } else { 
            
            res.render('pages/learn/not-enough-words', {
                message: req.flash('info'),
            });
        }
    };
    
    async selectMeaningEn(req, res) {

        res.render('pages/learn/select-meaning-en', {
            message: req.flash('info'),
        });
    };
    
    async selectMeaningEn_play(req, res) {

        const user = await User.findById(req.session.user._id);
        const words = user.wordlist;

        res.render('pages/learn/select-meaning/game', {
            message: req.flash('info'),
            words: words,
        });
    };
    
    async selectMeaningEn_check(req, res) {

        const question = req.body.question;
        const answer = req.body.answer.trim().toLowerCase();

        const user = await User.findById(req.session.user._id);
        const words = user.wordlist;
        const word = user.wordlist[question];
        const ans = word.name_en;
        
        try {
            console.log('q=' + question);
            console.log('a=' + answer);
            console.log('word=' + word);
            let score = 2;
            
            if (answer === ans) {
                points += 1;
            } else {
                console.log('Źle');
            }

            res.render('pages/learn/select-meaning/game', {
                message: req.flash('info'),
                words: words,
                score: score,
            });
            
        } catch (error) {
            console.log(error);
        }

    };

}

module.exports = new LearningController();