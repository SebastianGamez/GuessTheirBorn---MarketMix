const { createApp } = Vue;

const app = createApp({
    data() {
        return {

            render: {
                login: true,
                game: false,
                results: false
            },

            attempts: 0,

            bornToGuess: '',
            
            nameInput: '',
            
            bornInput: '',

            results: []
        }
    },

    mounted() {
        this.results = localStorage.getItem('results') ? JSON.parse(localStorage.getItem('results')) : [];
    },

    methods: {
        addUser(){
            bornDatesData.push(formData);
            swal("Usuario", "Usuario registrado con exito", "success");
        },
        getRandomNumber(){
            return Math.floor(Math.random() * 4);
        },
        getRandomBornDate(){
            return bornDatesData[Math.floor(Math.random() * (bornDatesData.length()))].bornDate.getFullYear();
        },
        startPlay(){

            if(this.attempts === 7) {
                this.attempts = 0;
                return swal("Usuario", "Se acabaron los intentos", "error");
            }

            ++this.attempts;

            this.bornToGuess = this.attempts === 1 ? this.getRandomBornDate() : this.bornToGuess;

            const bornSelected = this.bornInput

            if(this.bornToGuess < bornSelected){
                swal("Usuario", `La fecha seleccionada es mayor, intenta con un año entre ${this.bornToGuess - this.getRandomNumber} y ${this.bornToGuess + this.getRandomNumber}`, "warning");
            } else if(this.bornToGuess > bornSelected){
                swal("Usuario", `La fecha seleccionada es menor, intenta con un año entre ${this.bornToGuess - this.getRandomNumber} y ${this.bornToGuess + this.getRandomNumber}`, "warning");

            } else {
                swal("Usuario", "Felicitaciones, la fecha seleccionada es correcta", "success");
                this.results.push({
                    name: this.formData.name,
                    attempts: this.attempts
                });
                localStorage.setItem('results', JSON.stringify(this.results));
            }

        },
        backLogin(){
            this.attempts = 0;
            this.render.login = true;
            this.render.game = false;
            this.render.results = false;
        }
    }
});
