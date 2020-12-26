import {CardDesk} from "./cardDesk.js";

export class Visit {
    constructor ( { purpose, description, urgency, name, status, closeFormBtn } = {} ) {
        this.purpose = purpose;
        this.description = description;
        this.urgency = urgency;
        this.name = name;
        this.status = status;
        this.closeFormBtn = closeFormBtn;
        this.elements = {
            form: document.createElement('form'),
            closeFormBtn: this.createCloseBtn('X', 'close-form-btn'),
            purpose: this.createInputElement('purpose', 'Цель визита', 'text', 'form-input', this.purpose),
            description: this.createInputElement('description', 'Короткое описание визита', 'textarea', 'form-input', this.description),
            urgency: this.createSelectElement('Неотложная', 'Срочная', 'Обычная', 'Срочность', this.description),
            name: this.createInputElement('name', 'Ф.И.О.', 'text', 'form-input', this.name),
            status: this.createSelectStatus('Статус визита', 'Открыт', 'Выполнен'),
            btn: this.createInputElement('form-btn', 'send', 'submit', 'form-submit', urgency?'Изменить': 'Создать')
        }
    }
    createCloseBtn(textContent, className) {
        const el = document.createElement('button');
        el.textContent = textContent;
        el.className = className;
        return el
    }
    createInputElement(name, placeholder, type, className, value = "") {
        const el = document.createElement('input');
        el.name = name;
        el.required = true;
        el.placeholder = placeholder;
        el.type = type;
        el.className = className;
        el.value = value || "";
        return el;
        
    }
    createSelectElement(textHard, textMedium, textLow, textSelectOption) {
        const el = document.createElement('select')
        el.className = 'form-select'
        const hard = document.createElement('option'),
            medium = document.createElement('option'),
            low = document.createElement('option'),
            selectOption = document.createElement('option');
        selectOption.disabled = true;
        low.selected = true;
        selectOption.textContent = textSelectOption;
        hard.textContent = textHard;
        medium.textContent = textMedium;
        low.textContent = textLow;
        el.append(selectOption, hard, medium, low);
        return el;
    }
    createSelectStatus(defaultOp, open, done) {
        const el = document.createElement('select');
        el.className = 'form-select';
        const isOpen = document.createElement('option'),
            isDone = document.createElement('option'),
            defaultOption = document.createElement('option');
        defaultOption.disabled = true;
        isOpen.selected = true;
        isOpen.textContent = open;
        isDone.textContent = done;
        defaultOption.textContent = defaultOp
        el.append(defaultOption, isOpen, isDone);
        return el;
    }

    closeBtnListener(parent) {
        let select = document.querySelector('.doctor-select');

        this.elements.closeFormBtn.addEventListener('click', e => {
            e.preventDefault()
            if (select) {
                select.remove();
                const formSelect = document.querySelector('.visit-select-form').classList.add('form-hidden');
            }
            parent.remove();
            const btn = document.querySelectorAll('.close-form-btn');
            btn.forEach(e => e.classList.remove("remove"));
        })
    }

    closeFormListener(){
        document.body.addEventListener('click',(event)=>{
            if(event.target.classList.value===('visit-form') && event.target.classList.value===('wrapper')){
                document.querySelector('.card-container').classList.add('form-hidden');
                document.querySelector('.visit-form').classList.add('form-hidden');
            }
        })
    }
}

export class VisitCardiologist extends Visit {
    constructor({purpose, description, urgency, name, index, pressure, illnesses, age, status, id} = {}) {
        super({purpose, description, urgency, name, status});
        this.age = age;
        this.index = index;
        this.pressure = pressure;
        this.illnesses = illnesses;
        this.id = id;
    }

