const jwt =require('jsonwebtoken')
const bcrypt=require('bcryptjs')

const {promisify}=require('util');

const mysql=require('mysql');

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
})

exports.login=async(req,res)=>{
        try {
            const email = req.body.email;
            const password = req.body.password;
    
            if (!email || !password) {
                return res.status(400).render('login', {
                    message: 'Please provide an email and password'
                });
            }else{
    
            db.query('SELECT * FROM users WHERE email=?', [email], async (error, result) => {
        
                console.log("Login result:", result); 
    
                if (!result|| !(await bcrypt.compare(password, result[0].password))) {
                    console.log("Password comparison failed");
                    return res.status(401).render('login', {
                        message: 'Email or password is incorrect'
                    });
                } else {
                    console.log("Password comparison succeeded");
                    const id = result[0].id;
    
                    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
    
                    console.log("The token is:" + token);
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                   
                    console.log("JWT_COOKIE_EXPIRES:", process.env.JWT_COOKIE_EXPIRES);

                    
                    res.cookie('jwt', token, cookieOptions);
                    return res.status(200).redirect("/profile");
                    

                }
            });
        }
        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }

}

exports.register=(req,res)=>{
    console.log(req.body);

    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const passwordConfirm=req.body.passwordConfirm;


db.query('SELECT email FROM users WHERE email=?', [email], async (error, result) => {
    if (error) {
        console.log(error);
    }
    if (result.length > 0) {
        return res.render('register', {
            message: 'This email is already in use.'
        });
    } else if (password !== passwordConfirm) {
        return res.render('register', {
            message: 'Passwords do not match.'
        });
    }
    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    db.query('INSERT INTO users SET ?',{name:name,email:email,password:hashedPassword},(error,result)=>{
    if (error){
        console.log(error);
    }
    else{
        console.log(result)
        // return res.redirect('/profile');
        return res.render('register',{
            message:'user registered'
        });
    }
    // return res.redirect('/profile');
    res.send("Form submitted");
});

    });


};


exports.logout=async(req,res)=>{
    res.cookie('jwt','logout',{
        expires:new Date(Date.now()+2*1000),
        httpOnly:true
    });
    // res.status(200).redirect('/');
    return res.status(200).render('profile', { user: { id: id, email: email } });

}

exports.profile = (req, res) => {
    console.log('JWT_COOKIE_EXPIRES:', process.env.JWT_COOKIE_EXPIRES);

    const token = req.cookies.jwt; // Get the token from cookies

    if (!token) {
        return res.status(401).redirect('/login'); // Redirect to login if token is not present
    }

    const cookieOptions = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES, 10) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.cookie('jwt', token, cookieOptions);
    console.log(req.user);
    res.render('profile', { user: req.user });


};


exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            
            db.query('SELECT * FROM users WHERE id=?',[decoded.id],(error,result)=>{
            //const [result] = await db.query.bind(db)('SELECT * FROM users WHERE id=?', [decoded.id]);
                console.log(result);
                if (!result) {
                    return next();
                }

                req.user = result[0];
                console.log("user is");
                console.log(req.user);
                return next();

            });
        }catch (error) {
                console.log(error);
                return next();
            }
        } else {
            next();
    }
};




