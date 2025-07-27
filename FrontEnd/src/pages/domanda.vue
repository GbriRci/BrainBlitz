<script lang="ts">
    import { defineComponent } from "vue";
    import { Domanda } from "../utils/types";
    import { Risposta } from "../utils/types";
    import { Categoria } from "../utils/types";
    import axios from "axios";
    import { ControlloAccesso } from "../utils/Autorizzazioni";
    import { getSocket } from "../utils/socket"; 
    import { useUser } from "vue-clerk";
    
    export default defineComponent({
        setup() {
            const { user } = useUser();
            return { user };
        },
        data() {
            return {
                categoria: null as Categoria | null,
                domande: [] as Domanda[],
                risposte: [] as Risposta[],
                blocco: false as boolean,
                selezionata: null as Risposta | null,
                indice: 0 as number,
                punteggio: 0 as number,
                puntiaumentati: false as boolean,
                feedback: '' as string,
                orologio: 7 as number,
                consecutive: 0 as number,
                precedente: false as boolean,
                max: 0 as number,
            };
        },
        methods: {
            //prende la categoria passata da url
            CategoriaDomande: function() {
                axios.get("/api/categoria/" + this.$route.params.id_categoria)
                .then(response => this.categoria = response.data[0]);
            },

            //prende 5 domande con axios e le metto in un array con indice 'indice'
            //se la categoria è 6 prende le domande senza categoria specifica (MEGAMIX)
            Domanda() {
                if (Number(this.$route.params.id_categoria) != 6) {
                    return axios.get("/api/domanda/" + this.$route.params.id_categoria )
                    .then(response => this.domande = response.data);
                } else {
                    return axios.get("/api/domanda")
                    .then(response => this.domande = response.data);
                }
            },

            //prende le risposte con axios
            Risposta(IDDomanda: number) {
                if (this.domande) {
                    axios.get("/api/risposte/" + IDDomanda)
                    .then(response => {
                        this.risposte = response.data;
                    });
                }
            },

            //Quando premi una risposta aumenta se era corretta, puntiaumentati evita tu possa ricliccare
            Cliccato(risposta: Risposta) {
                if (!this.blocco) {
                    this.blocco = true;
                    this.selezionata = risposta;
                    if (risposta.Correttezza === 1 && !this.puntiaumentati) {
                        this.precedente = true; // correttezza della domanda precedente
                        this.punteggio++;
                        this.puntiaumentati = true; 
                        this.feedback = 'Risposta corretta!';
                        if(this.precedente || this.indice == 0){
                            this.consecutive++;
                        }
                    }
                    else {
                        this.feedback = 'Risposta errata!';
                        this.consecutive = 0;
                        this.precedente = false;
                    }
                    if(this.consecutive > this.max){
                        this.max = this.consecutive;
                    }
                }
            },

            //cambia la domanda
            NuovaDomanda() {
                if (this.indice < 5) {
                    this.indice++;
                    this.Risposta(this.domande[this.indice].IDDomanda);
                    this.orologio = 7;
                    this.blocco = false;
                    this.puntiaumentati = false;
                    this.feedback = '';
                } else {
                    this.invioPunteggio();
                    this.$router.push("/esiti/" + this.punteggio + "/" + this.max);
                }
            },

            //invio il punteggio al server
            invioPunteggio() {
                const socket = getSocket();
                const punteggio = this.punteggio;
                socket.emit('invioPunteggio', this.user?.username, punteggio);
            },

            //funzione per il tempo di risposta
            Orologio() {
                setInterval(() => {
                    if (this.orologio > 0) {
                        this.orologio -= 1;
                    } else {
                        this.NuovaDomanda(); // se il tempo è scaduto cambia domanda
                    }
                }, 1000);
            }
        },
        beforeMount(){
            ControlloAccesso();
        },
        mounted() {
            this.CategoriaDomande();
            this.Domanda().then(() => {
                this.Risposta(this.domande[0].IDDomanda);
                this.Orologio();
            });
        }
    });
</script>

<template>
    <div class="container-fluid col-11" v-if="domande && risposte && categoria"> 
        <div class="container p-3 rounded">
            <div class="row riga align-items-center">
                <div class="col-12 text-center mb-3">
                    <h1 class="titoli">{{ categoria.Nome }}</h1>
                    <h4 class="fs-3">Tempo: {{ orologio }}</h4>
                    <h5>Domanda N°: {{ indice + 1 }}/5 - Punteggio: {{ punteggio }} </h5>
                    <span class="fs-3"> {{ domande[indice].Testo }} </span>
                </div>
                <div class="col-xl-4 col-lg-5 col-md-6 mb-3 mx-auto text-center">
                    <img :src="'/img/categorie/'+domande[indice].Categoria+'.png'" :alt="categoria.Nome" class="img-fluid img_domande rounded"/>
                </div>
                <div class="col-xl-7 col-lg-7 col-md-12 col-s-12 col-xs-12 d-flex flex-column justify-content-center text-center">
                    <button v-for="risposta in risposte" :key="risposta.IDRisposta" type="button" 
                        :class="['bottone', 'mb-2', 'fs-4',
                            { 'corretto': risposta.Correttezza === 1 && blocco, 
                              'sbagliato': risposta.Correttezza === 0 && blocco,
                              'selezionata': risposta === selezionata }]"  
                        @click="Cliccato(risposta)">
                        {{ risposta.Testo }}
                    </button>
                    <div v-if="blocco" class="fs-4 fw-bold mt-1">{{ feedback }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
