const User=require("../models/user.js");
module.exports.SignUpForm=(req,res)=>{
    res.render("./user/signup.ejs");
};
module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({username,email});
    let registeruser=await User.register(newUser, password);
    req.login(registeruser,(err)=>{
        if(err)
        {
            next(err);
        }
         req.flash("success","Welcome to wonderlust");
    res.redirect("/listings");
    });
   
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};
module.exports.loginForm=(req,res)=>{
    res.render("./user/login.ejs");
};
module.exports.login= (req, res) => {
        req.flash("success", "You are logged in successfully");
        let redirectUrl=res.locals.redirectUrl || "./listings";
        res.redirect(redirectUrl);
    };

module.exports.logOut=(req,res,next)=>{
    req.logOut((err)=>{
        if(err)
        {
            next(err);

        }
        req.flash("success","You are logout");
        return res.redirect("/listings");
    })
};    