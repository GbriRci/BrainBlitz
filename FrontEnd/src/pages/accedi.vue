<script lang="ts" setup>
    import { SignIn } from 'vue-clerk';
</script>

<template>
    <div class="container-fluid col-10">
        <div class="d-flex justify-content-center mt-5">
            <SignIn after-sign-in-url="/" sign-up-url="/registrazione"/>
        </div> 
    </div>
</template>