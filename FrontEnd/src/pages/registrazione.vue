<script setup lang="ts">
    import { SignUp } from 'vue-clerk';
    sessionStorage.setItem('giaFatto', 'true'); // evita che la funzione che collega i database non avvenga continuamente
</script>

<template>
    <div class="container-fluid col-10">
        <div class="row text-center mb-3">
            <div class="d-flex justify-content-center align-items-center mt-4">
                <SignUp forceRedirectUrl="/" sign-in-url="/accesso"/>
            </div>  
        </div>
    </div>
</template>