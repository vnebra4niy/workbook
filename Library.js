class Book {
  constructor(title = '', author = '', year = '') {
    this.title = title;
    this.author = author;
    this.year = year;
  }
}

class Library {
  constructor(name) {
    this.name = name;
    this.list = [];
  }

  addBook(book) {
    if (!this.list.find(b => b.title === book.title)) {
      this.list.push(book);
    }
  }

  removeBook(title) {
    this.list = this.list.filter(b => b.title !== title);
  }

  findBooksByAuthor(author) {
    return this.list.filter(b => b.author === author);
  }

  listBooks() {
    return this.list.map(b => `${b.title} (${b.author}, ${b.year})`);
  }
}

const book = new Book('Back in future', 'someone', 1998)
const library = new Library('Some Library')

library.addBook(book)
console.log(library.listBooks())