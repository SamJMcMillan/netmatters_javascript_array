const emailPopup = document.getElementById("email-error");
var currentImage = document.getElementById("current-image");

emailPopup.style.display = "none";

function validateForm() {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  let emailInput = $("#email-field").val().trim();
  if (!emailPattern.test(emailInput)) {
    $(emailPopup).slideDown(400).delay(2000).slideUp(400);
    return false;
  } else {
    $(imageArray).append(currentImage);
    return true;
  }
}

// identify the current image
// append it to the array
// have a slider display images in array
