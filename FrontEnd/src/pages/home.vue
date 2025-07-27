<script lang="ts">
    import { defineComponent } from "vue";
    import { Utente } from "../utils/types";
    import { Amico } from "../utils/types";
    import { Badge } from "../utils/types";
    import axios from "axios";
    import { useUser } from "vue-clerk";
    import { ControlloAccesso } from "../utils/Autorizzazioni";
    import { getSocket } from "../utils/socket"; 

    export default defineComponent({
        setup() {
            const { user } = useUser();
            return { user};
        },
        data() {
            return {
                amici: [] as Amico[],
                badge: null as Badge | null,
                utente: null as Utente | null,
                sfide: [] as Amico[],
                giaRichiesta: [] as Amico[],
                numeroBadge: null as Badge | null,
            };
        },
        methods: {
            //Aggiungo l'utente a XAMPP
            UnisciDB() {
                if(this.user){
                    axios.post('/api/registrazione/utente', { Username: this.user.username});
                }
            },

            //Prendo i dati dell'utente da XAMPP e lo salvo in sessionstorage
            Utente(){
                if(this.user){
                    axios.get('/api/utente/' + this.user.username)
                    .then((response) => { this.utente = response.data[0];}); 
                }     
            },

            //recupera gli amici online
            Amici() {
                if(this.user){
                    axios.get("/api/amici/online/" + this.user.username)
                    .then((response) => (this.amici = response.data));
                }
            },

            //recupera le sfide ricevute
            SfideRicevute() {
                if(this.user){
                    axios.get('/api/utente/sfide/' + this.user.username)
                    .then(response => {this.sfide = response.data;});
                }
            },

            //manda la richiesta per giocare
            sfidaAmico(username: string) {
                if(this.user){
                    const socket = getSocket();
                    axios.post('/api/utente/richiesta', { mittente: this.user.username, destinatario: username });
                    socket.emit('attesa_amico', this.user.username);
                    this.$router.push("/match_sfida/" + username);
                }
            },

            // accetta la richiesta di amicizia 
            accettaSfida(username: string) {
                if(this.user){
                    const socket = getSocket();
                    axios.delete('/api/utente/rifiuta/' + this.user.username + '/' + username)
                    .then(() => {this.SfideRicevute();});
                    socket.emit('attesa_amico', this.user.username);
                    socket.emit('stanza_amici', username,  this.user.username);
                    this.$router.push("/match_sfida/" + username);
                }
            },

            // rifiuta la richiesta
            rifiutaSfida(sfida: string) {
                if(this.user){
                    axios.delete('/api/utente/rifiuta/' + this.user.username + '/' + sfida)
                    .then(() => {this.SfideRicevute();});
                }
            },

            //conto i badge sbloccati
            badgeSbloccati() {
                if(this.user){
                    axios.get('/api/utente/badge/' + this.user.username)
                    .then(response => { this.numeroBadge = response.data.length;});
                }
            },

            //controllo se l'utente ha già mandato la richiesta
            ControlloUnioneDB() {
                const giaFatto = sessionStorage.getItem('giaFatto');
                if (giaFatto) {
                    this.UnisciDB()
                    sessionStorage.setItem('giaFatto', 'false');
                }
            },

            //rende l'utente online
            Online(){
                if(this.user){
                    axios.patch("/api/utente/online", {Username: this.user.username});
                }
            },

            //tolgo l'utente dalle persone online
            Offline() {
                if(this.user){
                    axios.patch("/api/utente/disconnessione", {Username: this.user.username});
                }
            },

            //tolgo l'utente dalle persone occupate
            NonOccupato(){
                if(this.user){
                    axios.patch("/api/utente/nonoccupato", {Username: this.user.username});
                }
            },
        },
        beforeMount() {
            ControlloAccesso();
            this.ControlloUnioneDB();
        },
        mounted() {
            this.Online();
            this.NonOccupato();
            this.Amici();
            this.Utente();
            this.SfideRicevute();
            this.badgeSbloccati();
            window.addEventListener('beforeunload', this.Offline); 
        },
        beforeDestroy() { 
            //rende offline
            window.removeEventListener('beforeunload', this.Offline); 
        }
    });
</script>

