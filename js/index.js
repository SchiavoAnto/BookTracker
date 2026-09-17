const booksGrid = document.getElementById("books-grid");
const searchBar = document.getElementById("search-bar");
const sortingInput = document.getElementById("sorting-input");
const searchFiltersCheckbox = document.getElementById("search-filters-checkbox");
const sortFilterContainer = document.getElementById("sort-filter-container");
const readFilterCheckbox = document.getElementById("read-filter-checkbox");

function displayBooks() {
    booksGrid.replaceChildren();
    
    const books = [];
    getBooks((book) => {
        books.push(book);
    },
    () => {
        const sortingMode = sortingInput.value;
        let sortFn;
        switch (sortingMode) {
            case "title-asc":
                sortFn = (a, b) => a.title > b.title;
                break;
            case "title-desc":
                sortFn = (a, b) => a.title < b.title;
                break;
            case "author-asc":
                sortFn = (a, b) => a.author > b.author;
                break;
            case "author-desc":
                sortFn = (a, b) => a.author < b.author;
                break;
            case "rating-asc":
                sortFn = (a, b) => a.rating > b.rating;
                break;
            case "rating-desc":
                sortFn = (a, b) => a.rating < b.rating;
                break;
            case "start-date-asc":
                sortFn = (a, b) => new Date(b.readingStartedDate) - new Date(a.readingStartedDate);
                break;
            case "start-date-desc":
                sortFn = (a, b) => new Date(a.readingStartedDate) - new Date(b.readingStartedDate);
                break;
            case "end-date-asc":
                sortFn = (a, b) => new Date(b.readingEndedDate) - new Date(a.readingEndedDate);
                break;
            case "end-date-desc":
                sortFn = (a, b) => new Date(a.readingEndedDate) - new Date(b.readingEndedDate);
                break;
        }

        const query = searchBar.value.trim().toLowerCase();
        
        const filtered = books.filter((elem) => {
            return elem.title.toLowerCase().includes(query) ||
                elem.author.toLowerCase().includes(query) ||
                elem.publisher.toLowerCase().includes(query) ||
                elem.pageCount.toString() === query ||
                elem.rating.toString() === query ||
                elem.notes.toLowerCase().includes(query);
        }).filter((elem) => {
            if (readFilterCheckbox.checked) {
                return true;
            } else {
                let hasToBeShown = false;
                if (elem.readingEndedDate) {
                    const bookDate = new Date(elem.readingEndedDate);
                    const now = new Date();
                    hasToBeShown = now < bookDate;
                }
                if (hasToBeShown) {
                    hasToBeShown = elem.currentPage < elem.pageCount;
                }
                return hasToBeShown;
            }
        }).toSorted(sortFn);

        for (const book of filtered) {
            const bookEl = document.createElement("div");
            bookEl.classList.add("book");
            bookEl.addEventListener("click", () => {
                window.location.replace(`book.html?isbn=${book.isbn}&title=${book.title}`);
            });

            const coverEl = document.createElement("img");
            coverEl.classList.add("book-cover");
            coverEl.setAttribute("loading", "lazy");
            coverEl.setAttribute("src", book.cover ?? "");
            bookEl.appendChild(coverEl);
            
            const titleEl = document.createElement("h5");
            titleEl.textContent = book.title;
            bookEl.appendChild(titleEl);

            const ratingEl = document.createElement("span");
            ratingEl.classList.add("book-rating-element");
            ratingEl.textContent = book.rating;
            bookEl.appendChild(ratingEl);

            booksGrid.appendChild(bookEl);
        }
    });
}

sortingInput.addEventListener("change", (e) => {
    window.localStorage.setItem("sorting-value", e.target.value);
    displayBooks();
});

searchBar.addEventListener("input", () => {
    displayBooks();
});

searchFiltersCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) {
        sortFilterContainer.style.display = "flex";
    } else {
        sortFilterContainer.style.display = "none";
    }
});

readFilterCheckbox.addEventListener("change", (e) => {
    window.localStorage.setItem("show-read-value", e.target.checked);
    displayBooks();
});

(() => {
    const savedFilter = localStorage.getItem("sorting-value") ?? "title-asc";
    const option = document.querySelector(`#sorting-input > option[value='${savedFilter}']`);
    option.setAttribute("selected", "");

    const savedShowRead = localStorage.getItem("show-read-value") === "true";
    if (savedShowRead)
        readFilterCheckbox.setAttribute("checked", "");

    displayBooks();
})();