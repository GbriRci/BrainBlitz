<script lang="ts">
    import { defineComponent } from "vue";
    import { Badge } from "../utils/types";
    import axios from "axios";
    import { ControlloAccesso } from "../utils/Autorizzazioni";
    import { Utente } from "../utils/types";
    import { useUser } from "vue-clerk";

    export default defineComponent({
        setup() {
            const { user } = useUser(); //recupera l'utente loggato dal Clerk
            return { user };
        },
        data() {
            return {
                badges: [] as Badge[],
                badgeSbloccati: [] as Badge[],
                scelta: null as null | number,
                utente: null as null | Utente,
            }
        },
        methods: {
            //recupera utente
            Utente(){
                return axios.get('/api/utente/' + this.user?.username)
                .then((response) => { 
                    this.utente = response.data[0];
                    if(this.utente?.BadgeEQ){
                        this.scelta = this.utente?.BadgeEQ;
                    }
                });
            },

            //prende tutti i badge
            Badges(){
                axios.get("/api/badge")
                .then(response => this.badges = response.data);
            },

            //prende i badge sbloccati
            BadgesSbloccati(){
                if(this.utente){
                    axios.get("/api/badge/sbloccati/" + this.utente.Username)
                    .then(response => {this.badgeSbloccati = response.data;});
                }
            },

            //per cambiare badge
            ImpostaBadge(){
                if(this.scelta && this.utente){
                    axios.patch("/api/badge/equipaggiato", {
                        Username: this.utente.Username,
                        Scelta: this.scelta,
                    });
                }
            }
        },
        beforeMount(){
            ControlloAccesso();
            this.Utente().then(() => {
                 this.BadgesSbloccati();
            });
        },
        mounted(){
            this.$watch('scelta', () => {
                this.ImpostaBadge();
            });
            this.Badges();
        },
    })
</script>

<template>
    <div class="d-flex container-fluid col-11 justify-content-center"> <!--per avere una spaziatura laterale fissa-->
        <div class="row riga d-flex justify-content-center col-12">
            <div class="col-12 text-center">
                <img v-if="scelta !==null && scelta !==undefined" :src="'/img/badge/'+scelta+'.png'" :alt="'Badge ' + scelta" class="premio"/>
            </div>  
            <div class="col-12 text-center">
                <img v-if="user" :src="user.imageUrl" alt="User Image" class="profilo rounded-circle"/>            
            </div>
            <h1 class="mt-3 mb-3 d-flex justify-content-center categoria">Badge</h1>
            <div class="col-12">
                <div class="col-12 col-md-6 offset-md-3">
                    <select v-model="scelta" id="theme-options" name="theme-options" class="form-select w-100 w-lg-50 h-15 mx-auto">                    
                        <option v-if="badgeSbloccati.length != 0" :value="null" disable selected hidden>Badge sbloccati...</option>
                        <option v-else :value="null" disable selected hidden>Non hai sbloccato nessun badge...</option>
                        <option :value="badge.IDBadge" v-for="badge in badgeSbloccati" :key="badge.IDBadge">{{ badge.Nome }}</option>
                    </select>
                </div>
                <table class="table mt-4 rounded-table">
                    <thead class=text-center>
                        <tr>
                            <th class="d-none d-md-table-cell" scope="col">NOME</th>
                            <th scope="col">MISSIONE</th>
                            <th scope="col">BADGE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="badge in badges" :key="badge.IDBadge" :class="{ 'table-secondary': badgeSbloccati.some(b => b.IDBadge === badge.IDBadge) }">
                            <!--per ogni badge, table-secondary viene applicata se nell'array BadgeSbloccati sia un ID uguale a IDBadge-->
                            <td class="td-badge d-none d-md-table-cell">{{ badge.Nome }}</td>
                            <td class="td-badge"><span class="d-sm-block d-md-none fw-bold">{{ badge.Nome }}:</span> {{ badge.Missione }}</td>
                            <td class="text-center"><img class="ico_badge" :src="'/img/badge/'+badge.IDBadge+'.png'" :alt="badge.Nome"/></td>
                        </tr>
                    </tbody>
                </table>
            </div>  
        </div>
    </div>
</template>
