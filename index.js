const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;
const { v4: uuidv4 } = require("uuid");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
});

app.post("/user/create", (req, res) => {
    fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
        const parsed = JSON.parse(data);
        let id = uuidv4();
        req.body.id = id;
        parsed.users = [...parsed.users, req.body];
        fs.writeFile(
            "./db.json",
            JSON.stringify(parsed),
            { encoding: "utf-8" },
            (err) => {
                if (err) {
                    console.error(err);
                }
                res.status(201).send({ status: "User Created", id });
            }
        );
    });
});
app.get("/votes/voters", (req, res) => {
    fs.readFile("./db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        parsed.users = parsed.users.filter((el) => {
            return el.role === "voter"
        });
        res.send(parsed);
    });
});
app.get("/votes/party/:party", (req, res) => {
    const { party } = req.params;
    fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
        const parsed = JSON.parse(data);
        parsed.users = parsed.users.filter((el) => {
            return el.party === party;
        });
        res.send(parsed);
    });
});

app.get("/votes/count/:user", (req, res) => {
    const { user } = req.params;
    fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
        const parsed = JSON.parse(data);
        parsed.users = parsed.users.filter((el) => {
            if (el.name === user)
            {
                return el.name
                }
        });
        
        res.send(parsed);
    });
});

app.get("/db", (req, res) => {
    fs.readFile("./db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        res.send(parsed);
    });
});
app.post("/db", (req, res) => {
    fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
        const parsed = JSON.parse(data);
        parsed.users = [req.body];
        fs.writeFile(
            "./db.json",
            JSON.stringify(parsed),
            { encoding: "utf-8" },
            (err) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    });
});