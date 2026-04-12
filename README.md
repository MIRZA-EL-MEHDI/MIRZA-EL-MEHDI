# OperationCRM & ERP

A modern, multi-enterprise CRM & ERP platform built for simplicity and power. Manage multiple companies from a single interface with an intuitive UI that outshines legacy solutions.

## Features

### Multi-Enterprise Management
- Switch between enterprises instantly from the header
- Role-based access control (Owner, Admin, Member, Viewer)
- Create and manage unlimited enterprises

### CRM Module
- **Contacts** - Manage customers, suppliers, and partners with full details
- **Leads** - Track sales opportunities with value, probability, and source
- **Pipeline** - Visual Kanban board showing deals by stage (New to Won/Lost)

### Sales & Invoicing
- **Orders** - Create and track sales orders with auto-generated order numbers
- **Invoices** - Professional invoicing with status tracking (Draft to Paid)

### Inventory Management
- **Products** - Full product catalog with SKU, pricing, stock levels, and low-stock alerts
- **Warehouses** - Track storage locations with capacity visualization

### HR & Employee Management
- **Employees** - Team directory with position, salary, and department info
- **Departments** - Organizational structure with budget tracking

### Dashboard & Analytics
- Real-time KPI cards (Contacts, Leads, Revenue, Orders, Products, Employees)
- Sales pipeline breakdown with deal counts
- Recent leads and orders at a glance
- Comprehensive analytics with conversion rates and performance indicators

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | SQLite (via Prisma ORM) - easily swappable to PostgreSQL |
| **Auth** | NextAuth.js with JWT strategy |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Validation** | Zod + React Hook Form |

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MIRZA-EL-MEHDI/MIRZA-EL-MEHDI.git
cd MIRZA-EL-MEHDI

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Set up database (generate client, push schema, seed data)
npm run setup

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials
```
Email:    demo@operationcrm.com
Password: demo123
```

The demo account comes with two pre-configured enterprises (**Acme Corporation** and **Globex International**) with sample data across all modules.

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login & Registration pages
│   ├── (dashboard)/         # Main app pages
│   │   ├── dashboard/       # Overview dashboard
│   │   ├── crm/             # Contacts, Leads, Pipeline
│   │   ├── sales/           # Orders, Invoices
│   │   ├── inventory/       # Products, Warehouses
│   │   ├── hr/              # Employees, Departments
│   │   ├── analytics/       # Business intelligence
│   │   └── settings/        # App & enterprise settings
│   └── api/                 # REST API routes
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Sidebar, Header, Enterprise Switcher
│   └── providers.tsx        # Auth & Enterprise context
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── prisma.ts            # Database client
│   └── utils.ts             # Utility functions
└── types/
prisma/
├── schema.prisma            # Database schema (16 models)
└── seed.ts                  # Demo data seeder
```

## Database Models

The Prisma schema includes **16 models** with full relational support:

- `Enterprise` - Multi-tenant company management
- `User` / `EnterpriseMember` - Authentication & RBAC
- `Contact` - CRM contact management
- `Lead` - Sales pipeline tracking
- `Category` / `Product` - Product catalog
- `Warehouse` / `StockEntry` - Inventory management
- `Order` / `OrderItem` - Sales orders
- `Invoice` / `InvoiceItem` - Invoicing
- `Department` / `Employee` - HR management
- `LeaveRequest` - Time-off tracking

## Switching to PostgreSQL

Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/operationcrm"
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npx prisma db push
npm run db:seed
```

## License

MIT
