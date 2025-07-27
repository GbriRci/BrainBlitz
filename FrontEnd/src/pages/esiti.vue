<script lang="ts">
    import { defineComponent, watch } from "vue";
    import axios from "axios";
    import { useUser } from "vue-clerk";
    import { ControlloAccesso } from "../utils/Autorizzazioni";
    import { getSocket } from "../utils/socket";
    import { Utente } from "../utils/types";

    export default defineComponent({
        setup() {
            const { user } = useUser();
            return { user };
        },
        data() {
            return {
                esitovittoria: false as boolean,
                esitopareggio: false as boolean,
                esitosconfitta: false as boolean,
                punteggio: Number(this.$route.params.punteggio) as number,
                avversario: '' as string,
                punteggioavversario: 0 as number,
                utente: null as Utente | null,
                max: 0 || Number(this.$route.params.consecutive),
            }
        },
        methods: { 
            Utente(){
                if(this.user){
                    axios.get('/api/utente/' + this.user.username)
                    .then((response) => { this.utente = response.data[0];});    
                }
            },

            aggiornamentoStatistiche(){ 
                if(this.esitovittoria && this.user){
                    axios.patch("/api/utente/statistiche/vittoria", {Username: this.user.username})
                }
                axios.patch("/api/utente/statistiche", {Username: this.user?.username})
                .then(() => {
                    this.Utente();
                })
            },

            //controllo se hai sbloccato nuovoi badges
            sbloccaBadge(){
                if(this.utente){
                    if(this.max >= 2){
                        axios.post("/api/utente/achievement/" + this.utente.Username + "/1");
                    }
                    if(this.punteggio >= 4){ 
                        axios.post("/api/utente/achievement/" + this.utente.Username + "/2");
                    }
                    if(this.max >= 4){
                        axios.post("/api/utente/achievement/" + this.utente.Username + "/3");
                    }
                    if(this.punteggio == 5){ 
                        axios.post("/api/utente/achievement/" + this.utente.Username + "/4");
                    }
                    if(this.utente.PGiocate == 30){
                        axios.post("/api/utente/achievement/" + this.utente.Username + "/5");
                    }
                    if(this.utente.PVinte == 15){
                        axios.post("/api/utente/achievement/" + this.utente.Username + "/6");
                    }
                    if(this.utente.PVinte == 50){
                        axios.post("/api/utente/achievement/" + this.utente.Username + "/7");
                    }
                    if(this.utente.PGiocate == 200){
                        axios.post("/api/utente/achievement/" + this.utente.Username + "/8");
                    }
                    if(this.punteggio == 0){ 
                        axios.post("/api/utente/achievement/" + this.utente.Username + "/9");
                    }
                    if((this.utente.PGiocate - this.utente.PVinte) == 30){
                        axios.post("/api/utente/achievement/" + this.utente.Username + "/10");
                    }
                }
            },

            //funzione per controllare i risultati
            controlloEsiti(){
                if(this.punteggio > this.punteggioavversario){ //vittoria
                    this.esitovittoria = true;
                } else if(this.punteggio < this.punteggioavversario){ //sconfitta
                    this.esitosconfitta = true;
                } else if(this.punteggio == this.punteggioavversario) { //pareggio
                    this.esitopareggio = true;
                }
            },

            //invio il mio punteggio e ricevo quello dell'avversario
            OttieniPunteggio(){
                const socket = getSocket();
                socket.on('punteggio', (username: string, punteggioSocket: number) => { //ricevo il punteggio dell'avversario
                    if(this.user?.username !== username){
                        this.avversario = username; 
                        this.punteggioavversario = punteggioSocket;
                        this.controlloEsiti();
                    }
                });  
            },

            //funzione per la disconnessione
            Disconnessione(){
                //this.Utente();
                //this.aggiornamentoStatistiche();
                this.sbloccaBadge();
                const socket = getSocket();
                socket.emit('disconnessione');
            }
        },
        beforeMount(){
            ControlloAccesso();
            this.OttieniPunteggio();
        },
        mounted(){
            watch( //controllo se uno dei tre esiti è true
                [() => this.esitovittoria, () => this.esitopareggio, () => this.esitosconfitta],
                (newValues) => { //se uno dei tre esiti è true, aggiorno le statistiche
                    if (newValues.some(value => value)) {
                        this.aggiornamentoStatistiche();
                    }
                }
            );
        },
    })
</script>

<template>
    <div class="container container-fluid col-10"> 
        <div class="row riga text-center col-12">
            <!-- crea un ciclo if che controlla i punteggi dell'utente e dell'amico -->
            <h1 class="mt-3 mb-3 categoria">Risultati</h1>
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-3">
                <span v-if="esitovittoria">
                    <h2 class="esito">Hai vinto!</h2>
                    <div class="fs-3 mb-3">Continua così!</div>
                </span>
                <span v-if="esitopareggio">
                    <h2 class="esito">Parità</h2>
                    <div class="fs-3 mb-3">Ne mancava solo una...</div>
                </span>
                <span v-if="esitosconfitta">
                    <h2 class="esito">Hai perso...</h2>
                    <div class="fs-3 mb-3">Sarà per la prossima volta</div>
                </span>
            </div>
            <div class="row text-center col-12">
                <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 mb-5">
                    <div class="mb-3 fs-1 user_avv">{{ user?.username }}</div>
                    <div class="fs-3">N° risposte corrette: {{ punteggio }}</div>
                    <div class="fs-3">N° risposte sbagliate: {{ 5-punteggio }}</div>
                    <div class="fs-3">N° risposte consecutive: {{ max }}</div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 mb-5">
                    <div class="mb-3 fs-1 useravv">{{ avversario }}</div>
                    <div class="fs-3">N° risposte corrette: {{ punteggioavversario }}</div>
                    <div class="fs-3">N° risposte sbagliate: {{ 5-punteggioavversario }}</div>
                </div> 
                <a class="bottone fs-5 p-2 col-11 offset-1 col-md-4 offset-md-4" href="/" @click="Disconnessione()">Torna alla Home</a>
            </div>
        </div>
    </div>
</template>