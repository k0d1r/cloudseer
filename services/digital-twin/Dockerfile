FROM golang:1.22
WORKDIR /app
COPY . .
RUN go build -o digital-twin cmd/main.go
CMD ["./digital-twin"]
