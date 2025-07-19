import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.js';
import db from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'الوصول مرفوض - يلزم توكن مصادقة' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const [user] = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (!user[0]) {
      return res.status(401).json({ error: 'الوصول مرفوض - حساب المستخدم غير موجود' });
    }
    
    req.user = user[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'انتهت صلاحية التوكن، يرجى تجديده' });
    }
    res.status(401).json({ error: 'الوصول مرفوض - توكن غير صالح' });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'الوصول مرفوض - لا تملك الصلاحية اللازمة' });
    }
    next();
  };
};