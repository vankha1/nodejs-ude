exports.get404 = (req, res, next) => {

    res.status(404).render('404', {
        pageTitle : '404 Not Found',
        path: "/404error",
        isAuthenticated : req.session.isLoggedIn
    });

    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
}

exports.get500 = (req, res, next) => {

    res.status(500).render('500', {
        pageTitle : '500 Not Found',
        path: "/500"
    });

    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
}