-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: haribon_cms
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` (`id`, `title`, `slug`, `status`, `created_at`, `updated_at`) VALUES (1,'Home','home','published','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `pages` (`id`, `title`, `slug`, `status`, `created_at`, `updated_at`) VALUES (2,'About Me','about','published','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `pages` (`id`, `title`, `slug`, `status`, `created_at`, `updated_at`) VALUES (3,'Donate','donate','published','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `pages` (`id`, `title`, `slug`, `status`, `created_at`, `updated_at`) VALUES (6,'Our Story','our-story','published','2026-11-15 01:19:57','2026-11-15 01:19:57');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `page_sections`
--

LOCK TABLES `page_sections` WRITE;
/*!40000 ALTER TABLE `page_sections` DISABLE KEYS */;
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (1,1,'hero','Since 1972','Leading conservation in the Philippines for over 50 years','Inspired by the Philippine Eagle, the Haring Ibon, Haribon works with members and communities to protect our shared ecosystems.',NULL,'uploads/philippine-eagle.jpg','Donate now','/donate','Our work','#pillars',1,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (2,1,'actions_intro',NULL,'Ways to take part',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (3,1,'action_donate',NULL,'Donate','Support conservation work across the country.','donate',NULL,NULL,'/donate',NULL,NULL,3,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (4,1,'action_member',NULL,'Be a member','Join a community of nature defenders.','member',NULL,NULL,'https://haribon.org.ph/become-a-member/',NULL,NULL,4,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (5,1,'action_partner',NULL,'Partner with us','Work with Haribon on programs that matter.','partner',NULL,NULL,'https://haribon.org.ph/partner-with-us/',NULL,NULL,5,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (6,1,'action_volunteer',NULL,'Volunteer','Plant trees, watch birds and join cleanups.','volunteer',NULL,NULL,'https://haribon.org.ph/events-calendar/',NULL,NULL,6,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (7,1,'stat_founded',NULL,'1972','Year founded',NULL,NULL,NULL,NULL,NULL,NULL,7,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (8,1,'stat_years',NULL,'50+','Years of conservation',NULL,NULL,NULL,NULL,NULL,NULL,8,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (9,1,'stat_pillars',NULL,'4','Pillars of our work',NULL,NULL,NULL,NULL,NULL,NULL,9,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (10,1,'pillars_intro',NULL,'Our four pillars','Haribon organizes its work around four goals, each with its own programs.',NULL,NULL,NULL,NULL,NULL,NULL,10,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (11,1,'announcements_intro',NULL,'Latest announcements',NULL,NULL,NULL,NULL,NULL,NULL,NULL,11,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (12,1,'cta',NULL,'Every contribution helps protect the Philippines’ forests and wildlife',NULL,NULL,NULL,'Donate any amount','/donate',NULL,NULL,12,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (13,2,'about_intro','About me','About Me','Hi, I\'m Shanta Tuazon, a student developer who enjoys learning and exploring new things.',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (14,2,'about_name',NULL,'What the name means','“Haribon” comes from Haring Ibon, the local name of the Philippine Eagle, which means “king of birds.” The eagle is the national bird of the Philippines and is critically endangered, so it is a fitting symbol for an organization that protects the forests and wildlife it depends on.',NULL,NULL,NULL,NULL,NULL,NULL,2,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (15,2,'about_pioneer',NULL,'The pioneer of Philippine conservation','Haribon is the Philippines’ oldest and pioneer environmental conservation organization. Founded in 1972, it has spent more than 50 years protecting forests, species and the communities that live alongside them.',NULL,NULL,NULL,NULL,NULL,NULL,3,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (16,2,'about_reasons_intro',NULL,'Why I chose Haribon','These are the four reasons I chose the Haribon Foundation for this project.',NULL,NULL,NULL,NULL,NULL,NULL,4,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (17,2,'about_reason_conservation',NULL,'Environmental conservation','Protecting forests, wildlife, and natural habitats.','forest',NULL,NULL,NULL,NULL,NULL,5,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (18,2,'about_reason_biodiversity',NULL,'Biodiversity protection','Helping preserve unique Philippine species, including the Philippine Eagle.','species',NULL,NULL,NULL,NULL,NULL,6,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (19,2,'about_reason_community',NULL,'Community involvement','Encouraging people to participate in protecting nature.','people',NULL,NULL,NULL,NULL,NULL,7,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (20,2,'about_reason_sustainability',NULL,'Sustainability','Promoting responsible use of natural resources.','sustainability',NULL,NULL,NULL,NULL,NULL,8,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (21,3,'donate_intro','Support Haribon','Help protect the Philippines’ forests and wildlife','Since 1972, Haribon has championed biodiversity conservation, inspired by the Philippine Eagle. Choose an amount to support that mission.',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (22,3,'donate_point_forest',NULL,'Protecting forests and critical habitats',NULL,'forest',NULL,NULL,NULL,NULL,NULL,2,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (23,3,'donate_point_species',NULL,'Saving threatened species',NULL,'species',NULL,NULL,NULL,NULL,NULL,3,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (24,3,'donate_point_people',NULL,'Empowering communities to care for nature',NULL,'people',NULL,NULL,NULL,NULL,NULL,4,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (25,3,'donate_card',NULL,'Make a donation','Demo mode: pay with test card 4242 4242 4242 4242, any future date, any CVC. No real money is charged.',NULL,NULL,NULL,NULL,NULL,NULL,5,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `heading`, `body`, `icon`, `image_path`, `button_text`, `button_url`, `button2_text`, `button2_url`, `display_order`, `created_at`, `updated_at`) VALUES (27,6,'hello_word','A summary of our journey','Our Journey','Founded in 1972 as a birdwatching society inspired by the Philippine Eagle, the Haribon Foundation has grown into one of the Philippines\' pioneering environmental organizations. In 1983, it expanded its mission to focus on the conservation of the country\'s natural resources, biodiversity, and threatened species.\n\nOver the years, Haribon has championed environmental protection through wildlife conservation, forest restoration, biodiversity research, and community-based initiatives. It has also worked with local communities, government agencies, and other organizations to promote sustainable practices and protect important ecosystems.\n\nToday, after more than five decades, Haribon continues its mission through four key pillars: conserving habitats, saving species, empowering people, and encouraging sustainability. Its journey reflects a lasting commitment to protecting Philippine biodiversity and inspiring people to become stewards of nature.','forest','uploads/OB1GuygCkrWxLqNKa0cKRcvmBpqKgLINxrjoS6pg.jpg',NULL,NULL,NULL,NULL,1,'2026-11-15 01:20:55','2026-11-15 01:37:44');
/*!40000 ALTER TABLE `page_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` (`id`, `title`, `description`, `icon`, `items`, `image_path`, `status`, `published_at`, `display_order`, `created_at`, `updated_at`) VALUES (1,'Conserving Sites & Habitats','Protecting forests and critical habitats, from the Sierra Madre to the mountains of Panay.','forest','[\"Forests for Life\",\"Central Sierra Madre\",\"Central Panay Mountain Range\",\"Project AGOS\"]',NULL,'published','2026-11-15 01:08:30',1,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `programs` (`id`, `title`, `description`, `icon`, `items`, `image_path`, `status`, `published_at`, `display_order`, `created_at`, `updated_at`) VALUES (2,'Saving Species','Defending threatened wildlife and stopping the illegal trade that endangers it.','species','[\"Species of Hope\",\"Illegal Parrot Trade\"]',NULL,'published','2026-11-15 01:08:30',2,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `programs` (`id`, `title`, `description`, `icon`, `items`, `image_path`, `status`, `published_at`, `display_order`, `created_at`, `updated_at`) VALUES (3,'Empowering People','Teaching communities and young people to look after the nature around them.','people','[\"WePhili Project\",\"Biodiversity on the Move\",\"Junior Sea Guardians\"]',NULL,'published','2026-11-15 01:08:30',3,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `programs` (`id`, `title`, `description`, `icon`, `items`, `image_path`, `status`, `published_at`, `display_order`, `created_at`, `updated_at`) VALUES (4,'Encouraging Sustainability','Building membership, volunteering and advocacy that keep conservation going.','sustainability','[\"Membership & Volunteer Program\",\"NbS & BDFE\",\"Communications & Advocacy\"]',NULL,'published','2026-11-15 01:08:30',4,'2026-11-15 01:08:30','2026-11-15 01:08:30');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` (`id`, `title`, `content`, `image_path`, `status`, `published_at`, `created_at`, `updated_at`) VALUES (1,'World Elephant Day','Aug 12th 12:00 PM - Nov 16th 12:00 AM',NULL,'published','2026-11-15 01:17:29','2026-11-15 01:17:29','2026-11-15 01:17:29');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES (1,'org_name','Haribon Foundation','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES (2,'footer_description','Leading conservation in the Philippines since 1972.','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES (3,'contact_address','Manila Observatory Bldg, Rm 212, Ateneo de Manila University, Katipunan Avenue, Loyola Heights, Quezon City 1108','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES (4,'contact_email','hello@haribon.org.ph','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES (5,'facebook_url','https://www.facebook.com/GoHaribon','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES (6,'instagram_url','https://www.instagram.com/goharibon/','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES (7,'linkedin_url','https://ph.linkedin.com/company/goharibon','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES (8,'footer_notice','© 2026 Student project inspired by the Haribon Foundation. Donations on this site run in Stripe test mode and no real money is collected.','2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES (9,'credits_note','Icons from Lucide and Font Awesome Free, via react-icons.','2026-11-15 01:08:30','2026-11-15 01:08:30');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` (`id`, `filename`, `path`, `mime_type`, `size`, `created_at`, `updated_at`) VALUES (1,'philippine-eagle.jpg','uploads/philippine-eagle.jpg','image/jpeg',217938,'2026-11-15 01:08:30','2026-11-15 01:08:30');
INSERT INTO `media` (`id`, `filename`, `path`, `mime_type`, `size`, `created_at`, `updated_at`) VALUES (2,'tree-planting.jpg','uploads/OB1GuygCkrWxLqNKa0cKRcvmBpqKgLINxrjoS6pg.jpg','image/jpeg',253365,'2026-11-15 01:36:38','2026-11-15 01:36:38');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-21 15:13:50
