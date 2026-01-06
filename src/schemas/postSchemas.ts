import { z } from 'zod';
import { Difficulty } from '@prisma/client';

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(255, 'Başlık çok uzun'),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url('Geçerli bir video URL\'si giriniz').optional().or(z.literal('')),
  pdfUrl: z.string().url('Geçerli bir PDF URL\'si giriniz').optional().or(z.literal('')),
  imageUrl: z.string().url('Geçerli bir resim URL\'si giriniz').optional().or(z.literal('')),
  category: z.string().min(1, 'Kategori gereklidir').max(100, 'Kategori adı çok uzun'),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  duration: z.number().positive('Süre pozitif olmalıdır').optional(),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.BEGINNER)
});

export const UpdatePostSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(255, 'Başlık çok uzun').optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url('Geçerli bir video URL\'si giriniz').optional().or(z.literal('')),
  pdfUrl: z.string().url('Geçerli bir PDF URL\'si giriniz').optional().or(z.literal('')),
  imageUrl: z.string().url('Geçerli bir resim URL\'si giriniz').optional().or(z.literal('')),
  category: z.string().min(1, 'Kategori gereklidir').max(100, 'Kategori adı çok uzun').optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  duration: z.number().positive('Süre pozitif olmalıdır').optional(),
  difficulty: z.nativeEnum(Difficulty).optional()
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;