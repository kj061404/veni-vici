import { useState, useEffect } from 'react'

import './App.css'
import  Book from './Book.jsx'

function App() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [bannedAuthors, setBannedAuthors] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [showBook, setShowBook] = useState(false);

  function banAuthor(authorName) {
    if (!bannedAuthors.includes(authorName)) {
      const newBannedAuthors = [...bannedAuthors, authorName];
      setBannedAuthors(newBannedAuthors);
      console.log(`Banned author: ${authorName}`);
      getRandomFictionBook(newBannedAuthors);
    }
  };

  async function getRandomFictionBook(currentBannedAuthors = bannedAuthors) {
    const url = `https://openlibrary.org/search.json?subject=fiction&language=eng&page=${1}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.docs || !data.docs.length) {
        console.error("No books found");
        return;
      }

      const availableBooks = data.docs.filter(book => {
        const bookAuthor = book.author_name?.[0] || "Unknown Author";
        return !currentBannedAuthors.includes(bookAuthor);
      });

      if (availableBooks.length === 0) {
        console.log("No books available after filtering banned authors");
        setTitle("No books found");
        setAuthor("Try removing some authors from ban list");
        setCoverImg("https://via.placeholder.com/150x220?text=No+Books+Available");
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableBooks.length);
      const book = availableBooks[randomIndex];

      const title = book.title;
      const author = book.author_name?.[0] || "Unknown Author";
      const coverId = book.cover_i;
      const coverImg = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : "https://via.placeholder.com/150x220?text=No+Cover";

      setTitle(title);
      setAuthor(author);
      setCoverImg(coverImg);

      function addBookToList() {
        setBookList(prevItems => [...prevItems, {title, author, coverImg}]);
      }

      addBookToList();
      
      setShowBook(true);
      
      console.log({ title, author, coverImg });
      return { title, author, coverImg };

    } catch (error) {
        console.error("Error fetching book:", error);
      }
  }

  return (
    <div className='app-container'>
      <div className="sidebar">
        <div className="sidebar-header">
          <h3 className='left-sidebar-header'>Who have we seen so far?</h3>
        </div>
        <div className="sidebar-content">
          {bookList.map((book, index) => (
            <div key={index} className="sidebar-item">
              <img src={book.coverImg} alt={book.title} />
              <div className="item-details">
                <h4>{book.title}</h4>
                <p>{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='main-content'>
        <div className="content-header">
          <h1>Trippin' on Tales</h1>
          <p>Discover books to read</p>
        </div>
        
        {showBook ? (
          <Book title={title} author={author} coverImg={coverImg} onBanAuthor={banAuthor} />
        ) : (
          <div className="pre-discover-message">
            <p>Click the Discover button to find your next read!</p>
          </div>
        )}
        
        <div className="content-actions">
          <button className="discover-btn" onClick={() => getRandomFictionBook()}>Discover</button>
        </div>
        
        <div className="content-display">
          {/* Main content display area */}
        </div>
      </div>
      
      {/* Right sidebar for filters/options */}
      <div className="right-sidebar">
        <h3 className='right-sidebar-header'>Ban List</h3>
        <p>Select an attribute in your listing to ban it</p>
        <div className="banned-authors">
          {bannedAuthors.length > 0 ? (
            <ul>
              {bannedAuthors.map((author, index) => (
                <li key={index} className="banned-author">
                  {author}
                  <button 
                    onClick={() => {
                      const newBannedAuthors = bannedAuthors.filter(a => a !== author);
                      setBannedAuthors(newBannedAuthors);
                    }}
                    className="remove-ban"
                  >
                    ✕
                