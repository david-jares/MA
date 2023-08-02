FROM golang:1.19

WORKDIR /app

# Install go dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy all content to the image
COPY . .

# go: updates to go.mod needed; to update it:

# # Build the service
# RUN go build -o /service ./service
RUN go mod tidy
RUN go build -o /service 

# Install Python & jq
RUN apt-get update
RUN apt-get -y install python3 python3-setuptools python3-pip jq




RUN apt -y install python3-venv
# workaround for the folloing pip install command, we need to use a virtual environment
RUN python3 -m venv "/path/to/venv"
WORKDIR /path/to/venv/bin
RUN ./python3 -m pip install numpy pandas matplotlib scikit-learn python-rapidjson tqdm ruptures mysql-connector-python
		
CMD [ "/service" ]