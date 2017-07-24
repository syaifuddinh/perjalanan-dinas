-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 18, 2013 at 03:58 AM
-- Server version: 5.1.30
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `spd_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `spd_karyawan`
--

CREATE TABLE IF NOT EXISTS `spd_karyawan` (
  `id_karyawan` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nip_karyawan` varchar(45) NOT NULL,
  `nama_karyawan` varchar(255) NOT NULL DEFAULT '-',
  `jabatan_karyawan` varchar(255) NOT NULL DEFAULT '-',
  `gol_karyawan` varchar(8) NOT NULL,
  `kota_karyawan` varchar(45) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id_karyawan`,`nip_karyawan`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `spd_karyawan`
--

INSERT INTO `spd_karyawan` (`id_karyawan`, `nip_karyawan`, `nama_karyawan`, `jabatan_karyawan`, `gol_karyawan`, `kota_karyawan`) VALUES
(1, '198404042010122003', 'Yuli Yolanda', 'Staf subbag TU KKP Kelas II Cilacap', 'III/c', 'Cilacap'),
(3, '198805272009122001', 'Ria Rosmawardini', 'Staf Bag TU KKP Kelas I Soekarno Hatta', 'III/c', 'Jakarta'),
(4, '197806092005011003', 'Putri Garnaditia', 'Operator SAKPA KKP Kelas III jambi', 'III/c', 'Bandung'),
(5, '198704072010122002', 'Meylani Titi Sukma Dewi', 'Staf Subbag TU KKP Cilacap 1', 'III/a', 'Cilacap'),
(7, '197001261990011001', 'Rochman Suwardi', 'Wasubag Keuangan dan Pembukuan', 'III/a', 'Jakarta'),
(8, '198107042003121003', 'M Fajar Subechi', 'Kabag Umum dan Personalia', 'III/a', 'Jakarta'),
(14, '198312022010122002', 'Siti Daniati', 'Operator SAKPA KKP Kelas III jambi', 'III/a', 'Jambi');

-- --------------------------------------------------------

--
-- Table structure for table `spd_kegiatan`
--

CREATE TABLE IF NOT EXISTS `spd_kegiatan` (
  `id_kegiatan` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `no_kegiatan` varchar(45) NOT NULL,
  `akun_anggaran` varchar(45) NOT NULL DEFAULT '-',
  `tahun_anggaran` varchar(45) NOT NULL DEFAULT '-',
  `nama_kegiatan` text NOT NULL,
  `satuan_kerja` varchar(255) NOT NULL DEFAULT '-',
  `tgl_mulai` date NOT NULL,
  `tgl_akhir` date NOT NULL,
  `tempat_kegiatan` varchar(255) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id_kegiatan`,`no_kegiatan`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `spd_kegiatan`
--

INSERT INTO `spd_kegiatan` (`id_kegiatan`, `no_kegiatan`, `akun_anggaran`, `tahun_anggaran`, `nama_kegiatan`, `satuan_kerja`, `tgl_mulai`, `tgl_akhir`, `tempat_kegiatan`) VALUES
(3, '001.022125.0122/15155/001', '01.0225.00215.00222', '2013', 'PENYUSUNAN LAPORAN KEUANGAN UAPP E-1 PP DAN PL SEMESTER 1', 'Sekretariat Ditjen PP & l', '2013-07-26', '2013-07-31', 'Bandung'),
(4, '002.031041.0122541/1501', '2063.050.524219.001201', '2013', 'PENYELENGGARAAN KEDINASAN PIMPINAN DAN PENDAMPINGAN', 'Ditjen PP dan L', '2013-06-30', '2013-07-06', 'India'),
(8, '125.1201.256.21542', '2063.006.524219', '2013', 'MONITORING DAN EVALUASI DANA UPT/DEKON/TP', 'KKP dan BTKLPP', '2013-12-11', '2013-12-15', 'Cilacap'),
(10, '1251.251.12548', '2035.2659.22154', '2013', 'PELATIHAN STRENGTH BASED MOTIVATION', 'Sekjen PP & PL', '2013-11-20', '2013-11-30', 'Nusa Dua Bali');

-- --------------------------------------------------------

--
-- Table structure for table `spd_pelaksana`
--

