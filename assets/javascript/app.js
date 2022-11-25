// Sets up essential variables for use in this code.
const emailPopup = document.getElementById("email-error");
// As Picsum has a max id # of 1084, we are picking a random id from 1-1084.
let randomId = 1 + Math.floor(Math.random() * 1084);
let currentImage = "https://picsum.photos/id/" + randomId + "/300";
let imageArray = [];

// Developer switch, for when I need to reset sessionStorage for testing.
let reset = false;

// Creates the class that will be used to construct the imageObjects later.
class ImageObject {
  constructor(email, images) {
    this.email = email;
    this.images = images;
  }
}

loadOnStart = () => {
  // Checks if the placeholder email is the only thing in the array and ignores it if so
  if (imageArray[0].email === "") {
    console.log("nothing to see here");
  } else {
    // Loops through each object in imageArray
    for (let i = 0; i < imageArray.length; i++) {
      // for each item, create the email as a header
      $("#slides-wrap").append(
        "<h3 class='title-" + i + "'>" + imageArray[i].email + "</h3>"
      );
      // And create the tiny-slider div
      $("#slides-wrap").append("<div class='tiny-slide slider-" + i + "'>");
      // Loops through each item in the images array inside the imageArray objects
      for (let j = 0; j < imageArray[i].images.length; j++) {
        // Creates the div inside the tiny slider divs that contains the images
        $(".slider-" + i).append(
          "<div><img class='slider-img' src='" +
            imageArray[i].images[j] +
            "'></div>",
          "</div>"
        );
      }
    }
  }
};

// resets the code when reset (a few lines above) is set to true.
if (reset) {
  imageArray.push({ email: "", images: [] });
  sessionStorage.setItem("imageArray", JSON.stringify(imageArray));
  // If there is nothing in sessionStorage, create the empty placeholder array.
} else if (sessionStorage.getItem("imageArray") === null) {
  imageArray.push({ email: "", images: [] });
  // If there is data in sessionStorage, update imageArray on page load.
} else {
  imageArray = JSON.parse(sessionStorage.getItem("imageArray"));
  loadOnStart();
}

// Hides the email popup by deault, and sets the image on the homepage.
emailPopup.style.display = "none";
document.getElementById("current-image").src = currentImage;

// Code for the refresh button, which redoes the random image process above.
refreshImage = () => {
  randomId = 1 + Math.floor(Math.random() * 1084);
  currentImage = "https://picsum.photos/id/" + randomId + "/300";
  document.getElementById("current-image").src = currentImage;
};

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
      // If the if statement is found to be true, then the following code triggers.
      // Since the object that triggers the it statement *could* be the blank
      // placeholder object, the email is set to the emailInput just in case.
      imageArray[i].email = email;
      // The image is then pushed to the image array in the imageObject.
      imageArray[i].images.push(currentImg);
      newObject = false;
      // The code breaks the loop, so that it can't create duplicates
      break;
    }
    // if no email of the same name is found, the newObject value is changed to true.
    newObject = true;
  }

  // if the newObject value is changed to true in the previous code, this code below triggers.
  if (newObject) {
    // Creates the new object and adds it to imageArray.
    const newObject = new ImageObject(email, [currentImg]);
    imageArray.push(newObject);
  }

  // Updates the imageArray in the sessionStorage, so it is saved after a page refresh.
  sessionStorage.setItem("imageArray", JSON.stringify(imageArray));

  constructSlides(email);
};

constructSlides = (email) => {
  console.log(email);

  // Like last function, the code is looping through every item in the array.
  for (let i = 0; i < imageArray.length; i++) {
    // The code checks whether the headers already exist or not.
    // NEEDS TO MATCH emailInput
    if ($(".title-" + i).text() === email) {
      console.log($(".title-" + i).text());
      console.log("poggers");
      $(".slider-" + i).append(
        "<div><img class='slider-img' src='" +
          imageArray[i].images[imageArray[i].images.length - 1] +
          "'></div>"
      );
    }
    if ($(".title-" + i).length <= 0) {
      console.log("he is pogging");
      // Appends the title in the 'Selected Images' section of the page.
      $("#slides-wrap").append(
        "<h3 class='title-" + i + "'>" + imageArray[i].email + "</h3>"
      );
      // Appends the tiny slider in below the title.
      $("#slides-wrap").append(
        "<div class='tiny-slide slider-" + i + "'>",
        "<div><img class='slider-img' src='" +
          imageArray[i].images[imageArray[i].images.length - 1] +
          "'></div>",
        "</div>"
      );
    }
  }

  // Randomizes the image again, using the same code as the refresh button.
  randomId = 1 + Math.floor(Math.random() * 1084);
  currentImage = "https://picsum.photos/id/" + randomId + "/300";
  document.getElementById("current-image").src = currentImage;
};
