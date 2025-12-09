import "../index.css";
import Dither from "../components/Dither.jsx";
import TextType from "../components/TextType.jsx";
import LogoLoop from "../components/LogoLoop.jsx";
import PillNav from "../components/PillNav";

const imageLogos = [
  // {
  //   src: "src/assets/logos/react.svg",
  //   alt: "React",
  //   href: "https://reactjs.org/",
  // },
  {
    src: "src/assets/logos/kotlin.png",
    alt: "Kotlin",
    href: "https://kotlinlang.org/",
  },
  {
    src: "src/assets/logos/java.png",
    alt: "Java",
    href: "https://www.java.com/",
  },
  {
    src: "src/assets/logos/android.png",
    alt: "Android",
    href: "https://www.android.com/",
  },
  {
    src: "src/assets/logos/linux.png",
    alt: "Linux",
    href: "https://www.linux.org/",
  },
  {
    src: "src/assets/logos/gitimg.svg",
    alt: "Git",
    href: "https://git-scm.com/",
  },
  {
    src: "src/assets/logos/docker.svg",
    alt: "Docker",
    href: "https://www.docker.com/",
  },
  {
    src: "src/assets/logos/mysql.svg",
    alt: "MySQL",
    href: "https://www.mysql.com/",
  },
  {
    src: "src/assets/logos/firebase.png",
    alt: "Firebase",
    href: "https://firebase.google.com/",
  },
  {
    src: "src/assets/logos/metabase.png",
    alt: "Metabase",
    href: "https://www.metabase.com/",
  },
  {
    src: "src/assets/logos/n8n.svg",
    alt: "n8n",
    href: "https://n8n.io/",
  },
  {
    src: "src/assets/logos/ubuntu.png",
    alt: "Ubuntu",
    href: "https://ubuntu.com/",
  },
  {
    src: "src/assets/logos/python.svg",
    alt: "Python",
    href: "https://www.python.org/",
  },
];

