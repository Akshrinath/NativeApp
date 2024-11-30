import { useRef, useState } from "react";

export default function SearchableList({ item, itemKeyFn, children }) {
  const lastChange = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([""]);

  function handleChange(event) {
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }
    lastChange.current = setTimeout(() => {
      lastChange.current = null;
      setSearchTerm(event.target.value);
    }, 500);
  }

  return (
    <div>
      <input type="search" placeholder="Search" onChange={handleChange} />
      <ul>
        {searchResults.map((item) => {
          <li key={itemKeyFn(item)}>{children(item)}</li>;
        })}
      </ul>
    </div>
  );
}
