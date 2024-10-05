"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Typewriter from "typewriter-effect";
import HealthBar from "./HealthBar";

export default function Home() {
  const [health, setHealth] = useState(0); // Default health value
  const [energy, setEnergy] = useState(0);
  const [mental, setMental] = useState(0);
  const [charisma, setCharsima] = useState(0);
  const [skill, setSkill] = useState(0);
  const [intellect, setIntellect] = useState(0); // Default energy value
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [displayString, setDisplayString] = useState(
    "You have been doing fantasic lately, Tell me how your day was today..."
  );
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [image, setImage] = useState(1);
  const [isAskingMode, setIsAskingMode] = useState(false);
  const [isOptionsVisibile, setOptionsVisible] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stats`);
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

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const send = (e) => {
    if (e.code === "Enter") {
      const sendEntry = async () => {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/daily-entry",
            {
              date: date,
              entry: userInput,
            }
          );
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
            response.data.image ? setImage(response.data.image) : null;
            setUserInput("");
            setIsAskingMode(true);
          }
        } catch (error) {
          console.error("Error fetching daily entry:", error);
        }
      };

      sendEntry();
    }
  };

  const ask = (e) => {
    if (e.code === "Enter") {
      const sendEntry = async () => {
        try {
          const response = await axios.post("http://localhost:5000/api/ask", {
            entry: userInput,
          });
          if (response.data) {
            setDisplayString(response.data.answer);
            setIsInputVisible(false);
            setUserInput("");
          }
        } catch (error) {
          console.error("Error fetching daily entry:", error);
        }
      };

      sendEntry();
    }
  };
  const back = ()=>{
    setOptionsVisible(true);
    setUserInput("");
  }
  const details = (e) => {
    if (e.code === "Enter") {
      const sendEntry = async () => {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/personal",
            {
              entry: userInput,
            }
          );
        } catch (error) {
          console.error("Error fetching daily entry:", error);
        }
      };

      sendEntry();
    }
  };

  return (
    <div className="page-container">
      <div className="row1">
        <div className="column column1">
          <div
            id="avatar"
            className="avatar-animation"
            style={{ backgroundImage: `url(/${image}.gif)` }}
          ></div>
        </div>
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
      </div>
      <div className="row2">
        <div className="dialog-box">
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
                      userInput.length <= 0 ? setIsInputVisible(true) : null;
                    })
                    .start();
                }}
              />
            ) : isOptionsVisibile ? (
              <div>
                
              </div>
            ) : (
              <textarea
                id="userInput"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={isAskingMode ? ask : send} // Call ask or send based on mode
                className="input-box"
                placeholder={
                  isAskingMode
                    ? "Ask me anything you want to know..."
                    : "Enter what you did today..."
                }
                style={{
                  outline: "none",
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                  fontFamily: "Press Start 2P",
                  fontSize: "18px",
                  width: "100%",
                  height: "80px",
                }}
                autoFocus // Automatically focus on the input field
              />
            )}
            <button className="back" onClick={back}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
