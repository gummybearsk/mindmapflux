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

    // Validate credentials
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Check against environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '$2b$10$8K1p3H0McQlrFc3Zl2XcNe8jZc9L4P6Q2aU5kDc1FvGwX3wNx4CsS';

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
      { username, isAdmin: true },
      process.env.JWT_SECRET || 'mindmapflux-jwt-secret-2025-secure-key',
      { expiresIn: '24h' }
    );

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);

    return res.status(200).json({ 
      message: 'Login successful',
      user: { username, isAdmin: true }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Authentication middleware for protecting API routes
export function withAuth(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies['auth-token'];
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mindmapflux-jwt-secret-2025-secure-key') as any;
      
      if (!decoded.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      // Add user info to request
      (req as any).user = decoded;
      
      // Call the original handler
      return handler(req, res);
      
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
