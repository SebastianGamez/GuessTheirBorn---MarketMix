const { createApp } = Vue;

const app = createApp({
    data() {
        return {

            render: {
                login: true,
                game: false,
                results: false
            },

            name: '',

            attempts: 0,

            nameCharacter: '',

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
        registerUser(){
            swal("Adivina el año", `${this.name} registrado con exito`, "success");
            this.name = this.nameInput;
            this.render.login = false;
            this.render.game = true;

            this.nameInput = ''
        },
        getRandomNumber(){
            return Math.floor(Math.random() * 4);
        },
        getRandomBornDate(){
            const {name, bornDate} = bornDatesData[Math.floor(Math.random() * 5)];
            this.nameCharacter = name;
            return bornDate.getFullYear();
        },
        startPlay(){

            if(this.attempts === 7) {
                this.attempts = 0;
                this.bornInput = '';
                return swal(`${this.name}`, `Se acabaron los intentos, el año era ${this.bornToGuess}, año de nacimiento de ${this.nameCharacter}. Juguemos de nuevo`, "error");
            }

            ++this.attempts;

            this.bornToGuess = this.attempts === 1 ? this.getRandomBornDate() : this.bornToGuess;

            const bornSelected = this.bornInput;

            if(this.bornToGuess < bornSelected){
                swal(`${this.name}`, `La fecha seleccionada es mayor, intenta con un año entre ${this.bornToGuess - this.getRandomNumber()} y ${this.bornToGuess + this.getRandomNumber()}`, "warning");
            } else if(this.bornToGuess > bornSelected){
                swal("Usuario", `La fecha seleccionada es menor, intenta con un año entre ${this.bornToGuess - this.getRandomNumber()} y ${this.bornToGuess + this.getRandomNumber()}`, "warning");

            } else {
                swal(`${this.name}`, `Felicitaciones, el año seleccionado es correcto, ${this.bornToGuess} fue el año de nacimiento de ${this.nameCharacter}. Puedes ver tu puntaje en 'Ver resultados'`, "success");
                this.results.push({
                    name: this.name,
                    attempts: this.attempts
                });
                localStorage.setItem('results', JSON.stringify(this.results));
                this.bornInput = '';
            }

        },
        seeResults(){
            if(this.results.length === 0) return swal("Usuario", "No hay resultados para mostrar", "warning");
            this.render.login = false;
            this.render.game = false;
            this.render.results = true;
        },
        backLoginFromResults(){
            this.attempts = 0;
            if(this.name !== ''){
                this.render.login = false;
                this.render.game = true;
                this.render.results = false;
            }
            else {
                this.render.login = true;
                this.render.game = false;
                this.render.results = false;
            }
        },
        backLoginFromGame(){
            this.attempts = 0;
            this.render.login = true;
            this.render.game = false;
            this.render.results = false;
        }

    }
});

app.mount('#app');
