import {updateEmailFromId, updateUsername, updateRoleName} from "../admin.js";

export function addAllEvents(element, category){ // utilise quand on change un valeur des tableaux administrateur
    var OGvalue; // valeur du champ avant le changement
    var change = false; // si on a changé la valeur ou pas
    var cancelled = false; // si on a annulé le changement ou pas
  
    element.addEventListener("focusin", (e) => {
      OGvalue = e.target.innerHTML;
    });
  
    element.addEventListener("focusout", (e) => {
      if (OGvalue != e.target.innerHTML && !change && !cancelled && e.target.innerHTML != "") {
        if(confirm("Voulez-vous vraiment changer cette valeur ? ")){ // selon la catégorie, on change la valeur
          // on pourrait changer le message de confirmation selon la catégorie, mais pas encore
          change = true;
          if(category == "email") 
            updateEmailFromId(element.id, e.target.innerHTML)
          else if(category == "username")
            updateUsername(element.id, e.target.innerHTML)
          else if(category == "role-rname")
            updateRoleName(element.id, e.target.innerHTML)
          else{
            console.log("error, category not found");
            return;
          }
        }
        else
          e.target.innerHTML = OGvalue;
      }
      else{
        console.log("we do nothing");
        cancelled = false;
      }
    });
  
    element.addEventListener("keydown", (e) => {
      if(e.keyCode == 13){
          if(OGvalue != e.target.innerHTML && !change && e.target.innerHTML != ""){
            if(confirm("Voulez-vous vraiment changer cette valeur ?")){
              change = true;
              cancelled = false;
              if(category == "email")
                updateEmailFromId(element.id, e.target.innerHTML);
              else if(category == "username")
                updateUsername(element.id, e.target.innerHTML);
              else if(category == "role-rname")
                updateRoleName(element.id, e.target.innerHTML);
              else{
                console.log("error, category not found");
                return;
                }
              element.blur();
            }
            else{
              cancelled = true;
              element.innerHTML = OGvalue;
              element.blur();
            }
          }
          else{
            cancelled = true;
            element.blur();
          }
      }
    });
  }

  