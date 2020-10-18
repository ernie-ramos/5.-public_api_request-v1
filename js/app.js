const gallery = document.getElementById('gallery');
const modals = document.getElementById('modals');
const body = gallery.parentNode;
const search = document.querySelector('.search-container');
const modalContainerList = document.getElementsByClassName('modal-container');
const numOfAPIresults = 12;

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
    `https://randomuser.me/api/?results=${numOfAPIresults}&inc=picture,name,email,location,cell,dob&nat=us,gb,au,ca`
  ),
]).then((data) => {
  data.forEach((employees) => {
    employees.results.forEach((employee, index) => {
      createGalleryHTML(employee, index);
      createModalHTML(employee, index);
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

const createEl = (elem, claName, index) => {
  const e = document.createElement(elem);
  e.className = claName;
  e.id = index;
  return e;
};

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
gallery.addEventListener('click', (e) => {
  cardID = e.path.filter((path) => path.className === 'card')[0].id;
  for (let modal of modalContainerList) {
    const modalID = modal.id;
    if (cardID === modalID) {
      modal.style.display = 'block';
    }
  }
});
modals.addEventListener('click', (e) => {
  modalID = parseInt(
    e.path.filter((path) => path.className === 'modal-container')[0].id
  );
  let showID;
  if (e.target.textContent === 'X') {
    modals.childNodes[modalID].style.display = 'none';
  }
  if (e.target.textContent === 'Prev') {
    if (modalID == 0) {
      showID = 11;
    } else {
      showID = modalID - 1;
    }
    modals.childNodes[modalID].style.display = 'none';
    modals.childNodes[showID].style.display = 'block';
  }
  if (e.target.textContent === 'Next') {
    if (modalID == 11) {
      showID = 0;
    } else {
      showID = modalID + 1;
    }
    modals.childNodes[modalID].style.display = 'none';
    modals.childNodes[showID].style.display = 'block';
  }
});
search.addEventListener('keyup', (e) => {
  const input = search.childNodes[0].childNodes[1].value;
  for (let card of gallery.childNodes) {
    const name = card.childNodes[1].childNodes[0].textContent;

    if (!name.includes(input)) {
      card.style.display = 'none';
    } else if (name.includes(input) && card.style.display === 'none') {
      card.style.display = 'block';
    } else if (input.length === 0) {
      card.style.display = 'block';
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

function createGalleryHTML(employee, index) {
  const pictures = employee.picture;
  const fullName = employee.name;
  const email = employee.email;
  const location = employee.location;

  const cardDiv = createEl('div', 'card', index);
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

function createModalHTML(employee, index) {
  const pictures = employee.picture;
  const fullName = employee.name;
  const email = employee.email;
  const location = employee.location;
  const cell = employee.cell;
  const dob = new Date(employee.dob.date);
  const formattedDOB = dob.toLocaleDateString();

  const modalDiv = createEl('div', 'modal-div');
  const modalContDiv = createEl('div', 'modal-container', index);
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

  modals.appendChild(modalContDiv);
  modalContDiv.appendChild(modal);
  modal.appendChild(button);
  modal.appendChild(modalInfoContainer);

  const btnCont = createEl('div', 'modal-btn-container');
  btnCont.innerHTML = `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>`;
  modalContDiv.appendChild(btnCont);

  modalContDiv.style.display = 'none';
}
