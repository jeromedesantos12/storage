// import module local
const prompt = require("./Query");

// buat database dan tabel jika belum ada
(async () => {
  try {
    await prompt(`
    --  BUAT DATABASE

        CREATE DATABASE IF NOT EXISTS storage_db;
        use storage_db;
        
    --  BUAT TABLE

        CREATE TABLE IF NOT EXISTS storages (
            id int(11) NOT NULL,
            nama char(20) NOT NULL,
            PRIMARY KEY (id)
            );

        CREATE TABLE IF NOT EXISTS items (
            id int(11) NOT NULL,
            nama char(20) NOT NULL,
            PRIMARY KEY (id)
            );

        CREATE TABLE IF NOT EXISTS joins (
            id int(11) NOT NULL,
            storages int(11) NOT NULL,
            PRIMARY KEY (id),
            KEY storages (storages), CONSTRAINT storages FOREIGN KEY (storages) 
            REFERENCES storages (id) ON UPDATE CASCADE
            );

        CREATE TABLE IF NOT EXISTS joins_items (
            items int(11) NOT NULL,
            joins_id int(11) NOT NULL,
            KEY joins_id (joins_id),
            KEY items (items),CONSTRAINT items FOREIGN KEY (items) 
            REFERENCES items (id) ON UPDATE CASCADE, CONSTRAINT joins_id FOREIGN KEY (joins_id) 
            REFERENCES joins (id) ON UPDATE CASCADE
            );

    --  BUAT STORED PROCEDURE
 
        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS create_items(IN nama CHAR(20))
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
        END;
               
        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS create_joins(IN storages INT)
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
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS create_joins_items(IN items INT)
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
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS create_storages(IN nama CHAR(20))
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
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS delete_items(IN id INT)
        BEGIN
            DELETE 
            FROM items 
            WHERE items.id = id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS delete_joins(IN id INT)
        BEGIN
            DELETE 
            FROM joins_items 
            WHERE joins_items.joins_id = id;       
            DELETE 
            FROM joins 
            WHERE joins.id = id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS delete_storages(IN id INT)
        BEGIN
            DELETE 
            FROM storages 
            WHERE storages.id = id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_items()
        BEGIN
            SELECT * 
            FROM items;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_itemsID(IN id INT)
        BEGIN
            SELECT * 
            FROM items 
            WHERE items.id = id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_itemsNama(IN nama CHAR(20))
        BEGIN
            SELECT *
            FROM items
            WHERE items.nama = nama
            COLLATE utf8mb4_0900_ai_ci;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_joins()
        BEGIN
            SELECT 
            joins.id, 
            joins.storages AS storages_id, 
            storages.nama AS storages_nama 
            FROM joins
            INNER JOIN storages
            ON joins.storages = storages.id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_joinsID(IN id INT)
        BEGIN
            SELECT 
            joins.id, 
            joins.storages AS storages_id, 
            storages.nama AS storages_nama	
            FROM joins   
            INNER JOIN storages
            ON joins.storages = storages.id
            WHERE joins.id= id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_joinsNama(IN nama CHAR(20))
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
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_joinsStoragesID(IN storages INT)
        BEGIN
            SELECT *
            FROM joins 
            WHERE joins.storages = storages;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_joins_items()
        BEGIN
            SELECT 
            joins_items.joins_id, 
            joins_items.items AS items_id, 
            items.nama AS items_nama 
            FROM joins_items
            INNER JOIN items
            ON joins_items.items = items.id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_joins_itemsID(IN id INT)
        BEGIN
            SELECT 
            joins_items.joins_id, 
            joins_items.items AS items_id, 
            items.nama AS items_nama 
            FROM joins_items 
            INNER JOIN items
            ON joins_items.items = items.id
            WHERE joins_items.joins_id= id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_joins_itemsID(IN items INT)
        BEGIN
            SELECT *
            FROM joins_items
            WHERE joins_items.items = items;
        END;

        -- read_joins_itemsItemsID

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_joins_itemsNama(IN nama CHAR(20))
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
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_storages()
        BEGIN
            SELECT * 
            FROM storages;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_storagesID(IN id INT)
        BEGIN
            SELECT * 
            FROM storages
            WHERE storages.id= id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS read_storagesNama(IN nama CHAR(20))
        BEGIN
            SELECT *
            FROM storages
            WHERE storages.nama = nama
            COLLATE utf8mb4_0900_ai_ci;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS update_items(IN id INT, IN nama CHAR(20))
        BEGIN
            UPDATE items 
            SET items.nama = nama
            WHERE items.id = id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS update_joins(IN id INT, IN storages CHAR(20))
        BEGIN
            UPDATE joins 
            SET joins.storages = storages 
            WHERE joins.id = id;     
            DELETE 
            FROM joins_items 
            WHERE joins_items.joins_id = id;
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS update_joins_items(IN id INT, IN items CHAR(20))
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
        END;

        CREATE DEFINER= root@localhost 
        PROCEDURE IF NOT EXISTS update_joins_items(	IN id INT, IN nama CHAR(20))
        BEGIN
            UPDATE storages 
            SET storages.nama = nama
            WHERE storages.id = id;
        END;        
        `);
  } catch (error) {
    console.error(error.message);
  }
})();
