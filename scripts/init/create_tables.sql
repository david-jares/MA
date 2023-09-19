-- measurement
-- beacons / location
CREATE TABLE simcattle.measurement 
(
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `valid` BOOL NOT NULL DEFAULT 1,
    `device` VARCHAR(255) NOT NULL,
    `time` DATETIME NOT NULL,
    `geofences` VARCHAR(255),
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `altitude` VARCHAR(255),
    `beacon` VARCHAR(255) NOT NULL,
    `major` INT,
    `minor` INT,
    `uuid` VARCHAR(255) NOT NULL,
    `speed` VARCHAR(255),
    `attributes` TEXT,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

-- we want to add another column to the measurement table so we can distinguish between the different input types
ALTER TABLE simcattle.measurement ADD COLUMN `input_type` ENUM('BEACON', 'GPS', 'MIOTY') NOT NULL DEFAULT 'BEACON';

-- learning_measurement
-- this is the movement data from the cows that we get as input for the learning stage if we choose to go that way
CREATE TABLE simcattle.learning_measurement 
(
    `wifi_ap` VARCHAR(32) NULL,
    `cnx_time` DATETIME NULL,
    `client_id` VARCHAR(64) NULL
);

CREATE INDEX cnx_date ON simcattle.learning_measurement (cnx_time);
CREATE INDEX idx_ap ON simcattle.learning_measurement (wifi_ap);
CREATE INDEX time_and_ap ON simcattle.learning_measurement (cnx_time, wifi_ap);

-- smartspec_conf
-- here we have a table that stores the state of the currently active configuration data.
CREATE TABLE simcattle.smartspec_conf 
(
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `sensors` TEXT,
    `spaces` TEXT,
    `metasensors` TEXT,
    `learn_conf` TEXT,
    `gen_conf` TEXT,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);


-- location
CREATE TABLE simcattle.location
(
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `cattle_id` VARCHAR(32) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `space_id` VARCHAR(32) NOT NULL,
    `start_time` DATETIME NOT NULL,
    `end_time` DATETIME NOT NULL,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);
