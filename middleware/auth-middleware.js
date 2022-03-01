module.exports = function (req, res, next) {
  
    if (!req.session.user) {
  
      try {
        throw new Error('Musisz być zalogowany!');
      } catch(e) {
  
        res.render('pages/auth/login', {
          errors: e // by wyświetlić napis błędu jak wyżej np.:'Error: Nie znaleziono usera'.
        })
      }
    }
    next();
  };