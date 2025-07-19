import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function PlatformStats() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const data = [
    { number: 1250, text: "المعالجين المؤهلين لدعم السوريين نفسياً" },
    { number: 45, text: "المراكز المعتمدة داخل سوريا وفي دول اللجوء" },
    { number: 897542, text: "المستفيدين من خدماتنا لإعادة بناء حياتهم" },
  ];

  return (
    <div 
      style={{ 
        display: "flex", 
        justifyContent: "center", 
        margin: '-15px 0 40px 0', 
        padding: "40px 20px", 
      }}
      data-aos="fade-up"
    >
      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#3c7168", marginBottom: "30px" }}>
          دعم نفسي شامل لمساعدة السوريين على التعافي وإعادة بناء حياتهم
        </h3>
        {data.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h6 style={{ fontSize: "2rem", fontWeight: "bold", color: '#4faa85', margin: "10px 0" }}>
              {item.number}
            </h6>
            <p style={{ fontSize: "1.2rem", color: "#555" }}>{item.text}</p>
            {index < data.length - 1 && <hr style={{ borderColor: "#ddd", margin: "20px auto", width: "50%" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}