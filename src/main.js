const { createApp } = Vue;


const app = createApp({
    data() {
        return {

            attempts: 0,

            bornToGuess: '',
            
            formData: {
                name: '',
                bornDate: ''
            },
            
            bornInput: ''
        }
    },
    methods: {
        addUser(){
            bornDatesData.push(formData);
            swal("Usuario", "Usuario registrado con exito", "success");
        },
        getRandomBornDate(){
            return bornDatesData[Math.floor(Math.random() * (bornDatesData.length() - 1))].bornDate;
        },
        startPlay(){

            ++attempts;

            this.bornToGuess = this.bornToGuess === '' ? this.getRandomBornDate() : this.bornToGuess;

            const bornSelected = new Date(this.bornInput)

            if(this.bornToGuess < bornSelected){
                swal("Usuario", "La fecha seleccionada es mayor", "warning");
            } else if(this.bornToGuess > bornSelected){
                swal("Usuario", "La fecha seleccionada es menor", "warning");
            } else {
                swal("Usuario", "Felicitaciones, la fecha seleccionada es correcta", "success");
            }

        }
    }
});
