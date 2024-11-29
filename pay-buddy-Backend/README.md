# Pay-Buddy Backend 💰

A robust backend service for the Pay-Buddy payment and bussiness processing platform.

## 🚀 Tech Stack

### Core Technologies
- 🟢 **Runtime**: Node.js
- ⚡ **Framework**: Express.js
- 📘 **Language**: TypeScript
- 🗄️ **Database**: MongoDB
- 🔄 **Caching**: Redis
- 🎯 **API Style**: GraphQL (Apollo Server) & REST
- 🔐 **Authentication**: JWT & Cookie-based
- 📧 **Email Service**: Nodemailer

### Key Dependencies
- 🎨 **GraphQL**: Apollo Server Express, GraphQL
- 📦 **Database**: Mongoose, MongoDB driver
- 🔒 **Security**: bcrypt, jsonwebtoken
- 🛠️ **Utilities**: compression, cors, cookie-parser, dotenv
- 🔧 **Development**: nodemon, typescript

## 🏗️ Project Structure

pay-buddy-Backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── db/              # Database models and operations
│   ├── graphQL/         # GraphQL schemas and resolvers
│   ├── helpers/         # Utility functions
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   └── index.ts         # Application entry point

## 🌟 Features

### 1. Authentication System
- 👤 User registration
- 🔑 Secure login with session management
- 🍪 Cookie-based authentication
- 🔒 Password encryption using bcrypt
- 🎟️ Session token management

### 2. GraphQL API
- 🔍 Queries for user data and transactions
- ✏️ Mutations for data manipulation
- 🔄 Real-time updates
- 🛡️ Authentication middleware

### 3. Database Operations
- 📝 CRUD operations for users
- 💳 Transaction management
- 📊 Activity logging
- 🔄 Data synchronization

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/EmmanuelKandadev/pay-buddy-Backend.git
```

2. Install dependencies:
```bash
cd pay-buddy-Backend
npm install
```

3. Set up environment variables:
```bash
cp example.env .env
```

4. Start the development server:
```bash
npm run dev
```

## 🐳 Docker Support

Run the application using Docker:

```bash
# Build and start containers
npm run docker:build
npm run docker:up

# Stop containers
npm run docker:down

# View logs
npm run docker:logs
```

## 📚 API Documentation

### GraphQL Endpoints

#### Queries
- `getUserById`: Get user by ID
- `getUserByEmail`: Get user by email
- `getTempDataTwo`: Get transaction data
- `getAllActivity`: Get activity log

#### Mutations
- `register`: User registration
- `login`: User authentication
- `updateUser`: Update user details
- `insertNewTransaction`: Create transaction

## 🔒 Security Features

- ✅ JWT Authentication
- 🔐 Password Hashing
- 🍪 Secure Cookie Management
- 🛡️ CORS Protection
- 🔄 Rate Limiting

## 🧪 Development

### Available Scripts

```json
{
  "start": "nodemon",
  "dev": "nodemon index.ts",
  "docker:build": "docker-compose build",
  "docker:up": "docker-compose up -d",
  "docker:down": "docker-compose down"
}
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the ISC License.

## 👥 Authors

- Emmanuel Kanda - *Initial work*


