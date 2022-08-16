document.addEventListener('DOMContentLoaded', function () {
  const inputBook = document.getElementById('inputBook');
  inputBook.addEventListener('submit', function (event) {
      event.preventDefault();
      const modalBox = document.querySelector('.overlay-box');
      overlay.style.display = "none";
      modalBox.style.display = "block";
      addBook();
  });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
});


const books = [];
const RENDER_EVENT = 'render-book';

function addBook() {
  const generatedID = generateId();
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const bookIsComplete = document.querySelector('#inputBookIsComplete').checked;
  const bookNote = document.getElementById('inputBookNote').value; 
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookNote, bookIsComplete);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, note, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    note,
    isCompleted
  }
}

function makeBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.classList.add('title-book');
    bookTitle.innerText = bookObject.title;
    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookObject.author;
    const bookYear = document.createElement('p');
    bookYear.innerText = bookObject.year;
    const bookNote = document.createElement('p');
    bookNote.innerText = bookObject.note;
   
    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(bookTitle, bookAuthor, bookYear, bookNote);

    if (bookObject.isCompleted === true) {
      // Switch
      const switchButton = document.createElement('button');
      switchButton.classList.add('switch-button');
      switchButton.innerText = 'Belum selesai';
      switchButton.addEventListener('click', function () {
        const modalConfirmBox = document.querySelector('.overlay-confirm');
        const modalConfirmOk = document.querySelector('.modal-confirm-ok');
        const modalConfirmCancel = document.querySelector('.modal-confirm-cancel');
        modalConfirmBox.style.display = "block";

        modalConfirmOk.addEventListener('click', function() {
          switchBookFromCompleted(bookObject.id);
          modalConfirmBox.style.display = "none";
        });
        modalConfirmCancel.addEventListener('click', function() {
          modalConfirmBox.style.display = "none";
        });
      });

      // Delete
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-button');
      deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';
    
      deleteButton.addEventListener('click', function () {
        const modalDeleteCancel = document.querySelector('.modal-delete-cancel');
        const modalDeleteBox = document.querySelector('.overlay-delete');
        const modalDeleteOk = document.querySelector('.modal-delete-ok');
        modalDeleteBox.style.display = "block";

        modalDeleteOk.addEventListener('click', function() {
          removeBookFromCompleted(bookObject.id);
          modalDeleteBox.style.display = "none";
        });
        modalDeleteCancel.addEventListener('click', function() {
          modalDeleteBox.style.display = "none";
        });
      });

      // Edit
      const editButton = document.createElement('button');
      const closeBtn = document.querySelector('.close-btn');
      const overlay = document.querySelector('.overlay-edit');
      editButton.classList.add('edit-button');
      editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
      
      editButton.addEventListener('click', function() {
        console.log(bookObject);
        editBook(bookObject.id);
        overlay.style.display = "block";
      });

      closeBtn.addEventListener('click', function() {
        overlay.style.display = "none";
      });


      const container2 = document.createElement('div');
      container2.classList.add('action');
      container2.append(switchButton, deleteButton, editButton);
      container.append(container2);
    } else {
        // Switch
        const switchButton = document.createElement('button');
        switchButton.classList.add('switch-button');
        switchButton.innerText = 'Sudah selesai';
    
        switchButton.addEventListener('click', function () {
          const modalConfirmCancel = document.querySelector('.modal-confirm-cancel');
          const modalConfirmBox = document.querySelector('.overlay-confirm');
          const modalConfirmOk = document.querySelector('.modal-confirm-ok');
          modalConfirmBox.style.display = "block";
          
          modalConfirmOk.addEventListener('click', function() {
            addBookToCompleted(bookObject.id);
            modalConfirmBox.style.display = "none";
          });
          modalConfirmCancel.addEventListener('click', function() {
            modalConfirmBox.style.display = "none";
          });
        });
        
        // Delete
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';
    
        deleteButton.addEventListener('click', function () {
          const modalDeleteCancel = document.querySelector('.modal-delete-cancel');
          const modalDeleteBox = document.querySelector('.overlay-delete');
          const modalDeleteOk = document.querySelector('.modal-delete-ok');
          modalDeleteBox.style.display = "block";

          modalDeleteOk.addEventListener('click', function() {
            removeBookFromCompleted(bookObject.id);
            modalDeleteBox.style.display = "none";
          });
          modalDeleteCancel.addEventListener('click', function() {
            modalDeleteBox.style.display = "none";
          });
        });

        // Edit
        const editButton = document.createElement('button');
        const closeBtn = document.querySelector('.close-btn');
        const overlay = document.querySelector('.overlay-edit');
        editButton.classList.add('edit-button');
        editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
        
        editButton.addEventListener('click', function() {
          console.log(bookObject);
          editBook(bookObject.id);
          overlay.style.display = "block";
        });

        closeBtn.addEventListener('click', function() {
          overlay.style.display = "none";
        });


        const container2 = document.createElement('div');
        container2.classList.add('action');
        container2.append(switchButton, deleteButton, editButton);
        container.append(container2);
    }
  
  return container;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
