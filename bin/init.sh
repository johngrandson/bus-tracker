#!/bin/bash

# Initial config
LOCATION_ENV_PATH="./location-service/.env"
PAYMENT_ENV_PATH="./payment-service/.env"

# Volume names
LOCATION_ENV_VOLUME="location-env"
PAYMENT_ENV_VOLUME="payment-env"

# Function to check or create a volume
check_or_create_volume() {
    local volume_name=$1
    if docker volume inspect "$volume_name" >/dev/null 2>&1; then
        echo "Volume '$volume_name' already exists."
    else
        echo "Creating volume '$volume_name'..."
        docker volume create "$volume_name"
    fi
}

# Function to copy .env files to volumes
copy_env_to_volume() {
    local env_path=$1
    local volume_name=$2

    if [ -f "$env_path" ]; then
        echo "Copying $env_path to the volume $volume_name..."
        docker run --rm \
            -v "$env_path:/data/.env" \
            -v "$volume_name:/env" \
            busybox cp /data/.env /env/
        echo "File .env copied with success!"
    else
        echo "Error: File $env_path not found!"
    fi
}

# Verifica se o volume ja existe
check_or_create_volume "$LOCATION_ENV_VOLUME"
check_or_create_volume "$PAYMENT_ENV_VOLUME"

# Copy .env files
copy_env_to_volume "$LOCATION_ENV_PATH" "$LOCATION_ENV_VOLUME"
copy_env_to_volume "$PAYMENT_ENV_PATH" "$PAYMENT_ENV_VOLUME"

# Initialize Docker Compose
echo "Initializing o Docker Compose..."
docker-compose up -d

echo "Config completed!"
