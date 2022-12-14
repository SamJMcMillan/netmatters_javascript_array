// Sets up essential variables for use in this code.
const emailPopup = document.getElementById("email-error");
const imgPopup = document.getElementById("image-error");
const refreshBtn = document.getElementById("refresh");
const chooseBtn = document.getElementById("submit");
// As Picsum has a max id # of 1084, we are picking a random id from 1-1084.
let randomId = 1 + Math.floor(Math.random() * 1084);
let currentImage = "https://picsum.photos/id/" + randomId + "/300";
let imageArray = [];
// Used to determine whether the selected images need updating after the updateDatabase function
let dueUpdate = false;

// Developer switch, for when I need to reset sessionStorage for testing.
let reset = false;

// Creates the class that will be used to construct the imageObjects later.
class ImageObject {
  constructor(email, images) {
    this.email = email;
    this.images = images;
  }
}

// This function returns a url's status code.
UrlExists = (url, cb) => {
  jQuery.ajax({
    // Prepares the properties of the url
    url: url,
    dataType: "text",
    type: "GET",
    // the function below makes a xhr request to the url and returns it's status code
    // The function inside UrlExists can then be completed where UrlExists is triggered
    complete: function (xhr) {
      if (typeof cb === "function") cb.apply(this, [xhr.status]);
    },
  });
};

// randomizes the image id and replaces the currentImage with it
refreshImage = () => {
  randomId = 1 + Math.floor(Math.random() * 1084);
  currentImage = `https://picsum.photos/id/${randomId}/300`;
  document.getElementById("current-image").src = currentImage;
  //Calls the status code checking function from line 22
  UrlExists(currentImage, function (status) {
    // Tests if the status code is below 400, thus a success
    if (status < 400) {
      console.log("pass");
      // Or above 400, a failure
    } else if (status >= 400) {
      refreshImage();
    }
  });
};
refreshBtn.addEventListener("click", refreshImage);

loadOnStart = () => {
  // Checks if the placeholder email is the only thing in the array and ignores it if so
  if (imageArray[0].email === "") {
    console.log("nothing to see here");
  } else {
    // Loops through each object in imageArray
    for (let i = 0; i < imageArray.length; i++) {
      // for each item, create the email as a header
      $("#slides-wrap").append(
        `<h3 class='title-${i}'>${imageArray[i].email}</h3>`
      );
      // And create the tiny-slider div
      $("#slides-wrap").append(`<div class='tiny-slide slider-${i}'>`);
      // Loops through each item in the images array inside the imageArray objects
      for (let j = 0; j < imageArray[i].images.length; j++) {
        // Creates the div inside the tiny slider divs that contains the images
        $(".slider-" + i).append(
          `<div><img class='slider-img' src='
            ${imageArray[i].images[j]}'>
            </div>
          </div>`
        );
      }
    }
  }
  refreshImage();
};

// resets the code when reset (a few lines above) is set to true.
if (reset) {
  imageArray.push({ email: "", images: [] });
  sessionStorage.setItem("imageArray", JSON.stringify(imageArray));
  refreshImage();
  // If there is nothing in sessionStorage, create the empty placeholder array.
} else if (sessionStorage.getItem("imageArray") === null) {
  imageArray.push({ email: "", images: [] });
  refreshImage();
  // If there is data in sessionStorage, update imageArray on page load.
} else {
  imageArray = JSON.parse(sessionStorage.getItem("imageArray"));
  loadOnStart();
}

// Hides the email popup by deault, and sets the image on the homepage.
emailPopup.style.display = "none";
imgPopup.style.display = "none";

// Standard email regex, code mostly borrowed from my portfolio project.
validateForm = () => {
  let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  let emailInput = $("#email-field").val().trim();
  if (!emailPattern.test(emailInput)) {
    $(emailPopup).slideDown(400).delay(2000).slideUp(400);
  } else {
    updateDatabase(emailInput);
  }
};
chooseBtn.addEventListener("click", validateForm);

updateDatabase = (email) => {
  // constructs the currentImage data as a local variable for use in this function.
  const currentImg = $("#current-image").attr("src");
  // This variable will be used by the code to determine when a new object needs to
  // be constructed.
  let newObject = false;
  // Loops through all the items in imageArray and runs the if statement for each.
  for (let i = 0; i < imageArray.length; i++) {
    // The loop checks whether an object with the same email value as the one
    // submitted is present, in order to prevent duplicates. It also checks if
    // the only object present is the blank placeholder object.
    if (imageArray[i].email === email || imageArray[i].email === "") {
      if (imageArray[i].images.includes(currentImage)) {
        $(imgPopup).slideDown(400).delay(2000).slideUp(400);
        imageArray[i].email = email;
        newObject = false;
        dueUpdate = false;
        console.log("image ignored");
        break;
      } else {
        imageArray[i].email = email;
        // The image is then pushed to the image array in the imageObject.
        imageArray[i].images.push(currentImg);
        newObject = false;
        dueUpdate = true;
        console.log("image saved");
        // The code breaks the loop, so that it can't create duplicates
        break;
      }
    } else {
      // if no email of the same name is found, the newObject value is changed to true.
      newObject = true;
    }
  }

  // if the newObject value is changed to true in the previous code, this code below triggers.
  if (newObject) {
    // Creates the new object and adds it to imageArray.
    const newObject = new ImageObject(email, [currentImg]);
    dueUpdate = true;
    imageArray.push(newObject);
  }

  // Updates the imageArray in the sessionStorage, so it is saved after a page refresh.
  sessionStorage.setItem("imageArray", JSON.stringify(imageArray));

  constructSlides(email);
};

constructSlides = (email) => {
  console.log(email);
  if (dueUpdate === true) {
    // Like last function, the code is looping through every item in the array.
    for (let i = 0; i < imageArray.length; i++) {
      // The code checks whether the headers already exist or not.
      // NEEDS TO MATCH emailInput
      console.log("selected images updated");
      if ($(".title-" + i).text() === email) {
        $(".slider-" + i).append(
          `<div><img class='slider-img' src='${
            imageArray[i].images[imageArray[i].images.length - 1]
          }'></div>`
        );
      }
      if ($(".title-" + i).length <= 0) {
        // Appends the title in the 'Selected Images' section of the page.
        $("#slides-wrap").append(
          `<h3 class='title-${i}'>${imageArray[i].email}</h3>`
        );
        // Appends the tiny slider in below the title.
        $("#slides-wrap").append(
          `<div class='tiny-slide slider-${i}'>
      <div>
      <img class='slider-img' src='${
        imageArray[i].images[imageArray[i].images.length - 1]
      }'>
        </div>
      </div>`
        );
      }
    }
  }
};
