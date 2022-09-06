var socket = io();

socket.emit("joined"); // tell server that someone opened the page

socket.on("joined", () => { // when server tells client that someone has opened the page
  console.log("someone joined");
});
socket.on("leave", () => {
  console.log("someone left"); // when server tells client that someone has closed the page
});
socket.on("img", message => {
  console.log("Sent Image successful.");
  console.log(message);
  //console.log(document.getElementById("myimg").src);
  //document.getElementById("myimg").src = "data:image/jpeg;base64, " + message;
  document.getElementById("myimg").src = message;
  document.getElementById("myimg").style.display = "block";
  //console.log(document.getElementById("myimg").style.display);
});

var myurl = "";
var html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250});
const output = document.getElementById("output");
    
function onScanSuccess(decodedText, decodedResult) {
    // Handle on success condition with the decoded text or result.
    /*console.log(`Scan result: ${decodedText}`, decodedResult);
    console.log(decodedText);
    console.log(decodedText);*/
    console.log(typeof(decodedText));
    myurl = decodedText;
try {
  const url = new URL(myurl);
  console.log(url.hostname); // Logs: 'developer.mozilla.org'
  socket.emit("url", myurl);
  output.textContent = temp;
} catch (error) {
  console.log(myurl);
  output.textContent = myurl;
}

    // ...
    html5QrcodeScanner.clear();
    // ^ this will stop the scanner (video feed) and clear the scan area.
    //screenshot(decodedText);
    //document.getElementById("reader").style.display = "none";
  
}

html5QrcodeScanner.render(onScanSuccess);


function reScan() {
  console.log("test");
  myChange();
html5QrcodeScanner.render(onScanSuccess);
}

const inputURL = document.getElementById("url");
function getURL() {
  var temp = inputURL.value;
  if(isValidURL(temp)) {
    socket.emit("url", temp);
    output.textContent = temp;
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
  return (res !== null)
};