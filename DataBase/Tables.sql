use balance;
-- إنشاء الجداول الرئيسية بالترتيب الصحيح --
CREATE TABLE video_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE music_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE article_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES article_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    date_of_birth DATE NOT NULL,
    profile_image VARCHAR(255) DEFAULT 'default_profile.jpg',
    certificate VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL COMMENT 'مثال: دكتور، أستاذ، أخصائي',
    specialization VARCHAR(255) NOT NULL,
    sub_specialization TEXT COMMENT 'التخصصات الدقيقة',
    bio TEXT NOT NULL,
    experience_years INT NOT NULL,
    languages TEXT NOT NULL COMMENT 'اللغات المتحدث بها مفصولة بفواصل',
    rating DECIMAL(3,1) DEFAULT 0.0,
    reviews_count INT DEFAULT 0,
    patients_count INT DEFAULT 0,
    publications_count INT DEFAULT 0,
    consultation_fee DECIMAL(10,2) NOT NULL,
    available_days VARCHAR(100) NOT NULL COMMENT 'أيام العمل مفصولة بفواصل',
    working_hours VARCHAR(100),
    emergency_available BOOLEAN DEFAULT FALSE,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    online_consultation BOOLEAN DEFAULT TRUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    website VARCHAR(255),
    social_media_links JSON COMMENT 'روابط السوشيال ميديا بتنسيق JSON',
    awards TEXT COMMENT 'الجوائز والتكريمات',
    research_interests TEXT,
    professional_memberships TEXT COMMENT 'العضويات في الجمعيات المهنية',
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    age INT,
    gender ENUM('male', 'female', 'other'),
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    bio TEXT,
    role ENUM('user', 'doctor', 'admin', 'content_creator') NOT NULL DEFAULT 'user',
    doctor_id INT,
    profile_picture VARCHAR(255) DEFAULT 'default_profile.jpg',
    last_login DATETIME,
    registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    treatment_plan TEXT,
    notes TEXT,
    relationship_type ENUM('therapy', 'consultation', 'followup'),
    last_session_date DATE,
    next_session_date DATE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_doctor_patient (doctor_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE doctor_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    featured_image VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    dislike_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    post_url VARCHAR(512) NOT NULL UNIQUE, -- تغيير من TEXT إلى VARCHAR
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;