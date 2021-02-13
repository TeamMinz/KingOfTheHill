#!/bin/bash

export EXT_SECRET=$(aws secretsmanager get-secret-value --secret-id KOTH-Dev | jq -r '.SecretString | fromjson | .EXT_SECRET');
export EXT_CLIENT_ID=$(aws secretsmanager get-secret-value --secret-id KOTH-Dev | jq -r '.SecretString | fromjson | .EXT_CLIENT_ID');
export EXT_OWNER_ID=$(aws secretsmanager get-secret-value --secret-id KOTH-Dev | jq -r '.SecretString | fromjson | .EXT_OWNER_ID');
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity | jq -r '.Account');
export AWS_DEFAULT_REGION=$(aws configure get region);
export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key);
export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id);
export IMAGE_REPO_NAME="kothservice";
$(aws ecr get-login --no-include-email);
docker-compose up;
#docker run koth -e EXT_SECRET="$EXT_SECRET" -e EXT_CLIENT_ID="$EXT_CLIENT_ID" -e EXT_OWNER_ID="$EXT_OWNER_ID";
