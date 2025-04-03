let { DataTypes, sequelize } = require("../lib");
const { Author } = require("./Author.model");
const { Genre } = require("./Genre.model");

let Book = sequelize.define("Book", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Author,
      key: "id",
    },
  },
});

Book.belongsTo(Author, {
  foreignKey: {
    name: "authorId",
    allowNull: false,
  },
});

Book.belongsToMany(Genre, { through: "BookGenres" }); // Many-to-many relationship with Genre
Genre.belongsToMany(Book, { through: "BookGenres" }); // Many-to-many relationship with Book

module.exports = { Book };
