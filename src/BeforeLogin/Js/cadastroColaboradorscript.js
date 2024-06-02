document.getElementById('open_btn').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('main');
    
    sidebar.classList.toggle('open-sidebar');
    main.classList.toggle('expanded');
});

const inputIcon = document.querySelector(".input__icon");
const inputIcon2 = document.querySelector(".input__icon2");
const inputPassword = document.getElementById("password");
const inputConfirmedPassword = document.getElementById("ConfirmedPassword");

inputIcon.addEventListener("click", () => {
  inputIcon.classList.toggle("ri-eye-off-line");
  inputIcon.classList.toggle("ri-eye-line");
  inputPassword.type = inputPassword.type === "password" ? "text" : "password";
});

inputIcon2.addEventListener("click", () => {
  inputIcon2.classList.toggle("ri-eye-off-line");
  inputIcon2.classList.toggle("ri-eye-line");
  inputConfirmedPassword.type = inputConfirmedPassword.type === "password" ? "text" : "password";
});

const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Choose an image";
pictureImage.innerHTML = pictureImageTxt;

inputFile.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      const readerTarget = e.target;

      const img = document.createElement("img");
      img.src = readerTarget.result;
      img.classList.add("picture__img");

      pictureImage.innerHTML = "";
      pictureImage.appendChild(img);
    });

    reader.readAsDataURL(file);
  } else {
    pictureImage.innerHTML = pictureImageTxt;
  }
});

