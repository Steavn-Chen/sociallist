const BOX_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BOX_URL + "/api/v1/users/";
const dataPanel = document.querySelector("#personlist-datapanel");

const persons = [];
let filterPersons = []
const PERSONS_PER_PAGE = 24
let modeInterface = 1
const PERSONS_Item_PER_PAGE = 12
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const iconMode = document.querySelector('#icon-mode')

function renderPersonsList(file) {
  let rawHTML = ``
  file.forEach(function (data) {
    rawHTML += `
      <div class="col-6 col-md-4 col-lg-2 justify-content-center ">
        <div class="mb-4">
            <div class="card  ">
               <div class="card-img-top p-2 ">
                 <img class="card-img border-2 ${renderPersonsListgender(data.gender)} img-fluid" src="${data.avatar}"   alt="Card image cap">
               </div>
               <div class="card-body">
                  <div class="text-center">
                   <h5 class="card-name">${data.name}</h5>
                  </div>
                  <div class="card-fa text-center" >
                   <i class="far fa-address-card mx-3" class="btn-show-person" data-toggle="modal" data-target="#personmodal" data-id="${data.id}"></i>
                     <i class="far fa-heart mx-3" class="btn-add-favorite" data-id="${data.id}"></i>
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
      <div class="person-item list-group-item list-group-item-success ">
        <div class="row d-flex flex-nowrap ">
          <div class="person-img col-4 col-md-3 col-sm-1">
           <img class="item-img-top " src="${data.avatar}" alt="Card image cap">
          </div>
            <h5 class="item-name my-auto col-6  col-md-6 col-sm-1 text-center">${data.name}</h5>
            <div class="fa-item  my-auto col-2 col-md-3 col-sm-1 text-center">
                <i class="far fa-address-card mx-3" class="btn-show-person" data-toggle="modal" data-target="#personmodal" data-id="${data.id}"></i>
                <i class="far fa-heart mx-3" class="btn-add-favorite" data-id="${data.id}"></i>
                
            </div>
        </div>
      </div>
    `;
  });
  rawHTML += `</ul>`
  dataPanel.innerHTML = rawHTML;
}

function renderPersonsListgender(gender) {
  return gender === "male" ? ` border-primary ` : ` border-danger `
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
  console.log(modeInterface)
}

function renderPaginator(amount) {
  if (modeInterface === 1) {
    const numberOfPages = Math.ceil(amount / PERSONS_PER_PAGE)
    let rawHTML = ``
    for (let page = 1; page <= numberOfPages; page++) {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
    }
    paginator.innerHTML = rawHTML
  }
  else if (modeInterface === 2) {
    const numberOfPages = Math.ceil(amount / PERSONS_Item_PER_PAGE)
    let rawHTML = ``
    for (let page = 1; page <= numberOfPages; page++) {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
    }
    paginator.innerHTML = rawHTML
  }
}

function addToFavorite(id) {
  console.log(id)
  const list = JSON.parse(localStorage.getItem("favoritePersons")) || []
  const person = persons.find(function (person) {
    return person.id === id
  })
  if (list.some(function (person) {
    return person.id === id
  }))
    return alert("此會員己加入好友清單中了")
  list.push(person)
  localStorage.setItem('favoritePersons', JSON.stringify(list))
}

axios
  .get(INDEX_URL)
  .then(function (response) {
    persons.push(...response.data.results);
    renderPersonsList(getPersonsByPage(1))
    renderPaginator(persons.length)
  })
  .catch(function (err) {
    console.err(err);
  });

function showModalPerson(id) {
  const modalName = document.querySelector("#person-modal-name");
  const modalImage = document.querySelector("#person-modal-image");
  const modalGender = document.querySelector("#person-modal-gender");
  const modalEmail = document.querySelector("#person-modal-email");
  const modalBirthday = document.querySelector("#person-modal-birthday");
  const modalRegion = document.querySelector("#person-modal-region");
  const modalremovebtn = document.querySelector("#person-modal-remove-btn")
  axios
    .get(INDEX_URL + id)
    .then(function (response) {
      console.log(response);
      const data = response.data;
      modalName.innerText = `${data.name + " " + data.surname}`;
      console.log(modalName);
      modalImage.innerHTML = `<img class="show-card-img-top"  src="${data.avatar}" alt="Card image cap" class="img-fluid">`;
      modalGender.innerHTML = `${showModalPersongender(data.gender)} : ${data.gender}`
      console.log(modalGender)
      modalEmail.innerHTML = `<i class="far fa-envelope"></i> : ${data.email}`;
      modalBirthday.innerHTML = `<i class="fas fa-birthday-cake"></i> : ${data.birthday}`;
      modalRegion.innerHTML = `<i class="fas fa-map-marked-alt "></i> : ${data.region}`;
      modalremovebtn.innerHTML = `<i class="btn-remove-favorite" data-id="${data.id} ">刪除好友</i>`
    })
    .catch(function (err) {
      console.err(err);
    });
}

function showModalPersongender(gender) {
  return gender === "male" ? `<i class="fas fa-male border border-primary"></i> ` : `<i class="fas fa-female border border-danger"></i> `
}

function removeFormFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoritePersons")) || []
  if (!list) return
  console.log(list)
  if (list.every(function (person) {
    return person.id !== id
  }))
    return alert("此會員不在好友清單中")
  const listIndex = list.findIndex((person) => person.id === id)
  list.splice(listIndex, 1)
  console.log(list)
  if (listIndex === -1) return
  localStorage.setItem('favoritePersons', JSON.stringify(list))
  return alert('你己將此會員從好友清單移除')

}
const btnremovebutton = document.querySelector('.btn-remove-favorite')
console.log(btnremovebutton)
personmodal.addEventListener("click", function onPersonmodalClicked(event) {
  if (event.target.matches(".btn-remove-favorite")) {
    removeFormFavorite(Number(event.target.dataset.id))
  }
})

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".fa-address-card")) {
    console.log(event.target.dataset.id);
    showModalPerson(Number(event.target.dataset.id));
  }
  if (event.target.matches('.fa-heart')) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  if (modeInterface === 1) {
    renderPersonsList(getPersonsByPage(page))
  }
  else if (modeInterface === 2) {
    renderPersonsItem(getPersonsByPage(page))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmited(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filterPersons = persons.filter(function (person) {
    return person.name.toLowerCase().includes(keyword)
  })
  if (filterPersons.length === 0) {
    return alert('請輸入類別中的關鍵詞')
  }
  console.log(filterPersons)
  renderPersonsList(getPersonsByPage(1))
  renderPaginator(filterPersons.length)
  if (modeInterface === 1) {
    renderPersonsList(getPersonsByPage(1))
  }
  else if (modeInterface === 2) {
    renderPersonsItem(getPersonsByPage(1))
  }
})

iconMode.addEventListener('click', function oniconModeclicked(event) {
  const datalength = filterPersons.length ? filterPersons : persons
  if (event.target.matches('.fa-th')) {
    modeInterface = 1
    renderPersonsList(getPersonsByPage(1))
    renderPaginator(datalength.length)
  }
  else if (event.target.matches('.fa-list')) {
    modeInterface = 2
    renderPersonsItem(getPersonsByPage(1))
    renderPaginator(datalength.length)
  }
})

