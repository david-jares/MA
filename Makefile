#############################
# Docker machine states
#############################

reload_smartspec:
	# docker compose up --build smartspec-service
	docker compose up --no-deps --build -d smartspec-service
## Start the db
up_db:
	docker compose up -d db
	# docker compose up --build smartspec-service
reload_db:
	docker compose up --build db
## Start the project
up:
	docker compose up -d

## Stop the project
stop:
	docker compose stop

## Remove the project images, volumes and docker network
destroy:
	docker compose down -v

clean:
	docker compose down -v --remove-orphans
	docker image prune -af

clean-sm:
	docker compose down -v --remove-orphans
	docker image prune --filter "label=ma-smartspec-service" --force


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

# ## Reloads a service with updated src
# ## Usage: make reload s=some-service
# reload:
# 	docker exec -it code_$(s)_1 bash -c "cd /app && go build -o /service && chown 1000:1000 /service"
# 	docker stop code_$(s)_1
# 	docker commit code_$(s)_1 code_$(s)
# 	docker rm code_$(s)_1
# 	make up

## Reloads a service with updated src
## Usage: make reload s=some-service
# reload:
# 	docker exec -it code-$(s)-1 bash -c "cd /app && go build -o /service && chown 1000:1000 /service"
# 	docker stop code-$(s)_1
# 	docker commit code-$(s)-1 code-$(s)
# 	docker rm code-$(s)-1
# 	make up

# reloadui:
# 	docker exec -it code-web-ui-1 sh -c "cd /app && go build -o /service && chown 1000:1000 /service"
# 	docker stop code-web-ui-1
# 	docker commit code-web-ui-1 code-web-ui
# 	docker rm code-web-ui-1
# 	make up

update-frontend:
	docker cp "/root/2022-ma-paul-pongratz/code/web-ui/." code-web-ui-1:"/"
	docker restart code-web-ui-1

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
	docker exec -i code-db mysql -u user -ppassword simcattle < ./scripts/init/insert_in_smartspec_conf_GPS.sql

reload-db:	
	docker exec -i code-db mysql -u root -ppassword simcattle < ./scripts/init/grant_rights_to_user.sql
	docker exec -i code-db mysql -u root -ppassword simcattle < ./scripts/reload/clear_db_smartspec_conf.sql
	docker exec -i code-db mysql -u root -ppassword simcattle < ./scripts/reload/clear_db_smartspec_data.sql
	docker exec -i code-db mysql -u root -ppassword simcattle < ./scripts/init/insert_in_smartspec_conf_GPS.sql
	docker exec -i code-db mysql -u root -ppassword simcattle < ./scripts/init/load_data_from_csv_GPS.sql
# docker exec -i code-db mysql -u root -ppassword simcattle < ./scripts/init/load_data_from_csv.sql
	docker exec -i code-db mysql -u root -ppassword simcattle < ./scripts/init/transform_measurements.sql


run-my-script:
	go run ./scripts/dave/Testprint.go
	go run "/root/MA/scripts/dave/read_cattlegps.go"
	go run "/root/MA/scripts/dave/reformat_cattlegps.go"
	go run "/root/MA/scripts/dave/Create_Spaces.go"
	go run "/root/MA/scripts/dave/Countandprint.go"
	go run "/root/MA/scripts/dave/analyze_cattle_gps.go"
	go run "/root/MA/scripts/dave/Create_Sensors.go"
	go run "/root/MA/scripts/dave/Create_insert_in_smartspec_conf_gps_sql.go"
	go run "/root/MA/scripts/dave/Create_cattle_gps_formatted_with_sensorid_csv.go"

run-my-farm-script:
	go run ./scripts/dave/Testprint.go
	go run "/root/MA/scripts/dave_farm_gps/read_cattlegps.go"
	go run "/root/MA/scripts/dave_farm_gps/reformat_cattlegps.go"
	go run "/root/MA/scripts/dave_farm_gps/Create_Spaces.go"
	go run "/root/MA/scripts/dave_farm_gps/Countandprint.go"
	go run "/root/MA/scripts/dave_farm_gps/analyze_cattle_gps.go"
	go run "/root/MA/scripts/dave_farm_gps/Create_Sensors.go"
	go run "/root/MA/scripts/dave_farm_gps/Create_insert_in_smartspec_conf_gps_sql.go"
	go run "/root/MA/scripts/dave_farm_gps/Create_cattle_gps_formatted_with_sensorid_csv.go"



# # So David die E-Mail nur an dich.
# # Die CSV mit den Koordinaten ist etwas verwirrend formatiert. Latitude ist immer etwas mit 480.xxxxxxxx und Longtitude ist zweistellig mit 12.xxxxxxx
# # Kirchweihdach müsste das sein.

CURRENT_DIR=$(patsubst %/,%,$(dir $(realpath $(firstword $(MAKEFILE_LIST)))))
ROOT_DIR=$(CURRENT_DIR)
CURRENT_USER=
DOCKER_NAME=vite_docker
DOCKER_COMPOSE?=docker compose
DOCKER_EXEC_TOOLS_APP=$(CURRENT_USER) docker exec -it $(DOCKER_NAME) sh
NODE_INSTALL="npm i"
SERVER_RUN="npm run dev"

.PHONY:	vue_build vue_install vue_dev vue_up vue_start vue_first vue_stop vue_restart vue_clear

vue_build:
	$(DOCKER_COMPOSE)	up --build --no-recreate -d

vue_install:
	$(DOCKER_EXEC_TOOLS_APP) -c $(NODE_INSTALL)

vue_dev:
	$(DOCKER_EXEC_TOOLS_APP) -c $(SERVER_RUN)

vue_up:
	$(DOCKER_COMPOSE) up -d

vue_start:	vue_up vue_dev
# // this will up the docker env and run the npm run dev it to

vue_first:	vue_build vue_install vue_dev
# // this will build the env, up it and run the npm install and then run npm run dev it to

vue_stop: $(ROOT_DIR)/docker-compose.yml
	$(DOCKER_COMPOSE) kill || true
	$(DOCKER_COMPOSE) rm --force || true

vue_restart: vue_stop vue_start vue_dev

vue_clear: stop $(ROOT_DIR)/docker-compose.yml
	$(DOCKER_COMPOSE) down -v --remove-orphans || true
