const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const router = express.Router();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/qrscan/index.html'));
});

app.use(express.static(path.join(__dirname, 'qrscan')), router);

io.on("connection", socket => {
  socket.on("joined", () => { // when server recieves the "joined" message
    io.emit("joined"); // send message to client
    console.log("NEW CONNECTION");
  });
  socket.on("disconnect", () => { // when someone closes the tab
    io.emit("leave");
  });
  socket.on("url", message => {
    console.log(message);
    checkMaliciousURL(message);
    getImage(message, socket);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


function getImage(url, socket) {
  var fs = require('fs'),
    https = require('https');
  var Stream = require('stream').Transform;

  // Download Image Helper Function
  var downloadImageFromURL = (url, filename, callback) => {
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
  };

  url = url.replace("https://", "");
  console.log(url);
  var tempURL = "https://image.thum.io/get/width/1200/fullpage/https://" + url;
  console.log(tempURL);
  // Calling Function to Download
  downloadImageFromURL(tempURL, 'image/screenshot.png');

  const myInterval = setInterval(() => {
    console.log("wait 1s");
    if (fs.existsSync('image/screenshot.png')) {
      console.log("true");
      clearInterval(myInterval);
      // Convert image to base64
      var base64str = base64_encode('./image/screenshot.png', fs);
      socket.emit("img", base64str);
      deleteImage(fs);
    }
  }, 100);
}

// Helper function convert img to base64
function base64_encode(file, fs) {
  return "data:image/gif;base64," + fs.readFileSync(file, 'base64');
}


// Delete image after sending to client
function deleteImage(fs) {
  fs.unlink('image/screenshot.png', (err) => {
    if (err) {
      throw err;
    }
    console.log("File is deleted.");
  });
}


function checkMaliciousURL(myUrl) {
  var temp = encodeURIComponent(myUrl);
  var mainPart = "https://ipqualityscore.com/api/json/url/AzMdtT2gMURYiRzeMppANPqNVGn4jmuZ/";
  temp = mainPart + temp;

  const https = require('https');
  
  let url = temp;
  
  https.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
  
      res.on("end", () => {
          try {
              let json = JSON.parse(body);
              // do something with JSON
              console.log(json);
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
  const urlData = new Array(success, unsafe, domain, parking, spamming, 
                            malware, phishing, suspicious, adult,
                            risk_score, category);
  socket.emit("urlData", urlData);
}