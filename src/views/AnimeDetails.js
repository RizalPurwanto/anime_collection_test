import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import parse from "html-react-parser";
import styled from "@emotion/styled";
import { useMediaQuery } from "react-responsive";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { AiFillCloseCircle, AiFillHome } from "react-icons/ai";
import { IconContext } from "react-icons";
import { FaHome } from "react-icons/fa";
import Modal from "react-modal";
import Creatable, { useCreatable } from "react-select/creatable";
import CreatableSelect from "react-select/creatable";

const DetailsHeader = styled.div({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  // height: "25vh",
  position: "relative",
  justifyContent: "flex-start",

  backgroundColor: "#f7fff7",
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
    background: #6ca6c1 radial-gradient(circle, transparent 1%, midnightblue 1%) center/15000%;
  }
  &:active {
    background-color: #6ca6c1;
    background-size: 100%;
    transition: background 0s;
  }
`;

const ShowButton = styled.div`
  
  padding: 2px;
  background-color: transparent;
  
  border-radius: 8px;
  color: whitesmoke;
  font-size: 12px;
  font-weight:600;
  &:hover {
    background-color: #8693ab;
    color: white;
  }
  @media (max-width: 600px) {
    font-size: 12px;
    background-color:
    background-position: center;
  transition: background 0.5s;
  &:hover {
    background: transparent radial-gradient(circle, transparent 1%, #6ca6c1 1%) center/15000%;
    color: #313638;
  }
  &:active {
    background-color: transparent;
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
      format
      duration
      averageScore
      meanScore
      episodes
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
const selectCustomStyles = {
  input: (base) => ({
    ...base,
    height: 40,
    width: 35,
    minHeight: 35,
  }),
};
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "80vw",
    height: "50vh",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
};
const CoverImage = styled.img`
  border-radius: 4%;
`;
const AnimeDetails = () => {
  const [modalInput, setModalInput] = useState("");
  const [alert, setAlert] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [existingCollections, setExistingCollections] = useState([]);
  const [newCollections, setNewCollections] = useState([]);

  const [newCollection, setNewCollection] = useState({
    name: "",
    anime: [
      {
        id: "",
        title: "",
        image: "",
      },
    ],
  });

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    setModalInput("");
    setExistingCollections([]);
    setNewCollections([]);
    setAlert("");
  }



  const initializeState = () => {
    return JSON.parse(localStorage.getItem("collections")) || [];
  };

  const { animeId } = useParams();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 400px)" });

  const [storageCollection, setStorageCollection] = useState(initializeState());
  const [showCollection, setShowCollection] = useState(false);

  useEffect(() => {
    // localStorage.setItem("collections", JSON.stringify(collections));

    const collectionState = JSON.parse(localStorage.getItem("collections"));
    if (collectionState) {
      setStorageCollection(collectionState);
    }
  }, []);

  useEffect(() => {
    console.log("setLocalStor");
    localStorage.setItem("collections", JSON.stringify(storageCollection));
  }, [storageCollection]);

  const selectOptions = [
    ...storageCollection.map((collection) => {
      return { value: collection.name, label: collection.name };
    }),
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event);
    console.log(existingCollections, "existing");
    console.log(newCollections, "new");
    if (existingCollections.length > 0) {
      existingCollections.forEach((name) => {
        let currentCollections = [...storageCollection];
        const foundCollection = currentCollections.find((c) => c.name === name);
        let updatedCollection = { ...foundCollection };
        updatedCollection.anime.push({
          id: animeId,
          title: anime.title.english ? anime.title.english : anime.title.romaji,
          image: anime?.coverImage.large,
        });

        currentCollections[name] = updatedCollection;
        localStorage.setItem("collections", JSON.stringify(currentCollections));
      });
    }

    if (newCollections.length > 0) {
      const currentAnime = {
        id: animeId,
        title: anime.title.english ? anime.title.english : anime.title.romaji,
        image: anime?.coverImage.large,
      };

      newCollections.forEach((name) => {
        // storageCollection.find((collection) => {
        //   if (collection.name === name) {
        //     setAlert(`The name ${name}, already existed in collection`);
        //     return;
        //   }
        // });

        const newCollection = {
          name: name,
          anime: [currentAnime],
        };

        let currentCollections = [...storageCollection];
        currentCollections.push(newCollection);
        localStorage.setItem("collections", JSON.stringify(currentCollections));

        const collectionState = JSON.parse(localStorage.getItem("collections"));
        if (collectionState) {
          setStorageCollection(collectionState);
        }
      });
    }
    // console.log(newCollections);
    closeModal();
  };

  const handleChange = (event) => {
    const arr1 = event.map((e) => e.value);
    const arr2 = [...selectOptions].map((e) => e.value);
    const b = new Set(arr2);

    let newCollectionArr = arr1.filter((x) => !arr2.includes(x));
    let existingCollectionArr = arr1.filter((x) => arr2.includes(x));

    // console.log(result, "INI handleChange")
    console.log(event, "INI handleChange");
    console.log(newCollectionArr, "INI newCollectionArr");
    console.log(existingCollectionArr, "INI existingCollectionArr");
    setNewCollections(newCollectionArr);
    setExistingCollections(existingCollectionArr);

    // setModalInput(result)
  };

  const handleChangeInput = (event) => {
    // event.preventDefault()
    // const result = event.target.value
    const result = event.replace(/[^a-z0-9 ]/gi, "");
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    // console.log(result, "INI handleChange")
    console.log(result, "INI handleChangeInput");
    setModalInput(result);
  };

  const handleShowButtonClick = (event) => {
    event.preventDefault();
    setShowCollection(!showCollection);
  };

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
            height: "30vh",
            width: "100%",
          }}
          className="header-wrap"
        >
          <Banner src={anime?.bannerImage}></Banner>

          <DetailsHeader className="details-header">
            <div
              style={{
                minHeight: "100px",
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
                    {isSmallScreen &&  <IconContext.Provider value={{ color: "white", size:'30px' }}>
                    <div
                      className="actions"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignContent:'flex-start',
                        marginBottom:'5px'
                        
                      }}
                    >
                      
                      <HomeLink to={'/'}><AiFillHome></AiFillHome></HomeLink>
                    </div>
                  </IconContext.Provider>}
                    <Button onClick={openModal}>+ Add to My Collection</Button>
                  </div>
                 {!isSmallScreen &&  <IconContext.Provider value={{ color: "white", size:'30px' }}>
                    <div
                      className="actions"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        
                      }}
                    >
                      
                      <HomeLink to={'/'}><AiFillHome></AiFillHome></HomeLink>
                    </div>
                  </IconContext.Provider>}
                </CoverWrapperInner>
              </CoverWrap>
              {isMobile && (
                <div
                  className="title"
                  style={{
                    float: "left",
                    display:'inline-block',
                    marginTop: "5px",
                    fontSize: isSmallScreen ? '16px' : "18px",
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
            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              ariaHideApp={false}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <div>Add Anime to Collection</div>
                <div>
                  <AiFillCloseCircle onClick={closeModal}></AiFillCloseCircle>
                </div>
              </div>
              <ModalForm onSubmit={(e) => handleSubmit(e)}>
                {/* <div>
                <input style={{
                  width:'70%',
                  height:'55px',
                  outline:'none',
                  border:'none',
                  borderRadius:'5px',

                }} value={modalInput} onChange={handleChange}></input>
                <div style={{
                  backgroundColor:'white',
                  borderRadius:'5px',
                  width:'200px'
                }}>
                  <ul>
                    <li>a</li>
                    <li>a</li>
                    <li>a</li>
                  </ul>
                </div>
                <button>Add Collection to list</button>
                </div> */}
                <div style={{ width: "100%" }}>
                  <CreatableSelect
                    styles={selectCustomStyles}
                    isMulti
                    options={selectOptions}
                    onChange={handleChange}
                    inputValue={modalInput}
                    onInputChange={handleChangeInput}
                  />
                </div>
                {alert.length > 0 && <AlertText>{alert}</AlertText>}
                <Button type="submit">Submit</Button>
              </ModalForm>
            </Modal>
            <ShowButtonContainer>
              <ShowButton onClick={(e) => handleShowButtonClick(e)}>
                {showCollection ? (
                  <div>
                    <IoMdArrowDropup /> Hide Collections
                  </div>
                ) : (
                  <div>
                    <IoMdArrowDropdown /> Show Collections with this anime...
                  </div>
                )}
              </ShowButton>
            </ShowButtonContainer>
            {/* <div>{JSON.stringify(anime)}</div> */}
            {showCollection && (
              <>
                {/* <DescriptionTitle>Collection</DescriptionTitle> */}
                <Collection className="collection">
                  {storageCollection
                    .sort((a, b) => {
                      if (a.name < b.name) {
                        return -1;
                      }
                      if (a.name > b.name) {
                        return 1;
                      }
                      return 0;
                    })
                    .filter((item) => {
                      return item.anime.find((ani) => {
                        return ani.id === animeId;
                      });
                    })
                    .map((item, index) => (
                      <LinkText
                        to={`/collection/${item.name}`}
                        key={item.name + item.index}
                      >
                        {index + 1}. {item.name}
                      </LinkText>
                    ))}
                </Collection>
              </>
            )}

            <AnimeInfo className="anime-info">
              <InfoItem>
                <ItemType>Genres</ItemType>
                {anime.genres.join(", ")}
              </InfoItem>
              <InfoItem>
                <ItemType>Format</ItemType>
                {anime.format}
              </InfoItem>

              <InfoItem>
                <ItemType>Episodes</ItemType>
                {anime.episodes}
              </InfoItem>
              <InfoItem>
                <ItemType>Episodes Duration</ItemType>
                {anime.duration} minutes
              </InfoItem>
              <InfoItem>
                <ItemType>Average Score</ItemType>
                {anime.averageScore}%
              </InfoItem>
              <InfoItem>
                <ItemType>Mean Score</ItemType>
                {anime.meanScore}%
              </InfoItem>
            </AnimeInfo>

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

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const DescriptionTitle = styled.div`
  text-align: left;
  margin-left: 50px;
  font-weight: 600;
  width: 100%;
  color: whitesmoke;
`;
const Description = styled.div`
  font-size: 15px;
  display: inline-block;
  padding: 14px;
  border-radius: 7px;
  width: 84vw;
  text-align: justify;
  background-color: #f7fff7;
  color: #313638;
  font-weight: 500;
`;
const Actors = styled.div`
  width: 500px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;
const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const ItemType = styled.div`
  font-weight: 600;
`;
const AnimeInfo = styled.div`
  background-color: #f7fff7;
  display: flex;
  flex-direction: column;
  @media (max-width: 600px) {
    flex-direction: row;
  }
  width: 15%;
  @media (max-width: 600px) {
    width: 90%;
  }
  border-radius: 10px;
  margin-bottom: 10px;

  gap: 20px;
  padding: 20px;
  @media (max-width: 600px) {
    padding-bottom: 30px;
  }
  height: 50vh;
  @media (max-width: 600px) {
    height: 5vh;
  }

  @media (max-width: 600px) {
    -webkit-overflow-scrolling: touch;

    overflow-x: auto;
    white-space: nowrap;
  }
`;

const Collection = styled.div`
  color: black;
  background-color: #f7fff7;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 15%;
  @media (max-width: 600px) {
    width: 90%;
  }
  border-radius: 10px;
  margin-bottom: 10px;

  gap: 10px;
  padding: 20px;

  height: 50vh;
  @media (max-width: 600px) {
    height: 100px;
  }

  @media (max-width: 600px) {
    -webkit-overflow-scrolling: touch;

    overflow-y: auto;
    white-space: nowrap;
  }
`;

const AlertText = styled.div`
  color: red;
`;
const LinkText = styled(Link)`
  text-align: left;
  text-decoration: none;
  color: white;

  font-weight: 600;
  padding-left: 7px;
  padding-top: 3px;
  padding-bottom: 3px;
  width: 80vw;
  border-radius: 10px;
  background-color: #6ca6c1;
  &:hover {
    background: #6ca6c1 radial-gradient(circle, transparent 1%, midnightblue 1%)
      center/15000%;
  }
  &:active {
    background-color: #6ca6c1;
    background-size: 100%;
    transition: background 0s;
  }
`;

const HomeLink = styled(Link)`
  text-align: center;
  text-decoration: none;
  color: white;

  font-weight: 600;
  padding:3px;
  width: 10vw;
  border-radius: 10px;
  background-color: #6ca6c1;
  &:hover {
    background: #6ca6c1 radial-gradient(circle, transparent 1%, midnightblue 1%)
      center/15000%;
  }
  &:active {
    background-color: #6ca6c1;
    background-size: 100%;
    transition: background 0s;
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
  background-color: #4682B4;
`;
const ShowButtonContainer = styled.div`
  display: flex;
  margin-left: 20px;
  width: 100%;
  margin-top: 0px;
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
  color: #313638;
`;
export default AnimeDetails;
