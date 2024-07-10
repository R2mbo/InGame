import React, { useState, useEffect } from "react";
import GamesSection from "./Components/GamesSection";

function App() {

  const [plat, setPlat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allGames, setAllGames] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showAllSuggestions, setShowAllSuggestions] = useState<boolean>(false);
  const [displayedSuggestions, setDisplayedSuggestions] = useState<any[]>([]);
  const [suggestionLimit, setSuggestionLimit] = useState<number>(5);

  const myPlatform = (platform: string) => {
    setPlat(platform);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    updateSuggestions(query, false);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const fetchAllGames = (platform: string | null) => {
    const url = platform
      ? `https://www.freetogame.com/api/games?platform=${platform}`
      : `https://www.freetogame.com/api/games?platform=pc`;

    fetch(url)
      .then((response) => response.json())
      .then((final) => {
        setAllGames(final);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchAllGames(plat);
  }, [plat]);

  const updateSuggestions = (query: string, showAll: boolean) => {
    if (query.length === 0) {
      setSuggestions([]);
      setDisplayedSuggestions([]);
      return;
    }
    const filtered = allGames.filter((game) =>
      game.title.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
    setDisplayedSuggestions(filtered.slice(0, showAll ? filtered.length : suggestionLimit));
    setShowAllSuggestions(filtered.length > suggestionLimit);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.title);
    setSuggestions([]);
    setDisplayedSuggestions([]);
  };

  const handleSeeMoreClick = () => {
    const newLimit = suggestionLimit + 5;
    setSuggestionLimit(newLimit);
    setDisplayedSuggestions(suggestions.slice(0, newLimit));
    setShowAllSuggestions(suggestions.length > newLimit);
  };

  return (
    <>
      <header>
        <div className="container flex items-center justify-around md:justify-between flex-wrap mx-auto p-5 px-8 text-orange-500 font-bold">
          <a href="/" className="md:text-3xl cursor-pointer text-2xl uppercase tracking-widest">
            InGame
          </a>
          <nav className="flex items-center space-x-8">
            <ul className="flex space-x-8 md:text-xl text-lg">
              <li className="group relative py-[20px]">
                Platforms
                <ul className="absolute top-[50px] rounded-b-lg border-black border-2 md:top-[65px] bg-white w-[100px] text-sm md:text-lg hidden group-hover:block">
                  <li
                    className="cursor-pointer p-2"
                    onClick={() => myPlatform("pc")}
                  >
                    PC
                  </li>
                  <li
                    className="p-2 cursor-pointer"
                    onClick={() => myPlatform("browser")}
                  >
                    Browser
                  </li>
                </ul>
              </li>
            </ul>
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border rounded-md placeholder:text-black focus:outline-none w-full py-1 px-2 sm:py-2 sm:px-4"
              />
              {displayedSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full max-h-[500px] overflow-y-auto bg-white border rounded-md mt-1 z-10">
                  {displayedSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <img
                        src={suggestion.thumbnail}
                        alt={suggestion.title}
                        className="w-8 h-8 mr-2"
                      />
                      {suggestion.title}
                    </li>
                  ))}
                  {showAllSuggestions && (
                    <li
                      className="p-2 cursor-pointer text-center hover:bg-gray-200"
                      onClick={handleSeeMoreClick}
                    >
                      See More
                    </li>
                  )}
                </ul>
              )}
            </form>
          </nav>
        </div>
      </header>
      <GamesSection plat={plat} searchQuery={searchQuery} />
    </>
  );
}

export default App;
