import db from '../config/db.js';

export const getPatients = async (req, res) => {
  try {
    const query = `
      SELECT p.id AS patient_id, d.name AS doctor_name, 
             u.name AS patient_name, p.start_date
      FROM patients p
      JOIN doctors d ON p.doctor_id = d.id
      JOIN users u ON p.user_id = u.id
    `;
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).send('Error fetching data from database');
  }
};