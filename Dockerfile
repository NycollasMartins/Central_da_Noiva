FROM nginx:alpine

# Configuração do nginx (gzip + cache dos assets)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia todos os arquivos do site para a pasta pública do nginx
COPY . /usr/share/nginx/html

EXPOSE 80
