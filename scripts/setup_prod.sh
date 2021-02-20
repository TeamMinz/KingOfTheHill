#!/bin/bash
cd /etc/koth/QueueExtension
export EXT_SECRET=$(aws secretsmanager get-secret-value --secret-id KOTH | jq -r '.SecretString | fromjson | .EXT_SECRET');
export EXT_CLIENT_ID=$(aws secretsmanager get-secret-value --secret-id KOTH | jq -r '.SecretString | fromjson | .EXT_CLIENT_ID');
export EXT_OWNER_ID=$(aws secretsmanager get-secret-value --secret-id KOTH | jq -r '.SecretString | fromjson | .EXT_OWNER_ID');
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity | jq -r '.Account');
export AWS_DEFAULT_REGION=$(aws configure get region);
export IMAGE_REPO_NAME="kothservice";
export CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD);
export EXT_BOT_OAUTH=$(aws secretsmanager get-secret-value --secret-id KOTH | jq -r '.SecretString | fromjson | .EXT_BOT_OAUTH');
$(aws ecr get-login --no-include-email);

if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

if [ $CURRENT_BRANCH == "master"]; then
  export DOMAIN=prod.queue.teamminz.com;
  rm ./nginx/app.conf;
  cp ./nginx/app.conf.prod ./nginx/app.conf;
elif [ $CURRENT_BRANCH == "dev"]; then
  export DOMAIN=dev.queue.teamminz.com
  rm ./nginx/app.conf;
  cp ./nginx/app.conf.dev ./nginx/app.conf;
fi

domains=($DOMAIN)
rsa_key_size=4096
data_path="./certbot"
email="webmaster@teamminz.com" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi


if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$data_path/conf/live/$domains"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo


echo "### Starting nginx ..."
docker-compose up --force-recreate -d nginx
echo

echo "### Deleting dummy certificate for $domains ..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
echo


echo "### Requesting Let's Encrypt certificate for $domains ..."
#Join $domains to -d args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo

echo "### Reloading nginx ..."
docker-compose exec nginx nginx -s reload
