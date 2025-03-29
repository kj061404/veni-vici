import './Book.css';

function Book({title, author, coverImg, onBanAuthor}) {
    return (
        <div className="book-container">
            <h2>{title}</h2>
            <button className="author-btn" onClick={() => onBanAuthor(author)} title="Click to ban this author">{author}</button>
            <img src={coverImg} alt="Book Cover" />
        </div>
    );
}

export default Book;