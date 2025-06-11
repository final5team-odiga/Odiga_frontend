import React, { useState } from "react";
import WorldMapSVG from "../components/WorldMapSVG.jsx";
import "../styles/SearchMap.css";
import { countryNames } from "../data/countryNames.jsx";

export default function SearchMapPage() {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="SearchMap-container">
      <div className="SearchMap-searchbar">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="국가명을 입력하세요"
        />
      </div>
      <div className="SearchMap-mapwrap">
        <WorldMapSVG searchTerm={search} />
      </div>
    </div>
  );
}
