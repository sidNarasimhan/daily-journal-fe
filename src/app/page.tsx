"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Typewriter from "typewriter-effect";
import HealthBar from "./HealthBar";

// Define an enum for different input modes
enum InputMode {
  DailyJournal,
  AskQuestion,
  PersonalDetails,
  // Add more modes here as needed
}

export default function Home() {
  const [health, setHealth] = useState(0); // Default health value
  const [energy, setEnergy] = useState(0);
  const [mental, setMental] = useState(0);
  const [charisma, setCharsima] = useState(0);
  const [skill, setSkill] = useState(0);
  const [intellect, setIntellect] = useState(0); // Default energy value
  const date = useState(new Date().toISOString().split("T")[0]);
  const [displayString, setDisplayString] = useState(
    "You have been doing fantastic lately, Tell me how your day was today..."
  );
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [image, setImage] = useState(1);
  const [isOptionsVisibile, setOptionsVisible] = useState(true);
  const [currentOption, setCurrentOption] = useState(0);
  const [inputMode, setInputMode] = useState<InputMode | null>(null);
  const options = [
    { label: "Enter Daily Journal", mode: InputMode.DailyJournal },
    { label: "Ask a Question", mode: InputMode.AskQuestion },
    { label: "Enter Personal Details", mode: InputMode.PersonalDetails },
    // Add more options here as needed
  ];
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 1024);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(`https://daily-journal-be.onrender.com/api/stats`);
        if (response.data) {
          console.log("response", response.data);
          setHealth(response.data.health);
          setEnergy(response.data.energy);
          setMental(response.data.mental);
          setIntellect(response.data.intellect);
          setCharsima(response.data.charisma);
          setSkill(response.data.skill);
          setImage(response.data.image);
        }
      } catch (error) {
        console.error("Error fetching daily entry:", error);
      }
    };

    fetchEntry();
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isOptionsVisibile) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setCurrentOption((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setCurrentOption((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        } else if (e.key === "Enter") {
          e.preventDefault();
          handleOptionSelect(options[currentOption].mode);
          setUserInput("");
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isOptionsVisibile, currentOption, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && isInputVisible && !isOptionsVisibile) {
      e.preventDefault();
      switch (inputMode) {
        case InputMode.DailyJournal:
          sendDailyJournal();
          break;
        case InputMode.AskQuestion:
          askQuestion();
          break;
        case InputMode.PersonalDetails:
          sendPersonalDetails();
          break;
        // Add more cases here as needed
      }
    }
  };

  const sendDailyJournal = async () => {
    if (!userInput.trim()) {
      console.log("No input detected for daily journal entry.");
      return;
    }

    try {
      const response = await axios.post("https://daily-journal-be.onrender.com/api/daily-entry", {
        date: date,
        entry: userInput,
      });
      if (response.data) {
        console.log("response", response.data);
        setHealth(response.data.health);
        setEnergy(response.data.energy);
        setMental(response.data.mental);
        setIntellect(response.data.intellect);
        setCharsima(response.data.charisma);
        setSkill(response.data.skill);
        setDisplayString(response.data.message);
        setIsInputVisible(false);
        if (response.data.image) setImage(response.data.image);
        setUserInput("");
      }
    } catch (error) {
      console.error("Error sending daily entry:", error);
    }
  };

  const askQuestion = async () => {
    if (!userInput.trim()) {
      console.log("No input detected for question.");
      return;
    }

    try {
      const response = await axios.post("https://daily-journal-be.onrender.com/api/ask", {
        entry: userInput,
      });
      if (response.data) {
        setDisplayString(response.data.answer);
        setIsInputVisible(false);
        setUserInput("");
      }
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  const sendPersonalDetails = async () => {
    if (!userInput.trim()) {
      console.log("No input detected for personal details.");
      return;
    }

    try {
      const response = await axios.post("https://daily-journal-be.onrender.com/api/personal", {
        entry: userInput,
      });
      // Handle response as needed
      console.log("response", response.data);
      setIsInputVisible(false);
      setUserInput("");
    } catch (error) {
      console.error("Error sending personal details:", error);
    }
  };

  const back = () => {
    setOptionsVisible(true);
    setUserInput("");
    setInputMode(null);
  };

  const handleOptionSelect = (mode: InputMode) => {
    setOptionsVisible(false);
    setIsInputVisible(true);
    setInputMode(mode);
    // Add a small delay before focusing on the textarea
    setTimeout(() => {
      const textarea = document.getElementById('userInput') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
      }
    }, 0);
  };

  return (
    <div className="page-container">
      <div
        id="avatar"
        className="avatar-animation"
        style={{ backgroundImage: `url(/${image}.gif)` }}
      ></div>
      {!isMobile && (
        <div className="stats">
          <link
            href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
            rel="stylesheet"
          />

          <ul style={{ width: "100%" }}>
            <li> {<HealthBar value={health} type="Health" />}</li>
            <li>{<HealthBar value={energy} type="Energy" />}</li>
            <li>{<HealthBar value={mental} type="Mental" />}</li>
            <li>{<HealthBar value={charisma} type="Spirit" />}</li>
            <li>{<HealthBar value={skill} type="Skills" />}</li>
            <li>{<HealthBar value={intellect} type="Wisdom" />}</li>
          </ul>
        </div>
      )}
      <div className={`row2 ${isMobile ? 'mobile' : ''}`}>
        <div className="dialog-box" tabIndex={0}>
          <link
            href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
            rel="stylesheet"
          />
          <div className="dialog-content">
            {!isInputVisible ? (
              <Typewriter
                options={{ cursor: "", delay: 50 }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString(displayString)
                    .pauseFor(displayString.length * 50)
                    .callFunction(() => {
                      if(userInput.length <= 0) {setIsInputVisible(true)} 
                    })
                    .start();
                }}
              />
            ) : isOptionsVisibile ? (
              <div className="options-container">
                {options.map((option, index) => (
                  <div
                    key={option.label}
                    className={`option ${index === currentOption ? "selected" : ""}`}
                    onClick={() => handleOptionSelect(option.mode)}
                  >
                    {index === currentOption && ">"} {option.label}
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                id="userInput"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="input-box"
                placeholder={getPlaceholder(inputMode)}
                style={{
                  outline: "none",
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                  fontFamily: "Press Start 2P",
                  fontSize: isMobile ? "14px" : "18px",
                  width: "100%",
                  height: isMobile ? "60px" : "80px",
                }}
                autoFocus
              />
            )}
            <button className="back" onClick={back}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPlaceholder(mode: InputMode | null): string {
  switch (mode) {
    case InputMode.DailyJournal:
      return "Enter what you did today...";
    case InputMode.AskQuestion:
      return "Ask me anything you want to know...";
    case InputMode.PersonalDetails:
      return "Enter your personal details...";
    default:
      return "";
  }
}
