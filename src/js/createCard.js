import {VisitCardiologist, VisitDentist, VisitTherapist} from './visit.js';
import {CardDesk} from './cardDesk.js';


export class Card {
    constructor(visitCard) {

        this.id = visitCard.id;
        this.visitCard = visitCard;

        this.elements = {
            cardContainer: document.createElement("div"),
            editBtn: document.createElement('button'),
            detailsBtn: document.createElement('button'),
            deleteBtn: document.createElement('button'),
            doctorDetailsFields: document.createElement('div'),
            editCardContainer: document.createElement("div")
        }
    }
    render() {
        this.elements.cardContainer.classList.add('card');
        this.elements.editBtn.classList.add( 'edit-btn' );
        
        this.elements.detailsBtn.classList.add('details-btn');
        this.elements.deleteBtn.classList.add('delete-btn');
        this.elements.doctorDetailsFields.classList.add('doctorDetails');
        this.elements.editCardContainer.classList.add('editCardContainer');
        this.elements.editBtn.innerText = 'Редактировать';
        this.elements.detailsBtn.innerText = 'Подробнее';
        this.elements.deleteBtn.innerText = 'X';
        
        this.elements.editBtn.style.display='block';
        const cardContentInfo = Object.entries(this.visitCard);
        cardContentInfo.forEach(([key, value]) => {

            if (key === "age" || key === "bodyindex" ||
                key === "illnesses" || key === "pressure" ||
                key === "purpose" || key === "description" ||
                key=== "status" || key === "urgency" ||
                key === "lastVisit" || key === "id" ||
                key === "index"
            ) {

                let detailsCardField = document.createElement("p");
                detailsCardField.classList.add("card-fields");
                detailsCardField.innerText = `${key}: ${value}`;
                this.elements.doctorDetailsFields.append(detailsCardField);

            } else {
                let mainCardField = document.createElement("p");
                mainCardField.classList.add("card-fields");
                mainCardField.innerText = `${key}: ${value}`;
                this.elements.cardContainer.append(mainCardField);
            }
        })

        this.elements.cardContainer.append(this.elements.editBtn, this.elements.deleteBtn);
        this.elements.cardContainer.insertAdjacentElement('beforeend', this.elements.detailsBtn);
        document.querySelector('.card-container').append(this.elements.cardContainer);


        /*   Card Btn Listeners   */

        this.elements.deleteBtn.addEventListener('click', () => this.deleteCardRequest());
        this.elements.detailsBtn.addEventListener('click', () => {
            if (!document.querySelector('.doctorDetails')) {
                this.elements.cardContainer.append(this.elements.doctorDetailsFields);
                this.elements.detailsBtn.innerText = 'Скрыть';
            } else {
                this.elements.detailsBtn.innerText = 'Показать';
                document.querySelector('.doctorDetails').remove();
            }
        })
        this.elements.editBtn.addEventListener('click', () => this.editCard());
    }



deleteCardRequest() {
    fetch(`https://ajax.test-danit.com/api/v2/cards/${this.id}`, {
        method: 'DELETE',
        headers: {
             'Authorization': `Bearer ${localStorage.getItem('tokenData')}`
        },
    } ).then( ( response ) => {
        if ( response.status === 401 ) {
            localStorage.removeItem( 'tokenData' );
            return
          }
        if (response.status >= 200 && response.status < 300) {
            new CardDesk().creature()
            return response;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error
        }
    })
        .catch( ( error ) => {    
            console.error(error)
            window.alert('Server ERROR!')
            })
}

    editCard() {
        const removeBtn = document.querySelectorAll(".edit-btn");
        removeBtn.forEach(e => e.classList.add("remove"));

        if (this.visitCard.title === "cardiologist") {
            document.querySelector('.card-container').append(this.elements.editCardContainer);
            const editFormCardiologist = new VisitCardiologist(this.visitCard);
            editFormCardiologist.render(this.elements.editCardContainer);
        }
        if (this.visitCard.title === "therapist") {
            document.querySelector('.card-container').append(this.elements.editCardContainer);
            const editFormVisitTherapist = new VisitTherapist(this.visitCard);
            editFormVisitTherapist.render(this.elements.editCardContainer);
        } else if (this.visitCard.title === "dentist") {
            document.querySelector('.card-container').append(this.elements.editCardContainer);
            const editFormVisitDentist = new VisitDentist(this.visitCard);
            editFormVisitDentist.render(this.elements.editCardContainer);
        }
    }
}
