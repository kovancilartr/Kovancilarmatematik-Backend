import { Request, Response } from 'express';
import { postService } from '../services/postService';
import { CreatePostSchema, UpdatePostSchema } from '../schemas/postSchemas';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

export const postController = {
  // Tüm postları getir
  async getAllPosts(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, category, isPublished, search } = req.query;
      
      const filters = {
        category: category as string,
        isPublished: isPublished === 'true' ? true : isPublished === 'false' ? false : undefined,
        search: search as string
      };

      const posts = await postService.getAllPosts(
        Number(page),
        Number(limit),
        filters
      );

      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Postlar getirilirken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  },

  // Tek post getir
  async getPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post bulunamadı'
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Post getirilirken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  },

  // Yeni post oluştur
  async createPost(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = CreatePostSchema.parse(req.body);
      const authorId = req.user?.id;

      if (!authorId) {
        return res.status(401).json({
          success: false,
          message: 'Yetkilendirme hatası'
        });
      }

      const post = await postService.createPost({
        ...validatedData,
        authorId
      });

      res.status(201).json({
        success: true,
        data: post,
        message: 'Post başarıyla oluşturuldu'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Geçersiz veri',
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Post oluşturulurken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  },

  // Post güncelle
  async updatePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = UpdatePostSchema.parse(req.body);

      const post = await postService.updatePost(id, validatedData);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post bulunamadı'
        });
      }

      res.json({
        success: true,
        data: post,
        message: 'Post başarıyla güncellendi'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Geçersiz veri',
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Post güncellenirken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  },

  // Post sil
  async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await postService.deletePost(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Post bulunamadı'
        });
      }

      res.json({
        success: true,
        message: 'Post başarıyla silindi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Post silinirken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  },

  // Post görüntülenme sayısını artır
  async incrementViewCount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await postService.incrementViewCount(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post bulunamadı'
        });
      }

      res.json({
        success: true,
        data: { viewCount: post.viewCount }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Görüntülenme sayısı güncellenirken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  }
};