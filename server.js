const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const feedRoutes = require("./routes/feedRouters");
const messageRoutes = require("./routes/messageRouter");
const User = require("./models/User");
const Message = require("./models/Message");
const dotenv = require("dotenv");
const mysql = require("mysql2");

const roomsStatic = [
  "Info UAD",
  "Belajar Programming",
  "Info Makan & Minuman",
  "Pengejar Sunnah",
  "Teknologi Terkini",
  "Anak Editor",
  "Asupan Ngakak",
  "Modif Kendaraan",
  "Pecinta Kucing",
  "Wibu Bau Bawang",
];
const cors = require("cors");
// const connect = require("./dbConfig");
dotenv.config();

const connect = mysql.createConnection({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASS ?? "",
  database: process.env.DB_NAME ?? "bukubook",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    // origin: ["https://bukubook.netlify.app", "http://localhost:3000"],
  })
);

app.use("/users", userRoutes);
app.use("/feeds", feedRoutes);
app.use("/msg", messageRoutes);
// require("./connection");

const server = require("http").createServer(app);
const PORT = process.env.PORT || 52541;
const io = require("socket.io")(server, {
  cors: {
    // origin: ["https://bukubook.netlify.app", "http://localhost:3000"],
    // methods: "*",
  },
});

async function getLastMessagesFromRoom(room) {
  // let roomMessages = {};
  // await Message.aggregate([
  //   { $match: { to: room } },
  //   { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  // ]);
  // return new Promise((resolve) => {
  //   const query = `SELECT * FROM message WHERE \`to\`='${room}' GROUP BY date`;
  //   connect.query(query, function (err, rows, fields) {
  //     if (err) throw err;
  //     // const from = JSON.stringify('{"a":"a"}');
  //     // const messagesByDate= rows.
  //     // {content:rows.content:rows,socketid:rows.socketid,date:rows.socketid,to:rows,time:rows,_id:rows}
  //     console.log(rows );
  //     // res.status(200).send
  //     resolve({ _id: rows[0].date, messagesByDate: rows });
  //     // roomMessages = ;
  //   });
  // });
  return new Promise((resolve) => {
    // data: json => from:Array<object>
    const _serialize = (rawData) => {
      return rawData.map((data) =>
        data?.from && typeof data?.from == "string"
          ? { ...data, from: JSON.parse(data.from) }
          : data
      );
    };

    const query = `SELECT  *  FROM message WHERE \`to\`='${room}'`;
    connect.query(query, function (err, rows, fields) {
      if (err) throw err;
      console.log("rows", _serialize(rows));
      resolve(rows);
    });
  });
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}

// socket connection

io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    // const resultMembers = await User.find({}, [], { sort: { status: -1 } });
    const query = "SELECT * FROM `user` ORDER BY status DESC";
    connect.query(query, function (err, rows, fields) {
      if (err) throw err;
      console.log("rows", rows);
      io.emit("new-user", rows);
      // res.status(200).json(rows);
    });
  });

  socket.on("join-room", async (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    console.log("roomMessages", roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    // const newMessage = await Message.create({
    //   content,
    //   from: sender,
    //   time,
    //   date,s
    //   to: room,
    // });
    // const newMessage = {
    //   content,
    //   from: sender,
    //   time,
    //   date,
    //   to: room,
    // };
    const fromToJSON = JSON.stringify(sender);

    const query = `INSERT INTO message(content, from, time,date,to) VALUES('${content}','${fromToJSON}','${time}','${date}','${room}')`;
    connect.query(query, function (err, rows, fields) {
      if (err) throw err;
      console.log("rows", rows);
      io.emit("new-user", rows);
      // res.status(200).json(rows);
    });

    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });
  app.delete("/logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      // const user = await User.findById(_id);
      // user.status = "offline";
      // user.newMessages = newMessages;
      // await user.save();
      // const members = await User.find({}, [], { sort: { status: -1 } });
      // Im allready connect sir
      // can u change our models?
      // no sir, i just conetc the mysql
      // create new models for mysql and mongodb sir, please follow me

      const newMessagesToJSON = JSON.stringify(newMessages);
      const query1 = `UPDATE user SET status="offline", newMessages='${newMessagesToJSON}' where _id=19`;
      connect.query(query1, function (err, rows, fields) {
        if (err) throw err;
        const query2 = `SELECT  *  FROM user ORDER BY status DESC`;
        connect.query(query2, function (err, members, fields) {
          console.log("rows", members, "rows", rows);
          socket.broadcast.emit("new-user", members);
          res.status(200).json(members);
        });
      });
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});

app.get("/rooms", async (req, res) => {
  let rooms = [];
  async function getCountMsg(data) {
    const result = await Message.countDocuments({ to: data });
    return result;
  }
  for (let room of roomsStatic) {
    const dataCount = await getCountMsg(room);
    rooms.push({ room, dataCount });
  }

  res.json(rooms);
});

app.get("/", async (req, res) => {
  // const sender = {
  //   _id: 19,
  //   name: "Abdul Barakat",
  //   email: "abdulbarakat@gmail.com",
  //   status: "online",
  // };
  // const fromToJSON = JSON.stringify(sender);
  // const query = `INSERT INTO message(content, \`from\`, time,date,\`to\`) VALUES('${"ikan makan nasi"}','${fromToJSON}','${"10:34"}','${"21/12/2022"}','${"UAD"}')`;
  // connect.query(query, function (err, rows, fields) {
  //   if (err) throw err;
  //   console.log("rows", rows);
  //   io.emit("new-user", rows);
  //   // res.status(200).json(rows);
  // });
  // getLastMessagesFromRoom("UAD");
});

server.listen(PORT, () => {
  console.log("listening to port", PORT);
});
