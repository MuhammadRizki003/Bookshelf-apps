const books = [];
const RENDER_EVENT = 'render-book';
function generateId() {
    return +new Date();
}
function generateBooks(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}
function addBook() {
    const bookTitle = document.getElementById('inputTitle').value;
    const bookAuthor = document.getElementById('inputAuthor').value;
    const bookYear = parseInt(document.getElementById('inputYear').value);
    const isComplete = document.getElementById('inputIsComplete').checked;
    const bookId = generateId();
    const bookInfo = generateBooks(bookId, bookTitle, bookAuthor, bookYear, isComplete);
    books.push(bookInfo);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
document.addEventListener(RENDER_EVENT, function () {
    const notFinishedBook = document.getElementById('unread');
    const finishedBook = document.getElementById('read');
    notFinishedBook.innerHTML = '';
    finishedBook.innerHTML = '';
    const countBook = document.getElementById('jumlahBuku');
    countBook.innerText = books.length;
    for (const bookItem of books) {
        const bookElement = createBookList(bookItem);
        if (bookItem.isComplete) {
            finishedBook.append(bookElement);
        } else {
            notFinishedBook.append(bookElement);
        }
    }
});
function createBookList(bookItem) {
    const { id, title, author, year, isComplete, } = bookItem;
    const cover = document.createElement('img');
    cover.setAttribute('src', 'assets/img/cover.jpeg');
    const bookTitle = document.createElement('h2');
    bookTitle.innerText = title;
    bookTitle.classList.add('bookTitle');
    const desc = document.createElement('p');
    desc.innerText = `${year} • ${author}`
    const bookList = document.createElement('div');
    bookList.classList.add('bookList');
    bookList.setAttribute('id', `book-${id}`)
    const bookInfo = document.createElement('div');
    bookInfo.classList.add('bookInfo');
    if (isComplete) {
        const infoButton = document.createElement('div');
        infoButton.classList.add('infoButton');
        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.innerHTML = `<img src="assets/img/edit.png" alt="edit">`;
        editButton.addEventListener('click', function () {
            edit(id);
        })
        const replayButton = document.createElement('button');
        replayButton.classList.add('replay');
        replayButton.innerHTML = `<img src="assets/img/replay.png" alt="replay">`;
        replayButton.addEventListener('click', function () {
            change(id);
        })
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = `<img src="assets/img/delete.png" alt="delete">`;
        deleteButton.addEventListener('click', function () {
            deleteBook(id);
        })
        infoButton.append(editButton, replayButton, deleteButton);
        bookInfo.append(bookTitle, desc, infoButton);
        bookList.append(cover, bookInfo);
    } else {
        const infoButton = document.createElement('div');
        infoButton.classList.add('infoButton');
        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.innerHTML = `<img src="assets/img/edit.png" alt="edit">`;
        editButton.addEventListener('click', function () {
            edit(id);
        })
        const doneButton = document.createElement('button');
        doneButton.classList.add('done');
        doneButton.innerHTML = `<img src="assets/img/check-list.png" alt="done">`;
        doneButton.addEventListener('click', function () {
            change(id);
        })
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = `<img src="assets/img/delete.png" alt="delete">`;
        deleteButton.addEventListener('click', function () {
            deleteBook(id);
        })
        infoButton.append(editButton, doneButton, deleteButton);
        bookInfo.append(bookTitle, desc, infoButton);
        bookList.append(cover, bookInfo);
    }
    return bookList;
}
document.addEventListener('DOMContentLoaded', function () {
    const addBookButton = document.getElementById('addBook');
    addBookButton.addEventListener('click', function () {
        const form = document.getElementById('modal-form');
        form.style.display = 'flex';
    })
    const closeButton = document.getElementById('close');
    closeButton.addEventListener('click', function () {
        const form = document.getElementById('modal-form');
        form.style.display = 'none';
    })
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const form = document.getElementById('modal-form');
        form.style.display = 'none';
        addBook();
        submitForm.reset();
    });
    const closeEditButton = document.getElementById('closeEdit');
    closeEditButton.addEventListener('click', function () {
        const form = document.getElementById('modal-edit');
        form.style.display = 'none';
    })
    const submitEdit = document.getElementById('inputEdit');
    submitEdit.addEventListener('submit', function (event) {
        event.preventDefault();
        const form = document.getElementById('modal-edit');
        form.style.display = 'none';
        processEdit();
        submitEdit.reset();
    });
    if (cekStorage()) {
        loadLocalData();
    }
});

