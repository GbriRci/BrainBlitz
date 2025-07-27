// parte di scripting del FrontEnd
import { createApp } from "vue";
import { createRouter, createWebHistory, Router } from "vue-router";
import { clerkPlugin } from "vue-clerk";
import "./styles/style.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// importazione delle pagine
import App from "./App.vue";
import Home from "./pages/home.vue";
import Amici from "./pages/amici.vue";
import Categorie from "./pages/categoria.vue";
import Badge from "./pages/badge.vue";
import Matchmaking from "./pages/matchmaking.vue";
import Esiti from "./pages/esiti.vue";
import Domanda from "./pages/domanda.vue";
import NotFound from "./pages/NotFound.vue";
import Accesso from "./pages/accedi.vue";
import Registrazione from "./pages/registrazione.vue";
import Risultati from "./pages/risultati.vue";
import Allenamento from "./pages/allenamento.vue";
import match_sfida from "./pages/match_sfida.vue";
// creazione del router
const router: Router = createRouter({
  history: createWebHistory(), // ricorda la rotta selezionata in precedenza
  // rotte con il componente da restituire
  routes: [
    { path: "/", component: Home },
    { path: "/accesso", component: Accesso },
    { path: "/registrazione", component: Registrazione },
    { path: "/amici", component: Amici },
    { path: "/categorie", component: Categorie },
    { path: "/badge", component: Badge },
    { path: "/matchmaking", component: Matchmaking },
    { path: "/esiti/:punteggio/:consecutive", component: Esiti},
    { path: "/domanda/:id_categoria", component: Domanda},
    { path: "/risultati/:id_categoria/:punteggio", component: Risultati},
    { path: "/allenamento/:id_categoria", component: Allenamento},
    { path: "/match_sfida/:username", component: match_sfida},
    { path: "/:pathMatch(.*)*", component: NotFound }
  ]
});
//importazione della chiave pubblica
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// creazione dell'app e come deve essere montata
createApp(App)
  .use(clerkPlugin, {publishableKey: PUBLISHABLE_KEY})
  .use(router)
  .mount("#app");