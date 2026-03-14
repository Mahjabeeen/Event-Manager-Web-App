-- Main Events Table
CREATE TABLE Events (
    event_id INT PRIMARY KEY IDENTITY(1,1),
    event_name NVARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    location NVARCHAR(200),
    cost DECIMAL(10,2) NOT NULL,
    max_capacity INT,
    current_registrations INT DEFAULT 0,
    image_url NVARCHAR(500),
    category NVARCHAR(100),
    status NVARCHAR(50) DEFAULT 'Active'
);

-- Event Menus Table
CREATE TABLE Event_Menus (
    menu_id INT PRIMARY KEY IDENTITY(1,1),
    event_id INT FOREIGN KEY REFERENCES Events(event_id),
    menu_name NVARCHAR(200) NOT NULL,
    menu_type NVARCHAR(100) NOT NULL, -- 'Vegetarian', 'Non-Vegetarian', 'Vegan'
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_Menu_Event FOREIGN KEY (event_id) REFERENCES Events(event_id)
);

-- Menu Dishes Table
CREATE TABLE Menu_Dishes (
    dish_id INT PRIMARY KEY IDENTITY(1,1),
    menu_id INT FOREIGN KEY REFERENCES Event_Menus(menu_id),
    dish_name NVARCHAR(200) NOT NULL,
    description TEXT,
    dietary_info NVARCHAR(100),
    CONSTRAINT FK_Dish_Menu FOREIGN KEY (menu_id) REFERENCES Event_Menus(menu_id)
);

-- Registration Table
CREATE TABLE Registrations (
    registration_id INT PRIMARY KEY IDENTITY(1,1),
    event_id INT FOREIGN KEY REFERENCES Events(event_id),
    full_name NVARCHAR(200) NOT NULL,
    email NVARCHAR(200) NOT NULL,
    phone NVARCHAR(20),
    registration_date DATETIME DEFAULT GETDATE(),
    selected_menu_id INT FOREIGN KEY REFERENCES Event_Menus(menu_id),
    special_requests TEXT,
    payment_status NVARCHAR(50) DEFAULT 'Pending',
    total_amount DECIMAL(10,2),
    CONSTRAINT FK_Registration_Event FOREIGN KEY (event_id) REFERENCES Events(event_id)
);

-- Opportunities/Volunteer Positions
CREATE TABLE Opportunities (
    opportunity_id INT PRIMARY KEY IDENTITY(1,1),
    event_id INT FOREIGN KEY REFERENCES Events(event_id),
    position_name NVARCHAR(200) NOT NULL,
    description TEXT,
    requirements TEXT,
    slots_available INT NOT NULL,
    filled_slots INT DEFAULT 0
);