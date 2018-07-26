FROM nginx:1.11

# Get certificate info for ssl (e.g. quick generate: sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/ssl.key -out ssl/ssl.crt
RUN mkdir /etc/nginx/ssl
COPY ssl/ssl.key /etc/nginx/ssl/
COPY ssl/ssl.crt /etc/nginx/ssl/

COPY nginx.conf /etc/nginx/nginx.conf

LABEL version="0.2.1"