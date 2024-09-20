.PHONY: all frontend backend

all: frontend backend

frontend:
	@echo "Starting React app..."
	@cd frontend && npm run dev &

backend:
	@echo "Starting Flask app..."
	@cd backend && . venv/bin/activate && flask run &