-- =======================
-- Hello Cafe Delivery Schema
-- =======================
DROP DATABASE IF EXISTS hello_cafe_db;
Create DATABASE IF NOT EXISTS hello_cafe_db;
USE hello_cafe_db;

CREATE TABLE IF NOT EXISTS employee
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(32),
    username    VARCHAR(32) UNIQUE,
    password    VARCHAR(64),
    phone       VARCHAR(15),
    gender      VARCHAR(10),
    status      INT COMMENT '1 active, 0 inactive',
    create_time DATETIME,
    update_time DATETIME,
    create_user BIGINT COMMENT  'who create this employee',
    update_user BIGINT COMMENT  'last one update this employee'
);
DROP TABLE IF EXISTS  category;
CREATE TABLE IF NOT EXISTS category
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(32) UNIQUE,
    type            INT,
    sort            INT,
    status          INT COMMENT '1 active, 0 inactive',
    create_time     DATETIME,
    update_time     DATETIME,
    create_employee BIGINT COMMENT 'employee id who created the category',
    update_employee BIGINT COMMENT 'last employee id who updated the category'
);

CREATE TABLE IF NOT EXISTS menu_item
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(64) UNIQUE,
    category_id     BIGINT,
    price           DECIMAL(10, 2),
    image           VARCHAR(255),
    description     VARCHAR(255),
    status          INT COMMENT '1 active, 0 inactive',
    create_time     DATETIME,
    update_time     DATETIME,
    create_employee BIGINT COMMENT 'employee id who created the item',
    update_employee BIGINT COMMENT 'last employee id who updated the item'
);

CREATE TABLE IF NOT EXISTS combo
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(64) UNIQUE,
    category_id     BIGINT,
    price           DECIMAL(10, 2),
    image           VARCHAR(255),
    description     VARCHAR(255),
    status          INT COMMENT '1 active, 0 inactive',
    create_time     DATETIME,
    update_time     DATETIME,
    create_employee BIGINT COMMENT 'employee id who created the combo',
    update_employee BIGINT COMMENT 'last employee id who updated the combo'
);

CREATE TABLE IF NOT EXISTS combo_item
(
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    combo_id     BIGINT,
    menu_item_id BIGINT,
    name         VARCHAR(64),
    price        DECIMAL(10, 2),
    quantity     INT
);

CREATE TABLE IF NOT EXISTS user
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(32) UNIQUE,
    password    VARCHAR(64),
    email    VARCHAR(64),
    name        VARCHAR(32),
    phone       VARCHAR(15),
    gender      VARCHAR(10),
    id_number   VARCHAR(18),
    avatar      VARCHAR(500),
    create_time DATETIME
);

CREATE TABLE IF NOT EXISTS address_book
(
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id    BIGINT,
    name       VARCHAR(50),
    gender     VARCHAR(10),
    phone      VARCHAR(15),
    address    VARCHAR(200),
    city       VARCHAR(64),
    state      VARCHAR(64),
    zipcode    VARCHAR(12),
    label      VARCHAR(100),
    is_default TINYINT(1)
);

CREATE TABLE IF NOT EXISTS shopping_cart
(
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(64),
    image        VARCHAR(255),
    user_id      BIGINT,
    menu_item_id BIGINT,
    combo_id     BIGINT,
    quantity     INT,
    unit_price   DECIMAL(10, 2),
    create_time  DATETIME
);

CREATE TABLE IF NOT EXISTS orders
(
    id                      BIGINT PRIMARY KEY AUTO_INCREMENT,
    number                  VARCHAR(50),
    status                  INT COMMENT '1 pending payment, 2 awaiting acceptance, 3 accepted, 4 delivering, 5 completed, 6 canceled',
    user_id                 BIGINT,
    address_book_id         BIGINT,
    order_time              DATETIME,
    checkout_time           DATETIME,
    pay_method              INT COMMENT '1 credit card, 2 PayPal',
    pay_status              TINYINT COMMENT '0 unpaid, 1 paid, 2 refunded',
    amount                  DECIMAL(10, 2),
    notes                   VARCHAR(255),
    phone                   VARCHAR(15),
    address                 VARCHAR(255),
    user_name               VARCHAR(32),
    name                    VARCHAR(32),
    cancel_reason           VARCHAR(255),
    rejection_reason        VARCHAR(255),
    cancel_time             DATETIME,
    estimated_delivery_time DATETIME,
    delivery_status         TINYINT COMMENT '1 deliver immediately, 0 schedule delivery time',
    delivery_time           DATETIME,
    pack_amount             INT,
    tableware_number        INT,
    tableware_status        TINYINT COMMENT '1 provide per meal, 0 custom quantity'
);

CREATE TABLE IF NOT EXISTS order_detail
(
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(64),
    image        VARCHAR(255),
    order_id     BIGINT,
    menu_item_id BIGINT,
    combo_id     BIGINT,
    quantity     INT,
    unit_price   DECIMAL(10, 2),
    tax          DECIMAL(10, 2)
);

CREATE TABLE shop (
                      id BIGINT PRIMARY KEY AUTO_INCREMENT,
                      name VARCHAR(50) NOT NULL DEFAULT 'Hello Café',
                      status TINYINT NOT NULL DEFAULT 1, -- 1=open, 0=closed
                      update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

INSERT INTO shop (name, status) VALUES ('Hello Café', 1)