function Home() {
  const scrollToSection = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{ position: "relative", minHeight: "100vh" }}
      className="snap-y snap-mandatory h-screen overflow-y-scroll relative">
      {/* Fixed Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}>
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>

      {/* Fixed Header */}
      <header className="fixed inset-x-0 top-0 z-10 justify-center items-center backdrop-blur-xl bg-white/5 h-20 px-6 py-4 hidden md:flex">
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            justifyContent: "center",
          }}>
          <style>
            {`
              .pill-logo {
                display: none !important;
              }
              html {
                scroll-behavior: smooth;
              }
              
              /* Desktop centering */
              @media (min-width: 769px) {
                .pill-nav-container {
                  position: static !important;
                  display: flex !important;
                  justify-content: center !important;
                  align-items: center !important;
                  width: 100% !important;
                  left: auto !important;
                  top: auto !important;
                }
                .pill-nav {
                  justify-content: center !important;
                  width: auto !important;
                  margin: 0 !important;
                }
                .pill-nav-items {
                  margin: 0 !important;
                  display: flex !important;
                  justify-content: center !important;
                  width: auto !important;
                }
                .pill-list {
                  padding: 0.5rem 1.5rem !important;
                  gap: 1rem !important;
                  display: flex !important;
                  justify-content: center !important;
                  align-items: center !important;
                  margin: 0 !important;
                }
                .pill-list li {
                  margin: 0 0.5rem !important;
                }
              }
              
              /* Mobile: align menu button to left */
              @media (max-width: 768px) {
                .pill-nav-container {
                  position: static !important;
                  width: 100% !important;
                  display: flex !important;
                  justify-content: flex-start !important;
                  padding-left: 0 !important;
                }
                .pill-nav {
                  justify-content: flex-start !important;
                }
                .mobile-menu-button {
                  margin-left: 0 !important;
                }
                /* Enhanced blur for mobile menu popover */
                .mobile-menu-popover {
                  backdrop-filter: blur(30px) !important;
                  background: rgba(255, 255, 255, 0.15) !important;
                  border: 1px solid rgba(255, 255, 255, 0.2) !important;
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
                }
              }
            `}
          </style>
          <div
            onClick={(e) => {
              if (
                e.target.tagName === "A" &&
                e.target.getAttribute("href")?.startsWith("#")
              ) {
                e.preventDefault();
                scrollToSection(e.target.getAttribute("href"));
              }
            }}>
            <PillNav
              items={[
                { label: "Home", href: "#home" },
                { label: "About", href: "#about" },
                { label: "Skills", href: "#skills" },
                { label: "Contact", href: "#contact" },
                {
                  label: "Blog",
                  href: "https://blog.prabhuls.me/",
                  external: true,
                },
              ]}
              activeHref="#home"
              className="mx-auto"
              ease="power2.easeOut"
              baseColor="rgba(255, 255, 255, 0.1)"
              pillColor="rgba(255, 255, 255, 0.3)"
              hoveredPillTextColor="#ffffff"
              pillTextColor="rgba(255, 255, 255, 0.9)"
            />
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <section
          id="home"
          className="flex justify-center items-center min-h-screen px-6 snap-start min-h-screen flex items-center justify-center">
          <div
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              color: "#f5f5f5",
              textAlign: "center",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
            }}>
            <TextType
              text={[
                "Hey There, Thanks for Stopping By!",
                "This website is built with React, Tailwind CSS, and some magic! 🪄",
                "I'm Prabhu\nScroll down to know more about me \n⬇️",
              ]}
              //down arrow emoji
              typingSpeed={95}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </div>
        </section>

        {/* About Me Section */}
        <section
          id="about"
          className="min-h-screen flex justify-center items-center px-6 py-20 snap-start min-h-screen flex items-center justify-center">
          <div
            style={{
              maxWidth: "800px",
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              padding: "3rem",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#f5e3e3ff",
                marginBottom: "2rem",
                textAlign: "center",
              }}>
              About Me
            </h2>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#d1d1d1",
                lineHeight: "1.8",
                marginBottom: "1.5rem",
              }}>
              I enjoy working across different stacks, but I’m most at home with
              Python, Android (Jetpack Compose), React, and automation tools
              like Make, n8n, and cron-job.org. My learning style is simple:
              pick a real problem → build a solution → keep improving it.
            </p>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#d1d1d1",
                lineHeight: "1.8",
              }}>
              With a strong foundation in full-stack development, I specialize
              in Kotlin, Java, and Android development. I'm always eager to
              learn new technologies and take on challenging projects.
            </p>
          </div>
        </section>
        {/* Skills Section */}
        <section
          id="skills"
          className="min-h-screen flex flex-col justify-center items-center px-6 py-20 snap-start min-h-screen flex items-center justify-center">
          <div
            style={{
              maxWidth: "900px",
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              padding: "3rem",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              width: "100%",
            }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#f5e3e3ff",
                marginBottom: "3rem",
                textAlign: "center",
              }}>
              My Skills
            </h2>

            <div
              style={{
                width: "100%",
                marginBottom: "2rem",
                overflow: "hidden",
                filter:
                  "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))",
              }}>
              <LogoLoop
                logos={imageLogos}
                speed={120}
                direction="left"
                logoHeight={64}
                gap={60}
                hoverSpeed={0}
                scaleOnHover
                fadeOut={false}
                ariaLabel="Technology skills"
              />
            </div>

            <p
              style={{
                fontSize: "1.1rem",
                color: "#d1d1d1",
                textAlign: "center",
              }}>
              Proficient in Kotlin, Java, Android development, Linux, and more.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="min-h-screen flex justify-center items-center px-6 py-20 snap-start min-h-screen flex items-center justify-center">
          <div
            style={{
              maxWidth: "600px",
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              padding: "3rem",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              width: "100%",
            }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#f5e3e3ff",
                marginBottom: "2rem",
                textAlign: "center",
              }}>
              Get In Touch
            </h2>
            <div style={{ marginBottom: "1.5rem" }}>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#d1d1d1",
                  marginBottom: "1rem",
                }}
                href="mailto:dev@prabhuls.me">
                <strong style={{ color: "#f5e3e3ff" }}>Email:</strong>{" "}
                dev@prabhuls.me
              </p>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#d1d1d1",
                  marginBottom: "1rem",
                }}>
                <strong style={{ color: "#f5e3e3ff" }}>Get all links:</strong>{" "}
                <a
                  href="https://prabhuls.me/links"
                  target="_blank"
                  rel="noopener noreferrer">
                  ls-prabhu
                </a>
              </p>
            </div>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#d1d1d1",
                textAlign: "center",
                marginTop: "2rem",
              }}>
              Feel free to reach out for collaborations or just to say hi!
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          padding: "2rem",
          textAlign: "center",
          color: "#d1d1d1",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        className="">
        <p>
          &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
