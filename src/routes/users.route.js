const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/random', (req, res) => {       
    const users = fs.readFileSync('users.json');
    const parsedUsers = JSON.parse(users);
    const index = Math.floor(Math.random() * (parsedUsers.length - 0)) + 1;
    const random = parsedUsers[index];
    res.send(random);
});

router.get('/all', (req, res) => {
    const { limit } = req.query;  
    const users = fs.readFileSync('users.json');
    const parsedUsers = JSON.parse(users).slice(0, limit);
    res.send(parsedUsers);
});

router.post('/save', (req, res) => {       
    const users = fs.readFileSync('users.json');
    const parsedUsers = JSON.parse(users);

    if(Object.keys(parsedUsers[0]).every(user => Object.keys(req.body).includes(user))){
        parsedUsers.push(req.body);
        const newUser = JSON.stringify(parsedUsers);
        fs.writeFileSync("users.json", newUser);
        res.send(parsedUsers);
    } else{
        res.send('Please, give all fields');
    }
});

router.delete('/delete/:id', (req, res) => {  
    const { id } = req.params;     
    const users = fs.readFileSync('users.json');
    let parsedUsers = JSON.parse(users);
    parsedUsers = parsedUsers.filter(user => user.id !== Number(id));
    const newUsers = JSON.stringify(parsedUsers);
    fs.writeFileSync("users.json", newUsers);
    res.send(parsedUsers);
});

router.patch('/update/:id', (req, res) => {       
    const { id } = req.params;
    const users = fs.readFileSync('users.json');
    const parsedUsers = JSON.parse(users);
    for(let user of parsedUsers){
        if(user.id == id){
            let index = parsedUsers.indexOf(user);
            if (index !== -1) {
                parsedUsers[index] = req.body;
                fs.writeFileSync("users.json", JSON.stringify(parsedUsers));
                res.send(parsedUsers);
            }
        } 
    }
    res.send('');
});

router.patch('/bulk-update', (req, res) => {
    const users = fs.readFileSync('users.json');
    const parsedUsers = JSON.parse(users);
    parsedUsers.forEach(user => {
        req.query.ids.forEach(id => {
            if(user.id == id){
                let index = parsedUsers.indexOf(user);
                req.body.forEach(u => {
                   if(user.id == u.id){
                    if (index !== -1) {
                        parsedUsers[index] = u;
                        fs.writeFileSync("users.json", JSON.stringify(parsedUsers));
                        res.send(parsedUsers);
                    }
                   }
                })
            } 
        })        
    });
    res.send('');
});

module.exports = router;