<template>
    <div class="container-fluid col-10" v-if="utente"> 
        <div class="row riga text-center mb-3"><!--primo container -->
            <div class="col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-5 p-0"> <!--utente -->
                <div v-if="utente.BadgeEQ" class="col-12">
                    <RouterLink to="/badge"><img :src="'/img/badge/'+ utente.BadgeEQ +'.png'" :alt="'Badge ' + utente.BadgeEQ" class="premio"/></RouterLink> 
                </div>  
                <div class="col-12 text-center">
                    <img v-if="user" :src="user.imageUrl" alt="Immagine profilo" class="profilo rounded-circle"/>
                </div>    
                <div class="username fs-1 mb-3">{{ utente.Username }}</div>
                <div class="col-12 text-center d-flex flex-column align-items-center"> 
                    <div class="row w-100">
                        <div class="col-12 col-md-6 col-lg-12 mb-3">
                            <router-link class="bottoni_home py-2 px-5 fs-5 w-100" to="/matchmaking">Gioco online</router-link>
                        </div>
                        <div class="col-12 col-md-6 col-lg-12 mb-1">
                            <router-link class="bottoni_home py-2 px-5 fs-5 w-100" to="/categorie">Allenamento</router-link>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7"> <!--statistiche -->
                <span class="fas fa-trophy mt-5"></span>
                <span class="titoli ms-3">   
                    Statistiche:
                </span>
                <div class="row mt-3 pb-5">
                    <div class="col-4">
                        <div class="num_stat">{{ utente.PVinte }}</div>
                        <span>partite vinte</span>
                    </div>
                    <div class="col-4">
                        <div class="num_stat">{{ utente.PGiocate }}</div>
                        <span>partite giocate</span>
                    </div>
                    <div class="col-4">
                        <div class="num_stat">{{ numeroBadge }}</div>
                        <span>badge sbloccati</span>
                    </div>
                </div>
                <span class="col-12 fs-5 text-black fw-bold">
                    Vittorie: {{ utente.PGiocate > 0 ? (utente.PVinte / utente.PGiocate * 100).toFixed(2) : 0 }}%
                </span>
                <div class="progress mt-4 col-10 offset-1">
                    <div class="progress-bar bg-info" role="progressbar" :style="{width: (utente.PGiocate > 0 ? (utente.PVinte / utente.PGiocate * 100).toFixed(2) + '%' : '0%') }" aria-valuemin="0" aria-valuemax="100"></div>
                </div>   
            </div>   
        </div>
        
        <div class="row">
            <div class="riga col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 mb-3"> <!--terzo container -->
                <span class="fas fa-users ms-5"></span>
                <span class="titoli ms-3">Amici Online:</span>
                <table class="table mt-2 w-75 mx-auto">
                    <tr class="text-center" v-for="(amico, index) in amici" :key="amico.Username">
                        <td class="w-25">{{ amico.Username }}</td>
                        <td class="w-25 d-none d-sm-table-cell">{{ amico.PVinte }} vittorie </td>
                        <td class="w-25">
                            <button v-if="!amico.Occupato" @click="sfidaAmico(amico.Username)" class="bottone px-3 fs-5 mb-1">Sfida</button>
                            <button v-else class="bottone px-3 fs-5 mb-1 bg-dark text-white">Occupato</button>
                        </td> 
                    </tr>
                </table>
                <div class="mx-5 fs-5 pb-4" v-if="amici.length === 0">
                    Non hai amici online...
                </div>    
            </div>
            <div class="riga col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 mb-3"> <!--terzo container -->
                <span class="fas fa-gamepad ms-5"></span>
                <span class="titoli ms-3">Sfide:</span>
                <button class="fas fa-sync-alt ms-3 float-end bg-transparent mt-2 me-3 border-0" @click="SfideRicevute()"></button>
                <table class="table mt-2 w-75 mx-auto">
                    <tr v-for="sfida in sfide" :key="sfida.Username">
                        <td class="text-end">{{ sfida.Username }}</td>
                        <td class="text-end"><button class="bottone fs-5 px-2 py-2" @click="accettaSfida(sfida.Username)">Accetta</button></td>
                        <td class="text-start"><button @click="rifiutaSfida(sfida.Username)" class="bottone m-1 fs-5">Rifiuta</button></td>
                    </tr>
                </table>
                <div class="mx-5 fs-5 pb-4" v-if="sfide.length === 0">
                    Non hai richieste...
                </div>    
            </div>
        </div>
    </div>
</template>