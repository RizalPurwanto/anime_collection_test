import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";

const GET_ANIME = gql`
  query ($page: Int) {
    Page(page: $page, perPage: 10) {
      pageInfo {
        total
      }
      media {
        title {
          english
          romaji
          native
        }
        idMal
        description
        coverImage {
          medium
          large
          extraLarge
        }
        bannerImage
        genres
        source
        averageScore
      }
    }
  }
`;
const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data, refetch } = useQuery(GET_ANIME, {
    variables: { page: currentPage },
  });

  const changePage = (page, event) => {
    event.preventDefault();
    setCurrentPage(page);
    refetch(GET_ANIME, {
      variables: { page: currentPage },
    });
  };

  let anime = data?.Page?.media;

  return (
    <div style={{ height: "100vw" }}>
      <div>Home</div>

      {/* loading div */}
      {loading && (
        <div>
          <p>Loading...</p>
        </div>
      )}

      {/* error div  */}
      {error && (
        <div>
          <p>Error : {error.message}</p>
        </div>
      )}
      {/* {JSON.stringify(anime?.[7])} */}
      {/* {JSON.stringify(data)} */}
      <div
        style={{
          display: "flex",
          //   flex: "flex-grow",
          //   gap:'20px',
          flexDirection: "row",
          padding: "5px",
          //   justifyContent: "space-evenly",
          justifyContent: "center",
          flexWrap: "wrap",
          flexFlow: "row wrap",
          width: "100%",
          height: "70vw",
        }}
        className="anime-container"
      >
        {/* container */}
        <div
          style={{
            // display: "flex",
            // justifyContent: "flex-start",
            width: "100%",
            height: "100%",
            // flexWrap: "wrap",
            // flexFlow: "row wrap",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, max-content))",
            gap: "20px",
            justifyContent: "center",
            padding: "initial",
          }}
        >
          {anime?.length > 0 &&
            anime.map((oneAnime) => (
              <Link to={`/anime/${oneAnime?.idMal}`}>
                <div
                  style={{
                    width: "18vw",
                    height: "20vw",
                  }}
                  key={oneAnime?.idMal}
                >
                  {/* card */}
                  <img
                    style={{
                      objectFit: "fill",
                      width: "100%",
                      height: "30vw",
                      objectPosition: "0 0%",
                    }}
                    src={`${oneAnime?.coverImage?.large}`}
                  ></img>
                  <div style={{ width: "100%" }}>
                    <p
                      style={{
                        textAlign: "center",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {oneAnime?.title?.english
                        ? oneAnime?.title?.english
                        : oneAnime?.title?.romaji}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        <div>
          Pagination
          <div
            style={{ display: "flex", justifyContent: "center", gap: "5px" }}
          >
            {currentPage > 1 && (
              <div
                onClick={(e) => {
                  changePage(currentPage - 1, e);
                }}
              >
                Previous
              </div>
            )}
            {/* {Array.apply(0, Array(5)).map((x, i) => {
              if( x-1 >= 0) {
                  return (<div style={{ color: "red" }}>{currentPage}</div>)
              }
            })} */}

            {currentPage >= 3 && (
              <div
                onClick={(e) => {
                  changePage(currentPage - 2, e);
                }}
              >
                {currentPage - 2}
              </div>
            )}
            {currentPage >= 2 && (
              <div
                onClick={(e) => {
                  changePage(currentPage - 1, e);
                }}
              >
                {currentPage - 1}
              </div>
            )}
            <div style={{ color: "red" }}>{currentPage}</div>
            <div
              onClick={(e) => {
                changePage(currentPage + 1, e);
              }}
            >
              {currentPage + 1}
            </div>
            <div
              onClick={(e) => {
                changePage(currentPage + 2, e);
              }}
            >
              {currentPage + 2}
            </div>
            {currentPage < 500 && (
              <div
                onClick={(e) => {
                  changePage(currentPage + 1, e);
                }}
              >
                Next
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
