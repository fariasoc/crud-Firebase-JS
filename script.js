// Modal
const modalWrapper = document.querySelector('.modal-wrapper');

//Adicionar
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// Editar
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

//OK
const btnAdd = document.querySelector('.btn-add');

const tableUsers = document.querySelector('.table-users');

let id;

// Renderização de elemento 

const renderUser = doc => {

  console.log(doc.id)
  console.log(doc.data().firstName)
  const tr = `

  <tr data-id='${doc.id}'>
    <td>${doc.data().firstName}</td>
    <td>${doc.data().lastName}</td>
    <td>${doc.data().phone}</td>
    <td>${doc.data().email}</td>
    <td>
      <button class="btn btn-edit"> Editar </button>
      <button class="btn btn-delete"> Deletar </button>
    </td>
  </tr>

  `;
  tableUsers.insertAdjacentHTML('beforeend', tr);

  // Editar usuário

  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);

  btnEdit.addEventListener('click', () =>{
    
   editModal.classList.add('modal-show');

   id = doc.id;

   editModalForm.firstName.value = doc.data().firstName;
   editModalForm.lastName.value = doc.data().lastName;
   editModalForm.phone.value = doc.data().phone;
   editModalForm.email.value = doc.data().email;

  });

  // Deletar usuário

  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener('click', () =>{
    db.collection('users').doc(`${doc.id}`).delete().then(() => {
      console.log('Documento deletado com sucesso')
    }).catch(err => {
      console.log('Erro ao remover o documento', err)
    })
  });
}

// Adicionar usuário 

btnAdd.addEventListener('click', () => {
  addModal.classList.add('modal-show');

  addModalForm.firstName.value = '';
  addModalForm.lastName.value = '';
  addModalForm.phone.value = '';
  addModalForm.email.value = '';
});

// Clique fora do modal

window.addEventListener('click', e => {
  if (e.target === addModal) {
    addModal.classList.remove('modal-show')
  }
  if(e.target === editModal ){
    editModal.classList.remove('modal-show')
  }
  console.log(e.target, addModal, editModal)
});

// GET || Listar todos os usuários
/*
db.collection('users').get().then(querySnapshot => {
  querySnapshot.forEach(doc => {
    renderUser(doc)
    console.log(doc.data())
  })
})
*/

//Listagem em tempo real
db.collection('users').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change =>{
    console.log(change.type)
    if(change.type === 'added'){
      renderUser(change.doc)
    }
    if(change.type === 'removed'){
      let tr = document.querySelector(`[data-id='${change.doc.id}']`)
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
    }
    if(change.type === 'modified'){
      let tr = document.querySelector(`[data-id='${change.doc.id}']`)
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
      renderUser(change.doc)
    }
  })
})

editModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('users').doc(id).update({
    firstName: editModalForm.firstName.value,
    lastName: editModalForm.lastName.value,
    phone: editModalForm.phone.value,
    email: editModalForm.email.value
  });
  editModal.classList.remove('modal-show');
  
})

// Clique de envio do formulário

addModalForm.addEventListener('submit', e => {
  e.preventDefault();
  console.log(addModalForm.firstName.value)
  db.collection('users').add({
    firstName: addModalForm.firstName.value,
    lastName: addModalForm.lastName.value,
    phone: addModalForm.phone.value,
    email: addModalForm.email.value,   
  });
  modalWrapper.classList.remove('modal-show');
})

