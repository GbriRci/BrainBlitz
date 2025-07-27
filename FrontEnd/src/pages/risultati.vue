<script lang="ts">
    import { defineComponent } from "vue";
    import { ControlloAccesso } from "../utils/Autorizzazioni";
    import axios from "axios";
    import { Categoria } from "../utils/types";

    export default defineComponent({
        data() {
            return {
                categoria: null as Categoria | null,
                punteggio: this.$route.params.punteggio as any,
            };
        },
        methods: {
            //prende le informazioni relative alla categoria
            CategoriaDomande() {
                axios.get("/api/categoria/" + this.$route.params.id_categoria)
                .then(response => this.categoria = response.data[0]);
            }
        },
        beforeMount(){
            ControlloAccesso();
        },
        mounted(){
            this.CategoriaDomande();
        }
    });
</script>

<template>
    <div class="container container-fluid col-10"> 
        <div class="row text-center mb-3" >
            <div class="riga mx-auto col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h1 class="mt-3 mb-3 categoria">Risultati</h1>
                <span class="titoli fs-1"> {{ categoria?.Nome }} </span>
                <div v-if="punteggio >= 4">
                    <h2 class="fs-1">Complimenti!</h2>
                    <div class="fs-3">Hai ottenuto un punteggio eccellente!</div>
                </div>
                <div v-else-if="punteggio >= 3">
                    <h2 class="fs-1">Ben fatto!</h2>
                    <div class="fs-3">Hai ottenuto un buon punteggio!</div>
                </div>
                <div v-else>
                    <h2 class="fs-1">Puoi migliorare!</h2>
                    <div class="fs-3">Continua a provare per ottenere un punteggio migliore!</div>
                </div>
                <div class="fs-4 mt-3">Risposte corrette: {{ punteggio }}</div>
                <div class="fs-4 mb-4">Risposte sbagliate: {{ 5-punteggio }}</div>
                <div class="row  text-center mt-3" >
                    <button class="bottone col-12 col-sm-3 my-1 justify-content-center mx-auto" @click="$router.push('/')">Home</button>
                    <button class="bottone col-12 col-sm-3 my-1 justify-content-center mx-auto" @click="$router.push('/allenamento/'+ categoria?.IDCategoria)">Ritenta</button>
                    <button class="bottone col-12 col-sm-3 my-1 justify-content-center mx-auto" @click="$router.push('/categorie')">Categorie</button>
                </div>
            </div>
        </div>
    </div>
</template>