import { prisma } from '../config/database';

interface UpdateSiteSettingsData {
  siteName?: string;
  siteDescription?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: any;
  seoKeywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

const defaultSettings = {
  siteName: 'Kovancilar Matematik',
  siteDescription: 'Matematik eğitimi ve ders materyalleri',
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  contactEmail: 'info@kovancilarmatematik.com',
  seoKeywords: ['matematik', 'eğitim', 'ders', 'video'],
  seoTitle: 'Kovancilar Matematik - Online Matematik Eğitimi',
  seoDescription: 'Kaliteli matematik eğitimi ve ders materyalleri ile matematik öğrenin.',
  maintenanceMode: false,
  allowRegistration: true,
  maxFileSize: 10485760, // 10MB
  allowedFileTypes: ['pdf', 'mp4', 'jpg', 'jpeg', 'png'],
  socialLinks: {
    youtube: '',
    instagram: '',
    twitter: '',
    facebook: ''
  }
};

export const siteSettingsService = {
  async getSiteSettings() {
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      // İlk kez çalıştırılıyorsa varsayılan ayarları oluştur
      settings = await prisma.siteSettings.create({
        data: defaultSettings
      });
    }
    
    return settings;
  },

  async updateSiteSettings(data: UpdateSiteSettingsData) {
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      // Ayarlar yoksa önce oluştur
      settings = await prisma.siteSettings.create({
        data: { ...defaultSettings, ...data }
      });
    } else {
      // Mevcut ayarları güncelle
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data
      });
    }
    
    return settings;
  },

  async resetSiteSettings() {
    // Mevcut ayarları sil ve varsayılan ayarları oluştur
    await prisma.siteSettings.deleteMany({});
    
    const settings = await prisma.siteSettings.create({
      data: defaultSettings
    });
    
    return settings;
  },

  async getPublicSettings() {
    const settings = await this.getSiteSettings();
    
    // Sadece public bilgileri döndür (admin ayarlarını gizle)
    return {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      socialLinks: settings.socialLinks,
      seoKeywords: settings.seoKeywords,
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      maintenanceMode: settings.maintenanceMode
    };
  }
};