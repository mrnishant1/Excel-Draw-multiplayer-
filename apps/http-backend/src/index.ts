import express from 'express'
const app = express();
app.use(express.json())
import { Request, Response } from 'express';
const users=[
    {username: "1", password:"1"},
    {username: "2", password:"2"},
    {username: "3", password:"3"},
    {username: "4", password:"4"},

]

app.post('/signup',(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    //add them to database
    //then-- 
    res.json("got registered")
})
 

//@ts-ignore
app.post('/signin', (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            res.status(200).json({ message: "Sign-in successful" });
            return
            
        }
        return res.status(401).json({ message: "Invalid username or password" });
    }

    return res.status(400).json({ message: "Username and password are required" });
});

app.listen(5000, ()=>{console.log("port is listening")})