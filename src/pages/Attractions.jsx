import { useState } from "react";

const POPULAR_DESTINATIONS = [
  {
    id: 1,
    name: "Goa Beaches",
    state: "Goa",
    places: ["Baga", "Calangute", "Palolem"],
    bestTime: "Nov – Feb",
    description: "Perfect for beach holidays, parties and water sports.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: 2,
    name: "Jaipur – Pink City",
    state: "Rajasthan",
    places: ["Hawa Mahal", "Amber Fort", "City Palace"],
    bestTime: "Oct – Mar",
    description: "Palaces, forts and colourful markets rich in history.",
    image:
      "https://img.sanishtech.com/u/dc5b077c918ad7b59048e6c9eee4eae2.jpg",
  },
  {
    id: 3,
    name: "Manali & Rohtang",
    state: "Himachal Pradesh",
    places: ["Solang Valley", "Rohtang Pass"],
    bestTime: "Mar – Jun, Dec – Feb",
    description: "Snow, mountains and adventure sports in the Himalayas.",
    image:
      "https://img.sanishtech.com/u/9590bdbbd5796dfa0b20d0bb7f8d8045.jpg",
  },
  {
    id: 4,
    name: "Kerala Backwaters",
    state: "Kerala",
    places: ["Alleppey", "Kumarakom"],
    bestTime: "Sep – Mar",
    description: "Houseboats, lagoons and peaceful backwater cruises.",
    image:
      "https://img.sanishtech.com/u/f727e68e50f24219891ad968cf491117.jpg",
  },
  {
    id: 5,
    name: "Andaman Islands",
    state: "Andaman & Nicobar",
    places: ["Havelock Island", "Radhanagar Beach"],
    bestTime: "Nov – Apr",
    description: "Turquoise water, coral reefs and pristine beaches.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: 6,
    name: "Ladakh – Land of High Passes",
    state: "Ladakh",
    places: ["Pangong Lake", "Leh", "Nubra Valley"],
    bestTime: "Jun – Sep",
    description: "Monasteries, high-altitude lakes and dramatic landscapes.",
    image:
      "https://img.sanishtech.com/u/6fa8112deb1a6d32be1bba1828804cbf.jpg",
  },

  // ✅ Andhra Pradesh popular destinations
  {
    id: 7,
    name: "Tirupati & Tirumala",
    state: "Andhra Pradesh",
    places: ["Tirumala Temple", "Sri Govindaraja Swamy Temple"],
    bestTime: "Sep – Mar",
    description:
      "One of the most important pilgrimage centres in India, with ancient temples on Tirumala hills.",
    image:
      "https://img.sanishtech.com/u/dea095137c91d8f56e2a2fdb0d87626c.jpg",
  },
  {
    id: 8,
    name: "Visakhapatnam Coast",
    state: "Andhra Pradesh",
    places: ["RK Beach", "Kailasagiri", "Submarine Museum"],
    bestTime: "Oct – Mar",
    description:
      "A beautiful coastal city with long beaches, hill viewpoints and a relaxed seaside vibe.",
    image:
      "https://img.sanishtech.com/u/26ca8df8a24158890cc90e69f92c1f76.jpg",
  },
  {
    id: 9,
    name: "Araku Valley & Borra Caves",
    state: "Andhra Pradesh",
    places: ["Araku Valley", "Borra Caves", "Coffee Plantations"],
    bestTime: "Oct – Mar",
    description:
      "Scenic hill station near Vizag known for its coffee estates, tribal culture and limestone caves.",
    image:
      "https://img.sanishtech.com/u/1d17036eec27401293ebecd0af891421.jpg",
  },
];

