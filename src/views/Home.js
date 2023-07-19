import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import {
  Link,
  createSearchParams,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled from "@emotion/styled";
import { GrPrevious, GrNext } from "react-icons/gr";
import { MdCollectionsBookmark } from "react-icons/md";
import { Triangle } from "react-loader-spinner";
import { IconContext } from "react-icons";
import AniColleLogo from "../assets/Ani-Colle-logo.png";
import { generateId } from "../utils";

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
const AnimeImage = styled.img`
  object-fit: fill;
  width: 177px;
    height: 264px;
    margin-left: 20px;
    margin-top: 20px;
  @media (max-width: 600px) {
    width: 118px;
    height: 176px;
    margin-left: 0px;
    margin-top: 0px;
    border-color: #020626;
  border-width: 1px;
  border-style: solid;
  }
  object-position: 0 0%;
  
  
  border-radius: 5%;
`;

const LinkText = styled(Link)`
  text-decoration: none;
  color: black;
`;

const IconContainer = styled.div`
margin-right: 10px;
margin-top: 7px;

`
const IconLink = styled(Link)`
  display:flex;
  text-decoration:none;
  margin-top:3px;
  @media (max-width: 600px) {
    display:inline;
    margin-bottom:4px;
  }



`
const IconText = styled.div`
  font-size:20px;
  color:#6ca6c1;
  margin-left:3px;
  @media (max-width: 600px) {
    font-size:9px;
  }
`
const CardText = styled.div`
  width: 121px;

  font-size: 14px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PaginatorContainer = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 10px;
  justify-content: center;
  width: 100vw;
`;

const PaginatorButton = styled("button")`
  width: 40px;
  height: 40px;
  border-color:#020626;
  background-color: ${(props) =>
    props.isSelected ? `#020626;` : `whitesmoke;`}
  padding: 5px;
  color:${(props) => (props.isSelected ? `whitesmoke;` : `#020626;`)} 
  border-radius: 7px;
  font-weight:600;
  
`;
const HeaderContainer = styled.div`
  background-color: #020626;
  width: 100%;
  height: 9vh;
  display: flex;
  justify-content:flex-start;
  gap:200px;
  padding-left:100px;
  padding-right:00px;
  @media(max-width:600px) {
    padding-left:0px;
    padding-right: 9px;
    justify-content: space-between;
    width: 100vw;
    gap:0px;
  }
  color: whitesmoke;
  border-radius: 0px 0px 5px 5px;
`;
const CardContainer = styled.div`
  display: flex;
  border-radius: 5%;
  width: 100vw;
  
  height: 80vw;
  
  margin-top:20px;
  padding-right: 5px;
  background-color: whitesmoke;
  

  gap: 40px;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    overflow-y: auto;

  @media (max-width: 500px) {
    margin-top:10px;
    margin-right: 20px;
    background-color: whitesmoke;
    justify-content: space-evenly;
    gap: 10px;
    width: 100vw;
    flex-direction: column;
    justify-content: space-evenly;
    flex-wrap: wrap;
    overflow-y: auto;
    height: 500px;
    border-radius: 0%;
  }
`;
const AnimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  padding-top: 10px;
  width: 100%;
  height: 120vh;

   @media (max-width: 500px) {
    justify-content: flex-start;
    align-items:flex-start;
    width:100vh;
  }
`;

const Background = styled.div`
  background-color:#4682B4;
  height:140vh;
  @media (max-width: 500px) {
    justify-content: flex-start;
    align-items:flex-start;
    height:100vh;
  }
`
const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data, refetch } = useQuery(GET_ANIME, {
    variables: { page: currentPage },
  });
  const { page } = useParams();
  const history = useNavigate();
  useEffect(() => {
    if (page) setCurrentPage(page);
  }, []);

  const params = { page: currentPage };

  useEffect(() => {
    history({
      pathname: "",
      page: `?${createSearchParams(params)}`,
    });
  }, [currentPage]);
  const changePage = (page, event) => {
    event.preventDefault();
    setCurrentPage(page);
    refetch(GET_ANIME, {
      variables: { page: currentPage },
    });
  };

  let anime = data?.Page?.media;

  return (
    <Background >
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
      <HeaderContainer>
        <img src={AniColleLogo}></img>
        <IconContext.Provider value={{ size: "30px", color: "#6ca6c1" }}>
          <IconContainer
            
          >
            <IconLink
              
              to={`/collections`}
            >
              <MdCollectionsBookmark></MdCollectionsBookmark>
              <IconText
                
              >
                Collection
              </IconText>
            </IconLink>
          </IconContainer>
        </IconContext.Provider>
      </HeaderContainer>
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
                <div
                  style={{
                    height: "200px",
                  }}
                  key={oneAnime?.idMal}
                >
                  <AnimeImage
                  
                  src={`${oneAnime?.coverImage?.large}`}>

                  </AnimeImage>
                  {/* <img
                    style={{
                      objectFit: "fill",
                      width: "118px",
                      height: "176px",
                      objectPosition: "0 0%",
                      borderRadius: "10px",
                      borderColor: "#020626",
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                    src={`${oneAnime?.coverImage?.large}`}
                  ></img> */}
                  <CardText>
                    {oneAnime?.title?.english
                      ? oneAnime?.title.english
                      : oneAnime?.title.romaji}
                  </CardText>
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
                <IconContext.Provider value={{ size: "20px" }}>
                  <GrPrevious></GrPrevious>
                </IconContext.Provider>
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
            <div>{currentPage}</div>
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
                <IconContext.Provider value={{ size: "20px" }}>
                  <GrNext></GrNext>
                </IconContext.Provider>
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
    </Background>
  );
};

export default Home;
