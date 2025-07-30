import React, { useState, useEffect } from "react";
import trainIcon from "./train.png";

export default function RailwayRescueDashboard() {
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(37);
  const [messages, setMessages] = useState({
    loco: false,
    ttr: false,
    control: false,
    hospitals: []
  });
  const [popupShown, setPopupShown] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const beep = () => {
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    audio.play().catch(() => console.log("Interaction required before sound can play."));
  };

  useEffect(() => {
    if (emergencyTriggered) {
      let timer = 15;
      setCountdown(timer);
      const countdownInterval = setInterval(() => {
        timer--;
        setCountdown(timer);
        if (timer <= 0) clearInterval(countdownInterval);
      }, 1000);

      // Delay all messages to finish by countdown = 5
      setTimeout(() => { beep(); setMessages((prev) => ({ ...prev, loco: true })); }, 1000);
      setTimeout(() => { beep(); setMessages((prev) => ({ ...prev, ttr: true })); }, 2500);
      setTimeout(() => { beep(); setMessages((prev) => ({ ...prev, control: true })); }, 3000);

      const hospitals = ["MMC Hospital", "LifeCare Hospital", "City Heart Clinic", "Hope Medical Center", "Sri Ram Hospital"];
      hospitals.forEach((name, index) => {
        setTimeout(() => {
          beep();
          setMessages((prev) => ({ ...prev, hospitals: [...prev.hospitals, name] }));
        }, 3000 + index * 800);
      });

      const move = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          if (next >= 62) {
            clearInterval(move);
            setTimeout(() => setPopupShown(true), 500);
            return 62;
          }
          return next;
        });
      }, 300);
    }
  }, [emergencyTriggered]);

  const handleCommand = () => {
    if (input.trim().toLowerCase() === "s3 emergency" && !emergencyTriggered) {
      setEmergencyTriggered(true);
    }
    setInput("");
  };

  const handleReset = () => {
    setEmergencyTriggered(false);
    setMessages({ loco: false, ttr: false, control: false, hospitals: [] });
    setProgress(37);
    setPopupShown(false);
    setCountdown(null);
  };

  const activeStation = () => {
    if (progress < 25) return "Namakkal";
    if (progress >= 25 && progress < 50) return "Salem";
    if (progress >= 50 && progress < 75) return "Erode";
    return "Chennai";
  };

  return (
    <div className="min-h-screen grid grid-cols-4 bg-[#1E1E1E] text-white p-4">
      <div className="col-span-1 bg-gray-900 p-4 rounded">
        <h2 className="text-lg font-bold mb-4">💬 Chatbot</h2>
        <div className="bg-gray-800 h-96 p-2 rounded overflow-auto text-sm">
          {emergencyTriggered ? (
            <p>🚨 Emergency S3 received! Alerting all personnel...</p>
          ) : (
            <p>Type "S3 Emergency" to activate system</p>
          )}
          {countdown !== null && (
            <p className="mt-4 text-yellow-400">⏱ Countdown: {countdown}s</p>
          )}
        </div>
        <div className="mt-4 flex">
          <input type="text" className="flex-1 bg-gray-700 p-2 rounded-l outline-none" placeholder="Type a command..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCommand()} />
          <button className="bg-blue-600 px-4 rounded-r" onClick={handleCommand}>Send</button>
        </div>
        <button onClick={handleReset} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">🔁 Reset System</button>
      </div>

      <div className="col-span-3 p-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">👨‍✈️ Loco Pilot</h2>
          {messages.loco && <p className="text-green-400 text-sm">Emergency at S3 – Increase speed by 20km/h</p>}
        </div>
        <div className="bg-gray-700 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">👨‍💼 TTR</h2>
          {messages.ttr && <p className="text-green-400 text-sm">Emergency at S3</p>}
        </div>
        <div className="bg-gray-700 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">🚉 Control Room (Next Station)</h2>
          {messages.control && <p className="text-green-400 text-sm">Emergency at S3 — Train No. 124242 approaching, prepare first aid</p>}
        </div>

        <div className="bg-gray-700 p-4 rounded shadow col-span-3">
          <h2 className="font-semibold mb-2">🏥 Nearby Hospitals (within 5 km at next station)</h2>
          {messages.hospitals.length > 0 ? (
            <ul className="list-disc pl-4 text-green-400 text-sm space-y-1">
              {messages.hospitals.map((hospital, index) => (
                <li key={index}>{hospital}: Message received</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">Awaiting emergency signal...</p>
          )}
        </div>

        <div className="col-span-3 bg-gray-800 p-4 rounded shadow mt-4 relative">
          <h2 className="text-lg font-semibold mb-2">📍 Where is my train?</h2>
          <div className="flex justify-between items-center text-sm relative">
            {["Namakkal", "Salem", "Erode", "Chennai"].map((station) => (
              <div key={station} className="flex flex-col items-center relative">
                <div className={`w-2 h-2 mb-1 rounded-full ${activeStation() === station ? "bg-yellow-400 animate-pulse" : "bg-white"}`}></div>
                <span className={activeStation() === station ? "text-yellow-300 font-bold" : ""}>{station}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 bg-gray-600 h-3 rounded relative">
            <div style={{ width: `${progress}%` }} className="bg-green-400 h-full rounded-l transition-all duration-500"></div>
            <img src={trainIcon} alt="Train" className="absolute top-[-10px] w-6 h-6" style={{ left: `calc(${progress}% - 12px)` }} />
          </div>
          <p className="text-xs mt-1 text-right italic">Current Location: {progress >=85 ? "Chennai" : activeStation()}</p>
          {popupShown && (
            <div className="absolute top-0 right-4 bg-green-600 text-white px-4 py-2 rounded shadow animate-bounce">✅ Patient Saved</div>
          )}
        </div>
      </div>
    </div>
  );
}
