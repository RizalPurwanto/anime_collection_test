import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { GrPrevious, GrNext } from "react-icons/gr";
import { InfinitySpin, Triangle } from "react-loader-spinner";

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

const LinkText = styled(Link)`
  text-decoration: none;
  color: black;
`;

// const CardContainer = styled.div`
// display: grid;
// grid-template-columns: repeat(auto-fit, minmax(210px, max-content));

// @media (max-width:500px) {

//   column-gap: 50px;
// }

// `
const PaginatorContainer = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 10px;
  justify-content: center;
  width: 100vw;
  
`;


const PaginatorButton =styled("button")`
  width: 40px;
  height: 40px;
  border-color:#020626;
  background-color: ${props => props.isSelected ? 
    `#020626;` :`whitesmoke;`
    }
  padding: 5px;
  color:${props => props.isSelected ? 
   `whitesmoke;`: `#020626;`
    } 
  border-radius: 7px;
  font-weight:600;
  
`;
const CardContainer = styled.div`
  display: flex;
  border-radius: 7px;
  width: 100vw;
  height: 70vh;
    
  padding:5px;
  background-color: whitesmoke;
  @media (max-width: 500px) {
    gap: 19px;
    flex-direction: column;
    justify-content: space-evenly;
    flex-wrap: wrap;
    overflow-y: scroll;
  }
`;
const AnimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 20px;
  width: 100%;
  height: 100vh;
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
    <div style={{ height: "100vh", backgroundColor: "#4682B4" }}>
      {/* <div>Home</div> */}

      {/* loading div */}
      {/* {loading && (
        <div>
          <p>Loading...</p>
        </div>
      )} */}

      {/* error div  */}
      {error && (
        <div>
          <p>Error : {error.message}</p>
        </div>
      )}
      {/* {JSON.stringify(anime?.[7])} */}
      {/* {JSON.stringify(data)} */}
      <AnimeContainer>
        <CardContainer>
          {loading && (
            <div
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* <InfinitySpin 
            width='200'
            color="#4682B4"
          /> */}
              <Triangle
                height="180"
                width="180"
                color="#4682B4"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            </div>
          )}
          {!loading &&
            anime?.length > 0 &&
            anime.map((oneAnime) => (
              <LinkText to={`/anime/${oneAnime?.idMal}`}>
                <div style={{}} key={oneAnime?.idMal}>
                  <img
                    style={{
                      objectFit: "fill",
                      width: "118px",
                      height: "176px",
                      objectPosition: "0 0%",
                    }}
                    src={`${oneAnime?.coverImage?.large}`}
                  ></img>
                </div>
              </LinkText>
            ))}
        </CardContainer>

        <PaginatorContainer>
          {currentPage > 1 && (
            <PaginatorButton>
              {" "}
              <div
                onClick={(e) => {
                  changePage(currentPage - 1, e);
                }}
              >
                <GrPrevious></GrPrevious>
              </div>
            </PaginatorButton>
          )}

          {currentPage >= 3 && (
            <PaginatorButton>
              <div
                onClick={(e) => {
                  changePage(currentPage - 2, e);
                }}
              >
                {currentPage - 2}
              </div>
            </PaginatorButton>
          )}

          {/* {Array.apply(0, Array(5)).map((x, i) => {
              if( x-1 >= 0) {
                  return (<div style={{ color: "red" }}>{currentPage}</div>)
              }
            })} */}

          {currentPage >= 2 && (
            <PaginatorButton>
              <div
                onClick={(e) => {
                  changePage(currentPage - 1, e);
                }}
              >
                {currentPage - 1}
              </div>
            </PaginatorButton>
          )}

          <PaginatorButton isSelected>
            <div >{currentPage}</div>
          </PaginatorButton>
          <PaginatorButton>
            <div
              onClick={(e) => {
                changePage(currentPage + 1, e);
              }}
            >
              {currentPage + 1}
            </div>
          </PaginatorButton>

          <PaginatorButton>
            <div
              onClick={(e) => {
                changePage(currentPage + 2, e);
              }}
            >
              {currentPage + 2}
            </div>
          </PaginatorButton>

          {currentPage < 500 && (
            <PaginatorButton>
              <div
                onClick={(e) => {
                  changePage(currentPage + 1, e);
                }}
              >
                <GrNext></GrNext>
              </div>
            </PaginatorButton>
          )}
        </PaginatorContainer>
      </AnimeContainer>
      {/* <div
        style={{
          display: "flex",
          //   flex: "flex-grow",
          //   gap:'20px',
          flexDirection:'column',
          paddingTop: "20px",
          //   justifyContent: "space-evenly",
          justifyContent: "center",
         
          width: "100%",
          height: "100vh",
        }}
        className="anime-container"
      >
       
        
      </div> */}
    </div>
  );
};

export default Home;
