import { useRouter, Router } from "vue-router";
import { useAuth } from 'vue-clerk';
import { ref, watchEffect, onBeforeMount } from 'vue';

//funzione per evitare che il giocatore entri nel sito senza accesso, tramite url
export function ControlloAccesso() {
    const { isSignedIn } = useAuth();
    const isUserSignedIn = ref<boolean | undefined>(isSignedIn.value);

    watchEffect(() => {
        isUserSignedIn.value = isSignedIn.value;
    });

    onBeforeMount(() => {
        if (!isUserSignedIn.value) {
            const router: Router = useRouter();
            router.push("/accesso");
        }
    });
}