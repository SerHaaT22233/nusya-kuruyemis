import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seed basliyor...')

  try {
    const adminPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
      where: { email: 'admin@nusya.com' },
      update: {},
      create: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@nusya.com',
        password: adminPassword,
        role: 'ADMIN',
        isActive: true
      }
    })

    console.log('Admin kullanici olusturuldu:', admin.email)

    const categories = [
      { name: 'Antep Fistik', slug: 'antep-fistik', description: 'En kaliteli Antep fistiklari', image: '/uploads/category-antep-fistik.svg', isActive: true },
      { name: 'Badem', slug: 'badem', description: 'Ozenle kavrulmus taze bademler', image: '/uploads/category-badem.svg', isActive: true },
      { name: 'Findik', slug: 'findik', description: 'Giresun findiklari', image: '/uploads/category-findik.svg', isActive: true },
      { name: 'Kaju', slug: 'kaju', description: 'Buyuk ve lezzetli kaju fistiklari', image: '/uploads/category-kaju.svg', isActive: true },
      { name: 'Karisik Kuruyemis', slug: 'karisik-kuruyemis', description: 'Ozel karisim kuruyemis tabagi', image: '/uploads/category-karisik.svg', isActive: true },
      { name: 'Kabak Cekirdegi', slug: 'kabak-cekirdegi', description: 'Tuzsuz kabak cekirdekleri', image: '/uploads/category-kabak-cekirdegi.svg', isActive: true },
      { name: 'Ceviz', slug: 'ceviz', description: 'Buyuk ve besleyici cevizler', image: '/uploads/category-ceviz.svg', isActive: true },
      { name: 'Lokum', slug: 'lokum', description: 'Geleneksel Turk lokumu', image: '/uploads/category-lokum.svg', isActive: true },
      { name: 'Kuru Kayisi', slug: 'kuru-kayisi', description: 'Malatya kuru kayisi', image: '/uploads/category-kuru-kayisi.svg', isActive: true },
      { name: 'Kudus Hurmasi', slug: 'kudus-hurmas', description: 'Sulu ve tatli Kudus hurmasi', image: '/uploads/category-kudus-hurmas.svg', isActive: true }
    ]

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat
      })
    }

    console.log('Kategoriler olusturuldu')

    const categoryRecords = await prisma.category.findMany()

    const products = [
      { name: 'Antep Fistik', slug: 'antep-fistik', description: 'En kaliteli Antep fistiklari. Taze ve lezzetli.', price: 450, discountedPrice: 420, stock: 100, categoryId: categoryRecords[0].id, sku: 'ANT-001', unit: 'kg', isBestSeller: true, isNew: false, isOnSale: true, isCampaign: false, isActive: true, images: '["/uploads/antep-fistik-1.svg"]' },
      { name: 'Kavrulmus Badem', slug: 'kavrulmus-badem', description: 'Ozenle kavrulmus taze bademler.', price: 380, discountedPrice: null, stock: 80, categoryId: categoryRecords[1].id, sku: 'BAD-001', unit: 'kg', isBestSeller: true, isNew: false, isOnSale: false, isCampaign: false, isActive: true, images: '["/uploads/kavrulmus-badem-1.svg"]' },
      { name: 'Findik', slug: 'findik', description: 'Giresun findiklari. Dogal ve lezzetli.', price: 320, discountedPrice: 300, stock: 120, categoryId: categoryRecords[2].id, sku: 'FIN-001', unit: 'kg', isBestSeller: true, isNew: false, isOnSale: true, isCampaign: false, isActive: true, images: '["/uploads/findik-1.svg"]' },
      { name: 'Kaju', slug: 'kaju', description: 'Buyuk ve lezzetli kaju fistiklari.', price: 520, discountedPrice: 490, stock: 60, categoryId: categoryRecords[3].id, sku: 'KAJ-001', unit: 'kg', isBestSeller: true, isNew: false, isOnSale: false, isCampaign: false, isActive: true, images: '["/uploads/kaju-1.svg"]' },
      { name: 'Karisik Kuruyemis', slug: 'karisik-kuruyemis', description: 'Ozel karisim kuruyemis tabagi.', price: 400, discountedPrice: 380, stock: 90, categoryId: categoryRecords[4].id, sku: 'KAR-001', unit: 'kg', isBestSeller: true, isNew: false, isOnSale: true, isCampaign: false, isActive: true, images: '["/uploads/karisik-kuruyemis-1.svg"]' },
      { name: 'Kabak Cekirdegi', slug: 'kabak-cekirdegi', description: 'Tuzsuz kabak cekirdekleri.', price: 280, discountedPrice: 260, stock: 150, categoryId: categoryRecords[5].id, sku: 'KAB-001', unit: 'kg', isBestSeller: false, isNew: false, isOnSale: true, isCampaign: false, isActive: true, images: '["/uploads/kabak-cekirdegi-1.svg"]' },
      { name: 'Ceviz', slug: 'ceviz', description: 'Buyuk ve besleyici cevizler.', price: 350, discountedPrice: 330, stock: 70, categoryId: categoryRecords[6].id, sku: 'CEV-001', unit: 'kg', isBestSeller: false, isNew: false, isOnSale: false, isCampaign: false, isActive: true, images: '["/uploads/ceviz-1.svg"]' },
      { name: 'Lokum', slug: 'lokum', description: 'Geleneksel Turk lokumu. Fistikli.', price: 180, discountedPrice: 160, stock: 100, categoryId: categoryRecords[7].id, sku: 'LOK-001', unit: 'adet', isBestSeller: false, isNew: true, isOnSale: true, isCampaign: false, isActive: true, images: '["/uploads/lokum-1.svg"]' },
      { name: 'Kuru Kayisi', slug: 'kuru-kayisi', description: 'Malatya kuru kayisi. Dogal tat.', price: 220, discountedPrice: null, stock: 110, categoryId: categoryRecords[8].id, sku: 'KAY-001', unit: 'kg', isBestSeller: false, isNew: true, isOnSale: false, isCampaign: false, isActive: true, images: '["/uploads/kuru-kayisi-1.svg"]' },
      { name: 'Kudus Hurmasi', slug: 'kudus-hurmas', description: 'Sulu ve tatli Kudus hurmasi.', price: 250, discountedPrice: 230, stock: 85, categoryId: categoryRecords[9].id, sku: 'KUD-001', unit: 'kg', isBestSeller: false, isNew: true, isOnSale: false, isCampaign: false, isActive: true, images: '["/uploads/kudus-hurmas-1.svg"]' }
    ]

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product
      })
    }

    console.log('Urunler olusturuldu')

    await prisma.coupon.upsert({
      where: { code: 'NUSYA10' },
      update: {},
      create: {
        code: 'NUSYA10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 100,
        maxDiscount: 50,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2027-12-31'),
        usageLimit: 1000,
        perUserLimit: 5,
        usedCount: 0,
        isActive: true
      }
    })

    console.log('Kupon olusturuldu')
    console.log('Seed tamamlandi!')
  } catch (error) {
    console.error('Seed hatasi:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Seed islemi basarisiz:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
