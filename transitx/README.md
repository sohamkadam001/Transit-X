# 🚉 TransitX – Mumbai's Smart QR Transit System

**TransitX** is a high-performance full-stack web application designed to modernize Mumbai’s local train ticketing experience. Built for the modern commuter, it allows users to generate secure, encrypted QR tickets with real-time balance management and a premium "Digital Pass" interface.

![TransitX Dashboard Preview](https://via.placeholder.com/800x450/09090b/f2a238?text=TransitX+Secure+Ticketing+System)

## ✨ Key Features

-   **Instant QR Generation:** Encrypted transit passes generated in milliseconds using a custom station-to-station routing logic.
-   **Dynamic Wallet System:** Real-time balance tracking and automated fare deduction based on journey distance.
-   **Holographic Ticket UI:** A premium, animated horizontal transit pass featuring "Scanning Laser" effects and security timestamps.
-   **Journey History:** A dedicated slide-over panel to track active and expired tickets.
-   **Security First:** JWT-based authentication with protected API routes and secure Prisma database integration.
-   **Dark Mode Optimized:** Designed specifically for high-DPI displays (like the MacBook M4) with a sleek Zinc & Amber aesthetic.

## 🚀 Tech Stack

-   **Frontend:** [Next.js 14](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
-   **Backend:** Next.js Serverless Functions, [JWT](https://jwt.io/) for Auth
-   **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
-   **Icons:** [Lucide React](https://lucide.dev/)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/sohamkadam001/Transit-X.git](https://github.com/sohamkadam001/Transit-X.git)
   cd Transit-X