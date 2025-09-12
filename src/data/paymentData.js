// src/data/paymentData.js

// 1. Impor semua gambar logo dari folder assets
import bniLogo from '../assets/payment-method/bni.png';
import bcaLogo from '../assets/payment-method/bca.png';
import mandiriLogo from '../assets/payment-method/mandiri.png';
import briLogo from '../assets/payment-method/bri.png';

export const paymentInstructions = {
  bni: {
    name: 'BNI Virtual Account',
    logo: bniLogo, // 2. Gunakan variabel hasil import
    instructions: [
      // ... (instruksi BNI tidak berubah)
       {
        title: 'Pembayaran Melalui ATM BNI',
        steps: [
          'Login ke aplikasi BNI Mobile Banking.',
          'Pilih menu Lain > Transfer > Virtual Account Billing.',
          'Masukkan nomor Virtual Account (VA) yang diberikan.',
          'Konfirmasi nama dan jumlah pembayaran.',
          'Pilih Ya untuk konfirmasi dan proses selesai.',
        ],
      },
      {
        title: 'Pembayaran Melalui BNI Mobile Banking',
        steps: [
          'Login ke aplikasi BNI Mobile Banking.',
          'Pilih menu Transfer > Virtual Account Billing.',
          'Masukkan nomor VA.',
          'Lihat data tagihan (nama & jumlah).',
          'Tekan Lanjut > Konfirmasi > Masukkan MPIN.',
          'Pembayaran berhasil.',
        ],
      },
      {
        title: 'Lewat Internet Banking BNI (iBank)',
        steps: [
          'Login ke https://ibank.bni.co.id.',
          'Pilih menu Transfer > Virtual Account Billing.',
          'Masukkan nomor Virtual Account.',
          'Konfirmasi tagihan & klik Lanjut.',
          'Masukkan mToken untuk menyelesaikan transaksi.',
        ],
      },
    ],
  },
  bca: {
    name: 'BCA Virtual Account',
    logo: bcaLogo, // 2. Gunakan variabel hasil import
    instructions: [
      // ... (instruksi BCA tidak berubah)
        {
        title: 'Melalui ATM BCA',
        steps: [
          'Masukkan kartu ATM BCA dan PIN.',
          'Pilih Transaksi Lainnya.',
          'Pilih Transfer.',
          'Pilih Ke Rekening Virtual Account.',
          'Masukkan nomor VA BCA.',
          'Layar akan menampilkan nama penerima dan jumlah tagihan.',
          'Konfirmasi, lalu pilih YA untuk menyelesaikan transaksi.',
          'Simpan struk bukti pembayaran.',
        ],
      },
      {
        title: 'Melalui m-BCA (BCA Mobile)',
        steps: [
          'Buka aplikasi BCA Mobile, pilih m-BCA dan login dengan PIN.',
          'Pilih menu m-Transfer.',
          'Pilih BCA Virtual Account.',
          'Masukkan nomor VA.',
          'Akan tampil nama penerima dan jumlah tagihan -> klik OK.',
          'Masukkan PIN m-BCA.',
          'Transaksi selesai. Simpan bukti pembayaran (screenshot jika perlu).',
        ],
      },
       {
        title: 'Melalui KlikBCA (Internet Banking BCA)',
        steps: [
          'Login ke https://klikbca.com.',
          'Pilih menu Transfer Dana > Transfer ke BCA Virtual Account.',
          'Masukkan nomor VA dan klik Lanjutkan.',
          'Konfirmasi data -> masukkan KeyBCA Response (from token).',
          'Pembayaran selesai.',
        ],
      },
    ],
  },
  mandiri: {
    name: 'Mandiri Virtual Account',
    logo: mandiriLogo, // 2. Gunakan variabel hasil import
    instructions: [
      // ... (instruksi Mandiri tidak berubah)
        {
        title: 'Via ATM Mandiri',
        steps: [
          'Masukkan kartu ATM Mandiri dan PIN.',
          'Pilih Bayar/Beli > Multipayment.',
          'Masukkan Kode Perusahaan / Institusi.',
          'Masukkan Nomor Virtual Account Anda.',
          'Periksa detail tagihan (nama & nominal).',
          'Tekan Ya untuk menyelesaikan pembayaran.',
        ],
      },
      {
        title: "Via Livin' by Mandiri (Mobile Banking)",
        steps: [
          "Buka aplikasi Livin' by Mandiri (kuning).",
          'Login dengan user dan PIN.',
          'Pilih menu Bayar > Buat Pembayaran Baru > Multipayment.',
          'Cari dan pilih nama penyedia jasa.',
          'Masukkan Nomor Virtual Account.',
          'Lihat detail tagihan, lalu tekan Lanjutkan > Konfirmasi > Masukkan PIN.',
          'Transaksi berhasil.',
        ],
      },
       {
        title: 'Via Mandiri Internet Banking',
        steps: [
          'Login ke https://ibank.bankmandiri.co.id.',
          'Masuk ke menu Pembayaran > Multipayment.',
          'Pilih penyedia jasa / institusi.',
          'Masukkan Nomor VA dan pilih rekening sumber dana.',
          'Konfirmasi data tagihan dan klik Kirim.',
          'Masukkan token Mandiri (SMS atau token fisik).',
          'Selesai.',
        ],
      },
    ],
  },
  bri: {
    name: 'BRI Virtual Account (BRIVA)',
    logo: briLogo, // 2. Gunakan variabel hasil import
    instructions: [
      // ... (instruksi BRI tidak berubah)
       {
        title: 'Pembayaran VA BRI via ATM BRI',
        steps: [
            'Masukkan kartu ATM dan PIN.',
            'Pilih menu Transaksi Lain > Pembayaran > Lainnya > BRIVA.',
            'Masukkan nomor Virtual Account.',
            'Konfirmasi nama & nominal.',
            'Jika sudah benar, pilih Ya untuk menyelesaikan pembayaran.',
        ]
      },
      {
        title: 'Pembayaran VA BRI via BRImo (Mobile Banking BRI)',
        steps: [
            'Buka aplikasi BRImo, lalu login.',
            'Pilih menu BRIVA.',
            'Tekan tombol Bayar Baru.',
            'Masukkan nomor BRIVA dan tekan Lanjutkan.',
            'Periksa nama & nominal -> tekan Bayar.',
            'Masukkan PIN BRImo -> selesai.',
        ]
      },
      {
        title: 'Pembayaran VA BRI via Internet Banking (IB BRI)',
        steps: [
            'Login ke https://ib.bri.co.id.',
            'Pilih menu Pembayaran > BRIVA.',
            'Masukkan nomor VA dan klik Kirim.',
            'Cek nama dan jumlah tagihan.',
            'Masukkan mToken dan konfirmasi pembayaran.',
        ]
      },
    ]
  }
};