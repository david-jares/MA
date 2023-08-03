INSERT INTO simcattle.learning_measurement (`wifi_ap`, `cnx_time`, `client_id`)
SELECT 
  CASE 
    WHEN `input_type` = 'GPS' THEN `minor`, `time`, `device`
    WHEN `input_type` = 'MIOTY' THEN `column_4`, `time`, `device`
    ELSE SUBSTRING_INDEX(`beacon`, '-', -1), `time`, `device`
  END
FROM `simcattle.measurement`;



--  that was how it was done before:
-- INSERT INTO simcattle.learning_measurement (`wifi_ap`, `cnx_time`, `client_id`)
--   SELECT SUBSTRING_INDEX(`beacon`, '-', -1), `time`, `device`
--   FROM simcattle.measurement;



---------
-- here we extract the movement-data from our real cows and their movements from the database ( we stored it there in an earlier step ) and use&transform the necessary columns as input for our learning.
-- we put that transformed data into simcattle.learning_measurement, which will be used by SMARTSpec as source for the learning stage.
---------




-- This script is inserting data into the learning_measurement table of the simcattle database.
--  The data being inserted is obtained from the measurement table of the same database.

-- The INSERT INTO statement is used to insert data into the learning_measurement table.
--  The columns being inserted into are wifi_ap, cnx_time, and client_id.

-- The SELECT statement is used to retrieve data from the measurement table.
--  The SUBSTRING_INDEX function is used to extract the last part of the beacon column, which is separated by a hyphen. 
-- This value is then inserted into the wifi_ap column of the learning_measurement table.

-- The time column from the measurement table is inserted into the cnx_time column of the learning_measurement table.

-- The device column from the measurement table is inserted into the client_id column of the learning_measurement table.

-- Overall, this script is extracting data from the measurement table and transforming it into a format that can be inserted into the learning_measurement table. 