import React, { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Grid,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material"; // تأكد من استيراد أيقونة الإغلاق

export default function UserTestimonials() {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleClickOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage("");
  };

  // تهيئة AOS عند تحميل المكون
  useEffect(() => {
    AOS.init({
      duration: 1000, // مدة الحركة بالمللي ثانية
      once: true, // إذا كنت تريد أن يتم التنفيذ مرة واحدة فقط
    });
  }, []);

  const experiences = [
    {
      imagePath: "/Images/JPG/ahmed.jpg",
      comment:
        "لقد ساعدني مركز تَوَاْزُنْ على استعادة توازني النفسي بعد فترة صعبة. كانت الجلسات مريحة وفعّالة.",
      username: "Ahmed",
    },
    {
      imagePath: "/Images/JPG/fatima.jpg",
      comment:
        "التقنيات التي تعلمتها في تَوَاْزُنْ غيرت حياتي. أشعر الآن بالقدرة على مواجهة التحديات اليومية.",
      username: "Fatima",
    },
    {
      imagePath: "/Images/JPG/mohamad.jpg",
      comment:
        "المدربون في تَوَاْزُنْ محترفون للغاية. لقد ساعدوني في فهم نفسي بشكل أفضل.",
      username: "Mohamed",
    },
    {
      imagePath: "/Images/JPG/sara.jpg",
      comment:
        "التجربة كانت رائعة! بيئة مركز تَوَاْزُنْ مريحة وداعمة، مما جعلني أشعر بالأمان.",
      username: "Sara",
    },
    {
      imagePath: "/Images/JPG/omar.jpg",
      comment:
        "بعد انضمامي إلى تَوَاْزُنْ، أصبحت أتعامل مع ضغوط الحياة بشكل أفضل. أوصي به للجميع!",
      username: "Omar",
    },
  ];

  return (
    <Grid
      container
      spacing={0}
      style={{ justifyContent: "center", padding: "0 50px" }}
    >
      {experiences.map((item, index) => (
        <Grid
          item
          sm={6}
          xs={12}
          md={4}
          key={index}
          style={{ height: "auto", width: "150px" }}
          data-aos="fade-up" // إضافة تأثير AOS هنا
        >
          <Paper 
            elevation={3} 
            style={{ 
              padding: "20px", 
              margin: "10px", 
              borderRadius: "15px", 
              transition: "transform 0.3s ease-in-out", 
              '&:hover': { transform: "scale(1.05)" } 
            }}
          >
            <div
              style={{
                display: "flex",
                direction: "rtl",
                alignItems: "center",
                cursor: 'pointer'
              }}
            >
              <div>
                {/* صورة مصغرة */}
                <img
                  src={item.imagePath}
                  alt=""
                  style={{ 
                    cursor: "pointer", 
                    height: '80px', 
                    width: '80px', 
                    marginLeft: '15px', 
                    borderRadius: '50%', 
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                    transition: "transform 0.3s ease-in-out", 
                   
                  }}
                  onClick={() => handleClickOpen(item.imagePath)}
                />
              </div>
              <h5 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}>{item.username}</h5>
            </div>

            <p style={{ marginTop: "10px", fontSize: "1rem", color: "#555", lineHeight: "1.5" }}>{item.comment}</p>
          </Paper>
        </Grid>
      ))}

      {/* Dialog لعرض الصورة */}
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle style={{ backgroundColor: "#333", color: "#fff" }}>
          <IconButton edge="end" color="inherit" onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "#f5f5f5" }}>
          <img
            src={selectedImage}
            alt="Enlarged"
            style={{ 
              width: "100%", 
              maxWidth: "500px", 
              height: "auto", 
              borderRadius: "15px", 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' 
            }}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
}