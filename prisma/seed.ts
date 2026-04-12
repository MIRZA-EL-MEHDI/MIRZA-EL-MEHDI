import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const password = await hash("demo123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@operationcrm.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@operationcrm.com",
      password,
    },
  });

  // Create enterprises
  const enterprise1 = await prisma.enterprise.upsert({
    where: { slug: "acme-corp" },
    update: {},
    create: {
      name: "Acme Corporation",
      slug: "acme-corp",
      email: "info@acme.com",
      phone: "+1 555-0100",
      address: "123 Business Ave, New York, NY 10001",
      currency: "USD",
      website: "https://acme.com",
    },
  });

  const enterprise2 = await prisma.enterprise.upsert({
    where: { slug: "globex-inc" },
    update: {},
    create: {
      name: "Globex International",
      slug: "globex-inc",
      email: "hello@globex.com",
      phone: "+44 20 7946 0958",
      address: "456 Commerce St, London, UK",
      currency: "EUR",
      website: "https://globex.com",
    },
  });

  // Add user to both enterprises
  await prisma.enterpriseMember.upsert({
    where: { userId_enterpriseId: { userId: user.id, enterpriseId: enterprise1.id } },
    update: {},
    create: { userId: user.id, enterpriseId: enterprise1.id, role: "owner" },
  });

  await prisma.enterpriseMember.upsert({
    where: { userId_enterpriseId: { userId: user.id, enterpriseId: enterprise2.id } },
    update: {},
    create: { userId: user.id, enterpriseId: enterprise2.id, role: "admin" },
  });

  // Seed Acme Corp data
  // Contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: { firstName: "Sarah", lastName: "Johnson", email: "sarah@techventures.com", phone: "+1 555-0101", company: "TechVentures", position: "CTO", city: "San Francisco", country: "USA", type: "customer", enterpriseId: enterprise1.id },
    }),
    prisma.contact.create({
      data: { firstName: "Michael", lastName: "Chen", email: "m.chen@innovate.io", phone: "+1 555-0102", company: "Innovate.io", position: "VP Engineering", city: "Austin", country: "USA", type: "customer", enterpriseId: enterprise1.id },
    }),
    prisma.contact.create({
      data: { firstName: "Emily", lastName: "Williams", email: "emily@supplychainco.com", phone: "+1 555-0103", company: "SupplyChain Co", position: "Procurement Manager", city: "Chicago", country: "USA", type: "supplier", enterpriseId: enterprise1.id },
    }),
    prisma.contact.create({
      data: { firstName: "James", lastName: "Brown", email: "james@partnergroup.com", phone: "+1 555-0104", company: "Partner Group", position: "CEO", city: "Boston", country: "USA", type: "partner", enterpriseId: enterprise1.id },
    }),
    prisma.contact.create({
      data: { firstName: "Lisa", lastName: "Davis", email: "lisa@retailmax.com", phone: "+1 555-0105", company: "RetailMax", position: "Buyer", city: "Miami", country: "USA", type: "customer", enterpriseId: enterprise1.id },
    }),
  ]);

  // Leads
  await Promise.all([
    prisma.lead.create({
      data: { title: "Enterprise SaaS Platform", value: 150000, stage: "negotiation", probability: 75, source: "referral", contactId: contacts[0].id, enterpriseId: enterprise1.id },
    }),
    prisma.lead.create({
      data: { title: "Mobile App Development", value: 85000, stage: "proposal", probability: 50, source: "website", contactId: contacts[1].id, enterpriseId: enterprise1.id },
    }),
    prisma.lead.create({
      data: { title: "Cloud Migration Project", value: 200000, stage: "qualified", probability: 30, source: "cold-call", enterpriseId: enterprise1.id },
    }),
    prisma.lead.create({
      data: { title: "Data Analytics Dashboard", value: 65000, stage: "new", probability: 10, source: "social-media", enterpriseId: enterprise1.id },
    }),
    prisma.lead.create({
      data: { title: "API Integration Suite", value: 120000, stage: "won", probability: 100, source: "referral", contactId: contacts[3].id, enterpriseId: enterprise1.id },
    }),
    prisma.lead.create({
      data: { title: "E-commerce Platform Revamp", value: 95000, stage: "proposal", probability: 60, source: "advertisement", contactId: contacts[4].id, enterpriseId: enterprise1.id },
    }),
    prisma.lead.create({
      data: { title: "Legacy System Modernization", value: 300000, stage: "qualified", probability: 25, source: "cold-call", enterpriseId: enterprise1.id },
    }),
    prisma.lead.create({
      data: { title: "Cybersecurity Audit", value: 45000, stage: "lost", probability: 0, source: "website", enterpriseId: enterprise1.id },
    }),
  ]);

  // Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Software", color: "#6366f1", enterpriseId: enterprise1.id } }),
    prisma.category.create({ data: { name: "Hardware", color: "#f59e0b", enterpriseId: enterprise1.id } }),
    prisma.category.create({ data: { name: "Services", color: "#10b981", enterpriseId: enterprise1.id } }),
  ]);

  // Products
  await Promise.all([
    prisma.product.create({ data: { name: "Enterprise License", sku: "SW-001", description: "Annual enterprise software license", price: 9999, cost: 2000, quantity: 999, minStock: 10, unit: "pcs", categoryId: categories[0].id, enterpriseId: enterprise1.id } }),
    prisma.product.create({ data: { name: "Pro Workstation", sku: "HW-001", description: "High-performance workstation", price: 2499, cost: 1800, quantity: 45, minStock: 10, unit: "pcs", categoryId: categories[1].id, enterpriseId: enterprise1.id } }),
    prisma.product.create({ data: { name: "Cloud Hosting (Monthly)", sku: "SV-001", description: "Managed cloud hosting service", price: 299, cost: 100, quantity: 500, minStock: 50, unit: "pcs", categoryId: categories[2].id, enterpriseId: enterprise1.id } }),
    prisma.product.create({ data: { name: "Security Suite", sku: "SW-002", description: "Comprehensive security software", price: 1499, cost: 500, quantity: 200, minStock: 20, unit: "pcs", categoryId: categories[0].id, enterpriseId: enterprise1.id } }),
    prisma.product.create({ data: { name: "Network Switch 48-Port", sku: "HW-002", description: "Enterprise grade network switch", price: 899, cost: 600, quantity: 3, minStock: 5, unit: "pcs", status: "active", categoryId: categories[1].id, enterpriseId: enterprise1.id } }),
  ]);

  // Orders
  await Promise.all([
    prisma.order.create({
      data: { orderNumber: "ORD-2024001", status: "delivered", subtotal: 29997, tax: 2999.70, total: 32996.70, contactId: contacts[0].id, enterpriseId: enterprise1.id },
    }),
    prisma.order.create({
      data: { orderNumber: "ORD-2024002", status: "shipped", subtotal: 4998, tax: 499.80, total: 5497.80, contactId: contacts[1].id, enterpriseId: enterprise1.id },
    }),
    prisma.order.create({
      data: { orderNumber: "ORD-2024003", status: "confirmed", subtotal: 1497, tax: 149.70, total: 1646.70, contactId: contacts[4].id, enterpriseId: enterprise1.id },
    }),
    prisma.order.create({
      data: { orderNumber: "ORD-2024004", status: "draft", subtotal: 899, tax: 89.90, total: 988.90, enterpriseId: enterprise1.id },
    }),
  ]);

  // Invoices
  await Promise.all([
    prisma.invoice.create({
      data: { invoiceNumber: "INV-2024001", status: "paid", subtotal: 29997, tax: 2999.70, total: 32996.70, contactId: contacts[0].id, enterpriseId: enterprise1.id, paidDate: new Date() },
    }),
    prisma.invoice.create({
      data: { invoiceNumber: "INV-2024002", status: "sent", subtotal: 4998, tax: 499.80, total: 5497.80, contactId: contacts[1].id, enterpriseId: enterprise1.id, dueDate: new Date(Date.now() + 30 * 86400000) },
    }),
    prisma.invoice.create({
      data: { invoiceNumber: "INV-2024003", status: "overdue", subtotal: 1497, tax: 149.70, total: 1646.70, contactId: contacts[4].id, enterpriseId: enterprise1.id, dueDate: new Date(Date.now() - 10 * 86400000) },
    }),
    prisma.invoice.create({
      data: { invoiceNumber: "INV-2024004", status: "draft", subtotal: 899, tax: 89.90, total: 988.90, enterpriseId: enterprise1.id },
    }),
  ]);

  // Departments
  const departments = await Promise.all([
    prisma.department.create({ data: { name: "Engineering", description: "Software development and infrastructure", budget: 500000, enterpriseId: enterprise1.id } }),
    prisma.department.create({ data: { name: "Sales", description: "Revenue generation and client relations", budget: 300000, enterpriseId: enterprise1.id } }),
    prisma.department.create({ data: { name: "Marketing", description: "Brand, growth, and communications", budget: 200000, enterpriseId: enterprise1.id } }),
    prisma.department.create({ data: { name: "HR", description: "Human resources and talent management", budget: 150000, enterpriseId: enterprise1.id } }),
  ]);

  // Employees
  await Promise.all([
    prisma.employee.create({ data: { firstName: "Alex", lastName: "Turner", email: "alex@acme.com", position: "Lead Developer", salary: 12000, departmentId: departments[0].id, enterpriseId: enterprise1.id } }),
    prisma.employee.create({ data: { firstName: "Maria", lastName: "Garcia", email: "maria@acme.com", position: "Frontend Developer", salary: 9500, departmentId: departments[0].id, enterpriseId: enterprise1.id } }),
    prisma.employee.create({ data: { firstName: "David", lastName: "Kim", email: "david@acme.com", position: "Sales Manager", salary: 10000, departmentId: departments[1].id, enterpriseId: enterprise1.id } }),
    prisma.employee.create({ data: { firstName: "Rachel", lastName: "Green", email: "rachel@acme.com", position: "Marketing Director", salary: 11000, departmentId: departments[2].id, enterpriseId: enterprise1.id } }),
    prisma.employee.create({ data: { firstName: "Tom", lastName: "Wilson", email: "tom@acme.com", position: "HR Manager", salary: 9000, departmentId: departments[3].id, enterpriseId: enterprise1.id } }),
    prisma.employee.create({ data: { firstName: "Sophia", lastName: "Lee", email: "sophia@acme.com", position: "Backend Developer", salary: 10500, departmentId: departments[0].id, enterpriseId: enterprise1.id } }),
    prisma.employee.create({ data: { firstName: "Ryan", lastName: "Martinez", email: "ryan@acme.com", position: "Sales Rep", salary: 7500, departmentId: departments[1].id, enterpriseId: enterprise1.id } }),
  ]);

  // Warehouses
  await Promise.all([
    prisma.warehouse.create({ data: { name: "Main Warehouse", address: "100 Warehouse Blvd", city: "New York", country: "USA", capacity: 10000, usedCapacity: 6500, enterpriseId: enterprise1.id } }),
    prisma.warehouse.create({ data: { name: "West Coast Hub", address: "200 Logistics Way", city: "Los Angeles", country: "USA", capacity: 8000, usedCapacity: 3200, enterpriseId: enterprise1.id } }),
  ]);

  // Seed Globex data (enterprise2) - smaller dataset
  await prisma.contact.create({
    data: { firstName: "Hans", lastName: "Mueller", email: "hans@eurotrade.de", phone: "+49 30 1234567", company: "EuroTrade", position: "Director", city: "Berlin", country: "Germany", type: "customer", enterpriseId: enterprise2.id },
  });

  await prisma.lead.create({
    data: { title: "European Distribution Deal", value: 250000, stage: "negotiation", probability: 65, source: "referral", enterpriseId: enterprise2.id },
  });

  await prisma.department.create({
    data: { name: "Operations", description: "International operations team", budget: 400000, enterpriseId: enterprise2.id },
  });

  console.log("Database seeded successfully!");
  console.log("\nDemo credentials:");
  console.log("  Email: demo@operationcrm.com");
  console.log("  Password: demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
