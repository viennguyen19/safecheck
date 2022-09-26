const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const socketio = require('socket.io');
const router = express.Router();
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/qrscan/index.html'));
});

app.use(express.static(path.join(__dirname, 'qrscan')), router);

io.on("connection", socket => {
  socket.on("joined", () => { // when server recieves the "joined" message
    //io.emit("joined"); // send message to client
    console.log("NEW CONNECTION");
  });
  socket.on("disconnect", () => { // when someone closes the tab
    //io.emit("leave");
    console.log("User leave");
  });
  socket.on("url", message => {
    //console.log(message);
    checkMaliciousURL(message, socket);
    getImage(message, socket);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


function getImage(url, socket) {
  url = url.replace("https://", "");
  url = url.replace("http://", "");
  console.log(url);
  var tempURL = "https://image.thum.io/get/width/1200/fullpage/https://" + url;
  //var tempURL = "https://s3.amazonaws.com/images.seroundtable.com/google-rainbow-texture-1491566442.jpg";
  console.log(tempURL);
  // Calling Function to Download
  var fileName = 'screenshot' + socket.id + '.png';
  console.log(fileName);
  downloadImageFromURL(tempURL, 'image/' + fileName);

  const myInterval = setInterval(() => {
    console.log("wait 100ms");
    if (fs.existsSync('image/' + fileName)) {
      console.log("true");
      clearInterval(myInterval);
      // Convert image to base64
      var base64str = base64_encode('./image/' + fileName, fs);
      socket.emit("img", base64str);
      deleteImage(fs, fileName);
    }
  }, 100);
}

// Download image helper function
function downloadImageFromURL(url, filename, callback) {
  var Stream = require('stream').Transform;
  var client = http;
  if (url.toString().indexOf("https") === 0) {
    client = https;
  }
  client.request(url, function(response) {
    var data = new Stream();
    response.on('data', function(chunk) {
      data.push(chunk);
    });

    response.on('end', function() {
      fs.writeFileSync(filename, data.read());
    });
  }).end();
}

// Helper function convert img to base64
function base64_encode(file, fs) {
  return "data:image/gif;base64," + fs.readFileSync(file, 'base64');
}

// Delete image after sending to client
function deleteImage(fs, name) {
  fs.unlink('image/' + name, (err) => {
    if (err) {
      throw err;
    }
    console.log("File is deleted.");
  });
}

//old key AzMdtT2gMURYiRzeMppANPqNVGn4jmuZ
function checkMaliciousURL(myUrl, socket) {
  var temp = encodeURIComponent(myUrl);
  var mainPart = "https://ipqualityscore.com/api/json/url/jmwF3tLSZsDPM5HsZK4uRGrhroSlcxYr/";
  temp = mainPart + temp;   
  https.get(temp,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
  
      res.on("end", () => {
          try {
              let json = JSON.parse(body);
              // do something with JSON
              console.log(json);
              sendData(socket, json.success, json.unsafe, json.domain, 
                       json.parking, json.spamming, json.malware, 
                       json.phishing, json.suspicious, json.adult,
                       json.risk_score, json.category);

          } catch (error) {
              console.error(error.message);
          };
      });  
  }).on("error", (error) => {
      console.error(error.message);
  });
}


function sendData(socket, success, unsafe, domain, parking, spamming, 
                  malware, phishing, suspicious, adult,
                  risk_score, category) {
  const urlData = new Array(unsafe, domain, spamming, 
                            malware, phishing, suspicious, adult,
                            risk_score, category);
  socket.emit("urlData", urlData);
}

