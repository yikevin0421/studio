# **App Name**: Daegu Pulse

## Core Features:

- Institutional Google SSO: Restricted authentication system requiring '@daegu.ac.kr' email validation to ensure a secure, student-only environment.
- Live Student Square: A real-time community feed where students can publish posts, upload images via Firebase Storage, and interact through a like/dislike system.
- AI Content Guardian: An AI-powered moderation tool that uses reasoning to analyze community sentiment and automatically flags potentially toxic or inappropriate content for review.
- Academic Persistence Layer: Comprehensive Firestore implementation to save user progress, bookmarks, and detailed student profiles across sessions.
- Role-Based Command Center: An admin dashboard providing specific tooling for moderators to pin announcements and manage reports for maintainting campus digital hygiene.
- Unified Notification Engine: Instant notifications for student interactions such as post likes and comment replies, ensuring continuous community engagement.
- Student Success Dashboard: A personalized landing page displaying high-engagement trending posts and personal activity metrics.

## Style Guidelines:

- Primary Color: Scholar Indigo (#0d3381) reflecting trust and institutional heritage.
- Background Color: Alpine Frost (#f6f7fa) - a crisp, slightly cool light-themed canvas.
- Accent Color: Knowledge Purple (#4d0d81) used for CTAs and highlights, providing distinct visual contrast to the primary brand color.
- Main Typeface: 'Inter', chosen for its neutral, machined, and highly legible appearance across varied dashboard data densities.
- Linear and minimalist icon set with consistent line weights, emphasizing a modern professional aesthetic.
- Dual-navigation structure featuring a persistence sidebar on desktop and a high-accessibility bottom tab bar for mobile users.
- Context-aware transitions including skeleton loading states for feed items and subtle elevation changes on post hover.