const SAVE_EVENT = 'saveBook';
const STORAGE_KEY = 'BOOK_SHELF';
function cekStorage() {
    if (typeof (Storage) === undefined) {
        alert('Browser ini tidak support local storage');
        return false;
    }
    return true;
}
document.addEventListener(SAVE_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
    let localData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    localData = localData[localData.length - 1];
    let tempat = '';
    if (localData.isComplete) {
        tempat = 'Selesai dibaca'
    } else {
        tempat = 'Belum selesai dibaca'
    }
    alert(`Buku ${localData.title} berhasil disimpan di list ${tempat}.`);
});
function loadLocalData() {
    const localData = localStorage.getItem(STORAGE_KEY);
    let allBooks = JSON.parse(localData);
    if (allBooks !== null) {
        for (const bookItem of allBooks) {
            books.push(bookItem);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}
function saveData(message = null) {
    if (cekStorage()) {
        const parsedDataBook = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsedDataBook);
        if (!message) {
            document.dispatchEvent(new Event(SAVE_EVENT));
        } else {
            alert(message);
        }
    }
}
function customAlert(book, condition) {
    let message = '';
    if (condition == 'done') {
        message = 'telah selesai dibaca.';
    } else if (condition == 'delete') {
        message = 'telah berhasil dihapus.';
    } else if (condition == 'notDone') {
        message = 'kembali dibaca ulang.';
    } else if (condition == 'edit') {
        message = 'sudah diperbarui';
    }
    return `Buku ${book} ${message}`;
}
function findBookIndex(bookId) {
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            return i;
        }
    }
    return -1;
}
function deleteBook(bookId) {
    const deleteIndex = findBookIndex(bookId);
    if (deleteIndex === -1) return;
    const message = customAlert(books[deleteIndex].title, 'delete')
    books.splice(deleteIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(message);
}
function edit(bookId) {
    const editIndex = findBookIndex(bookId);
    document.getElementById('inputTitleEdit').setAttribute('placeholder', `Judul : ${books[editIndex].title}`);
    document.getElementById('inputAuthorEdit').setAttribute('placeholder', `Penulis : ${books[editIndex].author}`);
    document.getElementById('inputYearEdit').setAttribute('placeholder', `Tahun Terbit : ${books[editIndex].year}`)
    document.getElementById('inputIdBook').setAttribute('value', books[editIndex].id);
    const form = document.getElementById('modal-edit');
    form.style.display = 'flex';
}
function processEdit() {
    let titleEdit = document.getElementById('inputTitleEdit').value;
    let authorEdit = document.getElementById('inputAuthorEdit').value;
    let yearEdit = document.getElementById('inputYearEdit').value;
    const idEdit = document.getElementById('inputIdBook').value;
    const editIndex = findBookIndex(parseInt(idEdit));
    if (!titleEdit) {
        titleEdit = books[editIndex].title
    };
    if (!authorEdit) {
        authorEdit = books[editIndex].author
    };
    if (!yearEdit) {
        yearEdit = books[editIndex].year
    };
    books[editIndex].title = titleEdit;
    books[editIndex].author = authorEdit;
    books[editIndex].year = parseInt(yearEdit);
    document.dispatchEvent(new Event(RENDER_EVENT));
    const message = customAlert(books[editIndex].title, 'edit')
    saveData(message);
}
function change(bookId) {
    const change = findBookIndex(bookId);
    if (change === -1) return;
    if (books[change].isComplete == true) {
        books[change].isComplete = false;
        const message = customAlert(books[change].title, 'notDone');
        saveData(message);
    } else {
        books[change].isComplete = true;
        const message = customAlert(books[change].title, 'done');
        saveData(message);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}
function findResult(bookTitle) {
    const resultBook = [];
    for (let i = 0; i < books.length; i++) {
        const book = (books[i].title).toLowerCase();
        if (book.includes(bookTitle.toLowerCase())) {
            resultBook.push(books[i]);
        }
    }
    const notFinishedBook = document.getElementById('unread');
    const finishedBook = document.getElementById('read');
    notFinishedBook.innerHTML = '';
    finishedBook.innerHTML = '';
    for (const bookItem of resultBook) {
        const bookElement = createBookList(bookItem);
        if (bookItem.isComplete) {
            finishedBook.append(bookElement);
        } else {
            notFinishedBook.append(bookElement);
        }
    }
}
const buttonSearch = document.getElementById('inputSearch');
buttonSearch.addEventListener('submit', function (event) {
    event.preventDefault();
    const bookTitle = document.getElementById('searchTitle').value;
    findResult(bookTitle);
    document.getElementById('searchTitle').value = '';
})