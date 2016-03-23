var currentUser;

$(document).ready(function(){

  // Retrieve login information
  $("#loginCE").submit(function( event ) {
    var email = $("#email").val();
    var password = $("#password").val();

    loginCE(email, password);
    event.preventDefault();
  });

  // Save a note
  $("#saveNote").submit(function( event ) {
    var subject = $("#subject").val();
    var notebook = $("#notebook").val();
    var body = $("#body").val();
    var tags = $("#tags").val();
    saveNote(subject, notebook, body, tags);
    event.preventDefault();
  });

  var xhr = new XMLHttpRequest();
  xhr.open("GET", 'http://localhost:1337/api/users/56edbb745da4ce9ea00313a8/notebooks/own', true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState == 4 && xhr.status == 200) {
      var notebooksJSON = JSON.parse(xhr.responseText);

      for (var i = 0; i < notebooksJSON.length; i++) {
        var notebook = "<option>" + notebooksJSON[i].title + "</option>"
        $(notebook).appendTo("#notebook");
      }
    }
  }

  xhr.send();

  // grab highlighted text from the page
  // set up an event listener that triggers when chrome.extension.sendRequest is fired.
  chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
      // text selection is stored in request.selection
      $('textarea').val( request.selection );
  });

  chrome.tabs.executeScript(null, {code: "chrome.extension.sendRequest({selection: window.getSelection().toString() });"});

});

// Login to the chrome extension
function loginCE(email, password) {
  var params = {
    email: email,
    password: password
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'http://localhost:1337/login', true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Content-length", params.length);
  xhr.setRequestHeader("Connection", "close");

  xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState == 4 && xhr.status == 200) {
      changePopup('addANote.html')
    }
  }
  xhr.send(JSON.stringify(params));
}

// Change to the correct view
function changePopup(url) {
  window.location.href = url;
  chrome.browserAction.setPopup({
      popup: url
  });
}

// Save a note to notebook
function saveNote(subject, notebook, body, tags) {
  var params = {
    subject: subject,
    notebook: notebook,
    body: body,
    tags: tags
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'http://localhost:1337/api/users/56edbb745da4ce9ea00313a8/notebooks/56edbb745da4ce9ea0031377/notes/', true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      window.location.href = 'noteSaved.html';
    }
  }
  xhr.send(JSON.stringify(params));
}

