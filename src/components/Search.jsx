import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  //   props get passed to componets as a 'props' object
  //    to avoid having to call them as props.searchTerm, we destructure the object as {searchTerm, setSearchTerm} so we can just call them directly

  return (
    <div className="search">
      <div>
        <img src="/search.svg" alt="search" />

        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;