-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: taximarshal
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `place_id` varchar(500) NOT NULL,
  `location_name` varchar(500) NOT NULL,
  `address` varchar(500) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  UNIQUE KEY `place_id` (`place_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES ('ChIJ_xmHGv5slR4R-wWY4HcjBAE','Klipfontein Taxi Rank, Lekoa Str','Klipfontein View, Lethabong, 1685, South Africa',-26.04873,28.15978),('ChIJ4YhVOzRklR4Rfw5JXomQ6Hw','Centurion Taxi Rank - TR033','2026 Hendrik Verwoerd Dr, Centurion Central, Centurion, 0046, South Africa',-25.857979,28.1830832),('ChIJ8Va4rw9ulR4RVMTY-wWdSOs','Mall of Africa','Magwa Cres, Midrand, 2066, South Africa',-26.0140172,28.1073058),('ChIJ9dYPrK5vlR4RAe_89Obz1ig','Midrand Market & Taxi Rank','Halfway House Estate, Midrand, 1685, South Africa',-25.9985767,28.1283038),('ChIJa44iqKAOlR4Rwj5tEJEO6no','Bree Taxi Rank - JR107','Lilian Ngoyi St, Johannesburg, 2000, South Africa',-26.2008518,28.0365788),('ChIJly_xoyEMlR4RpxE-U4lYFpM','Wanderers Taxi Rank','34 Wanderers St, Braamfontein, Johannesburg, 2017, South Africa',-26.1971976,28.04433839999999),('ChIJp2e9aZ4OlR4RCvUnMILH0Cg','Mtn Noord Taxi Rank','68 Plein St, Johannesburg, 2000, South Africa',-26.1990905,28.0478999),('ChIJR6kei7dtlR4RxrRKYL7F30E','Ivory 2 Taxi Rank','Ivory Park, Midrand, 1693, South Africa',-26.0072563,28.1821679),('ChIJSYqbMHFslR4R45BnCn1nMwo','Esangweni Taxi Rank - ER019','Esangweni, Tembisa, 1632, South Africa',-26.0210104,28.2009773);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-08 12:59:11
