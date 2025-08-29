# 🧠 BrainPower Exchange

The world's first reverse marketplace where problem solvers bid on tasks. Convert your unused brainpower into crypto rewards.

## 🚀 Features

- **Reverse Marketplace**: Problem solvers bid on tasks instead of task owners hiring
- **Crypto Integration**: Built-in cryptocurrency payment system
- **User Authentication**: Secure email/password authentication
- **Task Management**: Create, bid on, and manage tasks
- **Real-time Updates**: Live task updates and bid notifications
- **Futuristic UI**: Modern, minimalist design with purple and gold theme

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/brainpower-exchange.git
cd brainpower-exchange
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Set up the database
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL from `supabase/init.sql`

### 5. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🗄️ Database Schema

### Tables
- **profiles**: User profiles with brainpower ratings and earnings
- **tasks**: Task listings with complexity levels and budgets
- **bids**: Solver bids on tasks
- **task_assignments**: Task assignments and completion tracking
- **transactions**: Crypto payment transactions

### Key Features
- Row Level Security (RLS) for data protection
- Automatic user profile creation
- Task status management
- Bid acceptance workflows

## 🎨 Design System

### Colors
- **Primary**: Purple (#8B5CF6) with grey undertones
- **Secondary**: Purple (#A855F7)
- **Accent**: Flamboyant Gold (#F59E0B)
- **Background**: Dark grey gradient

### Theme
- Futuristic and minimalist
- Glassmorphism effects
- Gradient overlays
- Smooth animations

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
└── types/              # TypeScript type definitions
```

### Key Components
- `CreateTask`: Task creation modal
- `Auth`: Authentication modal
- `TaskCard`: Individual task display
- `BidForm`: Bidding interface

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to add the same environment variables in your Vercel project settings.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🧠 About BrainPower Exchange

BrainPower Exchange is a revolutionary platform that flips the traditional freelance model on its head. Instead of task owners hiring workers, problem solvers bid on tasks they want to solve. This creates a more dynamic and competitive marketplace where brainpower is the currency.

### How it Works
1. **Task Creation**: Users post tasks they need help with
2. **Bidding**: Problem solvers bid on tasks they can solve
3. **Selection**: Task owners choose the best bid
4. **Completion**: Solvers complete the task and receive crypto rewards
5. **Payment**: Secure cryptocurrency transactions

### Use Cases
- Programming and automation tasks
- Creative design projects
- Research and analysis
- Consulting and advice
- Technical problem solving

---

Built with ❤️ and 🧠 for the future of work.
