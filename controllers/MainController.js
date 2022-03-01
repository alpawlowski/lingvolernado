class MainController {

    showHome(req, res) {
        res.render('pages/home', {
          title: 'Strona główna',
        });
    };

    showNotFound(req, res) {
      res.render('errors/404', { 
        layout: 'layouts/main',
        title: 'Nie znaleziono',
      })
    };
}

module.exports = new MainController();