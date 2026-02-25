import { useParams, useNavigate } from "react-router-dom";
import stateData from "../data/stateData";
import "../css/StatePage.css";

export default function StatePage() {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const decodedState = decodeURIComponent(stateName);

  const state = stateData[decodedState];

  if (!state) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>No data found for {decodedState}</h2>
      </div>
    );
  }

  return (
    <div
      className="state-hero"
      style={{
        backgroundImage: `url(${state.hero})`
      }}
    >
      <div className="state-overlay">

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1>📍 Top 5 Places in {decodedState}</h1>

        <div className="places-grid">
          {state.places.map((place, index) => (
            <div key={index} className="place-card">
              <img src={place.img} alt={place.name} />
              <h3>{place.name}</h3>

              <button
                className="homestay-btn"
                onClick={() =>
                  navigate("/homestays", {
                    state: { place: place.name, state: decodedState }
                  })
                }
              >
                View Homestays
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}