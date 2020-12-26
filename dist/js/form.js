import {Visit, VisitCardiologist, VisitDentist, VisitTherapist} from './visit.js';

export class  Form {
    constructor(formSelect, closeBtn, disabledOption, cardiologist, dentist, therapist, formDiv) {
        this.form = formSelect;
        this.closeBtn = closeBtn;
        this.disabledOption = disabledOption;
        this.cardiologist = cardiologist;
        this.dentist = dentist;
        this.therapist = therapist;
        this.formDiv = formDiv;
        this.elements = {
            formSelect: document.createElement('form'),
            closeBtn: document.createElement('button'),
            select: document.createElement('select'),
            disabledOption: document.createElement('option'),
            cardiologist: document.createElement('option'),
            dentist: document.createElement('option'),
            therapist: document.createElement('option'),
            formDiv: document.createElement('div')
        }
    }

    clearDiv(el) {
        el = this.elements.formDiv
        el.innerHTML = ''
    }

    createForm(event) {
        const container = document.querySelector('.wrapper'),
            showCardiologist = new VisitCardiologist(),
            showDentist = new VisitDentist(),
            showTherapist = new VisitTherapist();


       container.append(this.elements.formDiv);

        if (event.value === 'Кардиолог') {
            this.clearDiv()
            showCardiologist.render(this.elements.formDiv)
        } else if (event.value === 'Дантист') {
            this.clearDiv()
            showDentist.render(this.elements.formDiv)
        } else {
            this.clearDiv()
            showTherapist.render(this.elements.formDiv)
        }
    }

    closeSelectForm(){
        document.body.addEventListener('click',(event)=>{
            if(event.target.classList.value===('visit-select-form')){
                this.formSelect.style.display='none';
            }
        })
    }

    render(container) {
        const {formSelect, closeBtn, disabledOption, cardiologist, dentist, therapist, select} = this.elements;
        formSelect.className = 'visit-select-form'
        closeBtn.textContent = 'X';
        closeBtn.className = 'close-form-btn';
        disabledOption.textContent = 'Выберите врача:';
        disabledOption.disabled = true;
        disabledOption.selected = true;
        cardiologist.textContent = 'Кардиолог';
        dentist.textContent = 'Дантист';
        therapist.textContent = 'Терапевт';

        select.append(disabledOption, cardiologist, dentist, therapist);
        select.addEventListener('change', (e) => {
            let event = e.target;
            this.createForm(event);
        })
        formSelect.append(select, closeBtn);
        document.querySelector('.wrapper').append(formSelect);
        document.querySelector('.wrapper').append(select);
        select.classList.add('doctor-select');

        closeBtn.addEventListener( 'click', ( event ) => {
            event.preventDefault();
            formSelect.style.display = "none";
            select.remove();
        })
        this.closeSelectForm();
    }
}


const createButton = document.getElementById("createVisitBtn");
createButton.addEventListener('click', async (event) => {
    if (!document.querySelector('.doctor-select')) {
        const form = new Form().render();
    }
    document.querySelector('.doctor-select').className = 'doctor-select';
})
