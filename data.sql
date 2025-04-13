-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: pychat
-- ------------------------------------------------------
-- Server version	8.2.0

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
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
INSERT INTO `attachments` VALUES (1,'http://res.cloudinary.com/dloeqfbwm/image/upload/v1715150543/message_image/imeexkueqfz4hc9ai82v.png',11);
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (2,8),(1,11);
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `deleted_messages`
--

LOCK TABLES `deleted_messages` WRITE;
/*!40000 ALTER TABLE `deleted_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `deleted_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `friendships`
--

LOCK TABLES `friendships` WRITE;
/*!40000 ALTER TABLE `friendships` DISABLE KEYS */;
INSERT INTO `friendships` VALUES (1,1,2,'FRIENDS'),(2,2,1,'FRIENDS'),(3,1,3,'FRIENDS'),(4,3,1,'FRIENDS'),(5,4,1,'REQUEST_SENT'),(6,1,4,'REQUEST_RECEIVED'),(7,1,5,'REQUEST_SENT'),(8,5,1,'REQUEST_RECEIVED');
/*!40000 ALTER TABLE `friendships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'hi','2024-04-19 14:27:14','TEXT',1,1,NULL),(2,'Chào bạn','2024-04-19 14:27:49','TEXT',1,2,NULL),(3,'Cảm ơn vì đã đến','2024-04-19 14:28:07','TEXT',1,2,NULL),(4,'Haloo','2024-04-19 14:28:46','TEXT',2,3,NULL),(5,'có gì không??','2024-04-19 14:28:52','TEXT',2,1,NULL),(6,'Không bạn','2024-04-19 14:28:56','TEXT',2,3,NULL),(7,'bai','2024-04-19 14:32:06','TEXT',2,3,NULL),(8,'oke','2024-04-19 14:32:30','TEXT',2,1,NULL),(9,'hi','2024-04-19 14:33:58','TEXT',1,1,NULL),(10,'hi','2024-04-19 16:12:07','TEXT',1,1,'2024-05-08 13:42:05'),(11,NULL,'2024-05-08 13:42:21','IMAGE',1,1,NULL);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `participants`
--

LOCK TABLES `participants` WRITE;
/*!40000 ALTER TABLE `participants` DISABLE KEYS */;
INSERT INTO `participants` VALUES (1,2,1,NULL,NULL),(2,1,1,NULL,NULL),(3,3,2,NULL,NULL),(4,1,2,NULL,NULL);
/*!40000 ALTER TABLE `participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'dung1 nguoi','nguoidung1@gmail.com','$2b$10$2FrHk3CM13uwgMOWwutCy..RshabY6..e4kJ3dYJF/Pe6PkF0mtkK',NULL,'dung1','nguoi','https://res.cloudinary.com/dloeqfbwm/image/upload/v1715150181/avatar_user/default_avt1.jpg','https://res.cloudinary.com/dloeqfbwm/image/upload/v1713016596/background_user/default_background.png'),(2,'dung2 nguoi','nguoidung2@gmail.com','$2b$10$U3vJdbsnlrPJl7JDprLY4.xH7CMO4j.I1v1lDOoj/iiuPgj9tRHq6','2024-04-19 14:28:34','dung2','nguoi','https://res.cloudinary.com/dloeqfbwm/image/upload/v1715150181/avatar_user/default_avt2.jpg','https://res.cloudinary.com/dloeqfbwm/image/upload/v1713016596/background_user/default_background.png'),(3,'dung3 nguoi','nguoidung3@gmail.com','$2b$10$yX815a9dbdgOfzix46ZzLOJL9nfk80WEnQz8wIi3g0KqCSnHf0MG.','2024-04-19 14:33:42','dung3','nguoi','https://res.cloudinary.com/dloeqfbwm/image/upload/v1715150181/avatar_user/default_avt3.jpg','https://res.cloudinary.com/dloeqfbwm/image/upload/v1713016596/background_user/default_background.png'),(4,'dung4 nguoi','nguoidung4@gmail.com','$2b$10$b6Mh5qmXi1fM4VLzzSnWbObp0lzeIgMVeNc1UZKxk3iip0E2pD3WG',NULL,'dung4','nguoi','https://res.cloudinary.com/dloeqfbwm/image/upload/v1715150181/avatar_user/default_avt4.jpg','https://res.cloudinary.com/dloeqfbwm/image/upload/v1713016596/background_user/default_background.png'),(5,'dung5 nguoi','nguoidung5@gmail.com','$2b$10$UI7tfvCaziEZNTKqYRmMvuODDZfhwIGTZJQEweOB0gch8iJG133XS',NULL,'dung5','nguoi','https://res.cloudinary.com/dloeqfbwm/image/upload/v1715150181/avatar_user/default_avt5.jpg','https://res.cloudinary.com/dloeqfbwm/image/upload/v1713016596/background_user/default_background.png'),(6,'dung6 nguoi','nguoidung6@gmail.com','$2b$10$k7cTNjHn07CYU5pW1qivp.IhTyxNVAnYLhHwO1KO/JEOnrGtiH0Au',NULL,'dung6','nguoi','https://res.cloudinary.com/dloeqfbwm/image/upload/v1715150181/avatar_user/default_avatar.jpg','https://res.cloudinary.com/dloeqfbwm/image/upload/v1713016596/background_user/default_background.png');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-08 13:48:23
