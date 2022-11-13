/* ProtectedRoute - 24:00*/
/* auth - 34:10 */
/* App - 37:15 */


import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import auth from "../utils/auth";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip.js";

function App() {

  const history = useHistory();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState(undefined);


  //hook for token verification and auto login when rendering app

  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
    if (token) {
      auth.checkToken(token)
        .then((res) => {
          if (res) {
            setEmail(res.data.email);
            setIsLoggedIn(true);
            history.push('/');
          }
          else {
            localStorage.removeItem("jwt");
          }
        }).catch((err) => {
          console.log(err);
        });
    }
  }, [token, history]);

  const onRegister = (email, password) => {
    auth.register(email, password)
      .then((res) => {
        if (res.data._id) {
          console.log(res);
          toggleInfoTooltipSuccessRegisterationState();
          history.push('/signin');
        }
        else {
          toggleInfoTooltipFailedRegisterationState();
        }
      })
      .catch(() => {
        toggleInfoTooltipFailedRegisterationState();
      });
  }

  const onLogin = (email, password) => {
    auth.login(email, password)
      .then((res => {
        if (res.token) {
          toggleInfoTooltipSuccessLoginState();
          setToken(res.token);
          localStorage.setItem("jwt", token);
          localStorage.setItem("email", res.email);
          setIsLoggedIn(true);
          setEmail(email);
          history.push("/");
        }
        else {
          toggleInfoTooltipFailedLoginState();
        }
      }
      ))
      .catch(() => {
        toggleInfoTooltipFailedLoginState();
      });
  }

  //hook for set current user information
  const [currentUser, setCurrentUser] = useState({});
  //get user info from the server
  useEffect(() => {
    if (token) {
      api.getUserInfo(token)
        .then((info) => {
          setCurrentUser(info);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);

  const [cards, setCards] = useState([]);
  // get initial cards from the server
  useEffect(() => {
    if (token) {
      api.getInitialCards(token)
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    // Send a request to the API and getting the updated card data
    api.changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id, token)
      .then(() => {
        const newCards = cards.filter(
          (currentCard) => card._id !== currentCard._id
        );
        setCards(newCards);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //hook for auth if logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //TODELETE 

  /* setIsLoggedIn(true); */
  //hooks for opening the popups

  const [isInfoTooltipSuccessRegisterationOpen, setIsInfoTooltipSuccessRegisterationOpen] = useState(false);
  const [isInfoTooltipFailedRegisterationOpen, setIsInfoTooltipFailedRegisterationOpen] = useState(false);
  const [isInfoTooltipSuccessLoginOpen, setIsInfoTooltipSuccessLoginOpen] = useState(false);
  const [isInfoTooltipFailedLoginOpen, setIsInfoTooltipFailedLoginOpen] = useState(false);
  const [isPopupEditUserImageOpen, setIsPopupEditUserImageOpen] =
    useState(false);
  const [isPopupEditProfileOpen, setIsPopupEditProfileOpen] = useState(false);
  const [isPopupAddCardOpen, setIsPopupAddCardOpen] = useState(false);
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
  const [isPopupImageOpen, setIsPopupImageOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  /* functions for toggling popups state */

  const toggleInfoTooltipSuccessRegisterationState = () => {
    setIsInfoTooltipSuccessRegisterationOpen(!isInfoTooltipSuccessRegisterationOpen);
  };

  const toggleInfoTooltipFailedRegisterationState = () => {
    setIsInfoTooltipFailedRegisterationOpen(!isInfoTooltipFailedRegisterationOpen);
  };

  const toggleInfoTooltipSuccessLoginState = () => {
    setIsInfoTooltipSuccessLoginOpen(!isInfoTooltipSuccessLoginOpen);
  };

  const toggleInfoTooltipFailedLoginState = () => {
    setIsInfoTooltipFailedLoginOpen(!isInfoTooltipFailedLoginOpen);
  };

  const togglePopupUserImageState = () => {
    setIsPopupEditUserImageOpen(!isPopupEditUserImageOpen);
  };

  const togglePopupEditProfileState = () => {
    setIsPopupEditProfileOpen(!isPopupEditProfileOpen);
  };

  const togglePopupAddCardState = () => {
    setIsPopupAddCardOpen(!isPopupAddCardOpen);
  };

  /* const togglePopupConfirmationState = () => {
    setIsPopupConfirmationOpen(!isPopupConfirmationOpen);
  }; */


  const handleCardClick = (card) => {
    setIsPopupImageOpen(true);
    setSelectedCard(card);
  };

  const handleUpdateUser = (name, about) => {
    api.saveProfileData(name, about, token)
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // create new object from current user => replace avatar => setNew user
  const handleUpdateAvatar = (avatar) => {
    api.updateProfilePicture(avatar, token)
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddPlaceSubmit = (data) => {
    api.createCard(data, token)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onLogout = () => {
    console.log("onLogout is on");
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
  }

  const closeAllPopups = () => {
    setIsPopupEditUserImageOpen(false);
    setIsPopupEditProfileOpen(false);
    setIsPopupAddCardOpen(false);
    setIsPopupImageOpen(false);
    setIsPopupConfirmationOpen(false);
    setIsInfoTooltipSuccessRegisterationOpen(false);
    setIsInfoTooltipFailedRegisterationOpen(false);
    setIsInfoTooltipSuccessLoginOpen(false);
    setIsInfoTooltipFailedLoginOpen(false);
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
          <Header email={email} onLogout={onLogout} />
          <Switch>
            <ProtectedRoute exact path='/' loggedIn={isLoggedIn} redirectedPath='/signin'>
              <Main
                onUserImageClick={togglePopupUserImageState}
                onEditProfileClick={togglePopupEditProfileState}
                onAddCardClick={togglePopupAddCardState}
                cards={cards}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            </ProtectedRoute>
            <Route path="/signin">
              <Login onLogin={onLogin} />
            </Route>
            <Route path="/signup">
              <Register onRegister={onRegister} />
            </Route>
          </Switch>
          <Footer />

          {/* Change user image */}
          <EditAvatarPopup
            isOpen={isPopupEditUserImageOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          {/* Edit profile */}
          <EditProfilePopup
            isPopupOpen={isPopupEditProfileOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          {/* add card */}
          <AddPlacePopup
            isPopupOpen={isPopupAddCardOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
          />

          {/* Delete confirmation */}
          <PopupWithForm
            popupName="confirmation"
            isPopupOpen={isPopupConfirmationOpen}
            onClose={closeAllPopups}
            popupTitle="Are you sure?"
            submitButtonId="confirmationButton"
            submitButtonText="Yes"
          />

          {/* Image Popup */}
          <ImagePopup
            card={selectedCard}
            isPopupOpen={isPopupImageOpen}
            onClose={closeAllPopups}
          />

          <InfoTooltip
            popupName={'success-login'}
            isPopupOpen={isInfoTooltipSuccessLoginOpen}
            onClose={closeAllPopups}
            markType="success"
            popupSubtitles="Success! You have now been logged in."
          ></InfoTooltip>

          <InfoTooltip
            popupName={'fail-login'}
            isPopupOpen={isInfoTooltipFailedLoginOpen}
            onClose={closeAllPopups}
            markType="fail"
            popupSubtitles="Oops, something went wrong! Please try again."
          ></InfoTooltip>

          <InfoTooltip
            popupName={'success-registeration'}
            isPopupOpen={isInfoTooltipSuccessRegisterationOpen}
            onClose={closeAllPopups}
            markType="success"
            popupSubtitles="Success! You have now been registered."
          ></InfoTooltip>

          <InfoTooltip
            popupName={'fail-register'}
            isPopupOpen={isInfoTooltipFailedRegisterationOpen}
            onClose={closeAllPopups}
            markType="fail"
            popupSubtitles="Oops, something went wrong! Please try again."
          ></InfoTooltip>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
