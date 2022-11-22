const emailPopup = document.getElementById("email-error");

emailPopup.display = "none";

function validateForm() {
  let emailPattern =
    /^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
  let emailInput = $(".email-input").val().trim();
  if (!emailPattern.test(emailInput)) {
    console.log("failed");
  }
}
