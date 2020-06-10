import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  homeScreens,
  designerScreens,
  activityScreens,
  executionScreens,
  messageConfig,
  homeGuideConfig,
  designerGuideConfig,
  activityGuideConfig,
  executionGuideConfig,
} from "./constants";
import OnBoardGuideContainer from "./OnBoardGuideContainer";
import OnBoardMessage from "./OnBoardMessage";
import "./styles.scss";

export default function OnBoardExpContainer({ onBoardShow, setOnBoardShow }) {
  const [screen, setScreen] = useState(0);
  const location = useLocation();

  const nextScreen = () => {
    setScreen((prevCount) => prevCount + 1);
  };

  const previousScreen = () => {
    setScreen((prevCount) => prevCount - 1);
  };

  const goToScreen = (newScreen) => {
    setScreen(newScreen);
  };

  const closeModal = () => {
    setScreen(0);
    setOnBoardShow(false);
  };

  if (!onBoardShow) {
    return null;
  }

  const index = screen;
  const path = location.pathname;
  let screens = {};
  let guideConfig = {};
  let message = {};

  if (path.includes("/workflows")) {
    screens = homeScreens;
    guideConfig = homeGuideConfig;
    message = messageConfig.welcomeHome;
  } else if (path.includes("/editor")) {
    screens = designerScreens;
    guideConfig = designerGuideConfig;
    message = messageConfig.welcomeDesigner;
  } else if (path.includes("/activity") && !path.includes("/execution")) {
    screens = activityScreens;
    guideConfig = activityGuideConfig;
    message = messageConfig.welcomeActivity;
  } else if (path.includes("/execution")) {
    screens = executionScreens;
    guideConfig = executionGuideConfig;
    message = messageConfig.welcomeExecution;
  } else {
    closeModal();
    return null;
  }

  if (index === screens.WELCOME) {
    return (
      <div className="c-onboard-wrapper">
        <OnBoardMessage
          nextScreen={nextScreen}
          closeModal={closeModal}
          goToScreen={goToScreen}
          returnScreen={screens.RETURN}
          {...message}
        />
      </div>
    );
  }

  if (index === screens.DONE) {
    return (
      <div className="c-onboard-wrapper">
        <OnBoardMessage nextScreen={nextScreen} closeModal={closeModal} {...messageConfig.done} />
      </div>
    );
  }

  if (index === screens.RETURN) {
    return (
      <div className="c-onboard-wrapper">
        <OnBoardMessage closeModal={closeModal} {...messageConfig.return} />
      </div>
    );
  }

  return (
    <div className="c-onboard-wrapper c-onboard-wrapper--transparent">
      <OnBoardGuideContainer
        index={index}
        nextScreen={nextScreen}
        previousScreen={previousScreen}
        closeModal={closeModal}
        screens={screens}
        guideConfig={guideConfig}
      />
    </div>
  );
}
