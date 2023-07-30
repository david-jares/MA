-- 103_(W10T_A7H_2)
LOAD DATA INFILE '/data/cattle-gps-formatted.csv'
INTO TABLE simcattle.measurement
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@cattle_id, @timestamp, @longitude, @latitude, @nmea_valid)
SET `valid` = @valid="TRUE",

    -- sensor_id
    `device` = 1
    `time` = @time,
    `latitude` = @latitude,
    `longitude` = @longitude,
    `altitude` = 0,
    -- `beacon` = @beacon,
    -- `major` = @major,
    -- `minor` = @minor,
    -- `uuid` = @uuid,
    -- `speed` = @speed,
    -- `attributes` = @attributes;

-- 103_(W10T_A7H_2)
LOAD DATA INFILE '/data/cattle-gps-formatted.csv'
INTO TABLE simcattle.measurement
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@valid, @time, @geofences, @latitude, @longitude, @altitude, @beacon, @major, @minor, @uuid, @speed, @attributes)
SET `valid` = @valid="TRUE",
    `device` = "103_(W10T_A7H_2)",
    `time` = @time,
    `geofences` = @geofences,
    `latitude` = @latitude,
    `longitude` = @longitude,
    `altitude` = @altitude,
    `beacon` = @beacon,
    `major` = @major,
    `minor` = @minor,
    `uuid` = @uuid,
    `speed` = @speed,
    `attributes` = @attributes;
