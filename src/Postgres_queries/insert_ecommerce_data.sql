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

CREATE TABLE ecommerce_2k (
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

CREATE TABLE ecommerce_4k (
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

CREATE TABLE ecommerce_8k (
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
CREATE TABLE ecommerce_16k (
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
CREATE TABLE ecommerce_25k (
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