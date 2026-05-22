FROM php:8.3-cli-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    zip \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        fileinfo \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiar TODO el proyecto primero
COPY . .

# Instalar dependencias PHP
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install \
    --optimize-autoloader \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --ignore-platform-reqs

# Instalar dependencias Node y buildear assets
RUN npm ci && npm run build

# Cachear config de Laravel
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

CMD php artisan migrate --force && php -S 0.0.0.0:$PORT -t public
