<template>
    <div class="container-fluid col-10">
        <div class="riga py-0 text-center">
            <h1 class="not_found col-12">404</h1> 
            <h2 class="not_found">Page not found</h2> 
            <h3 class="not_found mt-4">Oops! Sembra che tu abbia perso la strada...</h3>
            <div class="mt-4">
                <img src="../img/404.png" alt="Image" class="not_found">
            </div>
            <button class="bottone mt-5 fs-5 col-12 col-sm-6 my-5 justify-content-center mx-auto" @click="$router.push('/')">Torna alla home</button>
        </div>
    </div>
</template>
  