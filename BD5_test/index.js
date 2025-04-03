let express = require("express");
let { Author } = require("./models/Author.model");
let { sequelize } = require("./lib/index");
let { Book } = require("./models/Book.model");
let { Genre } = require("./models/Genre.model");
let { Op } = require("@sequelize/core");
let app = express();

app.use(express.json());

//database seeding
app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    const authors = await Author.bulkCreate([
      {
        name: "J.K. Rowling",
        birthdate: "1965-07-31",
        email: "jkrowling@books.com",
      },
      {
        name: "George R.R. Martin",
        birthdate: "1948-09-20",
        email: "grrmartin@books.com",
      },
    ]);

    const genres = await Genre.bulkCreate([
      { name: "Fantasy", description: "Magical and mythical stories." },
      {
        name: "Drama",
        description: "Fiction with realistic characters and events.",
      },
    ]);

    const books = await Book.bulkCreate([
      {
        title: "Harry Potter and the Philosopher's Stone",
        description: "A young wizard's journey begins.",
        publicationYear: 1997,
        authorId: 1,
      },
      {
        title: "Game of Thrones",
        description: "A medieval fantasy saga.",
        publicationYear: 1996,
        authorId: 2,
      },
    ]);
    await books[0].setGenres([genres[0]]);
    await books[1].setGenres([genres[0], genres[1]]);

    return res.json({ message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error seeding the database", error });
  }
});

//function
async function fetchAllBooks() {
  let books = await Book.findAll();
  return { books };
}

//Endpoint 1
app.get("/books", async (req, res) => {
  try {
    let response = await fetchAllBooks();
    if (response.books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//function
async function fetchBooksByAuthor(authorId) {
  let books = await Book.findAll({ where: { authorId } });
  return { books: books };
}

//Endpoint 2
app.get("/authors/:authorId/books", async (req, res) => {
  try {
    let authorId = parseInt(req.params.authorId);
    let result = await fetchBooksByAuthor(authorId);
    if (result.books.length === 0) {
      return res.status(404).json({ message: "no books found by artist." });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//function
async function fetchBooksByGenre(genreId) {
  let books = await Book.findAll({
    include: [
      {
        model: Genre,
        where: { id: genreId },
      },
    ],
  });

  return { books: books };
}

//Endpoint 3
app.get("/genres/:genreId/books", async (req, res) => {
  try {
    let genreId = parseInt(req.params.genreId);
    let result = await fetchBooksByGenre(genreId);
    if (result.books.length === 0) {
      return res.status(404).json({ message: "no books found by genre." });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function addNewBook(newBook) {
  let book = await Book.create({
    title: newBook.title,
    description: newBook.description,
    publicationYear: newBook.publicationYear,
    authorId: newBook.authorId,
  });

  if (newBook.genreIds?.length) {
    let genres = await Genre.findAll({ where: { id: newBook.genreIds } });
    await book.setGenres(genres);
  }

  return { book };
}

//ENdpoint 4
app.post("/books", async (req, res) => {
  try {
    let newBook = req.body.newBook;
    let response = await addNewBook(newBook);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function addNewAuthor(newAuthor) {
  let author = await Author.create({
    name: newAuthor.name,
    birthdate: newAuthor.birthdate,
    email: newAuthor.email,
  });

  return { author };
}

//test1
app.post("/author", async (req, res) => {
  try {
    let newAuthor = req.body.newAuthor;
    let result = await addNewAuthor(newAuthor);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//function
async function fetchAuthorsByGenre(genreId) {
  let books = await Book.findAll({
    include: [
      {
        model: Genre,
        where: { id: genreId },
      },
      Author,
    ],
  });
  return { books: books };
}

//test2
app.get("/genres/:genreId/authors", async (req, res) => {
  try {
    let genreId = parseInt(req.params.genreId);
    let result = await fetchAuthorsByGenre(genreId);
    if (result.books.length === 0) {
      return res.status(404).json({ message: "No author found." });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// Kiran Wankhade
// 3:02 PM
// BD-5 Live
// 1. Add a New Author:
//  - Endpoint: `/author/new`
// - Method: `POST`
//  - Description: Add a new author to the system.
// 2. Get the authors by genre ID:
// - Endpoint: `/genres/:genresId/authors`
// -Description: Return all Authors names and book titles as per `genreId`
// - Response Should be :{
//         "authors": [
//           {
//            "authorName": "J.K. Rowling",
//            "bookTitle": "Harr......"} ]}
// - Hint:First, find the genre, then retrieve its books and their authors
// hiv-adfy-obm
