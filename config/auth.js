module.exports = {
    authorize: function(req, res, next) {
        if(!req.user) {
            return res.redirect('/auth/login');
        }

        if(!req.user.profileCreated) {
            return res.redirect('/user/create-profile')
        }
        
        return next();
    },

    disauthorize: function(req, res, next) {
        if(!req.user) return next();

        res.redirect('/');
    },

    loginAuth: function(req, res, next) {
        if(!req.user) {
            return res.redirect('/auth/login');
        }

        return next();
    }
}