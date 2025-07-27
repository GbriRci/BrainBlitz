<script setup lang="ts">
    import { ref, watchEffect } from 'vue';
    import { ClerkLoaded, useAuth, UserButton } from 'vue-clerk';
    import { useRoute } from 'vue-router';

    const { isSignedIn } = useAuth(); // isSignedIn è un booleano che indica se l'utente è loggato
    const isUserSignedIn = ref(isSignedIn.value);

    watchEffect(() => { // ogni volta che cambia il valore di isSignedIn, cambia anche il valore di isUserSignedIn
      isUserSignedIn.value = isSignedIn.value;
    });

    // pagine dove non si vede il burger menù e disabilita i link della navbar
    const route = useRoute();
    const isSpecialPage = ref(false); // booleano che indica se la pagina corrente è una pagina speciale
    watchEffect(() => {
        //rotte delle pagine speciali
        const specialPages = ['/matchmaking', '/domanda/:id_categoria', '/esiti/:punteggio', '/match_sfida/:username']; 
        // controlla se la pagina corrente è una pagina speciale, se trova una corrispondenza viene impostato a true
        isSpecialPage.value = specialPages.some(page => {
            // costruisce una regex (sequenza di caratteri speciale), costruita sostituendo i parametri dinamici con una sequenza di caratteri che non contenga lo slash
            const regex = new RegExp(`^${page.replace(/:id_categoria|:punteggio|:username/g, '[^/]+')}$`);
            // controlla se il path della rotta corrente corrisponde alla regex
            return regex.test(route.path);
        }
    )});
</script>

<template>
    <header>
        <nav class="navbar navbar-expand-lg p-0 navbar-dark mb-3">
            <div class="container-fluid col-11 d-flex justify-content-between">
                <div class="d-flex align-items-center" :class="{'disabled-link': isSpecialPage}">
                    <a href="/"> <img src="./img/logo.png" alt="Logo" class="logo rounded-circle img-fluid "></a> <!-- Logo -->
                    <div class="linea mx-3 d-none d-sm-block"></div> <!-- Linea verticale -->
                    <a href="/" class="navbar-brand text-reset mt-1 ms-2 honk-uniquifier d-none d-sm-block">Brain Blitz</a>
                </div>
                <button v-if="isUserSignedIn && !isSpecialPage" class="burgerMenu navbar-toggler border-0" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon p-3"></span>
                </button>
                <div v-if="isUserSignedIn && !isSpecialPage" class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item align-self-end mb-1 d-lg-none d-lg-block">
                            <a class="nav-link fw-bold HOME" href="/">Home</a>
                        </li>
                        <li class="nav-item align-self-end mb-1">
                            <a class="nav-link fw-bold AMICI" href="/amici">Amici</a>
                        </li> 
                        <li class="nav-item align-self-end mb-1">
                            <a class="nav-link fw-bold BADGE" href="/badge">Badge</a>
                        </li>
                        <li class="nav-item nav-link align-self-end">
                            <UserButton after-sign-out-url="/accesso"></UserButton>
                        </li>
                        <div class="linea linea2 text-center mx-4 d-none d-lg-block"></div>
                        <a href="/"><span class="homelogo d-none d-lg-block material-symbols-outlined text-white">home</span></a>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    
    <main>
        <ClerkLoaded> <!--se clerck è stato caricato-->
            <router-view /> <!-- in base alla rotta, mostra la pagina -->
        </ClerkLoaded>
    </main>
    
    <footer class="mt-3">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 text-center mt-3">
                    Brain Blitz 2024/25
                    <br>
                    Caroli Sofia - Passini Anna - Ricci Gabriele
                </div>
            </div>
        </div>
    </footer>
</template>

