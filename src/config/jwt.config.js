import jwt from 'jsonwebtoken';
export const genTokenAndSetCookie = (userId, res, role) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT, { expiresIn: '1d' });

    const cookieOptions = {
      maxAge: 86400000,
      httpOnly: true,
      path: '/',
      sameSite: 'Lax', 
    };

    if (role === 'user') {
      res.cookie('userToken', token, cookieOptions);
    } else if (role === 'admin') {
      res.cookie('adminToken', token, cookieOptions);
    }

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Error generating token");
  }
};

