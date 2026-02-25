import "../css/Home.css";
import hero from "../assets/images/hero.jpg";

const Home = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>Connect, Stay & Explore</h1>
          <p>
            Your smart travel platform connecting tourists,
            homestay hosts, and local guides for unforgettable experiences.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() =>
                document.getElementById("signup")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Get Started
            </button>

            <button
              className="btn-secondary"
              onClick={() =>
                document.getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features">
        <h2>Why Choose Travel Mate?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>🏡 Homestay Booking</h3>
            <p>Book comfortable stays hosted by trusted locals.</p>
          </div>

          <div className="feature-card">
            <h3>📍 Attractions Explorer</h3>
            <p>Discover popular destinations and hidden gems.</p>
          </div>

          <div className="feature-card">
            <h3>👨‍💼 Local Guide Support</h3>
            <p>Connect with experienced travel guides.</p>
          </div>

          <div className="feature-card">
            <h3>🔒 Secure Payments</h3>
            <p>Safe and reliable booking & payment system.</p>
          </div>
        </div>
      </section>

      {/* SIGNUP SECTION */}
      <section id="signup" className="cta">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join Travel Mate today and explore the world smarter.</p>

        <a href="/register" className="btn-light">
          Sign Up Now
        </a>
      </section>

      <footer className="footer">
        © 2026 Travel Mate. All rights reserved.
      </footer>
    </>
  );
};

export default Home;