import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import styled from "@emotion/styled";
import { useMediaQuery } from "react-responsive";

const DetailsHeader = styled.div({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  // height: "25vh",
  position: "relative",
  justifyContent: "flex-start",

  backgroundColor: "white",
  gap: "10px",
  height: "18vh",
});

const Banner = styled.div`
  width: 100%;
  height: 22vw;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-position: 50% 30%;
  @media (max-width: 600px) {
    background-position: 50% 50%;
  }
  background-image: ${(props) =>
    props.src
      ? `url(${props.src})`
      : `url("https://www.fondationairliquide.com/sites/foundation/files/2022-05/generic-banner-blue.jpg")`};
  background-size: cover;
  height: 400px;

  background-repeat: no-repeat;
  margin-top: -60px;
  @media (max-width: 600px) {
    margin-top: 0px;
  }
`;

const Button = styled.button`
  padding: 9px;
  background-color: #6ca6c1;
  font-weight: blod;
  border-radius: 8px;
  color: white;
  font-size: 17px;
  &:hover {
    background-color: #8693ab;
    color: white;
  }
  @media (max-width: 600px) {
    font-size: 15px;
    width:50vw;
    background-position: center;
  transition: background 0.5s;
  &:hover {
    background: blue radial-gradient(circle, transparent 1%, midnightblue 1%) center/15000%;
  }
  &:active {
    background-color: blue;
    background-size: 100%;
    transition: background 0s;
  }
`;

const CoverWrapperInner = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 600px) {
    flex-direction: row;
    gap: 20px;
  }
  justify-content: flex-end;
`;
const CoverWrap = styled.div`
  margin-top: -150px;
  @media (max-width: 600px) {
    margin-top: -100px;
  }
`;

const GET_ONE_ANIME = gql`
  query ($id: Int) {
    Media(id: $id) {
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
      characters(
        sort: ID
        page: 1
        role: MAIN

        perPage: 6
      ) {
        edges {
          name
          role
          voiceActors {
            name {
              full
              userPreferred
            }
            language
            image {
              large
              medium
            }
          }
        }
        nodes {
          name {
            userPreferred
          }
          image {
            large
            medium
          }
        }
      }
    }
  }
`;
const CoverImage = styled.img`
  border-radius: 4%;
`;
const AnimeDetails = () => {
  const { animeId } = useParams();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  const { loading, error, data, refetch } = useQuery(GET_ONE_ANIME, {
    variables: { id: animeId },
  });
  console.log(data, "INI DATA");
  const anime = data?.Media;

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error : {error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100%" }}>
      {/* <div>Anime Details</div> */}

      {/* loading div */}

      {/* {JSON.stringify(anime?.characters.nodes[0])} */}
      {/* {JSON.stringify(data?.Media.characters)} */}
      <AnimeContainer className="anime-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "45vh",
            width: "100%",
          }}
          className="header-wrap"
        >
          <Banner src={anime?.bannerImage}></Banner>

          <DetailsHeader className="details-header">
            <div
              style={{
                minHeight: "250px",
                marginLeft: "20px",
              }}
              className="container"
            >
              <CoverWrap className="cover-wrap">
                <CoverWrapperInner className="cover-wrap-inner">
                  <CoverImage
                    className="cover-image"
                    src={
                      isMobile
                        ? anime?.coverImage.medium
                        : anime?.coverImage.large
                    }
                  ></CoverImage>
                  <div
                    className="actions"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button>+ Add to My Collection</Button>
                  </div>
                </CoverWrapperInner>
              </CoverWrap>
              {isMobile && (
                <div
                  className="title"
                  style={{
                    float: "left",
                    marginTop: "5px",
                    fontSize: "23px",
                    color: "#313638",
                    fontWeight: "600",
                  }}
                >
                  {anime.title.english
                    ? anime.title.english
                    : anime.title.romaji}
                </div>
              )}
            </div>

            {!isMobile && (
              <div
                className="info"
                style={{
                  width: "65vw",
                  textAlign: "justify",
                  padding: "6px",
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  gap: "7px",
                  alignContent: "flex-start",
                }}
              >
                <div
                  className="title"
                  style={{ fontSize: "23px", fontWeight: "900" }}
                >
                  {anime.title.english
                    ? anime.title.english
                    : anime.title.romaji}
                </div>
                <div style={{ fontSize: "15px" }} className="description">
                  {parse(anime.description)}
                </div>
              </div>
            )}
          </DetailsHeader>
          {/* <div
            className="details-header"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              height: "20vw",
              position: "relative",
              justifyContent: "center",
              backgroundColor: "white",
              gap: "10px",
              height: "20vw",
            }}
          >
            
          </div> */}
        </div>
        {isMobile && (
          <ContentContainer className="content-container">
           
            <DescriptionTitle>
              <div>Description</div>
            </DescriptionTitle>
            <Description className="description">
              {parse(anime.description)}
            </Description>
          </ContentContainer>
        )}
      </AnimeContainer>
    </div>
  );
};
const DescriptionTitle = styled.div`
  text-align: left;
  margin-left: 50px;
  font-weight: 600;
  width: 100%;
  color: 313638;
`;
const Description = styled.div`
  font-size: 15px;
  display: inline-block;
  padding: 14px;
  border-radius: 7px;
  width: 84vw;
  text-align: justify;
  background-color: white;
  color: #313638;
  font-weight: 600;
`;
const Actors = styled.div`
  width: 500px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;
const AnimeInfo = styled.div`
  background-color: red;
  display: flex;
  flex-direction: column;
  @media (max-width: 600px) {
    flex-direction: row;
  }
  width: 15%;
  @media (max-width: 600px) {
    width: 60%;
  }
  border-radius: 10px;
  margin-bottom: 10px;
  justify-content: flex-start;
  gap: 10px;
  padding: 20px;
  height: 50vw;
  @media (max-width: 600px) {
    height: 10vw;
  }
  @media (max-width: 600px) {
    overflow-x: scroll;
  }
`;
const AnimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: no-wrap;
  flex-flow: row-wrap;
  width: 100%;
  height: 300vh;
  @media (max-width: 600px) {
    height: 5000px;
  }
  background-color: lightgray;
`;
const ContentContainer = styled.div`
  margin-top: 20px;
  height: 60vw;

  @media (max-width: 600px) {
    height: 2000px;
  }
  width: 100vw;
  display: flex;
  flex-direction: row;
  @media (max-width: 600px) {
    flex-direction: column;
  }
  justify-content: center;
  @media (max-width: 600px) {
    justify-content: flex-start;
  }
  @media (max-width: 600px) {
    align-items: center;
  }
  gap: 10px;
`;
export default AnimeDetails;
