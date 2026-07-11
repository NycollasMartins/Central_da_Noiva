FROM nginx:alpine

# Copia todos os arquivos do site para a pasta pública do nginx
COPY . /usr/share/nginx/html

EXPOSE 80
