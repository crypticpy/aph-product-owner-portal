# APH Product Owner Portal - Adaptive Micro-Learning Experience

A personalized, micro-learning platform for onboarding new Product Owners at Austin Public Health. Features adaptive learning paths based on user experience, bite-sized 5-minute modules, progress tracking, and interactive quizzes.

---

## 🎯 Key Features

### ✨ Personalized Learning Paths
- **Assessment on first visit** determines user's experience level, governance tier, and time availability
- **Three adaptive tracks**:
  - **Express** (8 modules, ~2 hours) - For experienced POs with simple products
  - **Standard** (20 modules, ~6 hours) - For new POs with moderate complexity
  - **Comprehensive** (34 modules, ~10 hours) - For new POs with complex products

### 📚 Micro-Learning Modules
- **5-minute lessons** that fit into busy schedules
- **Rich content** with headings, lists, examples, and pro tips
- **Interactive quizzes** with immediate feedback
- **Progress tracking** with visual indicators
- **Bookmarking** for modules to review later

### 📊 Progress Dashboard
- **Circular progress visualization** showing completion percentage
- **Statistics**: modules completed, time spent, bookmarked items
- **"Up Next"** preview of upcoming modules
- **Achievement celebration** when path completed

### 🎨 Modern, Accessible Design
- **APH brand compliance** with official colors and guidelines
- **WCAG 2.2 AA accessible** with proper contrast and keyboard navigation
- **Mobile-optimized** responsive design
- **Fluent UI** components and icons (SharePoint-compatible)

### 💾 Persistent Progress
- **localStorage** saves all progress locally
- **Resumable experience** - pick up where you left off
- **Cross-session** tracking of completed modules

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Navigate to project directory
cd aph-product-owner-portal

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Visit **http://localhost:5173** in your browser.

### Build for Production

```bash
# Build optimized production bundle
pnpm run build

# Preview production build locally
pnpm run preview
```

---

## 📖 User Journey

### First-Time User Experience

1. **Welcome Screen**: Assessment introduction
2. **3-Question Assessment** (30 seconds):
   - Experience level
   - Governance tier
   - Time availability
3. **Personalized Path Assigned**: Algorithm determines best fit
4. **Dashboard**: Shows progress and next steps
5. **Module Learning**: Rich content + quizzes
6. **Return Visits**: Automatic resume from last position

---

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18.3.1 + TypeScript 5.6.3
- **Build Tool**: Vite 6.2.6
- **UI Library**: Fluent UI v8.120.8 (SharePoint-compatible)
- **Icons**: Fluent UI React Icons 2.0.314 (bundled, no CDN)
- **Styling**: Tailwind CSS 3.4.16 + Custom CSS
- **Markdown**: markdown-to-jsx 8.0.0
- **Storage**: localStorage (converts to SharePoint Lists for deployment)

### Project Structure

```
src/
├── components/
│   ├── Assessment.tsx       # 3-step assessment
│   ├── Dashboard.tsx        # Progress dashboard
│   └── ModuleView.tsx       # Module display + quiz
├── types.ts                 # TypeScript definitions
├── moduleData.ts            # 34 learning modules
├── utils/storage.ts         # localStorage helpers
├── App.tsx                  # Main router
└── index.css                # APH design system
```

---

## 🎨 Design System

### APH Brand Colors

```css
--color-primary: #009F4D;      /* APH Green */
--color-brand-blue: #44499C;   /* APH Blue */
--color-text: #22254E;         /* Dark Blue */
--color-bg: #F7F6F5;           /* Faded White */
```

### Accessibility

- ✅ 4.5:1 contrast ratio
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Screen reader compatible

---

## 📚 Module Content (34 Total)

- **Day 1 Essentials** (5 modules)
- **Week 1: Foundation** (4 modules)
- **Week 2: Analysis** (5 modules)
- **Week 3-4: Planning** (3 modules)
- **Express Track** (1 module)

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### SharePoint Deployment

See **[SHAREPOINT_DEPLOYMENT_GUIDE.md](./SHAREPOINT_DEPLOYMENT_GUIDE.md)** for step-by-step instructions on deploying to SharePoint Online with GCC compliance.

---

## 🔧 Configuration

### Adding New Modules

Edit `src/moduleData.ts`:

```typescript
{
  id: 'your-module-id',
  title: 'Module Title',
  duration: 5,
  category: 'week1',
  priority: 'high',
  learningPaths: ['standard', 'comprehensive'],
  content: `# Your Content Here`,
  checkQuestion: { /* optional quiz */ }
}
```

### Customizing Learning Paths

Modify `src/App.tsx` → `determineLearningPath()` function.

---

## 📊 Analytics

Track progress locally via localStorage:
- Modules completed
- Time spent
- Bookmarked modules
- Last visit date

Export data:
```typescript
export function exportUserData() {
  // See utils/storage.ts
}
```

---

## 🤝 Contributing

1. Create feature branch
2. Make changes and test
3. Run `pnpm run build`
4. Commit and push
5. Create pull request

---

## 💬 Support

- **Email**: governance@aph.gov
- **Office Hours**: Tuesdays 2-3 PM
- **Community**: #product-owner-community

---

## 📌 Version History

### v2.0.0 (January 2025) - Adaptive Micro-Learning
- ✨ Personalized learning paths
- ✨ 34 micro-learning modules
- ✨ Interactive quizzes
- ✨ Progress dashboard
- ✨ Mobile optimization
- 📖 SharePoint migration guide

### v1.0.0 (July 2024) - Initial Launch
- 📄 Static content pages
- 📋 Resources and checklists

---

**Built with ❤️ for Austin Public Health Product Owners**
