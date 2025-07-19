CREATE DATABASE  IF NOT EXISTS `balance` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `balance`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: balance
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `article_categories`
--

DROP TABLE IF EXISTS `article_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `slug` varchar(100) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `article_categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `article_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_categories`
--

LOCK TABLES `article_categories` WRITE;
/*!40000 ALTER TABLE `article_categories` DISABLE KEYS */;
INSERT INTO `article_categories` VALUES (1,'الاضطرابات النفسية','مقالات عن أنواع الاضطرابات النفسية وأعراضها','psychological-disorders',NULL),(2,'العلاجات الحديثة','أحدث الطرق العلاجية في مجال الطب النفسي','modern-treatments',NULL),(3,'نصائح يومية','نصائح عملية لتحسين الصحة النفسية','daily-tips',NULL),(4,'قصص تعافي','تجارب حقيقية لأشخاص تعافوا من اضطرابات نفسية','recovery-stories',NULL),(5,'أبحاث ودراسات','أحدث الأبحاث في مجال الصحة النفسية','research-studies',NULL),(6,'الاكتئاب','كل ما يتعلق باضطراب الاكتئاب','depression',1),(7,'القلق','مقالات عن اضطرابات القلق بأنواعها','anxiety',1),(8,'التعافي من الإدمان','طرق علاج الإدمان النفسي','addiction-recovery',2);
/*!40000 ALTER TABLE `article_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_posts`
--

DROP TABLE IF EXISTS `doctor_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `doctor_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `featured_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `post_url` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_url` (`post_url`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `doctor_posts_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_posts`
--

LOCK TABLES `doctor_posts` WRITE;
/*!40000 ALTER TABLE `doctor_posts` DISABLE KEYS */;
INSERT INTO `doctor_posts` VALUES (1,'د. أحمد محمد',1,'نصائح طبية للعناية بالقلب','أمراض القلب هي أحد الأسباب الرئيسية للوفاة عالمياً. للوقاية من أمراض القلب، ينصح باتباع نظام غذائي صحي غني بالخضروات والفواكه والحبوب الكاملة، وممارسة الرياضة بانتظام لمدة 30 دقيقة على الأقل يومياً، وتجنب التدخين والكحول، والتحكم في مستويات التوتر. الفحوصات الدورية ضرورية لاكتشاف أي مشاكل مبكراً. تذكر أن الوقاية خير من العلاج.','heart-care.jpg','2025-05-18 19:06:00','2025-05-18 19:06:00','https://example.com/posts/heart-care-tips');
/*!40000 ALTER TABLE `doctor_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date NOT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'default_profile.jpg',
  `certificate` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'مثال: دكتور، أستاذ، أخصائي',
  `specialization` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_specialization` text COLLATE utf8mb4_unicode_ci COMMENT 'التخصصات الدقيقة',
  `bio` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience_years` int NOT NULL,
  `languages` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'اللغات المتحدث بها مفصولة بفواصل',
  `rating` decimal(3,1) DEFAULT '0.0',
  `reviews_count` int DEFAULT '0',
  `patients_count` int DEFAULT '0',
  `publications_count` int DEFAULT '0',
  `consultation_fee` decimal(10,2) NOT NULL,
  `available_days` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'أيام العمل مفصولة بفواصل',
  `working_hours` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_available` tinyint(1) DEFAULT '0',
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `online_consultation` tinyint(1) DEFAULT '1',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `social_media_links` json DEFAULT NULL COMMENT 'روابط السوشيال ميديا بتنسيق JSON',
  `awards` text COLLATE utf8mb4_unicode_ci COMMENT 'الجوائز والتكريمات',
  `research_interests` text COLLATE utf8mb4_unicode_ci,
  `professional_memberships` text COLLATE utf8mb4_unicode_ci COMMENT 'العضويات في الجمعيات المهنية',
  `verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'د. أحمد محمد','male','1975-03-15','ahmed.jpg','PhD_Psychiatry','أستاذ دكتور','الطب النفسي للبالغين','الاكتئاب المقاوم للعلاج','أخصائي نفسي مع 20 عاماً من الخبرة في علاج الاكتئاب والقلق',20,'العربية, الإنجليزية',4.8,0,0,0,300.00,'السبت,الأحد,الثلاثاء,الخميس','09:00-15:00',1,'السعودية','الرياض',NULL,1,'ahmed@example.com','+966501234567',NULL,NULL,NULL,NULL,NULL,1,'2025-05-18 14:55:33','2025-05-18 14:55:33'),(2,'د. سارة عبدالله','female','1982-07-22','sara.jpg','MD_Psychiatry','استشارية','طب نفس الأطفال','التوحد, ADHD','متخصصة في تشخيص وعلاج اضطرابات الأطفال النفسية',12,'العربية, الفرنسية',4.9,0,0,0,350.00,'الأحد,الاثنين,الأربعاء','10:00-16:00',0,'السعودية','جدة',NULL,1,'sara@example.com','+966502345678',NULL,NULL,NULL,NULL,NULL,1,'2025-05-18 14:55:33','2025-05-18 14:55:33'),(3,'د. خالد إبراهيم','male','1970-11-30','khaled.jpg','Board_Certified','بروفيسور','الطب النفسي الشرعي','اضطرابات الشخصية','خبير في الطب النفسي الشرعي وتقييم الحالات القانونية',25,'العربية, الإنجليزية',4.7,0,0,0,400.00,'السبت,الاثنين,الأربعاء','08:00-14:00',1,'الإمارات','دبي',NULL,1,'khaled@example.com','+971501234567',NULL,NULL,NULL,NULL,NULL,1,'2025-05-18 14:55:33','2025-05-18 14:55:33');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `music_categories`
--

DROP TABLE IF EXISTS `music_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `music_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `music_categories`
--

LOCK TABLES `music_categories` WRITE;
/*!40000 ALTER TABLE `music_categories` DISABLE KEYS */;
INSERT INTO `music_categories` VALUES (1,'موسيقى الاسترخاء','موسيقى هادئة تساعد على الاسترخاء وتخفيف التوتر'),(2,'أصوات الطبيعة','أصوات طبيعية لتحسين المزاج وزيادة التركيز'),(3,'الموسيقى العلاجية','مقطوعات موسيقية معدة خصيصاً للعلاج النفسي'),(4,'التأمل الموجه','موسيقى مصاحبة لجلسات التأمل والاسترخاء'),(5,'تحسين النوم','موسيقى وأصوات تساعد على النوم العميق');
/*!40000 ALTER TABLE `music_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `user_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `treatment_plan` text,
  `notes` text,
  `relationship_type` enum('therapy','consultation','followup') DEFAULT NULL,
  `last_session_date` date DEFAULT NULL,
  `next_session_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_doctor_patient` (`doctor_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `patients_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,1,1,'2023-02-01',NULL,'جلسات أسبوعية للعلاج المعرفي السلوكي',NULL,'therapy','2023-05-20','2023-05-27'),(2,2,2,'2023-03-15',NULL,'تقييم شامل ومتابعة شهرية',NULL,'consultation','2023-05-18','2023-06-18'),(3,1,3,'2023-04-10',NULL,'علاج دوائي مع جلسات تأهيلية',NULL,'followup','2023-05-15','2023-06-15');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_interactions`
--

DROP TABLE IF EXISTS `post_interactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_interactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `interaction_type` enum('like','dislike') NOT NULL,
  `interacted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_interaction` (`post_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `post_interactions_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `doctor_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_interactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_interactions`
--

LOCK TABLES `post_interactions` WRITE;
/*!40000 ALTER TABLE `post_interactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_interactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `address` text,
  `bio` text,
  `role` enum('user','doctor','admin','content_creator') NOT NULL DEFAULT 'user',
  `doctor_id` int DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT 'default_profile.jpg',
  `last_login` datetime DEFAULT NULL,
  `registration_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `refresh_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'محمد علي','mohamed@example.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','+966503456789',32,'male','السعودية','الرياض',NULL,NULL,'user',1,'default_profile.jpg',NULL,'2023-01-15 10:30:00',NULL),(2,'نورة عبدالرحمن','nora@example.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','+966504567890',28,'female','السعودية','جدة',NULL,NULL,'user',2,'default_profile.jpg',NULL,'2023-02-20 14:45:00',NULL),(3,'عبدالله سالم','abdullah@example.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','+971504567890',35,'male','الإمارات','أبوظبي',NULL,NULL,'user',NULL,'default_profile.jpg',NULL,'2023-03-10 09:15:00',NULL),(4,'أخصائي نفسي','admin@example.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','+966505678901',NULL,NULL,'السعودية','الرياض',NULL,NULL,'admin',NULL,'default_profile.jpg',NULL,'2023-01-01 08:00:00',NULL),(5,'amen abed','aminabedcu2017@gmail.com','123456789',NULL,22,'male','سوريا',NULL,NULL,NULL,'admin',NULL,'default_profile.jpg',NULL,'2025-05-21 00:00:00','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ4NzgyNzM5LCJleHAiOjE3NDkzODc1Mzl9.yzwisCZekxckqv9Dzq8xE5tClR70mXpya8HfE20OcJs'),(6,'shaza alsoukhny','shazaAlsokhny@gmail.com','123456789',NULL,22,'female','سوريا','','',NULL,'user',NULL,'default_profile.jpg',NULL,'2025-05-24 08:47:20','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzQ4MTUzMDMyLCJleHAiOjE3NDg3NTc4MzJ9.0c3bEtUsQasezLo7sqN8ZHDKHo49ORcjCDK4WTAW-94'),(7,'Amen','aminabedcu2022@gmail.com','13649972556',NULL,66,'male','سوريا','حمص','',NULL,'user',NULL,'default_profile.jpg',NULL,'2025-05-30 15:42:07','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzQ4NjA4OTI3LCJleHAiOjE3NDkyMTM3Mjd9.4oR-9QDuQZQyQFUx2fV_qtCmwGYBmBgjozHWGDXsKqs');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_categories`
--

DROP TABLE IF EXISTS `video_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `icon` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_categories`
--

LOCK TABLES `video_categories` WRITE;
/*!40000 ALTER TABLE `video_categories` DISABLE KEYS */;
INSERT INTO `video_categories` VALUES (1,'القلق والاكتئاب','فيديوهات تعليمية عن اضطرابات القلق والاكتئاب','anxiety-icon'),(2,'اضطرابات الشخصية','فيديوهات عن أنواع اضطرابات الشخصية وعلاجها','personality-icon'),(3,'الصحة النفسية للأطفال','فيديوهات متخصصة في مشاكل الأطفال النفسية','child-psychology-icon'),(4,'التعافي من الصدمات','فيديوهات تساعد في التعافي من الصدمات النفسية','trauma-icon'),(5,'مهارات التأقلم','فيديوهات تعليمية لتحسين مهارات التأقلم','coping-icon');
/*!40000 ALTER TABLE `video_categories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-01 16:36:13
