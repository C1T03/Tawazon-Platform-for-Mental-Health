import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function WelcomeHero() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        backgroundColor: "#f9f9f9",
        backgroundImage: "url(/Images/SVG/BackGround_1.svg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        color: "#ffff",
        padding: "150px 50px",
        lineHeight: "40px",
        backgroundAttachment: "scroll",
        display: "flex",
        flexDirection: "column",
      }}
      data-aos="fade-down"
      className="welcome-div"
    >
      <h4
        className="welcome"
        style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "20px" }}
      >
        أنت تستحق أن تكون سعيداً
      </h4>
      <p
        className="welcome"
        style={{ fontSize: "1.2rem", marginBottom: "20px" }}
      >
في منصة تَوَاْزُنْ، نقدم خدمات الرعاية النفسية لدعم أبناء سوريا في رحلتهم نحو التعافي وإعادة بناء حياتهم بعد سنوات الحرب. يضم مجتمعنا أفرادًا من جميع أنحاء البلاد، يجمعهم الأمل والقوة لاستعادة التوازن والطمأنينة.
      </p>
      <p className="welcome" style={{ fontSize: "1.2rem" }}>
        هل أنت مستعدٌ لاكتشاف عالمنا ؟{" "}
      </p>
    </div>
  );
}
