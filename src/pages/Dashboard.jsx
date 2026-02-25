import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/images/hero.jpg";
import "../css/Dashboard.css";

const allStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
  "Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh",
  "Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];

const top10India = [
  { name: "Taj Mahal", img: "https://images.unsplash.com/photo-1548013146-72479768bada" },
  { name: "Jaipur", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41" },
  { name: "Kerala", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944" },
  { name: "Goa", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
  { name: "Ladakh", img: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e" },
  { name: "Varanasi", img: "https://images.unsplash.com/photo-1518684079-3c830dcef090" },
  {
  name: "Andaman",
  img: "https://images.unsplash.com/photo-1582972236019-ea1d8fbbcd65"
},
  { name: "Rishikesh", img: "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0" },
  { name: "Hampi", img: "https://images.unsplash.com/photo-1608037521277-154cd1b89191" },
  { name: "Meghalaya", img: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33" }
];

export default function Dashboard() {

  const navigate = useNavigate();

  const [selectedState, setSelectedState] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;
    return diff > 0 ? diff / (1000 * 60 * 60 * 24) : 0;
  };

  const handleSearch = () => {
    if (selectedState && startDate && endDate) {
      navigate(`/state/${encodeURIComponent(selectedState)}`);
    } else {
      alert("Please select state and dates");
    }
  };

  return (
    <div
      className="dashboard-full"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="overlay">

        {/* HERO CONTENT */}
        <h1>🌍 Plan Your Dream Trip</h1>

        <div className="planner-box">

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">Select State</option>
            {allStates.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </select>

          <input type="date" onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" onChange={(e) => setEndDate(e.target.value)} />

          <button onClick={handleSearch}>
            Search
          </button>

        </div>

        {calculateDays() > 0 && (
          <div className="days-box">
            🗓 Total Stay: {calculateDays()} Days
          </div>
        )}

        {/* TOP 10 SECTION */}
        <h2 className="top-title">
          🏆 Top 10 Tourist Places in India
        </h2>

        <div className="attraction-grid">
          {top10India.map((item, index) => (
            <div key={index} className="card">
              <img src={item.img} alt={item.name} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}