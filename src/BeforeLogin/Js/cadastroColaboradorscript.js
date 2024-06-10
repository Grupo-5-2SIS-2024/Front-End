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

// Cadastro do colaborador

async function cadastrarColaborador(){
  const nomeElement = document.getElementById("nome");
  const sobrenomeElement = document.getElementById("sobrenome");
  const emailElement = document.getElementById("email");
  const telefoneElement = document.getElementById("telefone");
  const cpfElement = document.getElementById("cpf");
  const dataNascimentoElement = document.getElementById("dataNascimento");
  const especialidadeElement = document.getElementById("especialidade");
  const carteirinhaElement = document.getElementById("carteirinha");
  const passwordElement = document.getElementById("password");
  const confirmedPasswordElement = document.getElementById("confirmedPassword");
  const nivelAcessoElement = document.getElementById("nivelAcesso");

  if (!nomeElement || !sobrenomeElement || !emailElement || !telefoneElement || !cpfElement || 
      !dataNascimentoElement || !especialidadeElement || !carteirinhaElement || 
      !passwordElement || !confirmedPasswordElement || !nivelAcessoElement) {
    alert("Todos os campos devem estar preenchidos.");
    return;
  }

  const nomeDigitado = nomeElement.value;
  const sobrenomeDigitado = sobrenomeElement.value;
  const emailDigitado = emailElement.value;
  const telefoneDigitado = telefoneElement.value;
  const cpfDigitado = cpfElement.value;
  const dataNascimentoDigitada = dataNascimentoElement.value;
  const especialidadeDigitada = especialidadeElement.value;
  const carteirinhaDigitada = carteirinhaElement.value;
  const senhaDigitada = passwordElement.value;
  const confirmedPasswordDigitada = confirmedPasswordElement.value;
  const nivelAcessoEscolhido = nivelAcessoElement.value;

  if(senhaDigitada !== confirmedPasswordDigitada){
      alert("As senhas não coincidem.");
      return;
  }

  const dadosColaborador = {       
      "nome": nomeDigitado, 
      "sobrenome": sobrenomeDigitado,
      "email": emailDigitado,
      "telefone": telefoneDigitado,
      "cpf": cpfDigitado,
      "dataNascimento": dataNascimentoDigitada,
      "especificacaoMedica": {
          "id": especialidadeDigitada
      },
      "carterinha": carteirinhaDigitada,
      "senha": senhaDigitada,
      "ativo": true,
      "permissao": {
          "id": nivelAcessoEscolhido
      }
  };

  try {
    const respostaCadastro = await fetch("http://localhost:8080/medicos", {
        method: "POST",
        body: JSON.stringify(dadosColaborador),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });

    if(respostaCadastro.status == 201){
        window.location.href = "listagemColaborador.html";
    }else{
        alert("Ocorreu um erro ao cadastrar");
    }
  } catch (error) {
    alert("Ocorreu um erro ao tentar cadastrar: " + error.message);
  }
}

