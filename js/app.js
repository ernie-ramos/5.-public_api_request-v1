const gallery = document.getElementById('gallery');
const body = gallery.parentNode;
const search = document.querySelector('.search-container');
const modalBtnCont = document.getElementsByClassName('modal-btn-container');

// ------------------------------------------
//  FETCH FUNCTIONS
//
//  Enormous thanks and credit is due to Guil Hernandez
//  at Treehouse and his workshop Working with the Fetch API.
//  The code written below was greatly inspired by his own.
// ------------------------------------------

function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then((res) => res.json())
    .catch((error) => console.log('Looks there was a problem!', error));
}

Promise.all([
  fetchData(
    'https://randomuser.me/api/?results=12&inc=picture,name,email,location,cell,dob&nat=us,gb,au,ca'
  ),
]).then((data) => {
  data.forEach((employees) => {
    employees.results.forEach((employee) => {
      createGalleryHTML(employee);
      createModalHTML(employee);
    });
  });
});

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

const createEl = (elem, claName) => {
  const e = document.createElement(elem);
  e.className = claName;
  return e;
};

function createGalleryHTML(employee) {
  const pictures = employee.picture; //all three formats
  const fullName = employee.name; // title, first, and last
  const email = employee.email;
  const location = employee.location; // lots of location info!

  const cardDiv = createEl('div', 'card');
  const cardImgContainer = createEl('div', 'card-img-container');
  const cardInfoContainer = createEl('div', 'card-info-container');

  let imgContHTML = `<img class="card-img" src=${pictures.large} alt="profile picture">`;
  let infoContHTML = `<h3 id="name" class="card-name cap">${fullName.first} ${fullName.last}</h3>
                      <p class="card-text">${email}</p>
                      <p class="card-text cap">${location.city}, ${location.state}</p>`;

  cardImgContainer.innerHTML = imgContHTML;
  cardInfoContainer.innerHTML = infoContHTML;

  gallery.appendChild(cardDiv);
  cardDiv.appendChild(cardImgContainer);
  cardDiv.appendChild(cardInfoContainer);
}

function createModalHTML(employee) {
  const pictures = employee.picture; //all three formats
  const fullName = employee.name; // title, first, and last
  const email = employee.email;
  const location = employee.location; // lots of location info!
  const cell = employee.cell;
  const dob = new Date(employee.dob.date);
  const formattedDOB = dob.toLocaleDateString();

  const modalContDiv = createEl('div', 'modal-container');
  const modal = createEl('div', 'modal');
  const modalInfoContainer = createEl('div', 'modal-info-container');
  const button = createEl('button', 'modal-close-btn');

  button.type = 'button';
  button.id = 'modal-close-btn';
  button.innerHTML = `<strong>X</strong>`;

  let infoContHTML = `  <img class="modal-img" src=${pictures.large} alt="profile picture">
                        <h3 id="name" class="modal-name cap">${fullName.first} ${fullName.last}</h3>
                        <p class="modal-text">${email}</p>
                        <p class="modal-text cap">${location.city}</p>
                        <hr>
                        <p class="modal-text">${cell}</p>
                        <p class="modal-text">${location.street.number} ${location.street.name}, ${location.city}, ${location.state} ${location.postcode}</p>
                        <p class="modal-text">Birthday: ${formattedDOB}</p>`;

  modalInfoContainer.innerHTML = infoContHTML;

  body.appendChild(modalContDiv);
  modalContDiv.appendChild(modal);
  modal.appendChild(button);
  modal.appendChild(modalInfoContainer);

  const btnCont = createEl('div', 'modal-btn-container');
  btnCont.innerHTML = `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>`;
  modalContDiv.appendChild(btnCont);

  modalContDiv.style.display = 'none';
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------

gallery.addEventListener('click', (e) => {
  const clicked = e.path.filter((path) => path.className === 'card')[0];
  const clickedName = clicked.querySelector('#name').textContent;

  const modals = document.getElementsByClassName('modal-name');
  for (let modal of modals) {
    const modalName = modal.textContent;
    if (clickedName === modalName) {
      const closeBtn = modal.parentNode.parentNode.querySelector(
        '#modal-close-btn'
      );

      const modalContainer = modal.parentNode.parentNode.parentNode;
      modalContainer.style.display = 'block';
      closeBtn.addEventListener(
        'click',
        () => (modalContainer.style.display = 'none')
      );
    }
  }
});

// ------------------------------------------
//  HTML
// ------------------------------------------
search.innerHTML = `<form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                    </form>`;
