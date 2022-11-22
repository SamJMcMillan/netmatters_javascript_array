const emailPopup = document.getElementById("email-error");
var randomId = 1 + Math.floor(Math.random() * 1084);
var currentImage = "https://picsum.photos/id/" + randomId + "/300";
var imageArray = {
  name: "",
  images: [],
};

emailPopup.style.display = "none";
document.getElementById("current-image").src = currentImage;

refreshImage = () => {
  randomId = 1 + Math.floor(Math.random() * 1084);
  currentImage = "https://picsum.photos/id/" + randomId + "/300";
  document.getElementById("current-image").src = currentImage;
};

validateForm = () => {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  let emailInput = $("#email-field").val().trim();
  if (!emailPattern.test(emailInput)) {
    $(emailPopup).slideDown(400).delay(2000).slideUp(400);
    return false;
  } else {
    imageArray.name = emailInput;
    imageArray.images.push(currentImage);
    $(".slides-wrap").append(
      "<div class='slide-" + emailInput + "'><h3>" + emailInput + "</h3>",
      "<img src=" + imageArray.images[0] + "></div>"
    );
    randomId = 1 + Math.floor(Math.random() * 1084);
    currentImage = "https://picsum.photos/id/" + randomId + "/300";
    document.getElementById("current-image").src = currentImage;
    return true;
  }
};

// have a slider display images in array

// may need an array of all email entries, which in turn have their own image arrays
// use objects with name and imageArray values
// use innerHTML to display each individual email entry object in .slides-wrap
