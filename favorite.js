const BOX_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BOX_URL + "/api/v1/users/";
const dataPanel = document.querySelector("#personlist-datapanel");
const iconMode = document.querySelector('#icon-mode')

let filterPersons = []
const PERSONS_PER_PAGE = 24
const PERSONS_Item_PER_PAGE = 12
const persons = JSON.parse(localStorage.getItem('favoritePersons'))
let modeInterface = 1
function renderPersonsList(file) {
  let rawHTML = ``
  file.forEach(function (data) {
    rawHTML += `
      <div class="col-6 col-md-4 col-lg-2 justify-content-center">
        <div class="mb-4">
          <div class="card">
           <img class="card-img-top" src="${data.avatar}" alt="Card image cap">
            <div class="card-body">
              <div class="text-center">
               <h5 class="card-name">${data.name}</h5>
              </div>
              <div class="card-fa text-center" >
                <i class="far fa-address-card mx-3" class="btn-show-person" data-toggle="modal" data-target="#personmodal" data-id="${data.id}"></i>
                <i class="fas fa-trash mx-3"  class="btn-remove-favorite" data-id="${data.id}"></i>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderPersonsItem(file) {
  let rawHTML = ``
  rawHTML += `<ul class="list-group list-group-flush w-100  p-2 d-flex justify-content-center">`
  file.forEach(function (data) {
    rawHTML += `
      <div class="person-item list-group-item  list-group-item-success">
        <div class="row d-flex flex-nowrap ">
          <div class="person-img col-4 col-md-3 col-sm-1">
           <img class="item-img-top " src="${data.avatar}" alt="Card image cap">
          </div>
            <h5 class="item-name my-auto col-6  col-md-6 col-sm-1 text-center">${data.name}</h5>
            <div class="fa-item  my-auto col-2 col-md-3 col-sm-1 text-center">
                <i class="far fa-address-card mx-3" class="btn-show-person" data-toggle="modal" data-target="#personmodal" data-id="${data.id}"></i>
                <i class="fas fa-trash mx-3" class="btn-remove-favorite" data-id="${data.id}"></i>
            </div>
        </div>
      </div>`
  });
  rawHTML += `</ul>`
  dataPanel.innerHTML = rawHTML;
}

function getPersonsByPage(page) {
  const data = filterPersons.length ? filterPersons : persons
  if (modeInterface === 1) {
    const startIndex = ((page - 1) * PERSONS_PER_PAGE)
    return data.slice(startIndex, startIndex + PERSONS_PER_PAGE)
  }
  else if (modeInterface === 2) {
    const startIndex = ((page - 1) * PERSONS_Item_PER_PAGE)
    return data.slice(startIndex, startIndex + PERSONS_Item_PER_PAGE)
  }
}

function showModalPerson(id) {
  const modalName = document.querySelector("#person-modal-name");
  const modalImage = document.querySelector("#person-modal-image");
  const modalGender = document.querySelector("#person-modal-gender");
  const modalEmail = document.querySelector("#person-modal-email");
  const modalBirthday = document.querySelector("#person-modal-birthday");
  const modalRegion = document.querySelector("#person-modal-region");
  axios
    .get(INDEX_URL + id)
    .then(function (response) {
      const data = response.data;
      modalName.innerText = `${data.name + " " + data.surname}`;
      modalImage.innerHTML = `<img class="show-card-img-top"  src="${data.avatar}" alt="Card image cap" class="img-fluid">`;
      modalGender.innerHTML = `${showModalPersongender(data.gender)} : ${data.gender}`
      modalBirthday.innerHTML = `<i class="fas fa-birthday-cake"></i> : ${data.birthday}`;
      modalRegion.innerHTML = `<i class="fas fa-map-marked-alt "></i> : ${data.region}`;
    })
    .catch(function (err) {
      console.err(err);
    });
}

function showModalPersongender(gender) {
  return gender === "male" ? `<i class="fas fa-male border border-primary"></i> ` : `<i class="fas fa-female border border-danger"></i> `
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".fa-address-card")) {
    showModalPerson(Number(event.target.dataset.id));
  }
  if (event.target.matches('.fa-trash')) {
    removeFormFavorite(Number(event.target.dataset.id))
    console.log(event.target.dataset.id)
  }
});

function removeFormFavorite(id) {
  if (!persons) return
  const personIndex = persons.findIndex((person) => person.id === id)
  persons.splice(personIndex, 1)
  if (personIndex === -1) return
  localStorage.setItem('favoritePersons', JSON.stringify(persons))
  if (modeInterface === 1) {
    renderPersonsList(persons)
  }
  else if (modeInterface === 2) {
    renderPersonsItem(persons)
  }
}

iconMode.addEventListener('click', function oniconModeclicked(event) {
  if (event.target.matches('.fa-th')) {
    modeInterface = 1
    renderPersonsList(getPersonsByPage(1))
  }
  else if (event.target.matches('.fa-list')) {
    modeInterface = 2
    renderPersonsItem(getPersonsByPage(1))
  }
})
renderPersonsList(persons);