    render(container) {
        const {purpose, description, urgency, name, status, form, btn, closeFormBtn, id} = this.elements;
        this.cardiologistIndex = super.createInputElement('index', 'Ваш индекс массы тела', 'number', 'form-input', `${this.index}`);
        this.cardiologistPressure = super.createInputElement('pressure', 'Нормальное давление', 'text', 'form-input', this.pressure);
        this.cardiologistIllnesses = super.createInputElement('illnesses', 'Ранее перенесенные заболевания', 'text', 'form-input', this.illnesses);
        this.cardiologistAge = super.createInputElement('age', 'Ваш возраст', 'number', 'form-input', `${this.age}`);
        form.append(closeFormBtn, purpose, description, urgency, name, status, this.cardiologistIndex, this.cardiologistPressure, this.cardiologistIllnesses, this.cardiologistAge, btn);
        form.className = 'visit-form';
        container.append(form);
        container.className = 'form-container';
        let select = document.querySelector('.doctor-select');
        let formSelect = document.querySelector('.visit-select-form');
        console.log(formSelect);
        console.log(container);
        super.closeBtnListener(container);
        super.closeFormListener();

        this.elements.form.addEventListener('submit', async (e) => {
            e.preventDefault()
            if (select) {
                select.remove();
                formSelect.remove();
            }
            container.remove();
            if (document.querySelector('.remove')) {
                await fetch(`https://ajax.test-danit.com/api/v2/cards/${this.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': `Bearer ${localStorage.getItem('tokenData')}`
                    },
                    body: JSON.stringify({
                        title: 'cardiologist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        index: `${this.cardiologistIndex.value}`,
                        pressure: `${this.cardiologistPressure.value}`,
                        illnesses: `${this.cardiologistIllnesses.value}`,
                        age: `${this.cardiologistAge.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                } ).catch( ( error ) => {    
                    console.error(error)
                    window.alert('Server ERROR!')
                    })
            } else {
                await fetch(`https://ajax.test-danit.com/api/v2/cards`, {
                    method: "Post",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                         'Authorization': `Bearer ${localStorage.getItem('tokenData')}`
                    
                    },
                    body: JSON.stringify({
                        title: 'cardiologist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        index: `${this.cardiologistIndex.value}`,
                        pressure: `${this.cardiologistPressure.value}`,
                        illnesses: `${this.cardiologistIllnesses.value}`,
                        age: `${this.cardiologistAge.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                } ).catch( ( error ) => {   
                    console.error(error)
                    window.alert('Server ERROR!')
                    })
            }
            const VisitCardiologistCard = new CardDesk();
            VisitCardiologistCard.clearCards();
            await VisitCardiologistCard.getCards();
        })
    }
}
export class VisitDentist extends Visit {
    constructor({purpose, description, urgency, name, lastVisit, closeFormBtn, id} = {}) {
        super({purpose, description, urgency, name, closeFormBtn});
        this.lastVisit = lastVisit;
        this.id = id;
    }
    render(container) {
        const {purpose, description, urgency, name, status, form, btn, closeFormBtn} = this.elements;
        this.dentistLastVisit = super.createInputElement('lastVisit', 'Дата последнего визита', 'date', 'form-input', `${this.lastVisit}`);
        form.append(closeFormBtn, purpose, description, urgency, name, this.dentistLastVisit, status, btn)
        form.className = 'visit-form'
        container.append(form)
        container.className = 'form-container';
        let select = document.querySelector('.doctor-select');
        let formSelect = document.querySelector('.visit-select-form');
        super.closeBtnListener(container);
        super.closeFormListener();

        this.elements.form.addEventListener('submit', async (e) => {
            e.preventDefault()
            if (select) {
                select.remove();
                formSelect.remove();
            }
            container.remove();
            if (document.querySelector('.remove')) {
                await fetch(`https://ajax.test-danit.com/api/v2/cards/${this.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                         'Authorization': `Bearer ${localStorage.getItem('tokenData')}`
      
                    },
                    body: JSON.stringify({
                        title: 'dentist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        lastVisit: `${this.dentistLastVisit.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                } ).catch( ( error ) => {    
                    console.error(error)
                    window.alert('Server ERROR!')
                    })
            } else {
                await fetch(`https://ajax.test-danit.com/api/v2/cards`, {
                    method: "Post",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': `Bearer ${localStorage.getItem('tokenData')}`
                    },
                    body: JSON.stringify({
                        title: 'dentist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        lastVisit: `${this.dentistLastVisit.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                } ).catch( ( error ) => {   
                    console.error(error)
                    window.alert('Server ERROR!')
                    })
            }
            const VisitDentistCard = new CardDesk();
            VisitDentistCard.clearCards();
            await VisitDentistCard.getCards();
        })
    }
}
export class VisitTherapist extends Visit {
    constructor({purpose, description, urgency, name, age, status, closeFormBtn, id} = {}) {
        super({purpose, description, urgency, name, closeFormBtn});
        this.age = age;
        this.id = id;
    }
    render(container) {
        const {purpose, description, urgency, name, form, age, status, btn, closeFormBtn} = this.elements;
        this.therapistAge = super.createInputElement('age', 'Ваш возраст', 'number', 'form-input', `${this.age}`);
        form.append(closeFormBtn, purpose, description, urgency, name, this.therapistAge, status, btn)
        form.className = 'visit-form'
        container.append(form);
        container.className = 'form-container';
        let select = document.querySelector('.doctor-select');
        let formSelect = document.querySelector('.visit-select-form');
        super.closeBtnListener(container);
        super.closeFormListener();

        this.elements.form.addEventListener('submit', async (e) => {
            e.preventDefault()
            if (select) {
                select.remove();
                formSelect.remove();
            }
            container.remove();
            if (document.querySelector('.remove')) {
                await fetch(`https://ajax.test-danit.com/api/v2/cards/${this.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                         'Authorization': `Bearer ${localStorage.getItem('tokenData')}`
                       
                    },
                    body: JSON.stringify({
                        title: 'therapist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        age: `${this.therapistAge.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                } ).catch( ( error ) => {    
                    console.error(error)
                    window.alert('Server ERROR!')
                    })
            } else {
                await fetch(`https://ajax.test-danit.com/api/v2/cards`, {
                    method: "Post",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                      'Authorization': `Bearer ${localStorage.getItem('tokenData')}`
                       
                    },
                    body: JSON.stringify({
                        title: 'therapist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        age: `${this.therapistAge.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                } ).catch( ( error ) => {  
                    console.error(error)
                    window.alert('Server ERROR!')
                    })
            }
            const VisitTherapistCard = new CardDesk();
            VisitTherapistCard.clearCards();
            await VisitTherapistCard.getCards();
        })
}
}