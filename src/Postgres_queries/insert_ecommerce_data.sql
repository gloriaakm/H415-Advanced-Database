CREATE TABLE ecommerce_1k (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  rating DECIMAL(3, 2),
  reviews JSONB,
  images TEXT[],
  stock INT,
  date_added TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ecommerce_5k (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  rating DECIMAL(3, 2),
  reviews JSONB,
  images TEXT[],
  stock INT,
  date_added TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ecommerce_10k (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  rating DECIMAL(3, 2),
  reviews JSONB,
  images TEXT[],
  stock INT,
  date_added TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ecommerce_100k (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  rating DECIMAL(3, 2),
  reviews JSONB,
  images TEXT[],
  stock INT,
  date_added TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE ecommerce_1m (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  rating DECIMAL(3, 2),
  reviews JSONB,
  images TEXT[],
  stock INT,
  date_added TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
