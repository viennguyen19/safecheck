var socket = io();

var myurl = "";
var html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 200, qrbox: 300});
html5QrcodeScanner.clear();
const output = document.getElementById("output");
const inputURL = document.getElementById("url");
const reader = document.getElementById("reader");
const myimg = document.getElementById("myimg");
const btn = document.getElementById("btn");
const frameQR = document.getElementById("frameQR");
const showScreenshot = document.getElementById("showScreenshot");
const getScreenshot = document.getElementById("getScreenshot");
const hideSB = document.getElementById("hideSB");

const qrCode = document.getElementById("qrCode");
socket.emit("joined"); // tell server that someone opened the page

socket.on("img", message => {
  console.log("Sent Image successful.");
  getScreenshot.disabled = false;
  console.log(showScreenshot.disabled);
  document.getElementById("myimg").src = message;
  document.getElementById("myimg").style.display = "none";
});

socket.on("urlData", message => {
  const unsafe = document.getElementById("unsafe");
  const domain = document.getElementById("domain");
  const spamming = document.getElementById("spamming");
  const malware = document.getElementById("malware");
  const phishing = document.getElementById("phishing");
  const suspicious = document.getElementById("suspicious");
  const adult = document.getElementById("adult");
  const risk_score = document.getElementById("risk_score");
  const category = document.getElementById("category");
  console.log(message);
  unsafe.textContent = "Unsafe: " + message[0];
  domain.textContent = "Domain: " + message[1];
  spamming.textContent = "Spamming: " + message[2];
  malware.textContent = "Malware: " + message[3];
  phishing.textContent = "Phishing: " + message[4];
  suspicious.textContent = "Suspicious: " + message[5];
  adult.textContent = "Adult: " + message[6];
  risk_score.textContent = "Risk score: " + message[7];
  category.textContent = "Category: " + message[8]; 
});

function onScanSuccess(decodedText, decodedResult) { 
  // Handle on success condition with the decoded text or result.
  myurl = decodedText;
  if(isValidURL(myurl)) {
    //socket.emit("url", myurl);
    myurl = myurl.replace("https://", "");
    myurl = myurl.replace("http://", "");
    console.log(myurl);
    output.href = "https://" + myurl;
    output.textContent = "https://" + myurl;
    console.log(output.textContent);
    socket.emit("url", myurl);
    goToScreenshot();
    getScreenshot.disabled = true;
  } else {
    output.textContent = "Invalid URL. Please try diffenrent QR code.";
  }  
  reader.style.display = "none";
  html5QrcodeScanner.clear();

  // ^ this will stop the scanner (video feed) and clear the scan area.
  //screenshot(decodedText);
  //document.getElementById("reader").style.display = "none";  
}

// handle on error condition, with error message
function onScanError(errorMessage) {
  //console.error(errorMessage);
  //output.textContent = "";
}

html5QrcodeScanner.render(onScanSuccess, onScanError);


function reScan() {
  reader.style.display = "block";
  html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 20, qrbox: 300});
  html5QrcodeScanner.render(onScanSuccess, onScanError);
  myChange();
}

function clearURL() {
  inputURL.value = "";
}


function getURL() {
  var temp = inputURL.value;
  if(isValidURL(temp)) {
    socket.emit("url", temp);
    //output.textContent = temp;
    console.log(output.href);
    console.log(temp);
    temp = temp.replace("https://", "");   
    temp = temp.replace("http://", "");
    output.href = "https://" + temp;
    output.textContent = "https://" + temp;
    console.log(output.href);
    goToScreenshot();
    getScreenshot.disabled = true;
    return;
  }
  output.textContent = "Invalid URL. Please try again. Thanks";
  inputURL.value = "";
}

inputURL.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    console.log('Enter key pressed');
    getURL();
  }
});

/*
var selectCamera = document.querySelector("#reader__dashboard_section_csr");
console.log(selectCamera.firstChild.tagName);
console.log(selectCamera.firstChild);
selectCamera.firstChild.style.background = "red";*/



navigator.permissions.query({name:'camera'}).then(res => {
  res.onchange = ((e)=>{
    // detecting if the event is a change
    if (e.type === 'change'){
      // checking what the new permissionStatus state is
      const newState = e.target.state
      if (newState === 'denied') {
        console.log('why did you decide to block us?')
      } else if (newState === 'granted') {
        console.log('We will be together forever!');
myChange();
      } else {
        console.log('Thanks for reverting things back to normal')
      }
    }
  })
})




function myChange() {
  const myInterval = setInterval(myTimer, 1000);

function myTimer() {
  var selectCamera0 = document.querySelector("#reader__camera_selection");
  console.log(selectCamera0 == null);
  console.log("wait 1s");
  if(selectCamera0 != null) {
    clearInterval(myInterval);
    console.log(selectCamera0.parentNode);
    selectCamera0.parentNode.style.display = "block";
    console.log(selectCamera0.parentNode.nextSibling.firstChild);
    console.log(selectCamera0.parentNode.nextSibling.lastChild);
    selectCamera0.parentNode.nextSibling.lastChild.className = "test";

    return;
  }
}

}

//myChange();



var selectCamera = document.querySelector("#reader__dashboard_section_csr");
console.log(selectCamera.firstChild.tagName);
//console.log(selectCamera.firstChild.firstChild.tagName);

try {
  console.log(selectCamera.firstChild.firstChild.tagName);
}
catch(err) {
  console.log(err);
  myChange();
}


function isValidURL(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  console.log(res !== null);
  return (res !== null);
};

frameQR.addEventListener("click", () => {
  reader.style.display = "block";
  btn.style.display = "block";
  frameQR.style.display = "none";
  reScan();
})
/*
frameQR.addEventListener("touchstart", () => {
  reader.style.display = "block";
  btn.style.display = "block";
  frameQR.style.display = "none";
  reScan();
})*/

function scanQRcode() {
  reader.style.display = "block";
  btn.style.display = "block";
  frameQR.style.display = "none";
  document.getElementById("clickme").style.display = "none";
  reScan();
}

function displaySS() {
  myimg.style.display = "block";
  showScreenshot.style.zIndex = "10";
  showScreenshot.style.opacity = "1";
  hideSB.classList.add("hideScrollBar"); 
  document.getElementById("banner").style.opacity = "0.1";
}

function hideSS() {
  showScreenshot.style.opacity = "0";
  showScreenshot.style.zIndex = "-10";
  hideSB.classList.remove("hideScrollBar");
  document.getElementById("banner").style.opacity = "1";
}

function goToScreenshot() {
  html5QrcodeScanner.clear();
  document.getElementById("getScreenshot").scrollIntoView();
}



