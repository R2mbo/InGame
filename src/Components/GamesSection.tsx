import React, { useEffect, useState } from "react";

interface PlatformProps {
  plat: string | null;
  searchQuery: string;
}

interface GameData {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  genre: string;
  platform: string;
  game_url: string;
}

const GamesSection: React.FC<PlatformProps> = ({ plat, searchQuery }) => {
  const [allGames, setAllGames] = useState<GameData[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const gamesPerPage = 15;

  const fetchAllGames = (platform: string | null) => {
    setLoading(true);
    const url = platform
      ? `https://corsproxy.io/?https://www.freetogame.com/api/games?platform=${platform}`
      : `https://corsproxy.io/?https://www.freetogame.com/api/games?platform=pc`;

    fetch(url)
      .then((response) => response.json())
      .then((final) => {
        setAllGames(final);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllGames(plat);
  }, [plat]);

  useEffect(() => {
    const filtered = allGames.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGames(filtered);
    setCurrentPage(1); // Reset to first page when search query changes
  }, [searchQuery, allGames]);

  const start = (currentPage - 1) * gamesPerPage;
  const currentGames = filteredGames.slice(start, start + gamesPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredGames.length / gamesPerPage)) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <h1 className="text-center text-white font-bold sm:text-4xl mb-4">My Games List</h1>
      <section className="text-black min-h-screen flex justify-center flex-wrap gap-7 p-6">
        {loading && (
          <p className="text-2xl font-bold text-white">Loading...</p>
        )}
        {!loading && currentGames.length > 0 ? (
          currentGames.map((game) => (
            <div
              key={game.id}
              className="bg-gray-950 py-3 hover:scale-105 border-2 border-orange-500 rounded-md transition-all duration-[0.4s] space-y-3 h-fit rounded-md group"
            >
              <h3 className="md:text-xl text-white text-2xl px-3 font-bold my-3">
                {game.title}
              </h3>
              <img
                className="grayscale-[30%] w-full group-hover:grayscale-0"
                src={game.thumbnail}
                alt={game.title}
              />
              <div className="font-bold text-white md:text-lg px-3">
                <p>Game Type: {game.genre}</p>
                <p>Platform: {game.platform}</p>
              </div>
              <a
                href={game.game_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 font-bold md:text-lg ml-2 block w-fit text-gray-950 hover:text-orange-500 hover:bg-gray-950 hover:outline-2 hover:outline-orange-500 md:px-2 rounded-md p-1 mt-6 mx-auto"
              >
                More Info ?
              </a>
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-2xl font-bold text-white">
              {searchQuery ? "No Result Found" : "Loading..."}
            </p>
          )
        )}
      </section>
      <div className="flex justify-center my-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="mx-2 px-4 py-2 font-bold text-orange-500 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= Math.ceil(filteredGames.length / gamesPerPage)}
          className="mx-2 px-4 py-2 font-bold text-orange-500 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default GamesSection;
