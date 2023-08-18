"use-strict";

import * as MAIL_CTRL from "../controller/rqst-user-send-email.js"

//form
const form = document.getElementById('form-contact');

//inputs
const civilite = document.getElementById('civilite'); 
const nom = document.getElementById('nom');
const email = document.getElementById('email');
const tel = document.getElementById('telephone');
const sujet = document.getElementById('sujet');
const message = document.getElementById('message');

//error messages
const invalidNom = document.getElementById('invalid-feedback-name');
invalidNom.style.display='none';

const invalidEmail = document.getElementById('invalid-feedback-email');
invalidEmail.style.display='none';

const invalidTel = document.getElementById('invalid-feedback-tel');
invalidTel.style.display='none';

const invalidSujet = document.getElementById('invalid-feedback-sujet');
invalidSujet.style.display='none';

const invalidMessage = document.getElementById('invalid-feedback-message');
invalidMessage.style.display='none';

//boolean pour savoir si on peut envoyer le formulaire
let isOkForSubmission = false;
let isNomOk = false;
let isEmailOk = false;
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
        // console.log("nom is : "+nom.value); //test
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
    if (e.target.id === 'email') {
        if (e.target.value.length == 0) {
            invalidEmail.innerHTML= 'L\'email ne peut pas être vide';
            invalidEmail.style.display='block'; 
            email.style.borderBottom = '1px solid red'; 
        } else if (!e.target.value.includes('@') || !e.target.value.includes('.')) {
            invalidEmail.innerHTML= 'L\'email doit contenir un @ et un .';
            invalidEmail.style.display='block'; 
            email.style.borderBottom = '1px solid red'; 
        }
        else{
            invalidEmail.style.display='none';
            email.style.borderBottom = '1px solid #45a9d6';
            isEmailOk = true;
            return;
        }
        isEmailOk = false;
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
            return; // return ici pour garder isTelOk = true et ne pas le mettre a false en sortant du if
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
    
});


form.addEventListener('submit', (e) => {
    resMessage.style.display='none';
    
    if(isNomOk && isEmailOk && isTelOk && isSujetOk && isMessageOk){
        isOkForSubmission = true;
    }
    if(isOkForSubmission){
        e.preventDefault();

        //appelle une fonction async
        sendingEmail(civilite.value, nom.value, email.value, tel.value, sujet.value, message.value, isOkForSubmission); 
        isOkForSubmission = false;
        isNomOk = false;
        isEmailOk = false;
        isTelOk = false;
        isSujetOk = false;
        isMessageOk = false;
    }
    e.preventDefault();
});

async function sendingEmail(civiliteE, nomE, emailE, telE, sujetE, messageE, isOkInstance){ 
    const sendingEmail = new MAIL_CTRL.RequestEmailSent(civiliteE, nomE, emailE, telE, sujetE, messageE); 
    const stateSend = await sendingEmail.sendEmail();

    if(!isOkInstance){ 
        // console.log("instance non ok");
        resMessage.innerHTML = "Veuillez remplir correctement tous les champs";
        resMessage.style.display = "block";
        resMessage.style.color = "red";
        return;
    }
    if(stateSend){
            nom.value = "";
            email.value = "";
            tel.value = "";
            sujet.value = "";
            message.value = "";

            // console.log("mail envoyé");
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