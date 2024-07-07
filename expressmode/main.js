import express from "express";
import cors from "cors";
import connection from "./connection.js"; //????

const app = express(); //实例化

var todoList = new Map();

const userList = new Map();

//一个网络应用程序，需要绑定一个端口
app.listen(3001, () => {
  console.log("服务器启动成功");
});

app.use(cors());
// app.use(connection);
app.use(express.json());

// 创建 application/x-www-form-urlencoded 编码解析
app.use(express.urlencoded({ extend: false }));

app.get("/", (req, res) => {
  const sql = "select * from test";
  connection.query(sql, (err, result) => {
    try {
      res.send(result);
    } catch (err) {
      console.log("查询失败");
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username == "10000a" && password == "10000a") {
    res.json({
      status: 200,
      msg: "ok",
      username,
      token: "ThisisAdminToken",
      err: null,
      authority: "admin",
      islogin: true,
    });
  } else if (!userList.has(username)) {
    res.json({
      status: 200,
      msg: "ok",
      token: "",
      err: "用户未注册！",
    });
  } else if (userList.get(username) != password) {
    res.json({
      status: 200,
      msg: "ok",
      token: "",
      err: "密码错误！",
    });
  } else if (userList.get(username) == password) {
    res.json({
      status: 200,
      msg: "ok",
      username,
      token: "ThisisUserToken" + username,
      err: null,
      authority: "user",
      islogin: true,
    });
  } else {
    res.json({
      status: 200,
      msg: "ok",
      err: "Not known Error in login",
    });
  }
});

app.post("/islogin", (req, res) => {
  const { token } = req.body;
  if (token == "ThisisAdminToken") {
    res.json({
      status: 200,
      msg: "ok",
      username: "10000a",
      avatar: null,
      err: null,
      authority: "admin",
      islogin: true,
    });
  }
  else if (token.slice(0, 15) == "ThisisUserToken") {
    res.json({
      status: 200,
      msg: "ok",
      username: token.slice(15),
      avatar: null,
      err: null,
      authority: "user",
      islogin: true,
    });
  }
  else {
    res.json({
      status: 200,
      err: "用户未登录！",
      islogin: false,
      authority: null,
    });
  }
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (userList.has(username)) {
    res.json({
      status: 200,
      err: "用户已注册！",
    });
  } else {
    userList.set(username, password);
    res.json({
      status: 200,
      err: null,
    });
  }
});

app.post('/addToDoList', (req, res) => {
  const { item } = req.body;
})

app.post('/getToDoList', (req, res) => {
  const { username } = req.body;
  
})