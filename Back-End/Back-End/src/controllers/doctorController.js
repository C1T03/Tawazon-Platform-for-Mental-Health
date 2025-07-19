import db from '../config/db.js';

export const getDoctors = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM doctors");
    res.json(results);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).send("Error fetching data from database");
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const [results] = await db.query("SELECT * FROM doctors WHERE id = ?", [doctorId]);

    if (results.length === 0) {
      return res.status(404).send("Doctor not found");
    }

    res.json(results[0]);
  } catch (err) {
    console.error("Error fetching doctor:", err);
    res.status(500).send("Error fetching data from database");
  }
};