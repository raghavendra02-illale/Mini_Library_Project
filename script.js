// Mini Library System — browser version of the Python Library project.
let books = [
    { title: "Wings of Fire", author: "A. P. J. Abdul Kalam", copies: 2 },
    { title: "The Alchemist", author: "Paulo Coelho", copies: 1 },
    { title: "Ikigai", author: "Héctor García and Francesc Miralles", copies: 4 }
];

const form = document.getElementById("bookForm");
const titleInput = document.getElementById("t");
const authorInput = document.getElementById("a");
const copiesInput = document.getElementById("c");
const shelf = document.getElementById("shelf");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
});

// Find a title without case sensitivity.
function findBook(title) {
    const normalizedTitle = title.trim().toLowerCase();
    return books.find(book => book.title.toLowerCase() === normalizedTitle) || null;
}

// Add a new book or merge copies into an existing title.
function addBook() {
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const copies = Number(copiesInput.value);

    if (!title || !author) {
        showMessage("Please enter both a title and an author.", "error");
        return;
    }

    if (!Number.isInteger(copies) || copies < 1 || copies > 999) {
        showMessage("Enter a whole number of copies between 1 and 999.", "error");
        return;
    }

    const existing = findBook(title);
    if (existing) {
        // Keep one record per title; add the new copies to it.
        existing.copies += copies;
        showMessage(`Added ${copies} cop${copies === 1 ? "y" : "ies"} to “${existing.title}”.`, "success");
    } else {
        books.push({ title, author, copies });
        showMessage(`“${title}” was added to the library.`, "success");
    }

    form.reset();
    copiesInput.value = 1;
    draw();
}

function borrow(title) {
    const book = findBook(title);
    if (!book) return;

    if (book.copies <= 0) {
        showMessage(`No copies of “${book.title}” are currently available.`, "error");
        return;
    }

    book.copies -= 1;
    showMessage(`You borrowed “${book.title}”.`, "success");
    draw();
}

function returnBook(title) {
    const book = findBook(title);
    if (!book) return;

    book.copies += 1;
    showMessage(`A copy of “${book.title}” was returned.`, "success");
    draw();
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}

function draw() {
    shelf.replaceChildren();
    let totalCopies = 0;

    books.forEach((book, index) => {
        totalCopies += book.copies;

        const card = document.createElement("article");
        card.className = "book-card";

        const bookNumber = document.createElement("div");
        bookNumber.className = "book-number";
        bookNumber.textContent = String(index + 1).padStart(2, "0");

        const details = document.createElement("div");
        details.className = "book-details";

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.className = "author";
        author.textContent = `by ${book.author}`;

        const count = document.createElement("span");
        count.className = `availability ${book.copies === 0 ? "unavailable" : ""}`;
        count.textContent = book.copies === 0
            ? "No copies available"
            : `${book.copies} ${book.copies === 1 ? "copy" : "copies"} available`;

        details.append(title, author, count);

        const actions = document.createElement("div");
        actions.className = "book-actions";

        const borrowButton = document.createElement("button");
        borrowButton.type = "button";
        borrowButton.className = "borrow-button";
        borrowButton.textContent = "Borrow";
        borrowButton.disabled = book.copies === 0;
        borrowButton.setAttribute("aria-label", `Borrow ${book.title}`);
        borrowButton.addEventListener("click", () => borrow(book.title));

        const returnButton = document.createElement("button");
        returnButton.type = "button";
        returnButton.className = "return-button";
        returnButton.textContent = "Return";
        returnButton.setAttribute("aria-label", `Return ${book.title}`);
        returnButton.addEventListener("click", () => returnBook(book.title));

        actions.append(borrowButton, returnButton);
        card.append(bookNumber, details, actions);
        shelf.appendChild(card);
    });

    document.getElementById("titleCount").textContent = books.length;
    document.getElementById("copyCount").textContent = totalCopies;
    document.getElementById("shelfLabel").textContent = `${books.length} ${books.length === 1 ? "title" : "titles"}`;
    document.getElementById("emptyState").hidden = books.length !== 0;
}

// Render the starter books when the page first opens.
draw();
