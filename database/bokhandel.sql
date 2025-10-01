-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: bokhandel
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `beställning_böcker`
--

DROP TABLE IF EXISTS `beställning_böcker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beställning_böcker` (
  `BeställningID` int NOT NULL,
  `BokID` int NOT NULL,
  `Antal` int NOT NULL,
  PRIMARY KEY (`BeställningID`,`BokID`),
  KEY `BokID` (`BokID`),
  CONSTRAINT `beställning_böcker_ibfk_1` FOREIGN KEY (`BeställningID`) REFERENCES `beställningar` (`BeställningID`),
  CONSTRAINT `beställning_böcker_ibfk_2` FOREIGN KEY (`BokID`) REFERENCES `böcker` (`BokID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beställning_böcker`
--

LOCK TABLES `beställning_böcker` WRITE;
/*!40000 ALTER TABLE `beställning_böcker` DISABLE KEYS */;
INSERT INTO `beställning_böcker` VALUES (2,2,1),(3,3,2),(4,4,3),(5,5,1),(5,6,1),(6,2,1),(8,4,2),(9,4,2),(10,4,2),(12,6,1),(13,9,1),(15,9,3),(16,9,3),(17,9,3),(19,14,1),(20,7,5),(21,7,1),(22,13,2),(24,14,1),(25,1,1),(26,3,1),(27,5,2),(28,3,1);
/*!40000 ALTER TABLE `beställning_böcker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beställningar`
--

DROP TABLE IF EXISTS `beställningar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beställningar` (
  `BeställningID` int NOT NULL AUTO_INCREMENT,
  `KundID` int DEFAULT NULL,
  `Datum` date NOT NULL,
  PRIMARY KEY (`BeställningID`),
  KEY `KundID` (`KundID`),
  CONSTRAINT `beställningar_ibfk_1` FOREIGN KEY (`KundID`) REFERENCES `kunder` (`KundID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beställningar`
--

LOCK TABLES `beställningar` WRITE;
/*!40000 ALTER TABLE `beställningar` DISABLE KEYS */;
INSERT INTO `beställningar` VALUES (2,2,'2025-08-19'),(3,3,'2023-01-10'),(4,4,'2024-11-12'),(5,5,'2024-10-02'),(6,9,'2025-09-23'),(8,6,'2025-09-25'),(9,6,'2025-09-25'),(10,6,'2025-09-25'),(12,1,'2025-09-25'),(13,11,'2025-09-26'),(14,11,'2025-09-26'),(15,11,'2025-09-26'),(16,11,'2025-09-26'),(17,9,'2025-09-26'),(19,11,'2025-09-27'),(20,4,'2025-09-27'),(21,4,'2025-09-27'),(22,16,'2025-09-27'),(24,1,'2025-09-29'),(25,11,'2025-09-29'),(26,16,'2025-09-29'),(27,16,'2025-09-29'),(28,1,'2025-09-29');
/*!40000 ALTER TABLE `beställningar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `böcker`
--

DROP TABLE IF EXISTS `böcker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `böcker` (
  `BokID` int NOT NULL AUTO_INCREMENT,
  `Titel` varchar(200) NOT NULL,
  `Författare` varchar(100) DEFAULT NULL,
  `Pris` decimal(10,2) NOT NULL,
  `LagerAntal` int DEFAULT '0',
  PRIMARY KEY (`BokID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `böcker`
--

LOCK TABLES `böcker` WRITE;
/*!40000 ALTER TABLE `böcker` DISABLE KEYS */;
INSERT INTO `böcker` VALUES (1,'SQL för Nybörjare','Erik Svensson',199.00,11),(2,'Avancerad Databasdesign','Maria Johansson',299.00,10),(3,'Programmering i Python','Lars Nilsson',249.00,7),(4,'Javascript Grund','Maria Johansson',99.00,11),(5,'Programmering i C#','Lars Nilsson',340.00,13),(6,'Programmering i C++','Erik Svensson',399.00,9),(7,'Uppdaterad titel','Musse',199.00,0),(9,'Best why to coding','Jawa',299.00,3),(11,'How to live best','The Old man',999.00,10),(12,' Do it best','livet',999.00,11),(13,'It nice','me',2999.00,19),(14,'Live experince 100%','The very old man',345.00,0),(15,' The best','you',99.00,1);
/*!40000 ALTER TABLE `böcker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kunder`
--

DROP TABLE IF EXISTS `kunder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kunder` (
  `KundID` int NOT NULL AUTO_INCREMENT,
  `Namn` varchar(100) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Mobile` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`KundID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `idx_mobile` (`Mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kunder`
--

LOCK TABLES `kunder` WRITE;
/*!40000 ALTER TABLE `kunder` DISABLE KEYS */;
INSERT INTO `kunder` VALUES (1,'AWO AHMED','AWO@bokhandel.com','0722889588'),(2,'Björn Berg','bjorn@bokhandel.com','0722888768'),(3,'Carla Carlsson','carla@bokhandel.com','0711669588'),(4,'Musse Said','musse@bokhandel.com','735523114'),(5,'Ismael Ibrahim','ismael@bokhandel.com','735523141'),(6,'Niklas Mårdby','niki@bokhandel.com','733995588'),(7,'Anna Andersson','anna@bokhandel.com','0701234567'),(9,'Omar','omar@bokhandel.se','0789865432'),(11,'Karim','karim@bokhandel.com','0789865432'),(16,'lalasawa','lalads@bokhandel.com','0789865432');
/*!40000 ALTER TABLE `kunder` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-01  6:48:20
