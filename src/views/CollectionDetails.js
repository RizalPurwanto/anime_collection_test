import styled from "@emotion/styled";
import { Triangle } from "react-loader-spinner";
import { IconContext } from "react-icons";
import AniColleLogo from "../assets/Ani-Colle-logo.png";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillCloseCircle, AiFillHome } from "react-icons/ai";
import { BsFillTrash3Fill } from "react-icons/bs";
import Modal from "react-modal";
import { generateId } from "../utils";

const LinkText = styled(Link)`
  text-decoration: none;
  color: black;
  @media (max-width: 600px) {
  }
`;

const AlertText = styled.div`
  color: red;
`;
const CollectionContainerWrapper = styled.div`
  @media (max-width: 600px) {
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: flex-start;
  }
`;
const CollectionContainer = styled.div`
  @media (max-width: 600px) {
  }
  display: flex;

  margin-bottom: 5px;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const RecentContainer = styled.div`
  @media (max-width: 600px) {
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 40vh;
`;
const CollectionHeaderText = styled.div`
  @media (max-width: 600px) {
  }
  font-size: 19px;
  padding: 5px;
  font-weight: 600;
  color: #6ca6c1;
`;
const CollectionHeader = styled.div`
  @media (max-width: 600px) {
  }
  display: flex;
  flex-direction: row;
  width: 95%;
  background-color: #020626;
  height: 6vh;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
`;
const CollectionContent = styled.div`
  @media (max-width: 600px) {
  }
  background-color: transparent;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  
  overflow-x: auto;
  width: 90%;
  padding: 4px;
  border-radius: 5px;
  align-items: flex-start;
`;

const CollectionItemCard = styled.div`
  height: 100%;
`;
const CardLink = styled(Link)`
height: 55vh;
  @media (max-height: 500px) {
    height: 50vh;
  };
  text-decoration: none;
  color: whitesmoke;
  width: 50vw;
  
`;

const CollectionItemText = styled.div`
  @media (max-width: 600px) {
  }
  font-size: 15px;
  font-weight: 700;
  text-align:left;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const CoverImage = styled.img`
  @media (max-width: 600px) {
  }
  width: 60vw;
  border-radius: 6px;
`;
const ModalButton = styled.button`

  padding: 9px;
  background-color: #6ca6c1;
  font-weight: blod;
  border-radius: 8px;
  color: white;
  
  font-size: 19px;
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

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const HeaderContainer = styled.div`
  @media (max-width: 600px) {
  }
  background-color: #020626;
  width: 100vw;
  height: 9vh;
  display: flex;
  justify-content: space-between;
  padding-right: 9px;
  color: whitesmoke;
  border-radius: 0px 0px 5px 5px;
`;

const MainContainer = styled.div`
  @media (max-width: 600px) {
  }
  background-color: #4682b4;
  min-height: 100vh;
`;
const PageTitleText = styled.div`
  @media (max-width: 600px) {
  }
  font-size: 20px;
  font-weight: 600;
  
`;
const PageTitleContainer = styled.div`
  @media (max-width: 600px) {
  }
  background-color: #f7fff7;
  display: flex;
  justify-content: space-between;
  padding-right: 9px;
  padding-left: 10px;
  height: 7vh;
  align-items: center;
  margin-bottom: 20px;
`;
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "80vw",
    height: "30vh",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
};

const CollectionDetails = () => {
  const { collectionId } = useParams();

  const initializeState = () => {
    return JSON.parse(localStorage.getItem("collections")) || [];
  };
  const [storageCollection, setStorageCollection] = useState(initializeState());
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedAnime, setselectedAnime] = useState({
    name:'',
    id:''
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
  const [modalInput, setModalInput] = useState("");
  const [alert, setAlert] = useState("");

  const collectionDetails = storageCollection.find(
    (el) => el.name === collectionId
  );
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

  const handleRemoveAnime = (event) => {
    event.preventDefault();

    const collectionWithoutSelectedAnime = collectionDetails.anime.filter((el) => el.id !== selectedAnime.id)
   

    let collectionsWithoutSelected = storageCollection.filter(
      (el) => el.name !== collectionId
    );

    let updatedCollection = {
        name:collectionId,
        anime:collectionWithoutSelectedAnime
    }

    collectionsWithoutSelected.push(updatedCollection)
    console.log(
        collectionWithoutSelectedAnime,
      `ANIME named ${selectedAnime.name} REMOVED`
    );
    console.log(collectionsWithoutSelected, "ZOM REMOVED FROM ACTION")
    setStorageCollection(collectionsWithoutSelected);
    closeConfirmationModal();
  };

  const handleChange = (event) => {
    event.preventDefault();
    console.log(event);
    const result = event.target.value.replace(/[^a-z0-9 ]/gi, "");

    console.log(result, "INI handleChange");

    setModalInput(result);
  };
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
    setAlert("");
    setModalInput("");
  }

  function closeConfirmationModal() {
    setConfirmationModalIsOpen(false);
    setSelectedCollection("");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(modalInput);
    const isCollectionNameTaken = storageCollection.find(
      (el) => el.name === modalInput
    );
    if (isCollectionNameTaken) {
      setAlert(`The name ${modalInput}, already used in collection`);
      return;
    }
    const id = generateId();
    const newCollection = {
      id: id,
      name: modalInput,
      anime: [],
    };
    let newCollections = [...storageCollection];
    newCollections.push(newCollection);
    setStorageCollection(newCollections);
    closeModal();
  };

  function afterOpenModal() {
    // subtitle.style.color = "#f00";
  }

  function afterOpenConfirmationModal() {
    // subtitle.style.color = "#f00";
  }

  function openConfirmationModal(event, anime) {
    event.preventDefault()
    setConfirmationModalIsOpen(true);
    setselectedAnime({
        title:anime.title,
        id:anime.id
    });
  }

  return (
    <MainContainer>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>Add a new Collection</div>
          <div>
            <AiFillCloseCircle onClick={closeModal}></AiFillCloseCircle>
          </div>
        </div>
        <ModalForm onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label>Collection Name </label>
            <input
              style={{
                width: "100%",

                borderRadius: "5px",
              }}
              value={modalInput}
              onChange={handleChange}
            ></input>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "5px",
                width: "200px",
              }}
            >
              {alert.length > 0 && <AlertText>{alert}</AlertText>}
            </div>
          </div>

          <ModalButton type="submit">Submit</ModalButton>
        </ModalForm>
      </Modal>
      <Modal
        isOpen={confirmationModalIsOpen}
        onAfterOpen={afterOpenConfirmationModal}
        onRequestClose={closeConfirmationModal}
        ariaHideApp={false}
        style={customStyles}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            Are you sure you want to remove "{selectedAnime.title}" from this
            collection?
          </div>
          <div>
            <AiFillCloseCircle
              onClick={closeConfirmationModal}
            ></AiFillCloseCircle>
          </div>
        </div>
        <ModalForm onSubmit={(e) => handleRemoveAnime(e)}>
          <div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "5px",
                width: "200px",
              }}
            ></div>
          </div>

          <ModalButton type="submit">Confirm</ModalButton>
        </ModalForm>
      </Modal>
      <HeaderContainer>
        <img src={AniColleLogo}></img>
        <IconContext.Provider value={{ size: "30px", color: "#6ca6c1" }}>
          <div
            style={{
              marginRight: "10px",
              marginTop: "7px",
            }}
          >
            <Link
              style={{
                textDecoration: "none",
              }}
              to={`/`}
            >
              <AiFillHome></AiFillHome>
              <div
                style={{
                  fontSize: "9px",
                  color: "#6ca6c1",
                }}
              >
                Home
              </div>
            </Link>
          </div>
        </IconContext.Provider>
      </HeaderContainer>
      <PageTitleContainer>
        <PageTitleText>
          {`Collection  >  `} {collectionDetails.name}
        </PageTitleText>
      </PageTitleContainer>
      <CollectionContainerWrapper>
        <CollectionContainer>
          <CollectionContent className="collection content">
            {collectionDetails.anime.map((a, i) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                  
                }}
              >
                <div
                  style={{
                    display:'flex',
                    backgroundColor:'#020626',
                    height:'70px',
                    width:'60px',
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'column',
                    borderRadius:'7px'
                  }}

                  onClick={(e) =>openConfirmationModal(e, a)}
                >
                  <IconContext.Provider
                    value={{ size: "30px", color: "#6ca6c1" }}
                  >
                    <BsFillTrash3Fill></BsFillTrash3Fill>
                  </IconContext.Provider>
                  <div style={{
                    color: "#6ca6c1", 
                    fontSize:'13px',
                    fontWeight:'600'
                  }}>Remove</div>
                </div>
                <CardLink to={`/anime/${a.id}`}>
                  <CollectionItemCard key={a.title + i}>
                    <CoverImage src={a.image}></CoverImage>
                    <CollectionItemText>{a.title}</CollectionItemText>
                  </CollectionItemCard>
                </CardLink>
              </div>
            ))}
          </CollectionContent>
        </CollectionContainer>
      </CollectionContainerWrapper>
    </MainContainer>
  );
};

export default CollectionDetails;