const STATE_PLACES = [
  {
    state: "Andhra Pradesh",
    region: "South",
    places: ["Tirupati", "Araku Valley", "Visakhapatnam"],
  },
  {
    state: "Arunachal Pradesh",
    region: "North-East",
    places: ["Tawang", "Ziro Valley"],
  },
  {
    state: "Assam",
    region: "North-East",
    places: ["Kaziranga National Park", "Majuli Island"],
  },
  { state: "Bihar", region: "East", places: ["Bodh Gaya", "Nalanda"] },
  {
    state: "Chhattisgarh",
    region: "Central",
    places: ["Chitrakote Falls", "Barnawapara Sanctuary"],
  },
  { state: "Goa", region: "West", places: ["Baga Beach", "Old Goa Churches"] },
  {
    state: "Gujarat",
    region: "West",
    places: ["Gir National Park", "Rann of Kutch", "Somnath"],
  },
  {
    state: "Haryana",
    region: "North",
    places: ["Kurukshetra", "Sultanpur Bird Sanctuary"],
  },
  {
    state: "Himachal Pradesh",
    region: "North",
    places: ["Shimla", "Manali", "Dharamshala"],
  },
  {
    state: "Jharkhand",
    region: "East",
    places: ["Ranchi", "Betla National Park"],
  },
  {
    state: "Karnataka",
    region: "South",
    places: ["Coorg", "Hampi", "Mysuru"],
  },
  {
    state: "Kerala",
    region: "South",
    places: ["Munnar", "Alleppey", "Kochi", "Wayanad"],
  },
  {
    state: "Madhya Pradesh",
    region: "Central",
    places: ["Khajuraho", "Bandhavgarh", "Ujjain"],
  },
  {
    state: "Maharashtra",
    region: "West",
    places: ["Mumbai", "Lonavala", "Ajanta & Ellora"],
  },
  {
    state: "Manipur",
    region: "North-East",
    places: ["Loktak Lake", "Imphal"],
  },
  {
    state: "Meghalaya",
    region: "North-East",
    places: ["Shillong", "Cherrapunji", "Living Root Bridges"],
  },
  {
    state: "Mizoram",
    region: "North-East",
    places: ["Aizawl", "Vantawng Falls"],
  },
  {
    state: "Nagaland",
    region: "North-East",
    places: ["Kohima", "Dzukou Valley", "Hornbill Festival"],
  },
  {
    state: "Odisha",
    region: "East",
    places: ["Puri", "Konark Sun Temple", "Chilika Lake"],
  },
  {
    state: "Punjab",
    region: "North",
    places: ["Amritsar – Golden Temple", "Wagah Border"],
  },
  {
    state: "Rajasthan",
    region: "West",
    places: ["Jaipur", "Udaipur", "Jaisalmer", "Jodhpur"],
  },
  {
    state: "Sikkim",
    region: "North-East",
    places: ["Gangtok", "Nathula Pass", "Gurudongmar Lake"],
  },
  {
    state: "Tamil Nadu",
    region: "South",
    places: ["Ooty", "Kodaikanal", "Mahabalipuram", "Madurai"],
  },
  {
    state: "Telangana",
    region: "South",
    places: ["Hyderabad – Charminar", "Ramoji Film City"],
  },
  {
    state: "Tripura",
    region: "North-East",
    places: ["Ujjayanta Palace", "Neermahal"],
  },
  {
    state: "Uttar Pradesh",
    region: "North",
    places: ["Agra – Taj Mahal", "Varanasi", "Lucknow"],
  },
  {
    state: "Uttarakhand",
    region: "North",
    places: ["Rishikesh", "Haridwar", "Nainital", "Valley of Flowers"],
  },
  {
    state: "West Bengal",
    region: "East",
    places: ["Kolkata", "Darjeeling", "Sundarbans"],
  },

  // key Union Territories / capital regions for “all India” feel
  {
    state: "Delhi (NCT)",
    region: "Capital",
    places: ["India Gate", "Qutub Minar", "Red Fort"],
  },
  {
    state: "Jammu & Kashmir",
    region: "North",
    places: ["Srinagar", "Gulmarg", "Pahalgam"],
  },
  {
    state: "Ladakh",
    region: "North",
    places: ["Leh", "Pangong Lake", "Nubra Valley"],
  },
  {
    state: "Puducherry",
    region: "South",
    places: ["White Town", "Auroville", "Promenade Beach"],
  },
  {
    state: "Andaman & Nicobar Islands",
    region: "Islands",
    places: ["Port Blair", "Havelock Island"],
  },
];

export default function Attractions() {
  const [search, setSearch] = useState("");

  const text = search.toLowerCase();

  const filteredPopular = POPULAR_DESTINATIONS.filter((d) => {
    return (
      d.name.toLowerCase().includes(text) ||
      d.state.toLowerCase().includes(text) ||
      d.places.some((p) => p.toLowerCase().includes(text))
    );
  });

  const filteredStates = STATE_PLACES.filter((s) => {
    return (
      s.state.toLowerCase().includes(text) ||
      s.region.toLowerCase().includes(text) ||
      s.places.some((p) => p.toLowerCase().includes(text))
    );
  });

  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "2rem auto",
        padding: "0 1.5rem",
      }}
    >
      <h1>Tourist Attraction Guide – All India</h1>
      <p>
        Browse popular destinations and famous tourist places from every state
        and region of India. Use the search box to filter by state, city or
        attraction name.
      </p>

      <input
        type="text"
        placeholder="Search by state, city, place or region (e.g. Goa, Andhra Pradesh, temple)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          margin: "1rem 0",
          padding: "0.5rem 0.6rem",
          width: "100%",
          maxWidth: "500px",
        }}
      />

      {/* Popular destinations cards */}
      <h2 style={{ marginTop: "1.5rem" }}>Popular Destinations Across India</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {filteredPopular.map((d) => (
          <div
            key={d.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#ffffff",
              boxShadow: "0 4px 12px rgba(144, 49, 96, 1)",
            }}
          >
            <img
              src={d.image}
              alt={d.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <div style={{ padding: "0.8rem 1rem" }}>
              <h3>{d.name}</h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#4b5563",
                  marginTop: "0.2rem",
                }}
              >
                {d.state} • Best time: {d.bestTime}
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#4b5563",
                  marginTop: "0.4rem",
                }}
              >
                {d.description}
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#1d4ed8",
                  marginTop: "0.4rem",
                }}
              >
                Places: {d.places.join(", ")}
              </p>
            </div>
          </div>
        ))}

        {filteredPopular.length === 0 && (
          <p>No popular destination matched “{search}”.</p>
        )}
      </div>

      {/* States & famous places */}
      <h2 style={{ marginTop: "2.5rem" }}>States & Famous Tourist Places</h2>
      <p style={{ marginBottom: "1rem", color: "#4b5563" }}>
        These are quick reference lists you can later connect to APIs or
        detailed pages in your backend.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredStates.map((s) => (
          <div
            key={s.state}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "0.9rem 1rem",
              background: "#ffffff",
            }}
          >
            <h3 style={{ marginBottom: "0.2rem" }}>{s.state}</h3>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              Region: {s.region}
            </p>
            <ul
              style={{
                paddingLeft: "1.1rem",
                margin: 0,
                fontSize: "0.9rem",
              }}
            >
              {s.places.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}

        {filteredStates.length === 0 && (
          <p>No state or place matched “{search}”.</p>
        )}
      </div>
    </section>
  );
}