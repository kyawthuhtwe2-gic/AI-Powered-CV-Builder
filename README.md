# AI-Powered CV Builder

The **AI-Powered CV Builder** is a modern full-stack SaaS application that enables users to generate professional resumes using artificial intelligence. It provides dynamic form-based CV creation, real-time preview, multiple templates, and AI-assisted content generation.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- OAuth2 login (Google)
- JWT-based stateless authentication
- Role/permission-based access control

### 🧾 CV Builder Engine
- Dynamic form-based CV creation
- Sections:
  - Personal Information
  - Education
  - Work Experience
  - Skills
  - Projects
- Real-time preview updates

### 🤖 AI-Powered Content Engine
- Generate professional CV summaries
- Suggest skills based on job title
- Enhance work experience descriptions
- Improve job keyword optimization

### 🎨 Template System
- Modern (tech-focused design)
- Minimal (clean whitespace layout)
- Corporate (formal structured layout)
- Creative (bold and colorful design)
- JSON-based dynamic template rendering

### 📁 File Upload System
- Profile image upload
- File validation & security checks
- Secure storage handling

---

## 🏗️ Tech Stack

### Backend
- Java 17+
- Spring Boot
- Spring Security (OAuth2 + JWT)
- Spring Data JPA
- MySQL
- Maven / Gradle

### Frontend
- React.js
- Axios
- React Hook Form
- TailwindCSS / Material UI
- React Router

### AI
- OpenAI API (GPT-based CV generation)

### DevOps
- Docker
- Docker Compose

---

## 🧱 System Architecture

- React Frontend (UI Layer)
- Spring Boot Backend (API Layer)
- Authentication Layer (OAuth2 + JWT)
- MySQL Database Layer
- AI Service Layer (OpenAI Integration)

---

## 📦 Project Structure

```
/frontend   → React application
/backend    → Spring Boot application
/docker     → Docker configuration
```

---

## 🐳 Docker Setup

### Services

#### 🗄️ MySQL Database
- Image: `mysql:8.0`
- Container: `cv_mysql`
- Port: `3307 → 3306`
- Persistent volume: `mysql_data`

#### ⚙️ Backend (Spring Boot)
- Container: `cv_backend`
- Port: `8080`
- Connects to MySQL via Docker network

#### 🌐 Frontend (React)
- Container: `cv_frontend`
- Port: `3000 → 5173`

---

## 📄 Docker Compose

```yaml
version: "3.8"

services:

  db:
    image: mysql:8.0
    container_name: cv_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ai_powered_cv_builder_db
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    container_name: cv_backend
    restart: always
    ports:
      - "8080:8080"
    depends_on:
      - db
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/ai_powered_cv_builder_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SERVER_ADDRESS: 0.0.0.0

  frontend:
    build: ./frontend
    container_name: cv_frontend
    restart: always
    ports:
      - "3000:5173"
    depends_on:
      - backend

volumes:
  mysql_data:
```

---

## 🔄 System Flow

React → Spring Boot → MySQL / OpenAI

---

## 📌 Key Concepts

- Microservice-style architecture
- Containerized deployment
- Scalable modular backend
- AI-powered content generation
- Real-time UI updates

---

## 🏁 Conclusion

The AI-Powered CV Builder is a scalable, production-ready SaaS platform that combines AI intelligence with modern web technologies to simplify and enhance resume creation.
```