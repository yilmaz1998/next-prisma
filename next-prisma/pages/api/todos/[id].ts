import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    const todoId = Number(id)
    
    if (req.method === 'GET') {
        try {
        const todo = await prisma.todo.findUnique({
            where: { id: todoId },
        });
        if (!todo) {
            res.status(404).json({ error: 'Todo not found' });
        } else {
            res.status(200).json(todo);
        }
        } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todo' });
        }
    }
    
    if (req.method === 'PUT') {
        const { title, completed } = req.body;
        const updatedTodo = await prisma.todo.update({
          where: { id: todoId },
          data: {
            title,
            completed,
          },
        });
        return res.status(200).json(updatedTodo);
      } 
      
    if (req.method === 'DELETE') {
        try {
        const deletedTodo = await prisma.todo.delete({
            where: { id: todoId },
        });
        res.status(200).json(deletedTodo);
        } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
        }
    } 
    
    else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }}