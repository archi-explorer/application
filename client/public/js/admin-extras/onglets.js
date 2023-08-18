"use-strict";

/**
 * Gestion des onglets utilisateurs et roles
 */

export function ongletSetup(onglets, contenu) {
  let index = 0;

  onglets.forEach((onglet) => {
    onglet.addEventListener("click", () => {
      if (onglet.classList.contains("active")) {
        return;
      } else {
        onglet.classList.add("active");
      }

      index = onglet.getAttribute("data-anim");
      // console.log(index);

      for (var i = 0; i < onglets.length; i++) {
        if (onglets[i].getAttribute("data-anim") != index) {
          onglets[i].classList.remove("active");
        }
      }

      for (var j = 0; j < contenu.length; j++) {
        if (contenu[j].getAttribute("data-anim") == index) {
          contenu[j].removeAttribute("hidden");
          contenu[j].classList.add("actifContenu");
        } else {
          contenu[j].setAttribute("hidden", "true");
          contenu[j].classList.remove("actifContenu");
        }
      }
    });
  });
}