for (const index in books) {
  if (books[index].id === bookId) {
    return index;
  }
}
return -1;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function switchBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  document.getElementById('inputBookTitleEdit').value = bookTarget.title;
  document.getElementById('inputBookAuthorEdit').value = bookTarget.author;
  document.getElementById('inputBookYearEdit').value = bookTarget.year;
  document.getElementById('inputBookNoteEdit').value = bookTarget.note;
  document.getElementById('inputBookIsCompleteEdit').checked = bookTarget.isCompleted;

  const inputEdit = document.getElementById('inputBookEdit');
  const overlay = document.querySelector('.overlay-edit');
  const modalEdit = document.querySelector('.overlay-modal-edit');
  const modalButtonEdit = document.querySelector('.modal-button-edit');
  inputEdit.addEventListener('submit', function(event) {
    event.preventDefault();
    updateData(bookTarget.id);
    modalEdit.style.display = "block";
    overlay.style.display = "none";
  });

  modalButtonEdit.addEventListener('click', function() {
    window.location.reload();
  });
}

function updateData(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  console.log(bookTarget);
  bookTarget.title = document.getElementById('inputBookTitleEdit').value;
  bookTarget.author = document.getElementById('inputBookAuthorEdit').value;
  bookTarget.year = document.getElementById('inputBookYearEdit').value;
  bookTarget.note = document.getElementById('inputBookNoteEdit').value;
  bookTarget.isCompleted = document.getElementById('inputBookIsCompleteEdit').checked;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Modal addBook
const addButton = document.querySelector('.add-book');
const closeButton = document.querySelector('.close-button');
const overlay = document.querySelector('.overlay');
addButton.addEventListener('click', function() {
  overlay.style.display = "block";
});

closeButton.addEventListener('click', function() {
  overlay.style.display = "none";
});

// Search
const searchInput = document.getElementById('searchBookTitle');
searchInput.addEventListener('keyup', function() {
  let input, filter, i, txtValue;
  input = searchInput;
  filter = input.value.toLowerCase();
  bookCard = document.getElementsByClassName('book_item');

  for (i = 0; i < bookCard.length; i++) {
    results = bookCard[i].getElementsByClassName("title-book")[0];
    txtValue = results.textContent.toLowerCase() || results.innerText.toLowerCase();
    if (txtValue.indexOf(filter) > -1) {
      bookCard[i].style.display = "block";
    } else {
      bookCard[i].style.display = "none";
    }
  }
});

// Success addBook
const modalBox = document.querySelector('.overlay-box');
const modalButton = document.querySelector('.modal-button');
modalButton.addEventListener('click', function() {
  overlay.style.display = "none";
  modalBox.style.display = "none";
});

// Arrow
const headShelf = document.querySelector('#uncomplete-head-shelf')
const headShelfIcon = document.querySelector('#uncomplete-arrow-icon');
const bookCardUncomplete = document.querySelector('#uncompleteBookshelfList');
const bookCardUncomplete2 = document.querySelector('#uncomplete-book-shelf');
headShelf.addEventListener('click', () => {
    headShelfIcon.classList.toggle('icon-transform');
    bookCardUncomplete.classList.toggle('hide-card');
    bookCardUncomplete2.classList.toggle('decrease-height');
});

const headShelf2 = document.querySelector('#complete-head-shelf')
const headShelfIcon2 = document.querySelector('#complete-arrow-icon');
const bookCardComplete = document.querySelector('#completeBookshelfList');
const bookCardComplete2 = document.querySelector('#complete-book-shelf');
headShelf2.addEventListener('click', () => {
    headShelfIcon2.classList.toggle('icon-transform');
    bookCardComplete.classList.toggle('hide-card');
    bookCardComplete2.classList.toggle('decrease-height');
});


// Local Storage
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}
  
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById('uncompleteBookshelfList');
  uncompletedBookList.innerHTML = '';
  
  const completedBookList = document.getElementById('completeBookshelfList');
  completedBookList.innerHTML = '';
  
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted)
      uncompletedBookList.append(bookElement);
    else
      completedBookList.append(bookElement);
  }
});