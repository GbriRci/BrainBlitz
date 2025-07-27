<script lang="ts">
    import { defineComponent } from "vue";
    import axios from "axios";
    import { useUser } from "vue-clerk";
    import { Badge } from "../utils/types";
    import { ControlloAccesso } from "../utils/Autorizzazioni";
    import { Utente } from "../utils/types";
    import { getSocket } from "../utils/socket"; 
    
    export default defineComponent({
        setup() {
            const { user } = useUser();
            return { user };
        },
        data() {
            return {
                utente: null as Utente | null, 
                arrivato: false as boolean,
                badge: null as Badge | null,
                IDCategoria: null as number | null,
                amico: this.$route.params.username,
            }
        },
        methods: {
            //Prendo i dati dell'utente
            Utente() {
                if(this.user){
                    axios.get('/api/utente/' + this.user.username)
                    .then((response) => { this.utente = response.data[0];});      
                }
            },

            //crea un server per giocare online
            CreaServer(socket: any) {
                if (this.user) {
                    socket.on('partita_iniziata', (username1: string, username2: string, categoria: number) => {
                        this.arrivato = true;
                        this.IDCategoria = categoria;
                        console.log("ottenuto:" + username1 + " e " + username2)
                        setTimeout(() => {
                            this.$router.push("/domanda/"+ this.IDCategoria);
                        }, 5000);
                    });
                }
            },

            //disconnette dalla socket
            Disconnessione(){
                const socket = getSocket();
                socket.emit('disconnessione');
            },

            //rende l'utente occupato
            Occupato(){
                if(this.user){
                    axios.patch("/api/utente/occupato", {Username: this.user.username});
                }
            },
        },
        beforeMount(){
            ControlloAccesso();
            this.Utente();
        },
        mounted(){
            const socket = getSocket();
            this.Occupato();
            this.CreaServer(socket);  
        }
    })
</script>

<template>
    <div class="riga riga_match container-fluid col-10" v-if="utente"> 
        <div class="row text-center mb-3 col-12">
            <div class="categoria col-12">Sfida con {{amico}}</div>
            <h2 v-if="!arrivato" class="pb-4">aspettando una risposta...</h2>  
            <div class="giocatore mx-auto col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12">
                <img v-if="user" :src="user.imageUrl" alt="User Image" class="imgGiocatore rounded-circle"/>
                <div class="fs-2">{{ utente.Username }}</div>
            </div>
            <div class="vs col-lg-2 col-md-12 col-sm-12 col-xs-12 d-flex align-items-center justify-content-center">
                VS
            </div>
            <div v-if="arrivato" class="giocatore mx-auto col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12 align-items-center justify-content-center">
                <img src="../img/avversario.png" alt="User Image" class="imgGiocatore rounded-circle"/>
                <div class="fs-2">{{ amico }}</div>
            </div>
            <div v-else class="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12 d-flex align-items-center justify-content-center">
                <img class="gif" src="../img/caricamento.gif" alt="Caricamento">
            </div>
            <a v-if="!arrivato" class="bottone fs-5 p-2 mt-3 col-11 offset-1 col-md-6 offset-md-3" href="/" @click="Disconnessione()">Torna alla Home</a>    
        </div>
    </div>
</template>