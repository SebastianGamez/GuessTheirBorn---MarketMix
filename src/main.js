// Descripción: Archivo principal de la aplicación
// Autor: Sebastián Gámez Ariza

// Importación de librerías
const { createApp } = Vue;

// Creación de la aplicación
const app = createApp({
    data() {
        return {
            // Renderización de componentes
            render: {
                login: true,
                register: false,
                game: false,
                results: false,
                resultsButton: false
            },
            // Datos de la aplicación
            name: '',
            attempts: 0,
            nameCharacter: '',
            bornToGuess: '',
            // Inputs de la aplicación
            nameRegisterInput: '',
            bornDateRegisterInput: '',
            nameInput: '',
            bornInput: '',
            // Datos de la aplicación con persistencia en localStorage
            results: [],
            bornDates: [...bornDatesData],

        }
    },

    // Actualización de la aplicación
    updated() {
        // Se valida si los resultados son mayores a 0 para mostrar el botón de ver resultados
        this.render.resultsButton = this.results.length > 0 ? true : false;
        // Se obtienen los resultados de localStorage
        this.results = localStorage.getItem('results') ? JSON.parse(localStorage.getItem('results')) : [];
        // Se obtienen los personajes registrados de localStorage
        this.bornDates = localStorage.getItem('bornDates') ? JSON.parse(localStorage.getItem('bornDates')) : this.bornDates;
    },
    // Montaje de la aplicación
    mounted() {
        // Se da una bienvenida e informa al usuario de las reglas del juego
        swal("Adivina el año", `Adivina el año de nacimiento de algún personaje famoso. Para comenzar debes ingresar tu nombre. Tendrás siete intentos y por cada uno errado se te otorgará una pista. Al final podrás ver los mejores resultados en una tabla especifica. Recuerda ¡También puedes registrar tus propios personajes!`, "info");
        // Se obtienen los resultados de localStorage
        this.results = localStorage.getItem('results') ? JSON.parse(localStorage.getItem('results')) : [];
        // Se obtienen los personajes registrados de localStorage
        this.bornDates = localStorage.getItem('bornDates') ? JSON.parse(localStorage.getItem('bornDates')) : this.bornDates;
        // Se valida si existen resultados en localStorage para mostrar el botón de ver resultados
        this.render.resultsButton = this.results.length > 0 ? true : false;
    },
    // Métodos de la aplicación
    methods: {
        // Método para registrar un personaje
        registerCharacter(){
            // Se valida que los inputs no estén vacíos
            if(this.nameRegisterInput === '') return swal("Adivina el año", "Ingresa un nombre de usuario", "error");
            if(this.bornDateRegisterInput === '') return swal("Adivina el año", "Ingresa un año de nacimiento", "error");
            // Se almacena el personaje en el arreglo de personajes
            this.bornDates.push({
                name: this.nameRegisterInput,
                bornDate: new Date(this.bornDateRegisterInput)
            });
            // Se almacena el arreglo de personajes en localStorage
            localStorage.setItem('bornDates', JSON.stringify(this.bornDates));
            // Se muestra un mensaje de éxito
            swal("Adivina el año", `El personaje ${this.nameInput} fue registrado con éxito`, "success");
            // Se limpian los inputs
            this.nameRegisterInput = '';
            this.bornDateRegisterInput = '';
        },
        // Método para iniciar sesión
        registerUser(){
            // Se valida que el input no esté vacío
            if(this.nameInput === '') return swal("Adivina el año", "Ingresa un nombre de usuario", "error");
            // Se almacena el nombre de usuario en la aplicación
            this.name = this.nameInput;
            // Se oculta el componente de login y se muestra el componente de juego
            this.render.login = false;
            this.render.game = true;
            // Se muestra un mensaje de bienvenida
            swal("Adivina el año", `Bienvenido ${this.name}`, "success");
            // Se limpia el input
            this.nameInput = '';
            // Se reinicia el juego
            this.attempts = 0;
        },
        // Método para obtener un número aleatorio de 1 a 3 y ser usado como pista
        getRandomNumber(){
            return Math.floor(Math.random() * (4 - 1) + 1);
        },
        // Método para obtener un año de nacimiento aleatorio de un personaje
        getRandomBornDate(){
            // Se obtiene un personaje aleatorio
            const {name, bornDate} = this.bornDates[Math.floor(Math.random() * this.bornDates.length)];
            // Se almacena el nombre del personaje
            this.nameCharacter = name;
            // Se retorna el año de nacimiento del personaje
            return bornDate.getFullYear();
        },
        // Método para iniciar el juego
        startPlay(){
            // Se valida que el usuario no lleve el máximo de intentos
            if(this.attempts === 7) {
                // Se reinicia el juego
                this.attempts = 0;
                // Se limpia el input
                this.bornInput = '';
                // Se muestra un mensaje de error
                return swal(`${this.name}`, `Se acabaron los intentos, el año era ${this.bornToGuess}, año de nacimiento de ${this.nameCharacter}. Juguemos de nuevo`, "error");
            }
            // Se incrementa el número de intentos
            ++this.attempts;
            // Se obtiene el año de nacimiento a adivinar, si es el primer intento se obtiene un año aleatorio, si no se obtiene el mismo año de nacimiento
            this.bornToGuess = this.attempts === 1 ? this.getRandomBornDate() : this.bornToGuess;
            // Se obtiene el año seleccionado por el usuario
            const bornSelected = this.bornInput;
            // Si el año seleccionado es menor mayor o menor al año de nacimiento a adivinar se muestra un mensaje de error y una pista
            // La pista indica un año entre el año de nacimiento a adivinar y dos números aleatorios obtenidos, tanto menores como mayores al año de nacimiento a adivinar
            if(this.bornToGuess < bornSelected){
                swal(`${this.name}`, `La fecha seleccionada es mayor, intenta con un año entre ${this.bornToGuess - this.getRandomNumber()} y ${this.bornToGuess + this.getRandomNumber()}`, "warning");
            } else if(this.bornToGuess > bornSelected){
                swal("Usuario", `La fecha seleccionada es menor, intenta con un año entre ${this.bornToGuess - this.getRandomNumber()} y ${this.bornToGuess + this.getRandomNumber()}`, "warning");
            } else {
                // Si el año seleccionado es correcto se muestra un mensaje de éxito
                swal(`${this.name}`, `Felicitaciones, el año seleccionado es correcto, ${this.bornToGuess} fue el año de nacimiento de ${this.nameCharacter}. Puedes ver tu puntaje en 'Ver resultados'`, "success");
                // Se almacena el resultado en el arreglo de resultados
                this.results.push({
                    name: this.name,
                    attempts: this.attempts
                });
                // Se almacena el arreglo de resultados en localStorage
                localStorage.setItem('results', JSON.stringify(this.results));
                // Se reinicia el juego
                this.bornInput = '';
                this.attempts = 0;
            }
        },
        // Método para mostrar los resultados
        seeResults(){
            // Se valida que existan resultados
            if(this.results.length === 0) return swal("Usuario", "No hay resultados para mostrar", "warning");
            // Se oculta el componente de juego y se muestra el componente de resultados
            this.render.login = false;
            this.render.game = false;
            this.render.results = true;
        },
        backLoginFromResults(){
            // Se reinicia el juego
            this.attempts = 0;
            // Si el usuario ya se ha registrado se oculta el componente de login y se muestra el componente de juego
            // Se oculta el componente de resultados y se muestra el componente del juego
            if(this.name !== ''){
                this.render.login = false;
                this.render.game = true;
                this.render.results = false;
            }
            // Se oculta el componente de resultados y se muestra el componente de login
            else {
                this.render.login = true;
                this.render.game = false;
                this.render.results = false;
            }
        },
        // Método para volver al login desde el componente de registro
        backLoginFromGame(){
            // Se reinicia el juego
            this.attempts = 0;
            // Se oculta el componente de juego y se muestra el componente de login
            this.render.login = true;
            this.render.register = false;
            this.render.game = false;
            this.render.results = false;
        },
        // Método para mostrar el componente de registro
        goToRegister(){
            // Se oculta el componente de login y se muestra el componente de registro
            this.render.login = false;
            this.render.register = true;
        }
    }
});

// Se monta la instancia de Vue en el elemento con id 'app'
app.mount('#app');
