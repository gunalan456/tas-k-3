const express = require('express');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// In-memory "database" for books
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: '1984', author: 'George Orwell' }
];

// Helper function to generate new IDs
const generateId = () => {
    const maxId = books.length > 0 ? Math.max(...books.map(b => b.id)) : 0;
    return maxId + 1;
};

// GET all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

// GET a single book by ID
app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);
    
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// POST a new book
app.post('/api/books', (req, res) => {
    const { title, author } = req.body;
    
    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }
    
    const newBook = {
        id: generateId(),
        title,
        author
    };
    
    books = books.concat(newBook);
    res.status(201).json(newBook);
});

// PUT (update) an existing book
app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, author } = req.body;
    
    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }
    
    const bookIndex = books.findIndex(b => b.id === id);
    
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    const updatedBook = {
        id,
        title,
        author
    };
    
    books[bookIndex] = updatedBook;
    res.json(updatedBook);
});

// DELETE a book
app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = books.length;
    
    books = books.filter(b => b.id !== id);
    
    if (books.length === initialLength) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    res.status(204).end();
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
