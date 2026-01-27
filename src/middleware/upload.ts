import { RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Upload klasörünü oluştur
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Dosya depolama ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';

    // Dosya tipine göre klasör belirle
    if (file.mimetype.startsWith('image/')) {
      folder += 'images/';
    } else if (file.mimetype.startsWith('video/')) {
      folder += 'videos/';
    } else if (file.mimetype === 'application/pdf') {
      folder += 'pdfs/';
    } else {
      folder += 'others/';
    }

    // Klasörü oluştur
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Dosya adını benzersiz yap
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Dosya filtresi
const fileFilter = (req: any, file: any, cb: any) => {
  // İzin verilen dosya tipleri
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/avi',
    'video/mov',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Desteklenmeyen dosya tipi. Sadece resim, video ve PDF dosyaları yükleyebilirsiniz.'), false);
  }
};

// Multer konfigürasyonu
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 5 // Maksimum 5 dosya
  }
});

// Tek dosya upload
export const uploadSingle = (fieldName: string) => upload.single(fieldName) as any;

// Çoklu dosya upload
export const uploadMultiple = (fieldName: string, maxCount: number = 5) =>
  upload.array(fieldName, maxCount) as any;

// Farklı alanlar için dosya upload
export const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]) as any;