import { z } from 'zod';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const UpdateSiteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site adı gereklidir').max(100, 'Site adı çok uzun').optional(),
  siteDescription: z.string().max(1000, 'Site açıklaması çok uzun').optional(),
  logoUrl: z.string().url('Geçerli bir logo URL\'si giriniz').optional().or(z.literal('')),
  faviconUrl: z.string().url('Geçerli bir favicon URL\'si giriniz').optional().or(z.literal('')),
  primaryColor: z.string().regex(hexColorRegex, 'Geçerli bir hex renk kodu giriniz (örn: #FF0000)').optional(),
  secondaryColor: z.string().regex(hexColorRegex, 'Geçerli bir hex renk kodu giriniz (örn: #FF0000)').optional(),
  contactEmail: z.string().email('Geçerli bir e-posta adresi giriniz').optional().or(z.literal('')),
  contactPhone: z.string().max(20, 'Telefon numarası çok uzun').optional().or(z.literal('')),
  socialLinks: z.object({
    youtube: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    tiktok: z.string().url().optional().or(z.literal(''))
  }).optional(),
  seoKeywords: z.array(z.string().min(1)).max(20, 'En fazla 20 anahtar kelime girebilirsiniz').optional(),
  seoTitle: z.string().max(255, 'SEO başlığı çok uzun').optional().or(z.literal('')),
  seoDescription: z.string().max(500, 'SEO açıklaması çok uzun').optional().or(z.literal('')),
  maintenanceMode: z.boolean().optional(),
  allowRegistration: z.boolean().optional(),
  maxFileSize: z.number().positive('Dosya boyutu pozitif olmalıdır').max(104857600, 'Maksimum dosya boyutu 100MB olabilir').optional(), // 100MB max
  allowedFileTypes: z.array(z.string().min(1)).optional()
});

export type UpdateSiteSettingsInput = z.infer<typeof UpdateSiteSettingsSchema>;