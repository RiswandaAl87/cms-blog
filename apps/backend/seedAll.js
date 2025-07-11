const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const postModel = require('./src/models/post.model');
const userModel = require('./src/models/user.model');

const posts = [
  {
    title: 'Manfaat Bangun Pagi untuk Kesehatan Tubuh',
    content: 'Bangun pagi memberikan banyak manfaat seperti udara segar, suasana tenang, dan waktu yang lebih produktif.',
    author: 'Aulia Rahma',
    tags: ['kesehatan', 'gaya hidup'],
    image: 'https://res.cloudinary.com/dk0z4ums3/image/upload/v1711096096/attached_image/manfaat-bangun-pagi-dan-cara-mudah-melakukannya-0-alodokter.jpg',
    createdAt: new Date('2025-07-01T06:00:00.000Z'),
    updatedAt: new Date('2025-07-01T06:00:00.000Z'),
  },
  {
    title: '7 Tempat Wisata Alam Tersembunyi di Indonesia',
    content: 'Indonesia memiliki berbagai destinasi alam yang masih belum banyak diketahui. Berikut 7 di antaranya.',
    author: 'Dimas Nugraha',
    tags: ['travel', 'wisata', 'alam'],
    image: 'https://tribratanews.polri.go.id/web/image/blog.post/50991/image',
    createdAt: new Date('2025-07-02T09:30:00.000Z'),
    updatedAt: new Date('2025-07-02T09:30:00.000Z'),
  },
  {
    title: 'Tips Mengelola Waktu di Era Digital',
    content: 'Mengelola waktu secara efektif menjadi semakin penting di tengah gangguan dari media sosial dan internet.',
    author: 'Sinta Marlina',
    tags: ['produktif', 'waktu', 'motivasi'],
    image: 'https://wqa.co.id/wp-content/uploads/2021/04/manajemen-waktu.png',
    createdAt: new Date('2025-07-03T14:15:00.000Z'),
    updatedAt: new Date('2025-07-03T14:15:00.000Z'),
  },
  {
    title: 'Mengenal Makanan Tradisional Khas Nusantara',
    content: 'Setiap daerah di Indonesia punya makanan tradisional unik dengan cita rasa khas yang patut dicoba.',
    author: 'Hana Putri',
    tags: ['kuliner', 'tradisional', 'nusantara'],
    image: 'https://mediaindonesia.gumlet.io/news/2024/03/43d03d639383ac6dcb2c75730d394c6e.jpg?w=700&dpr=1.5',
    createdAt: new Date('2025-07-04T10:45:00.000Z'),
    updatedAt: new Date('2025-07-04T10:45:00.000Z'),
  },
  {
    title: 'Cara Menjaga Kesehatan Mental di Tengah Kesibukan',
    content: 'Kesehatan mental sering terlupakan saat sibuk. Padahal, menjaga keseimbangan pikiran sangat penting.',
    author: 'Reza Aditya',
    tags: ['kesehatan', 'mental', 'psikologi'],
    image: 'https://iik.ac.id/blog/wp-content/uploads/2024/10/manajemen-kesehatan.jpeg',
    createdAt: new Date('2025-07-05T08:20:00.000Z'),
    updatedAt: new Date('2025-07-05T08:20:00.000Z'),
  },
  {
    title: 'Inspirasi Dekorasi Minimalis untuk Ruang Tamu',
    content: 'Dekorasi ruang tamu dengan gaya minimalis menciptakan kesan bersih, luas, dan nyaman untuk keluarga.',
    author: 'Indriani Syahputra',
    tags: ['dekorasi', 'interior', 'minimalis'],
    image: 'https://balisunsetroadconvention.com/wp-content/uploads/2024/06/dekorasi-indoor-pernikahan-dengan-perpaduan-kayu.jpg',
    createdAt: new Date('2025-07-06T11:00:00.000Z'),
    updatedAt: new Date('2025-07-06T11:00:00.000Z'),
  },
  {
    title: 'Buku Cerita',
    content: 'Buku yg sangat bagus',
    author: 'Wanda',
    tags: ['123'],
    image: 'https://res.cloudinary.com/dkmdopf6y/image/upload/v1751867849/posts/vumb7egzjqutcti91btc.jpg',
    createdAt: new Date('2025-07-07T05:57:26.242Z'),
    updatedAt: new Date('2025-07-07T05:57:26.242Z'),
  }
];

async function seedAll() {
  try {
    await mongoose.connect('mongodb://localhost:27017/cms_blog');
    console.log('✅ Terhubung ke database.');

    // Seed Posts
    await postModel.deleteMany();
    await postModel.insertMany(posts);
    console.log('✅ Data postingan berhasil dimasukkan!');

    // Seed Admin User
    const existingAdmin = await userModel.findOne({ email: 'admin@hotel.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new userModel({
        username: 'adminaja',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
      });
      await adminUser.save();
      console.log('✅ Admin berhasil dibuat!');
    } else {
      console.log('ℹ Admin sudah ada, tidak dibuat ulang.');
    }
  } catch (error) {
    console.error('❌ Gagal melakukan seed:', error);
    process.exit(1);
  }
}

seedAll();
