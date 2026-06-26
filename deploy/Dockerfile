FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html app.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY templates /usr/share/nginx/html/templates
EXPOSE 80
