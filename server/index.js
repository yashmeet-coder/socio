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
app.listen(5000, () => console.log("Server Running"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const contactEmail = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 587,
    secure: false,
    secureConnection: false,
    requireTLS:true,
    auth: {
      user: "team@sociosynapse.com",
      pass: "7017772887,
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
      from: "team@sociosynapse.com",
      to: "team@sociosynapse.com",
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
