INSERT INTO simcattle.learning_measurement (`wifi_ap`, `cnx_time`, `client_id`)
SELECT 
  CASE 
    WHEN `input_type` = 'GPS' THEN (`minor`, `time`, `device`)
    WHEN `input_type` = 'MIOTY' THEN (`column_4`, `time`, `device`)
    ELSE (SUBSTRING_INDEX(`beacon`, '-', -1), `time`, `device`)
  END
FROM `simcattle.measurement`;

-- device= the ID of the collar tracker it originates from.
-- time = time at which the measurement was recorded
-- wifi_ap = the number suffix of the `beacon` 


--  that was how it was done before:
-- INSERT INTO simcattle.learning_measurement (`wifi_ap`, `cnx_time`, `client_id`)
--   SELECT SUBSTRING_INDEX(`beacon`, '-', -1), `time`, `device`
--   FROM simcattle.measurement;

