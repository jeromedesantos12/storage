-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.31 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for procedure storage_db.create_items
DELIMITER //
CREATE PROCEDURE `create_items`(
	IN `nama` CHAR(20)
)
BEGIN

	SET @id = (
		SELECT id 
			FROM items 
			ORDER BY id 
			DESC LIMIT 0, 1
		);
	
   INSERT 
		INTO items (
			items.id, 
			items.nama
		)	 
		VALUES (
			if (@id is null, 1, @id+1), 
			nama
		);
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.create_joins
DELIMITER //
CREATE PROCEDURE `create_joins`(
	IN `storages` INT
)
BEGIN

	SET @id = (
		SELECT id 
			FROM joins 
			ORDER BY id 
			DESC LIMIT 0, 1
		);
	
   INSERT 
		INTO joins (
			joins.id, 
			joins.storages
		) 		
		VALUES (
			if (@id is null, 1, @id+1), 
			storages
		);
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.create_joins_items
DELIMITER //
CREATE PROCEDURE `create_joins_items`(
	IN `items` INT
)
BEGIN

	SET @id = (
		SELECT id 
			FROM joins 
			ORDER BY id 
			DESC LIMIT 0, 1
		);
	
	INSERT 
		INTO joins_items (
			joins_items.items, 
			joins_items.joins_id
		)
		VALUES (
			items, 
			if (@id is null, 1, @id)
		);
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.create_storages
DELIMITER //
CREATE PROCEDURE `create_storages`(
	IN `nama` CHAR(20)
)
BEGIN

	SET @id = (
		SELECT id 
			FROM storages 
			ORDER BY id 
			DESC LIMIT 0, 1
		);
	
   INSERT 
		INTO storages (
			storages.id, 
			storages.nama
		) 
		VALUES (
			if (@id is null, 1, @id+1), 
			nama
		);
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.delete_items
DELIMITER //
CREATE PROCEDURE `delete_items`(
	IN `id` INT
)
BEGIN

	DELETE 
		FROM items 
		WHERE items.id = id;
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.delete_joins
DELIMITER //
CREATE PROCEDURE `delete_joins`(
	IN `id` INT
)
BEGIN

   DELETE 
		FROM joins_items 
		WHERE joins_items.joins_id = id;
		
   DELETE 
		FROM joins 
		WHERE joins.id = id;

END//
DELIMITER ;

-- Dumping structure for procedure storage_db.delete_storages
DELIMITER //
CREATE PROCEDURE `delete_storages`(
	IN `id` INT
)
BEGIN

	DELETE 
		FROM storages 
		WHERE storages.id = id;
		
END//
DELIMITER ;

