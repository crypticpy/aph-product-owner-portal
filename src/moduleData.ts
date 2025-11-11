import { Module } from './types';

// Micro-learning modules - 5 minutes each
export const modules: Module[] = [
  // DAY 1 ESSENTIALS - Broken into micro-modules
  {
    id: 'day1-registry-intro',
    title: 'What is the Product Registry?',
    description: 'Understand why product registration is essential',
    duration: 2,
    category: 'day1',
    priority: 'high',
    learningPaths: ['express', 'standard', 'comprehensive'],
    content: `
# What is the Product Registry?

The Product Registry is APH's central system for tracking all software products. Think of it as registering your car with the DMV - it's how we know your product exists and who's responsible for it.

## Why Register?

- ✅ **Visibility**: Leadership knows your product exists
- ✅ **Support**: Governance team can help you
- ✅ **Compliance**: Meet APH policy requirements
- ✅ **Resources**: Access templates, training, and guidance

## What Information is Needed?

- Product name and description
- Your contact information
- Primary users/stakeholders
- Current status (planning, active, sunset)

**Next**: You'll fill out the simple 5-minute form.
    `,
    checkQuestion: {
      question: 'Why is product registration important?',
      options: [
        'It\'s just bureaucracy',
        'It ensures visibility, support, and compliance',
        'Only for large products',
        'Optional for experienced POs'
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'day1-registry-complete',
    title: 'Complete Your Product Registry',
    description: 'Fill in basic product information',
    duration: 5,
    category: 'day1',
    priority: 'high',
    learningPaths: ['express', 'standard', 'comprehensive'],
    content: `
# Complete Your Product Registry

Ready to register your product! This takes about 5 minutes.

## Quick Tips:

1. **Product Name**: Use the official name
2. **Description**: Keep it to 2-3 sentences
3. **Users**: List primary user groups (e.g., "APH nurses", "Public residents")
4. **Status**: Be honest about current stage

## What You'll Need:

- ☐ Product name
- ☐ Brief description
- ☐ Your contact info
- ☐ Primary stakeholders
- ☐ Current development status

**Action**: Click the button below to access the registry form.

[Start Registry Form →](#registry-form)

💡 **Pro Tip**: Have this info ready and you'll finish in 3 minutes!
    `
  },
  {
    id: 'day1-roadmap-intro',
    title: 'Why You Need a Product Roadmap',
    description: 'Learn the purpose of roadmap planning',
    duration: 3,
    category: 'day1',
    priority: 'high',
    learningPaths: ['standard', 'comprehensive'],
    content: `
# Why You Need a Product Roadmap

A roadmap is your product's **strategic plan**. It shows where you're going and how you'll get there.

## What a Roadmap Does:

✅ **Aligns stakeholders** - Everyone sees the plan
✅ **Guides decisions** - Helps you prioritize
✅ **Shows progress** - Visual timeline of wins
✅ **Manages expectations** - Clear about what's coming

## What It's NOT:

❌ A detailed task list (that's your backlog)
❌ Set in stone (it evolves!)
❌ Just for you (it's a communication tool)

## Real Example:

**Q1**: Fix critical bugs + accessibility
**Q2**: Mobile app launch
**Q3**: User dashboard improvements
**Q4**: Analytics integration

See? High-level themes, not 100 tiny tasks.

**Next**: Download our pre-formatted template to get started.
    `,
    checkQuestion: {
      question: 'A product roadmap is:',
      options: [
        'A detailed task list with deadlines',
        'A strategic plan showing themes and direction',
        'Only for executives to see',
        'Created once and never changed'
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'day1-roadmap-download',
    title: 'Download & Customize Roadmap Template',
    description: 'Get your pre-formatted roadmap started',
    duration: 5,
    category: 'day1',
    priority: 'high',
    learningPaths: ['standard', 'comprehensive'],
    content: `
# Download & Customize Roadmap Template

Our template is pre-formatted and ready to use. Just fill in your product's specifics!

## What's Included:

📊 **Timeline View** - Quarters or months
🎯 **Theme Sections** - Organize by strategic goals
👥 **Stakeholder Notes** - Track who cares about what
📈 **Status Indicators** - On track, at risk, complete

## How to Use:

1. **Download** the Excel template below
2. **Add your product name** at the top
3. **Fill in Q1-Q2** to start (don't overthink it!)
4. **Share** with your manager for feedback

## Quick Start Tips:

- Start with 3-5 themes per quarter
- Use simple language (avoid jargon)
- Include "why" for each theme
- Update monthly

[Download Roadmap Template →](#download)

💡 **Time-Saver**: You can complete a draft in 15-20 minutes!
    `
  },
  {
    id: 'day1-office-hours',
    title: 'Schedule Your First Office Hours',
    description: 'Book consultation with governance team',
    duration: 3,
    category: 'day1',
    priority: 'medium',
    learningPaths: ['standard', 'comprehensive'],
    content: `
# Schedule Your First Office Hours

Get personalized guidance from the Product Governance team!

## What Are Office Hours?

Weekly 30-minute sessions where you can:

- ❓ Ask specific questions about your product
- 🤝 Get advice on stakeholder challenges
- 📋 Review your roadmap or registry
- 💡 Learn best practices from experts

## What to Expect:

- **Informal & helpful** - No judgment zone!
- **Your agenda** - Bring your questions
- **Actionable advice** - Leave with next steps
- **Optional** - Come when you need us

## When to Schedule:

🌟 **Recommended**: Within first week
⏰ **When**: Tuesdays 2-3 PM (virtual or in-person)
👥 **Capacity**: 20 participants max

## What to Bring:

- Your product registry confirmation
- Any questions about governance
- (Optional) Draft roadmap for feedback

[Schedule Office Hours →](#schedule)

💬 **New POs say**: "I wish I had done this sooner!"
    `
  },

  // WEEK 1 - Foundation modules
  {
    id: 'week1-role-overview',
    title: 'Your Role as a Product Owner',
    description: 'Core responsibilities and expectations',
    duration: 5,
    category: 'week1',
    priority: 'high',
    learningPaths: ['standard', 'comprehensive'],
    content: `
# Your Role as a Product Owner

You're the **bridge** between users, stakeholders, and the development team.

## Core Responsibilities:

### 1. Vision & Strategy (20% of your time)
- Define what success looks like
- Align product with APH goals
- Communicate the "why"

### 2. Prioritization (30% of your time)
- Decide what gets built first
- Balance stakeholder needs
- Say "no" when necessary

### 3. Communication (30% of your time)
- Keep stakeholders informed
- Represent user needs
- Report on progress

### 4. Collaboration (20% of your time)
- Work with dev team
- Attend key meetings
- Remove blockers

## You Are NOT:

❌ A project manager (someone else handles logistics)
❌ A designer (but you guide design decisions)
❌ A developer (but you understand technical constraints)

## Real-World Balance:

**Sarah, Registry PO**: "I spend mornings with stakeholders, afternoons with my dev team, and Fridays planning next month."

**Next**: Learn about governance tiers and what they mean for you.
    `,
    checkQuestion: {
      question: 'The Product Owner primarily:',
      options: [
        'Writes all the code',
        'Manages project schedules and tasks',
        'Defines vision and prioritizes work',
        'Only attends meetings'
      ],
      correctAnswer: 2
    }
  },
  {
    id: 'week1-governance-tiers',
    title: 'Understanding Governance Tiers',
    description: 'What tier is your product and why it matters',
    duration: 4,
    category: 'week1',
    priority: 'high',
    learningPaths: ['comprehensive'],
    content: `
# Understanding Governance Tiers

APH uses tiers to determine oversight level. Higher risk = more governance.

## Quick Decision Tree:

**Does your product handle PHI/PII?** → Yes: **Tier 1-2**

**Is it mission-critical (downtime = major impact)?** → Yes: **Tier 1-2**

**Large budget (>$50K/year)?** → Yes: **Tier 1-2**

**Everything else** → **Tier 3-4**

## What This Means for You:

### Tier 1-2 (High Governance)
- ✅ Quarterly reviews with leadership
- ✅ Formal change approval process
- ✅ Enhanced security requirements
- ✅ More support from governance team

### Tier 3-4 (Light Governance)
- ✅ Annual check-ins
- ✅ Streamlined approval process
- ✅ Standard security requirements
- ✅ Self-service resources

## Don't Know Your Tier?

No problem! The governance team will help you determine it during office hours or via the registry form.

**Pro Tip**: Most products start as Tier 3-4. As they grow, they may move up.

**Next**: Map your stakeholders so you know who to engage.
    `
  },
  {
    id: 'week1-stakeholder-mapping',
    title: 'Map Your Stakeholders',
    description: 'Identify and categorize key people',
    duration: 5,
    category: 'week1',
    priority: 'high',
    learningPaths: ['standard', 'comprehensive'],
    content: `
# Map Your Stakeholders

Not all stakeholders are equal. Let's identify who needs what level of attention.

## The Stakeholder Grid:

### High Influence + High Interest → **Manage Closely**
These are your VIPs!
- Weekly/bi-weekly updates
- Involve in major decisions
- Examples: Direct manager, program director

### High Influence + Low Interest → **Keep Satisfied**
Important but busy.
- Monthly summaries
- Alert for major changes only
- Examples: Division director, CFO

### Low Influence + High Interest → **Keep Informed**
Your champions!
- Regular updates (they'll love them)
- Great for feedback
- Examples: Power users, peer POs

### Low Influence + Low Interest → **Monitor**
Minimal communication.
- Quarterly or as-needed
- Examples: Tangential departments

## Your Action Item:

Create a simple list:

| Name | Role | Influence | Interest | Communication Plan |
|------|------|-----------|----------|-------------------|
| ... | ... | ... | ... | ... |

**Template Available**: Download our stakeholder mapping template.

[Download Stakeholder Template →](#template)

**Next**: Join the product owner community for peer support.
    `
  },
  {
    id: 'week1-community-join',
    title: 'Join the Product Owner Community',
    description: 'Connect with peers and get support',
    duration: 3,
    category: 'week1',
    priority: 'medium',
    learningPaths: ['standard', 'comprehensive'],
    content: `
# Join the Product Owner Community

You're not alone! APH has an active community of product owners.

## What You'll Get:

### 🗓️ Monthly Roundtables
- Share challenges and solutions
- Learn from experienced POs
- Virtual & in-person options

### 💬 Slack Workspace
- Quick questions answered fast
- Share resources and templates
- Casual conversations

### 📚 Resource Library
- Shared templates
- Case studies
- Best practices docs

## How to Join:

1. Fill out the community sign-up form
2. Get Slack invite within 24 hours
3. Attend next roundtable (see calendar)

## What Members Say:

**David, Permitting PO**: "I got answers in the Slack channel in under an hour. Game-changer!"

**Maria, Inspection PO**: "The roundtables helped me realize I wasn't behind - we all face similar challenges."

[Join Community →](#join)

**Bonus**: Current community has 35+ active product owners!
    `
  },

  // WEEK 2 - Analysis modules
  {
    id: 'week2-product-assessment-intro',
    title: 'Why Assess Your Product?',
    description: 'Understanding the assessment process',
    duration: 3,
    category: 'week2',
    priority: 'high',
    learningPaths: ['standard', 'comprehensive'],
    content: `
# Why Assess Your Product?

Before you plan where to go, you need to know where you are!

## The Product Assessment:

A structured way to understand your product's current state.

## What You'll Discover:

### 👥 Users
- Who uses your product?
- What are their primary goals?
- What frustrates them most?

### 📊 Metrics
- How many active users?
- What features are most used?
- Where do users get stuck?

### 🔧 Technical Health
- What's the tech stack?
- Any technical debt?
- Performance issues?

### 🎯 Business Value
- What problem does it solve?
- What's the ROI/impact?
- How does it support APH mission?

## Why This Matters:

You can't improve what you don't measure!

**Time Investment**: 3 hours total, broken into bite-sized tasks

**Next**: Start by identifying your users.
    `
  },
  {
    id: 'week2-identify-users',
    title: 'Who Are Your Users?',
    description: 'Identify and understand user groups',
    duration: 5,
    category: 'week2',
    priority: 'high',
    learningPaths: ['standard', 'comprehensive'],
    content: `
# Who Are Your Users?

Time to identify who actually uses your product!

## Exercise: User Inventory

**Grab a notepad** and answer these:

### Primary Users (use it daily/weekly)
- Job titles/roles:
- What they do with your product:
- Pain points:

### Secondary Users (use it occasionally)
- Job titles/roles:
- What they do with your product:
- Pain points:

### Indirect Users (affected but don't use it)
- Job titles/roles:
- How they're impacted:

## Real Example:

**Permitting Product**
- **Primary**: Permit reviewers (daily approvals)
- **Secondary**: Applicants (submit permits)
- **Indirect**: Public health inspectors (use approved data)

## Action Item:

Create a simple user list. Don't overthink it!

**Template Tip**: Use our User Profile template to organize this.

[Download User Profile Template →](#template)

**Time**: Should take 10-15 minutes max.

**Next**: Analyze what problems your product solves.
    `
  },
  {
    id: 'week2-problem-solution',
    title: 'What Problem Do You Solve?',
    description: 'Articulate your product\'s core value',
    duration: 5,
    category: 'week2',
    priority: 'high',
    learningPaths: ['comprehensive'],
    content: `
# What Problem Do You Solve?

Every great product solves a real problem. What's yours?

## The Problem Statement:

Fill in this template:

**[User type]** needs a way to **[do something]** because **[reason/pain point]**.

### Examples:

✅ "Permit reviewers need a way to **track application status** because **they lose track across multiple systems**."

✅ "APH nurses need a way to **access patient records quickly** because **delays impact care quality**."

❌ "We need a database." *(Too vague! What's the user problem?)*

## Your Turn:

Write your problem statement:

_________________________________

_________________________________

_________________________________

## Test It:

Show it to 2-3 users. Do they nod and say "YES!"?

If not, refine it until they do.

## Why This Matters:

Your problem statement becomes your **product vision**. Everything you build should solve this problem.

**Next**: Review your current metrics and data.
    `,
    checkQuestion: {
      question: 'A good problem statement:',
      options: [
        'Focuses on technical solutions',
        'Describes user needs and pain points',
        'Lists features to build',
        'Only mentions business goals'
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'week2-metrics-review',
    title: 'Review Current Metrics',
    description: 'Understand your product\'s performance',
    duration: 5,
    category: 'week2',
    priority: 'medium',
    learningPaths: ['comprehensive'],
    content: `
# Review Current Metrics

Let's look at the data! Even if you don't have much, start here.

## Key Metrics to Find:

### Usage Metrics
- **Active users** (daily/weekly/monthly)
- **Session duration** (how long they use it)
- **Feature adoption** (what features are used most)

### Performance Metrics
- **Load time** (how fast is it?)
- **Error rate** (how often does it break?)
- **Uptime** (is it reliable?)

### Business Metrics
- **Task completion rate** (do users finish what they start?)
- **User satisfaction** (surveys, feedback scores)
- **ROI/cost savings** (if applicable)

## Don't Have Metrics Yet?

**No problem!** Note what you'd *like* to track. That's your future analytics roadmap.

## Where to Find Data:

- Google Analytics (if implemented)
- Server logs
- Help desk tickets
- User surveys/interviews

## Quick Exercise:

List 3 metrics you know right now:

1. _______________________
2. _______________________
3. _______________________

**Pro Tip**: Start with what you have. Perfect data isn't required!

**Next**: Document your product vision based on what you've learned.
    `
  },
  {
    id: 'week2-vision-document',
    title: 'Document Your Product Vision',
    description: 'Create a clear vision statement',
    duration: 5,
    category: 'week2',
    priority: 'high',
    learningPaths: ['standard', 'comprehensive'],
    content: `
# Document Your Product Vision

Now that you understand users, problems, and metrics - let's capture the vision!

## The Vision Statement:

A vision statement is 2-3 sentences describing:
- **What** your product does
- **Who** it serves
- **Why** it matters

### Template:

**[Product Name]** helps **[target users]** to **[achieve goal]** by **[how it works]**. This supports APH's mission by **[impact]**.

### Real Example:

"The Permit Portal helps APH reviewers to process applications 50% faster by centralizing all permit types in one system. This supports APH's mission by reducing wait times for local businesses and improving customer service."

## Your Turn:

Write your vision statement:

_________________________________

_________________________________

_________________________________

## Share It:

- Add to your product registry
- Put it in your roadmap
- Share with stakeholders
- Reference it when prioritizing features

**Why**: When you're drowning in requests, your vision guides what to say yes (or no) to!

[Save to Product Registry →](#save)

**Next**: Move into planning phase (Week 3-4).
    `
  },

  // WEEK 3-4 - Planning modules
  {
    id: 'week3-roadmap-creation',
    title: 'Create Your Product Roadmap',
    description: 'Build your strategic plan',
    duration: 5,
    category: 'week3-4',
    priority: 'high',
    learningPaths: ['express', 'standard', 'comprehensive'],
    content: `
# Create Your Product Roadmap

Time to build your strategic plan for the next 3-6 months!

## Roadmap Building Steps:

### 1. Gather Inputs (10 min)
- Your vision statement
- Stakeholder priorities
- User pain points
- Technical debt items

### 2. Group Into Themes (15 min)
Don't list individual features. Group related work:

❌ "Add search box, filter by date, export to CSV"
✅ "Improve Data Discovery"

### 3. Sequence by Quarter (20 min)

**Q1**: Fix critical issues + quick wins
**Q2**: Major feature launch
**Q3**: Enhancements based on feedback
**Q4**: Prepare for next year

### 4. Add Context (15 min)
For each theme, note:
- **Why**: Business rationale
- **Who**: Primary stakeholders
- **Success**: How you'll know it worked

## Example Roadmap:

### Q1 2025: Foundation
- **Fix accessibility issues** (compliance)
- **Performance improvements** (user satisfaction)

### Q2 2025: Growth
- **Mobile-responsive design** (reach more users)
- **Advanced reporting** (stakeholder request)

[Use Our Roadmap Template →](#template)

**Time**: Budget 60-90 minutes for your first draft.

**Next**: Define success metrics for your roadmap.
    `
  },
  {
    id: 'week3-success-metrics',
    title: 'Define Success Metrics',
    description: 'How will you measure progress?',
    duration: 5,
    category: 'week3-4',
    priority: 'high',
    learningPaths: ['standard', 'comprehensive'],
    content: `
# Define Success Metrics

How will you know if your roadmap is working?

## The Metric Framework:

For EACH roadmap theme, define:

### Input Metrics (Did we do the work?)
- "Launched 3 new features"
- "Conducted 10 user interviews"
- "Fixed 25 bugs"

### Output Metrics (What changed?)
- "Reduced load time by 2 seconds"
- "Increased mobile users by 30%"
- "Improved satisfaction score from 6 to 8"

### Outcome Metrics (What's the impact?)
- "Saved staff 10 hours/week"
- "Reduced support tickets by 40%"
- "Enabled 500 more permits/month"

## Example:

**Theme**: Improve Data Discovery

| Metric Type | Measure |
|------------|---------|
| **Input** | Add search, filters, export |
| **Output** | 80% of users find data in <30 sec |
| **Outcome** | Reduce "can't find data" support tickets by 50% |

## Your Action:

Pick 3-5 key metrics for your roadmap. Don't overthink it!

**Pro Tip**: Start with what you can easily measure. Add sophisticated metrics later.

**Next**: Present your roadmap to stakeholders for feedback.
    `
  },
  {
    id: 'week3-stakeholder-presentation',
    title: 'Present Your Roadmap',
    description: 'Get stakeholder buy-in',
    duration: 5,
    category: 'week3-4',
    priority: 'medium',
    learningPaths: ['comprehensive'],
    content: `
# Present Your Roadmap

Time to share your plan and get feedback!

## Presentation Structure (15 min):

### 1. Context (3 min)
- Current state: "Here's where we are"
- Vision: "Here's where we're going"
- Problem: "Here's why it matters"

### 2. The Roadmap (7 min)
- Walk through quarters
- Explain the "why" for each theme
- Show how it connects to APH goals

### 3. Metrics (2 min)
- How you'll measure success
- When you'll report back

### 4. Questions & Feedback (3 min)
- Listen more than you talk
- Take notes
- Don't get defensive!

## Presentation Tips:

✅ **DO**:
- Use visuals (roadmap template)
- Tell stories about user impact
- Be honest about constraints
- Ask for specific feedback

❌ **DON'T**:
- Dive into technical details
- Promise exact dates
- Present a 50-slide deck
- Ignore concerns

## After the Meeting:

- Send summary email within 24 hours
- Update roadmap based on feedback
- Schedule follow-up review

[Presentation Template →](#template)

**Congrats!** You've completed your first 4 weeks as a Product Owner! 🎉
    `
  },

  // Express path-only modules (quick wins for experienced POs)
  {
    id: 'express-quick-setup',
    title: 'Express Setup Checklist',
    description: 'Fast-track for experienced POs',
    duration: 5,
    category: 'day1',
    priority: 'high',
    learningPaths: ['express'],
    content: `
# Express Setup Checklist

Welcome experienced Product Owner! Let's get you set up quickly.

## Complete These Today:

### ☐ Product Registry (5 min)
Register your product in APH's system.
[Start Registry →](#registry)

### ☐ Download Templates (2 min)
Get roadmap and stakeholder templates.
[Download Templates →](#templates)

### ☐ Review Governance Tier (3 min)
Determine if your product is Tier 1-4.
[Check Tier Guide →](#tiers)

## This Week:

### ☐ Schedule Office Hours (Optional)
Only if you have APH-specific questions.
[Schedule →](#schedule)

### ☐ Join PO Community (Recommended)
Slack channel and monthly roundtables.
[Join →](#community)

## You're All Set!

✅ You already know product management
✅ These resources are APH-specific adaptations
✅ Access full training library anytime

[Skip to Resources →](#resources)
    `
  }
];

// Helper function to get modules for a specific learning path
export function getModulesForPath(path: 'express' | 'standard' | 'comprehensive'): Module[] {
  return modules.filter(m => m.learningPaths.includes(path));
}

// Helper function to get module by ID
export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

// Calculate total time for a learning path
export function calculatePathDuration(path: 'express' | 'standard' | 'comprehensive'): number {
  const pathModules = getModulesForPath(path);
  return pathModules.reduce((total, module) => total + module.duration, 0);
}
