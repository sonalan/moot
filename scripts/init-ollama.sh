#!/bin/sh

# Wait for Ollama service to be ready
echo "Waiting for Ollama service to be ready..."
until curl -f http://ollama:11434/api/tags > /dev/null 2>&1; do
  echo "Ollama not ready yet, waiting..."
  sleep 2
done

echo "Ollama is ready!"

# Pull the model if specified
if [ -n "$OLLAMA_MODEL" ]; then
  echo "Pulling model: $OLLAMA_MODEL"
  docker-compose exec -T ollama ollama pull "$OLLAMA_MODEL"
  echo "Model pulled successfully!"
else
  echo "No OLLAMA_MODEL specified, skipping model pull"
fi

echo "Setup complete!"