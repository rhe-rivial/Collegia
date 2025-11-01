import '../App.css'
export default function SearchBar({ placeholderText }) {
    return (
        <input className="search-bar"
            type="text" 
            placeholder={placeholderText || "Enter here..."}
        />
    );    
}