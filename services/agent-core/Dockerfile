FROM golang:1.22
WORKDIR /app
COPY . .
RUN go build -o agent-core cmd/main.go
CMD ["./agent-core"]
