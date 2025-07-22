import type { NextApiRequest } from 'next';
import { adminAuth } from './firebaseAdmin';

export async function verifyToken(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  return decodedToken;
}