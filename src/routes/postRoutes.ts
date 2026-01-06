import { Router } from 'express';
import { postController } from '../controllers/postController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.patch('/:id/view', postController.incrementViewCount);

// Protected routes (Admin only)
router.use(authenticateToken);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;