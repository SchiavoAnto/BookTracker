const form = document.getElementById("form");
const backButton = document.getElementById("back-button");
const doneButton = document.getElementById("done-button");

const coverPreview = document.getElementById("cover-preview");
const coverInput = document.getElementById("cover-input");
const loadingSpinner = document.getElementById("loading-spinner");
const isbnInput = document.getElementById("isbn-input");
const titleInput = document.getElementById("title-input");
const authorInput = document.getElementById("author-input");
const publisherInput = document.getElementById("publisher-input");
const pageCountInput = document.getElementById("page-count-input");
const genreInput = document.getElementById("genre-input");
const currentPageInput = document.getElementById("current-page-input");
const startDateInput = document.getElementById("start-date-input");
const endDateInput = document.getElementById("end-date-input");
const ratingInput = document.getElementById("rating-input");
const notesInput = document.getElementById("notes-input");

const authorDatalist = document.getElementById("author-datalist");
const publisherDatalist = document.getElementById("publisher-datalist");
const genreDatalist = document.getElementById("genre-datalist");

backButton.addEventListener("click", () => {
    if (needsBackConfirmation() &&
        !confirm("Vuoi davvero annullare le modifiche e tornare indietro?")) return;
    document.documentElement.setAttribute("vt-direction", "back");
    window.location.replace("index.html");
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const book = {
        isbn: isbnInput.value.trim(),
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        publisher: publisherInput.value.trim(),
        pageCount: parseInt(pageCountInput.value),
        genre: genreInput.value.trim(),
        currentPage: parseInt(currentPageInput.value || 0),
        readingStartedDate: startDateInput.value.trim(),
        readingEndedDate: endDateInput.value.trim(),
        rating: ratingInput.value,
        notes: notesInput.value.trim(),
        cover: coverPreview.getAttribute("src") ?? ""
    };
    addBook(book);
    
    window.location.replace("index.html");
});

isbnInput.addEventListener("change", async (e) => {
    loadingSpinner.removeAttribute("hidden");
    const isbnValue = e.target.value.trim();

    const dataResponse = await fetch(`https://openlibrary.org/isbn/${isbnValue}.json`);
    let authorUrl = null;
    if (dataResponse.status == 200) {
        const jsonData = await dataResponse.json();
        if (jsonData.title)
            titleInput.value = jsonData.title;
        if (jsonData.authors)
            authorUrl = jsonData.authors[0].key;
        if (jsonData.publishers)
            publisherInput.value = jsonData.publishers[0];
        if (jsonData.number_of_pages)
            pageCountInput.value = jsonData.number_of_pages;
    }

    if (authorUrl) {
        const authorResponse = await fetch(`https://openlibrary.org${authorUrl}.json`);
        if (authorResponse.status == 200) {
            const data = await authorResponse.json();
            if (data.name)
                authorInput.value = data.name;
        }
    }

    if (coverInput.files.length > 0) {
        // The user has manually selected a cover image so we don't override it.
        loadingSpinner.setAttribute("hidden", "");
        return;
    }
    try {
        const response = await fetch(`https://covers.openlibrary.org/b/isbn/${isbnValue}-M.jpg`);
        const blob = await response.blob();
        loadFileInCoverPreview(blob);
    } finally {
        loadingSpinner.setAttribute("hidden", "");
    }
});

coverInput.addEventListener("change", () => {
    loadFileInCoverPreview(coverInput.files[0]);
});

doneButton.addEventListener("click", () => {
    document.documentElement.setAttribute("vt-direction", "back");
    form.requestSubmit();
});

function needsBackConfirmation() {
    return coverInput.files.length > 0 ||
        isbnInput.value ||
        titleInput.value ||
        authorInput.value ||
        publisherInput.value ||
        pageCountInput.value ||
        genreInput.value ||
        currentPageInput.value ||
        startDateInput.value ||
        endDateInput.value ||
        ratingInput.value > 0 ||
        notesInput.value;
}

function loadFileInCoverPreview(file) {
    const reader = new FileReader();
    reader.onload = () => {
        coverPreview.setAttribute("src", reader.result);
    };
    reader.readAsDataURL(file);
    loadingSpinner.setAttribute("hidden", "");
}

function pickCoverFile() {
    coverInput.click();
}

(() => {
    pageCountInput.addEventListener("input", () => {
        currentPageInput.setAttribute("max", pageCountInput.value);
    });

    const authors = new Set();
    const publishers = new Set();
    const genres = new Set();
    getBooks((book) => {
        if (book.author)
            authors.add(book.author);
        if (book.publisher)
            publishers.add(book.publisher);
        if (book.genre)
            genres.add(book.genre);
    },
    () => {
        for (const author of authors) {
            const item = document.createElement("option");
            item.setAttribute("value", author);
            authorDatalist.appendChild(item);
        }
        for (const publisher of publishers) {
            const item = document.createElement("option");
            item.setAttribute("value", publisher);
            publisherDatalist.appendChild(item);
        }
        for (const genre of genres) {
            const item = document.createElement("option");
            item.setAttribute("value", genre);
            genreDatalist.appendChild(item);
        }
    });
})();