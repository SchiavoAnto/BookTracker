/**
 * Creates (or opens) the database.
 */
function database(successCallback) {
    const openRequest = window.indexedDB.open("BookTrackerDB", 1);

    openRequest.onupgradeneeded = (event) => {
        console.log("Database needs upgrade.");
        const db = event.target.result;

        const booksTable = db.createObjectStore("books", {
            keyPath: "isbn"
        });
        booksTable.createIndex("isbn", "isbn", {
            unique: true
        });
        booksTable.createIndex("title", "title");
        booksTable.createIndex("author", "author");
        booksTable.createIndex("publisher", "publisher");
        booksTable.createIndex("pageCount", "pageCount");
        booksTable.createIndex("genre", "genre");
        booksTable.createIndex("currentPage", "currentPage");
        booksTable.createIndex("readingStartedDate", "readingStartedDate");
        booksTable.createIndex("readingEndedDate", "readingEndedDate");
        booksTable.createIndex("rating", "rating");
        booksTable.createIndex("notes", "notes");
        booksTable.createIndex("cover", "cover");

        const cartTable = db.createObjectStore("cart", {
            keyPath: ["title", "author"]
        });
        cartTable.createIndex("title", "title");
        cartTable.createIndex("author", "author");
        cartTable.createIndex("publisher", "publisher");
        cartTable.createIndex("price", "price");
    };

    openRequest.onsuccess = (event) => {
        console.log("Database opened successfully.");
        successCallback(event.target.result);
    };

    openRequest.onerror = (event) => {
        console.log("Database error: ", event);
    };
}

/**
 * Adds a book to the DB.
 * @param {{isbn:string, title:string, author:string, pageCount:number, genre:string, currentPage:number, readingStartedDate:string, readingEndedDate:string, rating:number, notes:string, cover:string}} book 
 */
function addBook(book) {
    database((db) => {
        try {
            const trx = db.transaction("books", "readwrite");
            const books = trx.objectStore("books");
            books.add(book);
        } catch (ex) {
            console.error(ex);
        }
    });
}

function getBook(isbn, gotFn = () => {}) {
    database((db) => {
        const trx = db.transaction("books", "readwrite");
        const books = trx.objectStore("books");
        const getRequest = books.get(isbn);
        getRequest.onsuccess = () => {
            const book = getRequest.result;
            gotFn(book);
        };
    })
}

function getBooks(elementCallback, endCallback) {
    database((db) => {
        const trx = db.transaction("books", "readonly");
        const books = trx.objectStore("books");
        books.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;
    
            if (!cursor) {
                if (endCallback) endCallback();
                return;
            }
    
            const book = cursor.value;
            elementCallback(book);
    
            cursor.continue();
        };
    });
}

function updateBook(book) {
    database((db) => {
        const trx = db.transaction("books", "readwrite");
        const books = trx.objectStore("books");
        books.put(book);
    });
}

function deleteBook(isbn) {
    database((db) => {
        const trx = db.transaction("books", "readwrite");
        const books = trx.objectStore("books");
        books.delete(isbn);
    });
}

function addBookToCart(book) {
    database((db) => {
        try {
            const trx = db.transaction("cart", "readwrite");
            const cart = trx.objectStore("cart");
            cart.add(book);
        } catch (ex) {
            console.error(ex);
        }
    });
}

function getBooksFromCart(elementCallback, endCallback) {
    database((db) => {
        const trx = db.transaction("cart", "readonly");
        const cart = trx.objectStore("cart");
        cart.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;
    
            if (!cursor) {
                if (endCallback) endCallback();
                return;
            }
    
            const book = cursor.value;
            elementCallback(book);
    
            cursor.continue();
        };
    });
}

function deleteBookFromCart(title, author) {
    database((db) => {
        const trx = db.transaction("cart", "readwrite");
        const cart = trx.objectStore("cart");
        cart.delete([title, author]);
    });
}