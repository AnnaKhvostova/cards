
import {CardDesk} from "./cardDesk.js";

const loginUrl = 'https://ajax.test-danit.com/api/v2/cards/login';
const token = sessionStorage.getItem('tokenData');



export class Modal {
  constructor(cardDesk) {

    this.form = document.createElement('form');
    this.closeBtn = document.createElement('button');
    this.formBody = document.createElement('div');
    this.email = document.createElement('input');
    this.password = document.createElement('input');
    this.submitBtn = document.createElement('button'); 
    this.cardDesk = cardDesk;
  }

  closeSigningForm(){
    document.body.addEventListener('click',(event)=>{
      if(event.target.classList.value===('signInForm')){
        this.form.style.display='none';
      }
    })
  }

  render() {
    const myFormId = 'myform'
    const loginForm = document.getElementById( myFormId )
    if (loginForm) {
      loginForm.style.display = "block";
      return
    } 
    this.form.className = "cards-create-form"
    this.closeBtn.className = "login-modal-btn";
    this.formBody.className = "login-modal";
    this.email.className = "form-input";
    this.password.className = "form-input";
    this.submitBtn.className = "form-btn";

    this.closeBtn.textContent = "X";
    this.submitBtn.textContent = "Войти";

    this.email.setAttribute("type", "email");
    this.password.setAttribute("type", "password");
    this.submitBtn.setAttribute("type", "submit");

    this.email.name = 'email';
    this.password.name = 'password';

    this.email.placeholder = "Введите e-mail";
    this.password.placeholder = "Введите пароль";
    this.form.id=myFormId
    this.formBody.append(this.closeBtn, this.email, this.password, this.submitBtn);

    this.form.append(this.formBody);
    document.body.prepend(this.form);

    this.form.addEventListener('keypress', (event) => {
      const key = event.code;
      if (key === "Enter") {
        this.getLogin(this.email, this.password, this.form);
      }
    })

    this.submitBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.getLogin(this.email, this.password, this.form);
      document.querySelector('.cards-create-form').remove();
    })

    this.closeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.form.style.display = "none";
    })
    this.closeSigningForm();
  }

  changeBtn () {
    //debugger
    console.log( 'gggggggg' );
    if (localStorage.getItem('tokenData')) {
      document.querySelector('#btnLogin').style.display = "none";
      document.querySelector( '#createVisitBtn' ).style.display = "block";
      document.querySelector( '#btnLogaut' ).style.display = "block";
    } else {
      document.querySelector('#btnLogin').style.display = "block";
      document.querySelector( '#createVisitBtn' ).style.display = "none";
      document.querySelector( '#btnLogaut' ).style.display = "none";
    }

    
  }

  async getLogin(email, password, form) {
    await fetch(loginUrl, {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        "email": email.value,
        "password": password.value
      }),
    })
      .then( response => {
        if ( response.status === 401 ) {
          localStorage.removeItem( 'tokenData' );
          return
        }
          return (response.text())
        })
        .then(token => {
          if (typeof token!=='string') {
            throw new Error('Введен неверный логин или пароль')
          } else {
            localStorage.setItem('tokenData', token);
            this.changeBtn();
            const bord = this.cardDesk.creature();
          }
        })
      .catch( error => {
        console.error(error)
          localStorage.removeItem('tokenData');
          window.alert('Server ERROR!')
        })
  }
}

// export {token};
const cardDesk = new CardDesk();
const modal = new Modal( cardDesk )

const createButton = document.getElementById("createVisitBtn");
const btnLogaut = document.getElementById( "btnLogaut" );
btnLogaut.addEventListener('click', async (event) => {
  localStorage.removeItem( 'tokenData' );
  cardDesk.creature();
  modal.changeBtn();
})
const loginButton = document.getElementById("btnLogin");

if (localStorage.getItem('tokenData')) {
  cardDesk.creature();
  modal.changeBtn();
}
loginButton.addEventListener('click', async (event) => {
  modal.render();
})

