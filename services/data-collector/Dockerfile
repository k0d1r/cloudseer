FROM golang:1.22
WORKDIR /app
COPY . .
RUN go build -o data-collector cmd/main.go
CMD ["./data-collector"]
