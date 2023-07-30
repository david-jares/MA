#############################
# Docker machine states
#############################

## Start the project
up:
	docker compose up -d

## Stop the project
stop:
	docker compose stop

## Remove the project images, volumes and docker network
destroy:
	docker compose down -v

## Restart all project containers
restart: stop up

## Display current state of the containers
state:
	docker compose ps

## Rebuild all containers 
rebuild: stop
	docker compose pull
	docker compose build --pull
	make up

## Show logs for all containers. 
## Use "make logs s=some-service" to specify a single service. 
logs:
	docker compose logs -f --tail=50 $(s)

## Reloads a service with updated src
## Usage: make reload s=some-service
reload:
	docker exec -it code_$(s)_1 bash -c "cd /app && go build -o /service && chown 1000:1000 /service"
	docker stop code_$(s)_1
	docker commit code_$(s)_1 code_$(s)
	docker rm code_$(s)_1
	make up

# .PHONY: reload-sql-scripts

# reload-sql-scripts:

# 	docker compose exec db mysql -u user -p password simcattle < /docker-entrypoint-initdb.d/1.sql
# 	# docker compose exec db mysql -u user -p password simcattle < /docker-entrypoint-initdb.d/2.sql
# 	# docker compose exec db mysql -u user -p password simcattle < /docker-entrypoint-initdb.d/4.sql
# 	# docker compose exec db mysql -u user -p password simcattle < /docker-entrypoint-initdb.d/5.sql

dave:
	go run ./scripts/dave/execute_multiple_files_sequentially.go

reload-db-config:
	docker exec -i code-db mysql -u user -ppassword simcattle < ./scripts/reload/clear_db_smartspec_conf.sql
# docker exec -i code-db mysql -u user -ppassword simcattle < ./scripts/init/insert_in_smartspec_conf_GPS.sql
		


run-my-script:
# go run ./scripts/dave/Testprint.go
# go run ./scripts/dave/Testprint.go
# go run "/root/2022-ma-paul-pongratz/code/scripts/dave/read_cattlegps.go"
# go run "/root/2022-ma-paul-pongratz/code/scripts/dave/reformat_cattlegps.go"
# go run "/root/2022-ma-paul-pongratz/code/scripts/dave/Create_Spaces.go"
# go run "/root/2022-ma-paul-pongratz/code/scripts/dave/Countandprint.go"
# go run "/root/2022-ma-paul-pongratz/code/scripts/dave/analyze_cattle_gps.go"
# go run "/root/2022-ma-paul-pongratz/code/scripts/dave/Create_Sensors.go"
# go run "/root/2022-ma-paul-pongratz/code/scripts/dave/Create_insert_in_smartspec_conf_gps_sql.go"
	go run "/root/2022-ma-paul-pongratz/code/scripts/dave/Create_load_data_from_csv_GPS_sql.go"

# .PHONY: command1 command2 command3

# command1:
# # go run "/root/2022-ma-paul-pongratz/code/scripts/dave/read_cattlegps.go"
# # go run "/root/2022-ma-paul-pongratz/code/scripts/dave/reformat_cattlegps.go"
# # go run "/root/2022-ma-paul-pongratz/code/scripts/dave/count_and_print_reformatted_unique_gps_values.go",
# 	go run "/root/2022-ma-paul-pongratz/code/scripts/dave/Testprint.go",
# # go run "/root/2022-ma-paul-pongratz/code/scripts/dave/Create_Sensors.go",


# So David die E-Mail nur an dich.
# Die CSV mit den Koordinaten ist etwas verwirrend formatiert. Latitude ist immer etwas mit 480.xxxxxxxx und Longtitude ist zweistellig mit 12.xxxxxxx
# Kirchweihdach müsste das sein.