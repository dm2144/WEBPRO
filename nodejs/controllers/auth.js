const jwt =require('jsonwebtoken')
const bcrypt=require('bcryptjs')

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
        }
    //additional
    console.log("before db.query")
    db.query('SELECT email FROM users WHERE email=?', [email], async (error, result) => {
        //add
        console.log("inside")
        console.log(result);
        if(!result || !(await bcrypt.compare(password,result[0].password))){
            console.log("Password comparison failed");
            res.status(401).render('login',{
                message:'email or password is incorrect'
            })
        }else{
            console.log("Password comparison succeeded");
            const id=result[0].id;

            const token=jwt.sign({id},process.env.JWT_SECRET,{
                expiresIn:process.env.JWT_EXPIRES_IN
            });
 
            console.log("The token is:"+token);
            const cookieOptions={
                expires:new Date(
                    Date.now()+process.env.JWT_COOKIE_EXPIRES *24*60*60*1000
                ),
                httpOnly:true
            }
            res.cookie('jwt',token,cookieOptions);
            res.status(200).redirect("/profile");
        }
        })
    }catch(error){
        console.log(error);
    }
}


exports.register=(req,res)=>{
    console.log(req.body);

    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const passwordConfirm=req.body.passwordConfirm;

    // db.query('SELECT email FROM users WHERE email=?',[email,async(error,result)=>{
    //     if (error){
    //         console.log(error);
    //     }
    //     if (result.length>0){
    //         return res.sender('register'),{
    //             message:'This email is already in use..'
    //         }
    //     }else if (password!==passwordConfirm){
    //         return res.render('register',{
    //             message:'Passwords do not match'
    //         });
    //     }
    //     console.log('Before hashing:', password);
    //     let hashedPassword=await bcrypt.hash(password,8);
    //     console.log(hashedPassword)
    // }
// ])


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
        return res.render('register',{
            message:'user registered'
        });
    }

    res.send("Form submitted");
});

    });


};


exports.logout=async(req,res)=>{
    res.cookie('jwt','logout',{
        expires:new Date(Date.now()+2*1000),
        httpOnly:true
    });
    res.status(200).redirect('/');
}