import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    try {
      const decodedUser = await verifyToken(req);
      const todos = await prisma.todo.findMany({
        where: { userId: decodedUser.uid },
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const decodedToken = await verifyToken(req);
      const { title, type, dueDate } = req.body;
      const newTodo = await prisma.todo.create({
        data: { title, type, dueDate: dueDate ? new Date(dueDate) : null, userId: decodedToken.uid, },
      });
      res.status(201).json(newTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({ error: 'Failed to create todo' });
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }}