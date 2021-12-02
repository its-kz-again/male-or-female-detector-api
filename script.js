// cache (using local storage)
let localStorage = window.localStorage;

/*
* This method is used for get the form and info from html file
* and then call the check_name function for check name
*/
async function get_form(event){
  event.preventDefault();

  // for (var key in localStorage){
  //  console.log(key)
  // }

  let name = document.getElementById('name').value;
  check_name(name);
}

/*
* This method is used for (a get request for input name)
*/
async function get_request(name){
  let data, response;
  let gender, predicted_gender, probability;

try {
    if (localStorage.getItem(name)){
       // Retrieve from local storage
      gender = localStorage.getItem(name);
      // show answer in saved answer
      document.getElementById("save_answer_gender").innerHTML = gender;
    }

    response = await fetch( `https://api.genderize.io/?name=${name}`);
    // show error when request get network error - (Points and Extras)
    if (response.status >= 400){
      show_error("The request encountered a network error");
      return false;
    }
    else {
      // convert response to object in javascript
      data = await response.json();
      predicted_gender = data.gender;
      probability = data.probability;
      // document.getElementById("save_answer_gender").innerHTML = "";
    }

    // show error when no prediction for the name - (Points and Extras)
    if (predicted_gender === null){
      show_error("There is no prediction for this name");
    }

    else {
      set_prediction_data(predicted_gender, probability, name);
    }
   }
  catch (e) {
   console.log(e);
  }
}

/*
* This method is used for save the (name, gender) into local storage
*/
async function save_data(event){
  event.preventDefault();

  try {
    let predicted_gender = document.getElementById("predicted-gender").innerHTML;
    let probability = document.getElementById("probability").innerHTML;
    let name = document.getElementById("hidden_name").innerHTML;
    let saved_answer = document.getElementById("save_answer_gender").innerHTML;
    let gender;

    // recieve the gender from user
    try {
      gender = document.querySelector('input[name="gender"]:checked').value;
      // unchecked the checked radio button
      document.querySelector('input[name="gender"]:checked').checked = false;
    }
    catch (e){
      console.log(e);
      gender = null;
    }

    if (saved_answer.length != 0){
    // delete previous value for saved Answer
      // console.log(name);
      document.getElementById("save_answer_gender").innerHTML = "";
      localStorage.removeItem(name);
    }

    if (predicted_gender.length == 0){
      show_error("There is no prediction for save.");
    }
    else {
      if (gender == null){
        gender = predicted_gender;
      }
      // Store in local storage
      localStorage.setItem(name, gender);
      // notification : Data saved
      show_error("data saved.", "notification");
    }
  }
  catch (e) {
    console.log(e);
  }
}


/*
* This method is used for remove one pair (name , gender) from local storage
*/
async function clear_data(event){
    event.preventDefault();

  try {
      let name = document.getElementById("hidden_name").innerHTML;
      let saved_answer = document.getElementById("save_answer_gender").innerHTML;

      if (saved_answer.length == 0){
      show_error("saved answer is empty.", "notification");
      }
      else{
        // clear the info from local storage
        document.getElementById("save_answer_gender").innerHTML = "";
        localStorage.removeItem(name);
      }
    }
  catch (e){
    console.log(e);
  }
}


/*
* This method is used for set the predicted values into <p> tag html
*/
function set_prediction_data(gender, probability, name){
  document.getElementById("predicted-gender").innerHTML = gender;
  document.getElementById("probability").innerHTML = probability;
  // save the name into hidden <p> tag for (save and retrieve from local storage)
  document.getElementById("hidden_name").innerHTML = name;
}

/*
* This method is used to check if the name is valid or not.
* if name is valid call get_request function and return get_request
* else raise and show error
*/
function check_name(name){
  let regex = new RegExp("^[a-zA-Z ]*$");

  if (name.length == 0){
    show_error("You didn't enter your name.");
  }
  else if(name.length > 255){
    show_error("Your name is too long.(length(name) >  255)");
  }
  else if(regex.test(name)){
    get_request(name);
    return true;
  }
  else{
    show_error("Unauthorized characters are used in your name.");
  }
}

// class for MESSAGE box content
class MessageBox {

  constructor(id, time) {
    this.id = id;
    this.time = time;
  }

  /*
  * This method is used for show the message box
  */
  show(msg, label = "CLOSE", callback = null) {

    let t = this.time;

    let msgboxArea = document.querySelector(this.id);
    let msgboxBox = document.createElement("div");
    let msgboxContent = document.createElement("div");
    let msgboxClose = document.createElement("a");

    // Content area of the message box
    msgboxContent.classList.add("msgbox-content");
    msgboxContent.innerText = msg;

    // Close burtton of the message box
    msgboxClose.classList.add("msgbox-close");
    msgboxClose.setAttribute("href", "#");
    msgboxClose.innerText = label;

    // Container of the Message Box element
    msgboxBox.classList.add("msgbox-box");
    msgboxBox.appendChild(msgboxContent);
    msgboxBox.appendChild(msgboxClose);

    msgboxArea.appendChild(msgboxBox);

    // Close msgboxBox with click
    msgboxClose.addEventListener("click", (evt) => {
      evt.preventDefault();
      this.hide(msgboxBox, callback);
    });

    // set timeout for Close automatically msgboxBox
    if (t > 0) {
      this.msgboxTimeout = window.setTimeout(() => {
        this.hide(msgboxBox, callback);
      }, t);
    }

  }

  /*
  * This method is used for hide the message box
  */
  hide(msgboxBox, callback) {

  if (msgboxBox !== null) {
      // If the Message Box is not yet closed
      msgboxBox.classList.add("msgbox-box-hide");
    }

    msgboxBox.addEventListener("transitionend", () => {
      if (msgboxBox !== null) {
        // If the Message Box is not yet closed

        msgboxBox.parentNode.removeChild(msgboxBox);

        clearTimeout(this.msgboxTimeout);

        if (callback !== null) {
          // If the callback parameter is not null
          callback();
        }
      }
    });

  }
}

/*
* This method is used for show error and message
*/
function show_error(msg, err="error"){

  let msgboxbox = new MessageBox("#msgbox-area", 3000);

   msgboxbox.show(msg);

   if (err == "error"){
     // for delete gender and probability from previous prediction
     set_prediction_data("", "", "");
     // for don't show saved Answer
     document.getElementById("save_answer_gender").innerHTML = "";
   }

}
