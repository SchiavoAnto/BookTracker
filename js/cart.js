const backButton = document.getElementById("back-button");
const container = document.getElementById("container");
const addForm = document.getElementById("add-form");
const titleInput = document.getElementById("title-input");
const authorInput = document.getElementById("author-input");
const publisherInput = document.getElementById("publisher-input");
const priceInput = document.getElementById("price-input");

backButton.addEventListener("click", () => {
    document.documentElement.setAttribute("vt-direction", "back");
    window.location.replace("index.html");
});

addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const book = {
        title: titleInput.value,
        author: authorInput.value,
        publisher: publisherInput.value,
        price: priceInput.value
    };
    addBookToCart(book);

    window.location.reload();
});

function displayBooks() {
    const books = [];
    getBooksFromCart((book) => {
        books.push(book);
    },
    () => {
        // <div class="item">
        //     <div class="info">
        //         <h3>Animal Farm</h3>
        //         <h4>George Orwell</h4>
        //         <p>Liberty</p>
        //         <p>19.99€</p>
        //     </div>
        //     <div class="actions">
        //         <button class="delete-button">Elimina</button>
        //     </div>
        // </div>

        for (const book of books) {
            const item = document.createElement("div");
            item.classList.add("item");
    
            const info = document.createElement("div");
            info.classList.add("info");
            item.appendChild(info);
    
            const actions = document.createElement("div");
            actions.classList.add("actions");
            item.appendChild(actions);
    
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "Elimina";
            deleteButton.addEventListener("click", () => {
                if (!confirm(`Sei sicuro di voler eliminare '${book.title}' di '${book.author}'?`)) return;
                deleteBookFromCart(book.title, book.author);
                window.location.reload();
            });
            actions.appendChild(deleteButton);
    
            const titleEl = document.createElement("h3");
            titleEl.textContent = book.title;
            info.appendChild(titleEl);

            const authorEl = document.createElement("h4");
            authorEl.textContent = book.author;
            info.appendChild(authorEl);

            const publisherEl = document.createElement("p");
            publisherEl.textContent = book.publisher;
            info.appendChild(publisherEl);

            const priceEl = document.createElement("p");
            priceEl.textContent = `${book.price}€`;
            info.appendChild(priceEl);

            container.appendChild(item);
        }
    });
}

displayBooks();