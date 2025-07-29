// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Check credentials against environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUsername || !adminPasswordHash || !jwtSecret) {
      console.error('Admin credentials not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify username
    if (username !== adminUsername) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminPasswordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: adminUsername,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Set secure HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`
    ]);

    res.status(200).json({ 
      message: 'Login successful',
      user: { username: adminUsername, role: 'admin' }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// pages/api/auth/logout.ts
export async function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Clear the authentication cookie
  res.setHeader('Set-Cookie', [
    'auth-token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
  ]);

  res.status(200).json({ message: 'Logout successful' });
}

// pages/api/auth/verify.ts
export async function verifyHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.cookies['auth-token'];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    res.status(200).json({ 
      user: { 
        username: decoded.username, 
        role: decoded.role 
      }
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Middleware function for protecting admin routes
export function withAuth(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies['auth-token'];
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ message: 'Server configuration error' });
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      
      // Add user info to request
      (req as any).user = decoded;
      
      return handler(req, res);
      
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      console.error('Auth middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
