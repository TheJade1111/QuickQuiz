const express = require("express");
const fs = require("fs");
const session=require("express-session")
const app = express();
let testCode;
const PORT=process.env.PORT || 3000;
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:"abc"
}))
let role;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static(__dirname + "/Login"));
app.use(express.static(__dirname + "/TakeQuiz"));
app.use((req,res,next)=>{
    console.log("Request for "+req.url);
    next();
})
function authentication(req,res,next){
    if(req.session.email)
    next();
   else
   res.redirect("/");
}
app.get("/favicon.ico",(req,res)=>{
    res.sendFile(__dirname+"/favicon.ico.png");
})
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Login/main.html");
});
app.get("/createQuestions",authentication,(req,res)=>{
    res.sendFile(__dirname+"/createQuestions/createQuestions.html");
})
app.get("/getSessionRole",authentication,(req,res)=>{
    res.send(JSON.stringify({username:req.session.username,role:req.session.role}))
})
app.get("/about",authentication,(req,res)=>{
    res.sendFile(__dirname+"/About/about.html");
})
app.get("/help",authentication,(req,res)=>{
    res.sendFile(__dirname+"/Help/help.html");
})
app.get("/choose",authentication,(req,res)=>{
    res.sendFile(__dirname+"/Choose/choose.html");
})
app.post("/login",(req, res) => {
    fs.readFile(__dirname + "/Login/user.json", (err, data) => {
        if (err) {
            console.error("Error reading user data:", err);
        } else {
            let user_data;
            if (data == "") {
                user_data = [];
            } else {
                user_data = JSON.parse(data);
            }
            let flag = false;
            user_data.forEach((val) => {
                if (val.email == req.body.email && val.password == req.body.password) {
                    flag = true;
                    req.session.username=val.name;
                    req.session.email=val.email;
                    req.session.password=val.password;
                    req.session.role=val.role;
                }
            });
            if (flag == true) {
                console.log("Login successful!");
                res.status(200).json({ message: "Login successful" });
            } else {
                console.log("Login not successful!");
                res.status(401).json({ message: "Invalid email or password" });
            }
        }
    });
});

app.post("/register",(req, res) => {
    console.log(req.body);
    fs.readFile(__dirname + "/Login/user.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let user_data;
            if (data == "") {
                user_data = [];
            } else {
                user_data = JSON.parse(data);
            }
            let flag = false;
            user_data.forEach((val) => {
                if (val.email == req.body.email || val.name == req.body.name) {
                    flag = true;
                }
            });
            if (flag == true) {
                res.status(401).json({ message: "Such user already exists!" });
            } else {
                user_data.push({email:req.body.email,password:req.body.password,name:req.body.name,role:"student"});
                fs.writeFile(__dirname+"/Login/user.json",JSON.stringify(user_data),(err)=>{
                    if(err){
                        console.log(err);
                    }
                })
                res.status(200).json({ message: "Register successful" });
            }
        }
    });
});

app.get("/getQuestions",authentication,(req,res)=>{
    fs.readFile(__dirname+"/TakeQuiz/questions.json",(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });
})
app.post("/createQuiz",authentication,(req,res)=>{
    testCode = Math.floor(Math.random()*10000);
    fs.readFile(__dirname+"/TakeQuiz/questions.json",(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            let questions;
            if(data==""){
                questions=[];
            }
            else{
                questions=JSON.parse(data);
            }
            let contentArr=[];
            req.body[0].questions.forEach((val)=>{
                contentArr.push({numb:val.numb,question:val.question,answer:val.answer,options:val.options});
            })
            let obj={code:testCode,title:req.body[0].title,content:contentArr};
            questions.push(obj);
            
            fs.writeFile(__dirname+"/TakeQuiz/questions.json",JSON.stringify(questions),(err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.send("Quiz created successfully");
                }
            })
        }
    })
})
app.post("/getQuestionsCode",authentication,(req,res)=>{
    fs.readFile(__dirname+"/TakeQuiz/questions.json",(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            let questions;
            if(data==""){
                questions=[];
            }
            else{
                questions=JSON.parse(data);
            }
            
            questions = questions.filter((val)=>{
                return val.code==req.body.code;
            })
            res.send(questions);
        }
    })
})
app.post("/getCategoryQuestions",authentication,(req,res)=>{
    fs.readFile(__dirname+"/Choose/questions.json",(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            let questions;
            if(data==""){
                questions=[];
            }
            else{
                questions=JSON.parse(data);
            }
            
            questions = questions.filter((val)=>{
                return val.title==req.body.title;
            })
            res.send(questions);
        }
    })
})
app.get("/getTestCode",authentication,(req,res)=>{
    res.send({"redirectUrl": "/testCode.html"});
})
app.get("/code",authentication,(req,res)=>{
    res.send({code:testCode});
})
app.get("/logout",authentication,(req,res)=>{
    req.session.destroy();
    res.redirect("/");
})
app.listen(PORT, () => {
    console.log("Server Started on port "+PORT);
});
