 [Skill-Bridge](https://skill-bridg.vercel.app/)

## Description

Skill-Bridge is an online platform developed to connect clients and freelancers, enabling them to collaborate on projects and grow their businesses.

## Features

- User authentication and authorization using email password and google auth (nextAuth)
- Profile creation and management for clients and freelancers based on their choice if they want to work or hire people
- Project posting and bidding system
- Messaging system for communication between clients and freelancers implemented using websockets
- Clients can accept the proposals of freelancers and when work is completed they can update from their side with review rating system and money will be transferred
- Real-time dashboard for both freelancers and clients based on their usertype to see and manage everything
- Clients can see all freelancers profile and their portfolios
- Freelancers can see all job postings and client details and bid their proposals with cover letter as per job requirements

## Sample .env File

```properties
# Database connection
DATABASE_URL="postgresql://<username>:<password>@<host>/<database>?sslmode=require"

# NextAuth configuration
NEXT_AUTH_URL="http://localhost:3000"
NEXT_AUTH_SECRET="<your-next-auth-secret>"

# WebSocket URL
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"

# Google OAuth credentials
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL="http://localhost:3000"

```

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/nikhilsahni7/Skill-Bridge.git
   ```

2. Navigate to the project directory:
   ```sh
   cd my-app
   ```
3. Install dependencies using Bun:

   ```sh
   bun install
   ```

## Usage

1. Start the application:
   ```sh
   bun next dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Prerequisites

- [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://shadcn.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```sh
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```sh
   git push origin feature-branch
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Bun](https://bun.sh/) - JavaScript runtime
- [NextAuth](https://authjs.dev/getting-started/migrating-to-v5) - Auth library
- [Prisma](https://www.prisma.io/) - ORM for Node.js and TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Next.js](https://nextjs.org/) - React framework
- [Shadcn UI](https://shadcn.dev/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - Real-time communication
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