CREATE TABLE IF NOT EXISTS `spd_pelaksana` (
  `id_pelaksana` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `no_surat` varchar(45) NOT NULL,
  `id_karyawan` int(10) unsigned NOT NULL,
  `tgl_berangkat` date NOT NULL,
  `tgl_kembali` date DEFAULT NULL,
  `durasi` smallint(5) unsigned DEFAULT '0',
  `alat_angkut` varchar(45) DEFAULT '-',
  `tingkat_biaya` varchar(3) DEFAULT NULL,
  `ket` text,
  `jml_harian` smallint(5) unsigned DEFAULT '0',
  `harga_harian` decimal(10,0) DEFAULT '0',
  `tiket_pergi` decimal(10,0) DEFAULT '0',
  `tiket_pulang` decimal(10,0) DEFAULT '0',
  `tax_tujuan` decimal(10,0) DEFAULT '0',
  `tax_asal` decimal(10,0) DEFAULT '0',
  `transport_asal` decimal(10,0) DEFAULT '0',
  `transport_tujuan` decimal(10,0) DEFAULT '0',
  `jml_inap` smallint(5) unsigned DEFAULT '0',
  `harga_inap` decimal(10,0) DEFAULT '0',
  `total_harian` decimal(10,0) DEFAULT '0',
  `total_transport` decimal(10,0) DEFAULT '0',
  `total_inap` decimal(10,0) DEFAULT '0',
  `total_biaya` decimal(10,0) DEFAULT '0',
  `tgl_update` datetime DEFAULT NULL,
  `user_id` varchar(45) DEFAULT '-',
  `jenis_spd` varchar(45) NOT NULL,
  `tgl_surat` date NOT NULL,
  `tempat_asal` varchar(45) NOT NULL,
  `tempat_tujuan` varchar(45) NOT NULL,
  `agenda` text NOT NULL,
  `id_kegiatan` int(10) unsigned NOT NULL,
  `status` varchar(1) NOT NULL DEFAULT '0',
  `total_kasbon` decimal(10,0) NOT NULL DEFAULT '0',
  `sisa_bayar` decimal(10,0) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_pelaksana`,`no_surat`,`id_karyawan`,`id_kegiatan`,`jenis_spd`) USING BTREE
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `spd_pelaksana`
--

INSERT INTO `spd_pelaksana` (`id_pelaksana`, `no_surat`, `id_karyawan`, `tgl_berangkat`, `tgl_kembali`, `durasi`, `alat_angkut`, `tingkat_biaya`, `ket`, `jml_harian`, `harga_harian`, `tiket_pergi`, `tiket_pulang`, `tax_tujuan`, `tax_asal`, `transport_asal`, `transport_tujuan`, `jml_inap`, `harga_inap`, `total_harian`, `total_transport`, `total_inap`, `total_biaya`, `tgl_update`, `user_id`, `jenis_spd`, `tgl_surat`, `tempat_asal`, `tempat_tujuan`, `agenda`, `id_kegiatan`, `status`, `total_kasbon`, `sisa_bayar`) VALUES
(1, '1234', 8, '2012-12-13', '2012-12-19', 7, 'Umum', 'A', NULL, 7, 800000, 0, 0, 0, 0, 0, 0, 6, 700000, 5600000, 0, 4200000, 9800000, '2013-11-14 19:22:03', '-', 'Dalam Negeri', '2012-12-12', 'Jakarta', 'Surabaya, Malang, Denpasar', 'Jalan-jalan', 8, '1', 0, 0),
(2, '2351548', 4, '2013-11-15', '2013-11-19', 5, 'Pesawat', 'B', NULL, 5, 300000, 0, 0, 0, 0, 250000, 200000, 4, 800000, 1500000, 450000, 3200000, 5150000, '2013-11-16 01:35:04', '-', 'Dalam Negeri', '2012-12-15', 'Bandung', 'JayaPura', 'Survey Lokasi', 8, '1', 0, 5150000),
(3, '256848/5582/258.154', 3, '2013-12-16', '2013-12-20', 5, 'Pesawat', 'B', NULL, 5, 300000, 200000, 200000, 0, 0, 0, 0, 4, 800000, 1500000, 400000, 3200000, 5100000, '2013-11-16 01:10:18', '-', 'Dalam Negeri', '2013-12-15', 'Jakarta', 'Pontianak', 'wewhwhewe', 8, '1', 500000, 4600000),
(4, '56298', 3, '2013-12-10', '2013-12-31', 22, 'Pesawat', 'A', NULL, 22, 800000, 15000000, 23000000, 0, 0, 0, 0, 21, 700000, 17600000, 38000000, 14700000, 70300000, '2013-11-16 01:09:58', '-', 'Dalam Negeri', '2013-12-11', 'Jakarta', 'London dan Hongkong', 'Ketemu mezut ozil dkk', 8, '1', 0, 70300000),
(5, '12569', 3, '2012-11-14', '2012-11-30', 17, 'Pesawat', 'A', NULL, 17, 800000, 1000000, 2000000, 25000, 50000, 60000, 350000, 16, 700000, 13600000, 3485000, 11200000, 28285000, '2013-11-16 01:08:40', '-', 'Luar Negeri', '2013-11-10', 'Jakarta', 'Washington', 'Ketemu Obama', 8, '1', 0, 28285000),
(6, '25684', 8, '2013-11-07', '2013-11-22', 16, 'Umum', 'A', NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, '-', 'Dalam Negeri', '2012-10-10', 'Jakarta', 'Purbalingga', 'Mudik Lebaran', 9, '0', 0, 0),
(8, '5268584', 1, '2013-11-30', '2013-12-27', 28, 'Pesawat', 'B', NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, '-', 'Dalam Negeri', '2013-11-22', 'Jakarta', 'Temanggung', 'PENYUSUNAN LAPORAN KEUANGAN UAPP E-1 PP DAN PL SEMESTER 1', 3, '0', 0, 0),
(9, '1237895684', 1, '2013-11-14', '2013-11-14', 1, 'Pesawat', 'B', NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 'admin', 'Dalam Negeri', '2013-11-14', 'Jakarta', 'Jember', 'PENYUSUNAN LAPORAN KEUANGAN UAPP E-1 PP DAN PL SEMESTER 1', 3, '0', 0, 0),
(10, '235685', 5, '2013-11-15', '2013-11-19', 5, 'Pesawat', 'A', NULL, 5, 800000, 0, 0, 0, 0, 0, 0, 4, 700000, 4000000, 0, 2800000, 6800000, '2013-11-14 19:47:20', 'admin', 'Dalam Negeri', '2013-11-14', 'Jakarta', 'Padang', 'PENYUSUNAN LAPORAN KEUANGAN UAPP E-1 PP DAN PL SEMESTER 1', 3, '1', 0, 0),
(11, '25625458569598', 5, '2013-11-14', '2013-11-14', 1, 'Umum', 'A', NULL, 3, 800000, 300000, 300000, 5000, 10000, 75000, 65000, 2, 700000, 2400000, 755000, 1400000, 4555000, '2013-11-15 10:37:44', 'admin', 'Dalam Negeri', '2013-11-14', 'Cilacap', 'Bandung', 'PENYUSUNAN LAPORAN KEUANGAN UAPP E-1 PP DAN PL SEMESTER 1 edit', 3, '1', 0, 0),
(12, '9562695.226', 4, '2013-12-14', '2013-12-17', 4, 'Umum', 'B', NULL, 4, 300000, 0, 0, 0, 0, 0, 0, 3, 800000, 1200000, 0, 2400000, 3600000, '2013-11-14 19:21:41', 'admin', 'Dalam Negeri', '2013-11-14', 'Bandung', 'Cilacap dan Kebumen', 'MONITORING DAN EVALUASI DANA UPT/DEKON/TP', 8, '1', 0, 0),
(13, 'TU.08.02/VII.7/1145/2013', 7, '2013-11-15', '2013-11-17', 3, 'Umum', 'A', NULL, 3, 800000, 100000, 100000, 0, 0, 0, 0, 2, 700000, 2400000, 200000, 1400000, 4000000, '2013-11-14 20:13:35', 'admin', 'Dalam Negeri', '2013-11-15', 'Jakarta', 'Bandung', 'PENYUSUNAN LAPORAN KEUANGAN UAPP E-1 PP DAN PL SEMESTER 1', 3, '1', 0, 0),
(14, 'TU.01.01/VII.10/854/2013', 1, '2013-11-14', '2013-11-16', 3, 'Umum', 'B', NULL, 3, 300000, 0, 0, 0, 0, 0, 0, 2, 800000, 900000, 500000, 1600000, 3000000, '2013-11-17 10:08:21', 'admin', 'Luar Negeri', '2013-11-14', 'Cilacap', 'India', 'PENYELENGGARAAN KEDINASAN PIMPINAN DAN PENDAMPINGAN', 4, '1', 5500000, -2500000),
(15, '01.12.256.2256', 5, '2013-11-20', '2013-11-30', 11, 'Umum', 'A', NULL, 11, 800000, 0, 0, 0, 0, 0, 0, 10, 700000, 8800000, 0, 7000000, 15800000, '2013-11-14 23:34:54', 'admin', 'Dalam Negeri', '2013-11-14', 'Cilacap', 'Nusa Dua Bali', 'PELATIHAN STRENGTH BASED MOTIVATION', 10, '1', 0, 0),
(16, '25165.215265', 4, '2013-06-30', '2013-07-06', 7, 'Pesawat', 'B', NULL, 7, 300000, 0, 0, 0, 0, 0, 0, 6, 800000, 2100000, 0, 4800000, 6900000, '2013-11-17 10:08:14', 'admin', 'Luar Negeri', '2013-11-15', 'Bandung', 'India', 'PENYELENGGARAAN KEDINASAN PIMPINAN DAN PENDAMPINGAN', 4, '1', 0, 6900000),
(17, '256239.265895', 3, '2013-06-30', '2013-07-06', 7, 'Pesawat', 'B', NULL, 7, 300000, 0, 0, 0, 0, 0, 0, 6, 800000, 2100000, 0, 4800000, 6900000, '2013-11-17 10:08:29', 'admin', 'Luar Negeri', '2013-11-16', 'Jakarta', 'India', 'PENYELENGGARAAN KEDINASAN PIMPINAN DAN PENDAMPINGAN', 4, '1', 6000000, 900000);

-- --------------------------------------------------------

--
-- Table structure for table `spd_pengikut`
--

CREATE TABLE IF NOT EXISTS `spd_pengikut` (
  `id_pelaksana` int(10) unsigned NOT NULL,
  `id_pengikut` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nama_pengikut` varchar(45) NOT NULL,
  `tgl_lahir` varchar(45) DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_pelaksana`,`id_pengikut`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `spd_pengikut`
--

INSERT INTO `spd_pengikut` (`id_pelaksana`, `id_pengikut`, `nama_pengikut`, `tgl_lahir`, `keterangan`) VALUES
(14, 1, 'bambang', '10/10/2001', 'anak'),
(6, 1, 'Badu', '10/10/1998', 'badu donk'),
(15, 1, 'amir', '10/10/1991', 'Anak'),
(15, 2, 'paijah', '12/12/1975', 'Supir'),
(14, 2, 'bimbim', '10/10/2012', 'anak');

-- --------------------------------------------------------

--
-- Table structure for table `spd_refbiaya`
--

CREATE TABLE IF NOT EXISTS `spd_refbiaya` (
  `tingkat_biaya` varchar(3) NOT NULL,
  `u_harian` decimal(10,0) NOT NULL DEFAULT '0',
  `u_inap` decimal(10,0) NOT NULL DEFAULT '0',
  PRIMARY KEY (`tingkat_biaya`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `spd_refbiaya`
--

INSERT INTO `spd_refbiaya` (`tingkat_biaya`, `u_harian`, `u_inap`) VALUES
('A', 800000, 700000),
('B', 300000, 800000),
('C', 100000, 300000),
('D', 600000, 750000);

-- --------------------------------------------------------

--
-- Table structure for table `spd_refgol`
--

CREATE TABLE IF NOT EXISTS `spd_refgol` (
  `gol` varchar(8) NOT NULL,
  `tingkat_biaya` varchar(3) NOT NULL,
  `nama_gol` varchar(45) NOT NULL,
  PRIMARY KEY (`gol`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `spd_refgol`
--

INSERT INTO `spd_refgol` (`gol`, `tingkat_biaya`, `nama_gol`) VALUES
('III/a', 'A', 'Pranata 1'),
('III/b', 'C', 'Pranata 2'),
('III/c', 'B', 'Pranata 3'),
('II/a', 'D', 'Staf'),
('II/b', 'C', 'Staf Muda'),
('II/c', 'C', 'Staf Junior');

-- --------------------------------------------------------

--
-- Table structure for table `spd_refpejabat`
--

CREATE TABLE IF NOT EXISTS `spd_refpejabat` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `jabatan` text NOT NULL,
  `nama` varchar(255) NOT NULL DEFAULT '-',
  `nip` varchar(255) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `spd_refpejabat`
--

INSERT INTO `spd_refpejabat` (`id`, `jabatan`, `nama`, `nip`) VALUES
(1, 'Pejabat Pembuat Komitmen Bag Keuangan', 'Yoedi Anyanto, SE, Bsc, M. Epid', '196401111989111001'),
(2, 'Bendahara Pengeluaran Set Ditjen PP & PL', 'Zulham Wafiq, SE', '1983100320009121003'),
(3, 'BPP Bagian Keuangan', 'Sujiman', '196003031981031008'),
(4, 'PPk Swakelola Bag Kepegawaian dan Umum', 'Achmad Prihatna, S.K.M., M.K.M', '197107181995031001'),
(5, 'sdasd', 'asdas asdasd', 'asds');

-- --------------------------------------------------------

--
-- Table structure for table `stvlog`
--

CREATE TABLE IF NOT EXISTS `stvlog` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `msg` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=59 ;

-- --------------------------------------------------------

--
-- Table structure for table `stvuser`
--

CREATE TABLE IF NOT EXISTS `stvuser` (
  `id` varchar(45) NOT NULL,
  `passwd` varchar(255) NOT NULL,
  `role` varchar(45) NOT NULL DEFAULT 'user',
  `real_name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stvuser`
--

INSERT INTO `stvuser` (`id`, `passwd`, `role`, `real_name`) VALUES
('admin', '*BCDB46F9759BC3C7C2679D4E81145B53EE616059', 'admin', 'Adminem'),
('paijo', '*A4B6157319038724E3560894F7F932C8886EBFCF', 'user', 'John Doe');


CREATE VIEW `v_spd` AS select `t`.`id_pelaksana` AS `id_pelaksana`,`t`.`no_surat` AS `no_surat`,`t`.`id_karyawan` AS `id_karyawan`,`t`.`tgl_berangkat` AS `tgl_berangkat`,`t`.`tgl_kembali` AS `tgl_kembali`,`t`.`durasi` AS `durasi`,`t`.`alat_angkut` AS `alat_angkut`,`t`.`tingkat_biaya` AS `tingkat_biaya`,`t`.`ket` AS `ket`,`t`.`jml_harian` AS `jml_harian`,`t`.`harga_harian` AS `harga_harian`,`t`.`tiket_pergi` AS `tiket_pergi`,`t`.`tiket_pulang` AS `tiket_pulang`,`t`.`tax_tujuan` AS `tax_tujuan`,`t`.`tax_asal` AS `tax_asal`,`t`.`transport_asal` AS `transport_asal`,`t`.`transport_tujuan` AS `transport_tujuan`,`t`.`jml_inap` AS `jml_inap`,`t`.`harga_inap` AS `harga_inap`,`t`.`total_harian` AS `total_harian`,`t`.`total_transport` AS `total_transport`,`t`.`total_inap` AS `total_inap`,`t`.`total_biaya` AS `total_biaya`,`t`.`tgl_update` AS `tgl_update`,`t`.`user_id` AS `user_id`,`t`.`jenis_spd` AS `jenis_spd`,`t`.`tgl_surat` AS `tgl_surat`,`t`.`tempat_asal` AS `tempat_asal`,`t`.`tempat_tujuan` AS `tempat_tujuan`,`t`.`agenda` AS `agenda`,`t`.`id_kegiatan` AS `id_kegiatan`,`t`.`status` AS `status`,`k`.`no_kegiatan` AS `no_kegiatan`,`k`.`nama_kegiatan` AS `nama_kegiatan`,`k`.`akun_anggaran` AS `akun_anggaran`,`k`.`tahun_anggaran` AS `tahun_anggaran`,`k`.`tgl_mulai` AS `tgl_mulai`,`k`.`tgl_akhir` AS `tgl_akhir`,`k`.`satuan_kerja` AS `satuan_kerja`,`k`.`tempat_kegiatan` AS `tempat_kegiatan`,`e`.`nip_karyawan` AS `nip_karyawan`,`e`.`nama_karyawan` AS `nama_karyawan`,`e`.`gol_karyawan` AS `gol_karyawan`,`e`.`jabatan_karyawan` AS `jabatan_karyawan`,`e`.`kota_karyawan` AS `kota_karyawan`,`t`.`total_kasbon` AS `total_kasbon`,`t`.`sisa_bayar` AS `sisa_bayar` from ((`spd_kegiatan` `k` join `spd_pelaksana` `t`) join `spd_karyawan` `e`) where ((`k`.`id_kegiatan` = `t`.`id_kegiatan`) and (`e`.`id_karyawan` = `t`.`id_karyawan`));
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
