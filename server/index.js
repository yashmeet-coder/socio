require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());

app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));

app.use("/", router);
const port = process.env.port || 5000;
app.listen(port, () => console.log("Server Running"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const contactEmail = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: false,
  port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls:{
      ciphers:'SSLv3',
      rejectUnauthorized:false
  }
  });
  
  contactEmail.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
  });

  router.post("/contact", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message; 
    const mail = {
      from: email,
      to: process.env.EMAIL,
      subject: "Contact Form Submission",
      html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Subject: ${subject}</p>
             <p>Message: ${message}</p>`,
    };
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json({ status: "ERROR" });
        console.log(error);
      } else {
        res.json({ status: "Message Sent" });
      }
    });
  });
