INSERT INTO simcattle.learning_measurement (`wifi_ap`, `cnx_time`, `client_id`)
  SELECT SUBSTRING_INDEX(`beacon`, '-', -1), `time`, `device`
  FROM simcattle.measurement;

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