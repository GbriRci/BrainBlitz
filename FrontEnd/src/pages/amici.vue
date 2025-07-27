<script lang="ts">
    import { defineComponent } from "vue";
    import { Amico } from "../utils/types";
    import axios from "axios";
    import { ControlloAccesso } from "../utils/Autorizzazioni";
    import { Utente } from "../utils/types";
    import { useUser } from "vue-clerk";
    import DOMPurify from "dompurify"; //per sanificare l'input ed evitarne di malevoli

    export default defineComponent({
        setup() {
            const { user } = useUser();
            return { user };
        },
        data() {
            return {
                utente: null as Utente | null,
                amici: [] as Amico[],
                ricerca: null as null | string,
                cliccato: false as boolean,
                risultati: [] as Amico[],
                richieste: [] as Amico[],
                giaRichiesta: [] as Amico[],
            }
        },
        methods: {
            //Prendo i dati dell'utente da XAMPP e lo salvo in sessionstorage
            Utente(){
                if(this.user){
                    axios.get('/api/utente/' + this.user.username)
                    .then((response) => { this.utente = response.data[0];});      
                }
            },

            //cerco gli amici dell'utente
            Amici() {
                if(this.user){
                    axios.get("/api/amici/" + this.user.username)
                    .then(response => this.amici = response.data);
                }
            }, 

            //cerco le richieste di amicizia
            Richieste() {
                if(this.user){
                    axios.get("/api/amici/richieste/" + this.user.username)
                    .then(response => this.richieste = response.data);
                }
            },

            //rimuove un amico
            rimuoviAmico(amico: string) {
                if(this.user){
                    axios.delete('/api/amici/cancella/' + this.user.username + '/' + amico)
                    .then(() => {
                        this.Amici();
                    });
                }
            },
            
            //se l'utente è gia stato nella pagina ho già i suoi dati
            Cerca() {
                if(this.ricerca){
                    //sanifico l'input prima di mandarlo al database   
                    const inputPulito = DOMPurify.sanitize(this.ricerca);
                    axios.get('/api/amici/ricerca/' + inputPulito)
                    .then(response => {
                        this.risultati = response.data;
                        this.amiciziaGiaRichiesta();
                        this.ControlloNonSiaIo();
                        this.ControlloNonSiaAmico();
                        this.cliccato = this.risultati.length === 0;
                    })
                }
            },

            //per filtrare i risultati della ricerca
            ControlloNonSiaIo(){
                if(this.utente){
                    for (let i = 0; i < this.risultati.length; i++) {
                        if (this.risultati[i].Username === this.utente.Username) {
                            this.risultati.splice(i, 1);
                            i--;
                        }
                    }
                }
            },

            //per filtrare i risultati
            ControlloNonSiaAmico() {
                for (let i = 0; i < this.risultati.length; i++) {
                    for (let j = 0; j < this.amici.length; j++) {
                        if (this.risultati[i].Username === this.amici[j].Username) {
                            this.risultati.splice(i, 1);
                            i--;
                            break; 
                        }
                    }
                }
            },

            //prende le persone a cui ho già mandato la richiesta
            richiestefatte() {
                if(this.user){
                    axios.get('/api/amici/giarichiesto/' + this.user.username)
                    .then(response =>{ this.giaRichiesta = response.data});
                }
            },

            //per filtrare a chi ho già mandato la richiesta, in base alla funzione richiesteFatte
            amiciziaGiaRichiesta(){
                for (let i = 0; i < this.risultati.length; i++) {
                    for (let j = 0; j < this.giaRichiesta.length; j++) {
                        if (this.risultati[i].Username === this.giaRichiesta[j].Username) {
                            this.risultati.splice(i, 1);
                            i--;
                        }
                    }
                }
            },

            //manda la richiesta di amicizia
            mandaRichiesta(username: string) {
                 if(this.user){   
                    axios.post('/api/amici/richiesta', { mittente: this.user.username, destinatario: username })
                    .then(() => {
                        this.$router.go(0);
                    });
                 }
            },

            // accetta la richiesta di amicizia
            accettaRichiesta(username: string) {
                if(this.user){    
                    axios.post('/api/amici/accetta', { richiesta: username, user: this.user.username })
                    .then(() => {
                        axios.delete('/api/amici/rifiuta/' + this.user?.username + '/' + username);
                        this.Amici();
                        this.Richieste();
                    });
                }
            },

            // rifiuta la richiesta
            rifiutaRichiesta(username: string) {
                if(this.user){
                    axios.delete('/api/amici/rifiuta/' + this.user.username + '/' + username)
                    .then(() => {
                        this.Richieste();
                    });
                }
            }
        },
        beforeMount(){
            ControlloAccesso();
            this.Utente();
        },
        mounted() {
            this.Amici();
            this.Richieste();
            this.richiestefatte();
        }
    })
</script>

<template>
    <div class="impostazioni container-fluid col-10">
        <div class="row riga text-center col-12">
            <div class="input-group mb-2">
                <input type="text" class="form-control" placeholder="Inserisci nome utente" v-model="ricerca">
                <button class="bottone px-3 fs-5" @click="Cerca">Cerca</button>
            </div>
            <div v-if="risultati.length === 0 && cliccato" class="mb-4 fs-4">Nessun utente trovato...</div>
            <table v-else class="table table-borderless w-50 mx-auto">
                <tr v-for="risultato in risultati" :key="risultato.Username">
                    <td class="fs-4">{{ risultato.Username }}</td>    
                    <td><button @click="mandaRichiesta(risultato.Username)" class="bottone m-1">Invia</button></td>
                </tr>
            </table>
            <h2 class="categoria mb-4">Lista Amici</h2>
            <div class="fs-4" v-if="amici.length == 0">Non hai amici...</div>
            <table v-else class="table table-borderless ">
                <tr v-for="(amico, index) in amici" :key="amico.Username">
                    <td class="num">
                        <img v-if="index < 3" :src="`/img/medaglie/${index + 1}.png`" alt="Medaglia" class="premio bg-none">
                        <span class="bg-none" v-else>{{ index + 1 }}°</span>
                    </td>
                    <td>{{ amico.Username }}</td>
                    <td class="d-none d-md-table-cell">{{ amico.PVinte }} vittorie</td>
                    <td><button @click="rimuoviAmico(amico.Username)" class="bottone m-1">Rimuovi</button></td>
                </tr>
            </table>
            <h3 class="categoria mb-4 mt-4">Richieste Amicizia</h3>
            <div class="fs-4" v-if="richieste.length == 0">Non hai richieste di amicizia...</div>
            <table v-else class="table table-borderless ">
                <tr v-for="richiesta in richieste" :key="richiesta.Username">
                    <td class="text-end">{{ richiesta.Username }}</td>
                    <td class="text-end"><button @click="accettaRichiesta(richiesta.Username)" class="bottone m-1">Accetta</button></td>
                    <td class="text-start"><button @click="rifiutaRichiesta(richiesta.Username)" class="bottone m-1">Rifiuta</button></td>
                </tr>
            </table>
        </div>
    </div>
</template>