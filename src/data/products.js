// Mengimpor gambar-gambar produk dari folder assets
import tShirtFrom1811 from '../assets/img/img-product/T-Shirt From 1811-1.png';
import tShirtFrom1811_2 from '../assets/img/img-product/T-Shirt From 1811-2.png';
import tShirtFrom1811_3 from '../assets/img/img-product/T-Shirt From 1811-3.png';
import mostOfMyFriends from '../assets/img/img-product/T-Shirt Most of My Friends.png';
import tellYourCat from '../assets/img/img-product/T-Shirt Tell Your Cat.png';
// --- PERBAIKAN: Nama file gambar disesuaikan ---
// Pastikan nama file "T-Shirt Coffee Saves Lives.png" ini sama persis dengan yang ada di folder assets Anda.
import coffeeSavesLives from '../assets/img/img-product/T-Shirt Coffee Saves Lives.png';
import goplayOutside from '../assets/img/img-product/T-Shirt Goplay Outside.png';
import goodCode from '../assets/img/img-product/T-Shirt good code.png';
import evergreens from '../assets/img/img-product/T-Shirt Evergreens.png';


// Mengekspor array (kumpulan) data produk
export const products = [
  {
    id: 1,
    name: 'T-Shirt From 1811',
    price: 150000,
    image: tShirtFrom1811
  },
  {
    id: 2,
    name: 'T-Shirt From 1811',
    price: 200000,
    image: tShirtFrom1811_2
  },
  {
    id: 3,
    name: 'T-Shirt From 1811',
    price: 180000,
    image: tShirtFrom1811_3
  },
  {
    id: 4,
    name: 'T-Shirt Most of My Friends',
    price: 130000,
    image: mostOfMyFriends
  },
  {
    id: 5,
    name: 'T-Shirt Tell Your Cat',
    price: 200000,
    image: tellYourCat
  },
  {
    id: 6,
    name: 'T-Shirt Coffee Saves Lives',
    price: 180000,
    image: coffeeSavesLives
  },
  {
    id: 7,
    name: 'T-Shirt Goplay Outside',
    price: 150000,
    image: goplayOutside
  },
  {
    id: 8,
    name: 'T-Shirt good code',
    price: 200000,
    image: goodCode
  },
  {
    id: 9,
    name: 'T-Shirt Evergreens',
    price: 180000,
    image: evergreens
  }
];
