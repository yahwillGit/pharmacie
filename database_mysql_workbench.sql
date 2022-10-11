-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: pharm
-- ------------------------------------------------------
-- Server version	8.0.30

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
-- Table structure for table `pharmacies`
--

DROP TABLE IF EXISTS `pharmacies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pharmacies` (
  `ph_id` int NOT NULL AUTO_INCREMENT,
  `ph_name` varchar(45) DEFAULT NULL,
  `ph_location` varchar(45) DEFAULT NULL,
  `ph_phone` varchar(45) DEFAULT NULL,
  `ph_email` varchar(45) DEFAULT NULL,
  `create_at` varchar(200) DEFAULT NULL,
  `update_at` varchar(200) DEFAULT NULL,
  `validate_at` varchar(200) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `u_id` int DEFAULT NULL,
  `ph_lat` varchar(45) DEFAULT NULL,
  `ph_lng` varchar(45) DEFAULT NULL,
  `deleted_at` varchar(45) DEFAULT NULL,
  `guard_start_at` varchar(200) DEFAULT NULL,
  `guard_end_at` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`ph_id`),
  KEY `u_id_idx` (`u_id`),
  CONSTRAINT `u_id` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacies`
--

LOCK TABLES `pharmacies` WRITE;
/*!40000 ALTER TABLE `pharmacies` DISABLE KEYS */;
INSERT INTO `pharmacies` VALUES (1,'Millenaire','agoe','92655995','hognony@gmail.com','Tue Oct 11 2022 09:44:12 GMT+0000 (heure moyenne de Greenwich)','Tue Oct 11 2022 09:46:25 GMT+0000 (heure moyenne de Greenwich)','Tue Oct 11 2022 09:44:12 GMT+0000 (heure moyenne de Greenwich)','OUI',NULL,'null','null','null','null','null');
/*!40000 ALTER TABLE `pharmacies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produits`
--

DROP TABLE IF EXISTS `produits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produits` (
  `pr_id` int NOT NULL AUTO_INCREMENT,
  `pr_name` varchar(45) DEFAULT NULL,
  `pr_prix_u` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `tva` varchar(45) DEFAULT NULL,
  `ph_id` int DEFAULT NULL,
  PRIMARY KEY (`pr_id`),
  KEY `ph_id_idx` (`ph_id`),
  CONSTRAINT `ph_id` FOREIGN KEY (`ph_id`) REFERENCES `pharmacies` (`ph_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produits`
--

LOCK TABLES `produits` WRITE;
/*!40000 ALTER TABLE `produits` DISABLE KEYS */;
INSERT INTO `produits` VALUES (1,'Paracetamol','500','OUI','18',1);
/*!40000 ALTER TABLE `produits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `u_id` int NOT NULL AUTO_INCREMENT,
  `u_name` varchar(45) DEFAULT NULL,
  `u_username` varchar(45) DEFAULT NULL,
  `u_email` varchar(45) DEFAULT NULL,
  `u_mdp` varchar(45) DEFAULT NULL,
  `u_phone` varchar(45) DEFAULT NULL,
  `u_role` varchar(45) DEFAULT NULL,
  `u_gender` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Yahwill','h','hognony@gmail.com','1001','92625988','Admin','Homme'),(2,'Junior','j','yahwillh@gmail.com','0000','23235695','Admin','Homme');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-11 15:17:42
