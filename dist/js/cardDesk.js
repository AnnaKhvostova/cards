

import {Card} from "./createCard.js";
import {DragAndDrop} from "./drop.js"


export class CardDesk {
    constructor() {
        this.cards = [];
        this.elements = {
            desk: document.querySelector('.cards-box'),
            cardContainer: document.querySelector('.card-container'),
            filterContainer: document.querySelector(".cards-filter-form"),
            searchContainer: document.createElement("div"),
            searchInput: document.querySelector('.form-input'),
            statusSelect: document.querySelector('#statusSelect'),
            urgencySelect: document.querySelector('#ugrentlySelect'),
            searchBtn: document.querySelector("#searchBtn")
        }
    }

    creature() {
        // debugger
        this.clearCards();
        if (localStorage.getItem('tokenData')) {
            this.getCards();
            this.renderCardDesk();
            this.search();
            this.filter();
        }

    }

    renderCardDesk() {
        this.elements.searchBtn.setAttribute('type', 'Submit');
        this.elements.filterContainer.classList.add('filter-container');
        this.elements.searchInput.setAttribute('placeholder', 'Поиск');
        this.elements.searchInput.setAttribute('type', 'text');
        this.elements.desk.append(this.elements.cardContainer);
        document.querySelector(".cards").append(this.elements.desk);
    }

    async getCards() {
        await fetch('https://ajax.test-danit.com/api/v2/cards', {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Bearer ${localStorage.getItem('tokenData')}`
            },
        })
            .then( ( response ) => {
                if ( response.status === 401 ) {
                    localStorage.removeItem( 'tokenData' );
                    return
                  }
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    let error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
            .then(response => response.json())
            .then( cards => {
                
                if (cards.length === 0) {
                    if (document.querySelector('.desk-noMatches')) {
                        document.querySelector('.desk-noMatches').remove();
                    }
                    const deskInfo = document.createElement('div');
                    deskInfo.classList.add('desk-noInfo');
                    deskInfo.innerText = 'No items have been added';
                    this.elements.filterContainer.after(deskInfo);
                } else {
                    this.renderFilterInfo(cards)
                    const newDrop = new DragAndDrop (".card-container",".card")
                }
            } ).catch( ( error ) => {   
                console.error(error)
            window.alert('Server ERROR!')
            })
    }

    search() {
        this.elements.searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.filter();
            }
        });
        this.elements.searchBtn.addEventListener('click', (e) => {
            return this.filter()
        });
    }

    inputSearchfilter() {
        console.log(this.elements.searchInput);
        this.clearCards();
        let searchCards = this.cards.filter(item => item.title.toLowerCase().includes(this.elements.searchInput.value.toLowerCase()));
        this.renderFilterInfo(searchCards);
    }

    renderFilterInfo(searchArr) {
        this.clearCards();
        if (document.querySelector(".desk-noInfo")) {
            document.querySelector(".desk-noInfo").remove();
        }
        if (document.querySelector('.desk-noMatches')) {
            document.querySelector('.desk-noMatches').remove();
        }

        if (searchArr.length > 0) {
            searchArr.forEach(cardElem => {
                const verify = this.cards.filter(({ id }) => id === cardElem.id)[0]
                if (!verify) {
                    this.cards.push(cardElem)
                }
            })
            searchArr.forEach(e => new Card(e).render());
        }

    }

    clearCards() {
        document.querySelectorAll('.card').forEach(e => e.remove())
    }


    filter() {
        //debugger

        let searchCards = this.cards.filter(item => {
            let searchText = false
            Object.entries(item).forEach(([, value]) => {
                if (new RegExp(this.elements.searchInput.value).test(value)) {
                    searchText = true
                }
            })
            //debugger
            if (searchText &&
                (this.elements.urgencySelect.value === 'Все' || this.elements.urgencySelect.value === item.urgency) &&
                (this.elements.statusSelect.value === 'Все' || this.elements.statusSelect.value === item.status)
            ) {
                return true
            }
            return false
        });
        this.renderFilterInfo(searchCards);
    }
}
