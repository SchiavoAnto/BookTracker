const params = new URLSearchParams(window.location.search);
const isbn = params.get("isbn");
const title = params.get("title");

const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");
const titleEl = document.getElementById("page-title");
pageTitleHeaderEl = document.getElementById("page-title-header");
const coverPreviewEl = document.getElementById("cover-preview");
const authorTextEl = document.getElementById("author-text");
const publisherTextEl = document.getElementById("publisher-text");
const pageCountTextEl = document.getElementById("page-count-text");
const genreTextEl = document.getElementById("genre-text");
const isbnTextEl = document.getElementById("isbn-text");
const currentPageInput = document.getElementById("current-page-input");
const startDateInput = document.getElementById("start-date-input");
const endDateInput = document.getElementById("end-date-input");
const ratingInput = document.getElementById("rating-input");
const notesInput = document.getElementById("notes-input");

let book;

titleEl.textContent = title;
pageTitleHeaderEl.textContent = title;

saveButton.addEventListener("click", () => {
    updateBook(book);
    document.documentElement.setAttribute("vt-direction", "back");
    window.location.replace("index.html");
});
deleteButton.addEventListener("click", () => {
    if (!confirm(`Sei sicuro/a di voler eliminare ${title}?`)) return;
    deleteBook(book.isbn);
    document.documentElement.setAttribute("vt-direction", "back");
    window.location.replace("index.html");
});

currentPageInput.addEventListener("input", () => {
    book.currentPage = parseInt(currentPageInput.value);
});
startDateInput.addEventListener("input", () => {
    book.readingStartedDate = startDateInput.value;
});
endDateInput.addEventListener("input", () => {
    book.readingEndedDate = endDateInput.value;
});
ratingInput.addEventListener("value-change", (e) => {
    book.rating = e.value;
});
notesInput.addEventListener("input", () => {
    book.notes = notesInput.value;
});

(() => {
    getBook(isbn, (_book) => {
        book = _book;
        coverPreviewEl.setAttribute("src", book.cover);
        authorTextEl.textContent = `di ${book.author}`;
        if (book.publisher)
            publisherTextEl.textContent = book.publisher;
        pageCountTextEl.textContent = `${book.pageCount} pagine`;
        if (book.genre)
            genreTextEl.textContent = `Genere: ${book.genre}`;
        isbnTextEl.textContent = book.isbn;
        
        currentPageInput.value = book.currentPage;
        startDateInput.value = book.readingStartedDate;
        endDateInput.value = book.readingEndedDate;
        ratingInput.setAttribute("value", book.rating);
        notesInput.value = book.notes;
    });
})();