-- Dumping structure for table storage_db.items
CREATE TABLE IF NOT EXISTS `items` (
  `id` int NOT NULL,
  `nama` char(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table storage_db.items: ~25 rows (approximately)
INSERT INTO `items` (`id`, `nama`) VALUES
	(1, 'Pensil'),
	(2, 'Pulpen'),
	(3, 'Penghapus'),
	(4, 'Serutan'),
	(5, 'Gelas'),
	(6, 'Botol'),
	(7, 'Piring'),
	(8, 'Mangkok'),
	(9, 'Keyboard'),
	(10, 'Mouse'),
	(11, 'Koran'),
	(12, 'Majalah'),
	(13, 'Novel'),
	(14, 'Komik'),
	(15, 'Kabel'),
	(17, 'Mix'),
	(18, 'CD'),
	(19, 'Disket'),
	(20, 'Kaset'),
	(21, 'USB'),
	(22, 'HP'),
	(23, 'Tab'),
	(24, 'Batu'),
	(25, 'Kertas');

-- Dumping structure for table storage_db.joins
CREATE TABLE IF NOT EXISTS `joins` (
  `id` int NOT NULL,
  `storages` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `storages` (`storages`),
  CONSTRAINT `storages` FOREIGN KEY (`storages`) REFERENCES `storages` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table storage_db.joins: ~5 rows (approximately)
INSERT INTO `joins` (`id`, `storages`) VALUES
	(1, 1),
	(2, 2),
	(3, 3),
	(4, 4);

-- Dumping structure for table storage_db.joins_items
CREATE TABLE IF NOT EXISTS `joins_items` (
  `items` int NOT NULL,
  `joins_id` int NOT NULL,
  KEY `joins_id` (`joins_id`),
  KEY `items` (`items`),
  CONSTRAINT `items` FOREIGN KEY (`items`) REFERENCES `items` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `joins_id` FOREIGN KEY (`joins_id`) REFERENCES `joins` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table storage_db.joins_items: ~9 rows (approximately)
INSERT INTO `joins_items` (`items`, `joins_id`) VALUES
	(8, 3),
	(9, 3),
	(5, 2),
	(6, 2),
	(7, 4),
	(1, 1),
	(2, 1);

-- Dumping structure for procedure storage_db.read_items
DELIMITER //
CREATE PROCEDURE `read_items`()
BEGIN

	SELECT * 
		FROM items;
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_itemsID
DELIMITER //
CREATE PROCEDURE `read_itemsID`(
	IN `id` INT
)
BEGIN

	SELECT * 
		FROM items 
		WHERE items.id = id;
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_itemsNama
DELIMITER //
CREATE PROCEDURE `read_itemsNama`(
	IN `nama` CHAR(20)
)
BEGIN

	SELECT *
		FROM items
		WHERE items.nama = nama
		COLLATE utf8mb4_0900_ai_ci;
			
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_joins
DELIMITER //
CREATE PROCEDURE `read_joins`()
BEGIN

	SELECT 
		joins.id, 
		joins.storages AS storages_id, 
		storages.nama AS storages_nama 
		FROM joins
	
   INNER JOIN storages
    	ON joins.storages = storages.id;
    	
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_joinsID
DELIMITER //
CREATE PROCEDURE `read_joinsID`(
	IN `id` INT
)
BEGIN

	SELECT 
		joins.id, 
		joins.storages AS storages_id, 
		storages.nama AS storages_nama	
		FROM joins
	
	INNER JOIN storages
		ON joins.storages = storages.id
		WHERE joins.id= id;
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_joinsNama
DELIMITER //
CREATE PROCEDURE `read_joinsNama`(
	IN `nama` CHAR(20)
)
BEGIN

	SELECT 
		joins.id, 
		joins.storages AS storages_id, 
		storages.nama AS storages_nama 
		FROM joins 
	
   INNER JOIN storages
      ON joins.storages = storages.id
      WHERE storages.nama = nama 
		COLLATE utf8mb4_0900_ai_ci;
      	
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_joinsStoragesID
DELIMITER //
CREATE PROCEDURE `read_joinsStoragesID`(
	IN `storages` INT
)
BEGIN
	SELECT *
		FROM joins 
		WHERE joins.storages = storages;
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_joins_items
DELIMITER //
CREATE PROCEDURE `read_joins_items`()
BEGIN

	SELECT 
		joins_items.joins_id, 
		joins_items.items AS items_id, 
		items.nama AS items_nama 
		FROM joins_items
		
	INNER JOIN items
	   ON joins_items.items = items.id;
    	
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_joins_itemsID
DELIMITER //
CREATE PROCEDURE `read_joins_itemsID`(
	IN `id` INT
)
BEGIN

	SELECT 
		joins_items.joins_id, 
		joins_items.items AS items_id, 
		items.nama AS items_nama 	
		FROM joins_items 
		
	INNER JOIN items
	   ON joins_items.items = items.id
	   WHERE joins_items.joins_id= id;
      
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_joins_itemsItemsID
DELIMITER //
CREATE PROCEDURE `read_joins_itemsItemsID`(
	IN `items` INT
)
BEGIN
	SELECT *
		FROM joins_items
		WHERE joins_items.items = items;
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_joins_itemsNama
DELIMITER //
CREATE PROCEDURE `read_joins_itemsNama`(
	IN `nama` CHAR(20)
)
BEGIN

	SELECT 
		joins_items.joins_id, 
		joins_items.items AS items_id, 
		items.nama AS items_nama 
		FROM joins_items 
		
   INNER JOIN items
      ON joins_items.items = items.id
     	WHERE items.nama = nama 
		COLLATE utf8mb4_0900_ai_ci;
      
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_storages
DELIMITER //
CREATE PROCEDURE `read_storages`()
BEGIN

	SELECT * 
		FROM storages;
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_storagesID
DELIMITER //
CREATE PROCEDURE `read_storagesID`(
	IN `id` INT
)
BEGIN

	SELECT * 
		FROM storages
		WHERE storages.id= id;
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.read_storagesNama
DELIMITER //
CREATE PROCEDURE `read_storagesNama`(
	IN `nama` CHAR(20)
)
BEGIN

	SELECT *
		FROM storages
		WHERE storages.nama = nama
		COLLATE utf8mb4_0900_ai_ci;
			
END//
DELIMITER ;

-- Dumping structure for table storage_db.storages
CREATE TABLE IF NOT EXISTS `storages` (
  `id` int NOT NULL,
  `nama` char(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table storage_db.storages: ~23 rows (approximately)
INSERT INTO `storages` (`id`, `nama`) VALUES
	(1, 'Kardus A'),
	(2, 'Kardus B'),
	(3, 'Kardus C'),
	(4, 'Kardus D'),
	(5, 'Kardus E'),
	(6, 'Kardus F'),
	(7, 'Kardus G'),
	(8, 'Kardus H'),
	(9, 'Kardus I'),
	(10, 'Kardus J'),
	(11, 'Kardus K'),
	(12, 'Kardus L'),
	(13, 'Kardus M'),
	(14, 'Kardus N'),
	(15, 'Kardus O'),
	(16, 'Kardus P'),
	(17, 'Kardus Q'),
	(18, 'Kardus V'),
	(19, 'Kardus W'),
	(20, 'Kardus X'),
	(21, 'Kardus Y'),
	(22, 'Kardus Z');

-- Dumping structure for procedure storage_db.update_items
DELIMITER //
CREATE PROCEDURE `update_items`(
	IN `id` INT,
	IN `nama` CHAR(20)
)
BEGIN

	UPDATE items 
		SET items.nama = nama
		WHERE items.id = id;
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.update_joins
DELIMITER //
CREATE PROCEDURE `update_joins`(
	IN `id` INT,
	IN `storages` CHAR(20)
)
BEGIN

   UPDATE joins 
		SET joins.storages = storages 
		WHERE joins.id = id;
				
   DELETE 
		FROM joins_items 
		WHERE joins_items.joins_id = id;
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.update_joins_items
DELIMITER //
CREATE PROCEDURE `update_joins_items`(
	IN `id` INT,
	IN `items` CHAR(20)
)
BEGIN

	INSERT 
		INTO joins_items (
			joins_items.items, 
			joins_items.joins_id
		)	 
		VALUES (
			items, 
			id
		);
		
END//
DELIMITER ;

-- Dumping structure for procedure storage_db.update_storages
DELIMITER //
CREATE PROCEDURE `update_storages`(
	IN `id` INT,
	IN `nama` CHAR(20)
)
BEGIN

	UPDATE storages 
		SET storages.nama = nama
		WHERE storages.id = id;
		
END//
DELIMITER ;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
