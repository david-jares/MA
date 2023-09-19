LOAD DATA INFILE '/data/cattle_handdrawn.csv'
INTO TABLE simcattle.measurement
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@cattle_id, @timestamp, @longitude, @latitude, @nmea_valid, @sensor_id)
SET `cattle_id` = @cattle_id,
    `time` = @timestamp,
    `sensor_id` = @sensor_id,
    `longitude` = @longitude,
    `latitude` = @latitude,
    `altitude` = 0;


LOAD DATA INFILE '/data/cattle_handdrawn.csv'
INTO TABLE simcattle.learning_measurement
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@cattle_id, @timestamp, @longitude, @latitude, @nmea_valid, @sensor_id)
SET `client_id` = @cattle_id,
    `cnx_time` = @timestamp,
    `wifi_ap` = @sensor_id;

--  (`wifi_ap`, `cnx_time`, `client_id`)



-- -- 103_(W10T_A7H_2)
-- LOAD DATA INFILE '/data/103_(W10T_A7H_2).csv'
-- INTO TABLE simcattle.measurement
-- FIELDS TERMINATED BY ','
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS
-- (@valid, @time, @geofences, @latitude, @longitude, @altitude, @beacon, @major, @minor, @uuid, @speed, @attributes)
-- SET `valid` = @valid="TRUE",
--     `device` = "103_(W10T_A7H_2)",
--     `time` = @time,
--     `geofences` = @geofences,
--     `latitude` = @latitude,
--     `longitude` = @longitude,
--     `altitude` = @altitude,
--     `beacon` = @beacon,
--     `major` = @major,
--     `minor` = @minor,
--     `uuid` = @uuid,
--     `speed` = @speed,
--     `attributes` = @attributes;
