<script lang="ts">
    import { defineComponent } from "vue";
    import { Categoria } from "../utils/types";
    import axios from "axios";
    import { useUser } from "vue-clerk";
    import { ControlloAccesso } from "../utils/Autorizzazioni";

    export default defineComponent({
        setup() {
            const { isLoaded, isSignedIn, user } = useUser();
            return {isLoaded, isSignedIn, user};
        },
        data() {
            return {
                categorie: [] as Categoria[], 
                cliccato: false as boolean,
                voti: [] as number[],
                scelta: 0 as number,
            }
        },
        methods: {
            //prende tutte le categorie
            Categorie(){
                axios.get("/api/categorie")
                .then(response => {
                    this.categorie = response.data;
                })
            },

            //rende l'utente occupato
            Occupato(){
                if(this.user){
                    axios.patch("/api/utente/occupato", {Username: this.user.username});
                }
            },

            //una volta che la categoria è stat scelta inizia il gioco
            Scelto(IDCategoria: Number) {
                this.$router.push('/allenamento/' + IDCategoria);
            },
        },
        beforeMount(){
            ControlloAccesso();
        },
        mounted(){
            this.Categorie();
            this.Occupato();
        }
    });
</script>

<template>
    <div class="container-fluid col-10"> <!--per avere una spazioatura laterale fissa-->  
        <div class="row mt-4 riga col-12 text-center d-flex align-items-center justify-content-center">
            <div class="categoria col-12">Sfida Solitaria:</div>
            <div class="sottotitolo fs-1 col-12 mb-5">Seleziona una categoria...</div>
            <span class="col-md-6 mb-3" v-for="categoria in categorie" :key="categoria.IDCategoria">
                <button @click="Scelto(categoria.IDCategoria)" :class="['fs-3','bottone','bottonecategoria', categoria.Nome]">
                    {{ categoria.Nome }}
                </button>
            </span>
        </div>
    </div>
</template>

