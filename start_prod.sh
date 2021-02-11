export EXT_SECRET=$(aws secretsmanager get-secret-value --secret-id KOTH-Dev | jq -r '.SecretString | fromjson | .EXT_SECRET');
export EXT_CLIENT_ID=$(aws secretsmanager get-secret-value --secret-id KOTH-Dev | jq -r '.SecretString | fromjson | .EXT_CLIENT_ID');
export EXT_OWNER_ID=$(aws secretsmanager get-secret-value --secret-id KOTH-Dev | jq -r '.SecretString | fromjson | .EXT_OWNER_ID');
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity | jq -r '.Account');
export AWS_DEFAULT_REGION=$(aws configure get region);
export IMAGE_REPO_NAME="kothservice";
docker-compose up;
#docker run koth -e EXT_SECRET="$EXT_SECRET" -e EXT_CLIENT_ID="$EXT_CLIENT_ID" -e EXT_OWNER_ID="$EXT_OWNER_ID";
