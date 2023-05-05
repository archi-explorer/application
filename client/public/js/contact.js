"use-strict";

import * as MAIL_CTRL from "../controller/rqst-user-send-email.js"

//form
const form = document.getElementById('form-contact');

//inputs
const civilite = document.getElementById('civilite'); 
const nom = document.getElementById('nom');
const tel = document.getElementById('telephone');
const sujet = document.getElementById('sujet');
const message = document.getElementById('message');
// le email sera rempli cote serveur

//error messages
const invalidNom = document.getElementById('invalid-feedback-name');
invalidNom.style.display='none';

const invalidTel = document.getElementById('invalid-feedback-tel');
invalidTel.style.display='none';

const invalidSujet = document.getElementById('invalid-feedback-sujet');
invalidSujet.style.display='none';

const invalidMessage = document.getElementById('invalid-feedback-message');
invalidMessage.style.display='none';

//boolean pour savoir si on peut envoyer le formulaire
let isOkForSubmission = false;
let isNomOk = false;
let isTelOk = false;
let isSujetOk = false;
let isMessageOk = false;

// message res
const resMessage = document.getElementById('form-res-message');
resMessage.style.display='none';

//events
form.addEventListener('focusin', (e) => {
    resMessage.style.display='none';
});


form.addEventListener('focusout', (e) => {
    if (e.target.id === 'nom') {
        console.log("nom is : "+nom.value); //test
        if (e.target.value.length == 0) {
            invalidNom.innerHTML= 'Le nom ne peut pas être vide';
            invalidNom.style.display='block'; 
            nom.style.borderBottom = '1px solid red'; 
        } 
        else{
            invalidNom.style.display='none';
            nom.style.borderBottom = '1px solid #45a9d6';
            isNomOk = true;   
            return;
        }
        isNomOk = false;
    }
    if (e.target.id === 'telephone') { 
        if (isNaN(e.target.value)) { //pas numerique
            invalidTel.innerHTML= 'Le numéro de téléphone doit être numérique';
            invalidTel.style.display='block';
            tel.style.borderBottom = '1px solid red';
        } else if (e.target.value.length == 0) {
            invalidTel.innerHTML= 'Le numéro de téléphone ne peut pas être vide';
            invalidTel.style.display='block'; 
            tel.style.borderBottom = '1px solid red'; 
        } else if(e.target.value.length != 10 || e.target.value[0] != '0'){
            invalidTel.innerHTML= 'Le numéro de téléphone doit contenir 10 chiffres et commencer par 0';
            invalidTel.style.display='block'; 
            tel.style.borderBottom = '1px solid red'; 
        }
        else{
            invalidTel.style.display='none';
            tel.style.borderBottom = '1px solid #45a9d6';
            isTelOk = true;
            return; // pourquoi un return ici? pour garder isTelOk = true et ne pas le mettre a false en sortant du if
        }
        isTelOk = false;
    }
    if (e.target.id === 'sujet') {
        if (e.target.value.length == 0) {
            invalidSujet.innerHTML= 'Le sujet ne peut pas être vide';
            invalidSujet.style.display='block'; 
            sujet.style.borderBottom = '1px solid red'; 
        }
        else{
            invalidSujet.style.display='none';
            sujet.style.borderBottom = '1px solid #45a9d6';
            isSujetOk = true;
            return;
        }
        isSujetOk = false;

    }
    if (e.target.id === 'message') {
        if (e.target.value.length == 0) {
            invalidMessage.innerHTML= 'Le message ne peut pas être vide';
            invalidMessage.style.display='block'; 
            message.style.borderBottom = '1px solid red'; 
        } else if(e.target.value.length < 10 || e.target.value.length > 500){
            invalidMessage.innerHTML= 'Le message doit contenir entre 10 et 500 caractères';
            invalidMessage.style.display='block'; 
            message.style.borderBottom = '1px solid red'; 
        }
        else{
            invalidMessage.style.display='none';
            message.style.borderBottom = '1px solid #45a9d6';
            isMessageOk = true;
            return;
        }
        isMessageOk = false;
    }
    console.log("end of focusout");
    console.log("isNomOk focusout: " + isNomOk);
    console.log("isTelOk focusout: " + isTelOk);
    console.log("isSujetOk focusout: " + isSujetOk);
    console.log("isMessageOk focusout: " + isMessageOk);
});


form.addEventListener('submit', (e) => {
    resMessage.style.display='none';
    console.log("submit");
    console.log("nom ok?:"+isNomOk);
    console.log("tel ok?:"+isTelOk);
    console.log("sujet ok?:"+isSujetOk);
    console.log("message ok?:"+isMessageOk);
    console.log("isOkForSubmission?:"+isOkForSubmission);
    
    if(isNomOk && isTelOk && isSujetOk && isMessageOk){
        isOkForSubmission = true;
    }
    if(isOkForSubmission){
        e.preventDefault();

        //appelle une fonction async
        sendingEmail(civilite.value, nom.value, tel.value, sujet.value, message.value, isOkForSubmission); 
        isOkForSubmission = false;
        isNomOk = false;
        isTelOk = false;
        isSujetOk = false;
        isMessageOk = false;
    }
    e.preventDefault();
});

// alert(); -----> pop up
async function sendingEmail(civiliteE, nomE, telE, sujetE, messageE, isOkInstance){ 
    const sendingEmail = new MAIL_CTRL.RequestEmailSent(civiliteE, nomE, telE, sujetE, messageE); 
    const stateSend = await sendingEmail.sendEmail();

    if(!isOkInstance){ 
        console.log("instance non ok");
        resMessage.innerHTML = "Veuillez remplir correctement tous les champs";
        resMessage.style.display = "block";
        resMessage.style.color = "red";
        return;
    }
    if(stateSend){
            // window.location.reload();
            //au lieu de reload, on vide les champs du formulaire
            // et on affiche un message de confirmation
            nom.value = "";
            tel.value = "";
            sujet.value = "";
            message.value = "";

            console.log("mail envoyé");
            resMessage.innerHTML = "Votre message a bien été envoyé";
            resMessage.style.display = "block";
            resMessage.style.color = "green";
        }
        else {
            console.log("mail non envoyé");
            resMessage.innerHTML = "Votre message n'a pas pu être envoyé";
            resMessage.style.display = "block";
            resMessage.style.color = "red";
        }
}