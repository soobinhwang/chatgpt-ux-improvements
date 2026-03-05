import { useEffect, useMemo, useRef, useState } from 'react'
import gptLogo from './gpt-logo.png'

const sidebarTop = [
  { id: 'new', label: 'New chat', icon: 'new-chat' },
  { id: 'search', label: 'Search chats', icon: 'search' },
  { id: 'images', label: 'Images', icon: 'image' },
  { id: 'archived', label: 'Archived chats', icon: 'archive' },
]

const sidebarScrollExtras = [
  { id: 'apps', label: 'Apps', icon: 'apps' },
  { id: 'codex', label: 'Codex', icon: 'codex' },
]

const gptItems = [
  { id: 'gpt-1', label: 'Design Mentor', icon: 'circle' },
  { id: 'gpt-2', label: 'Accent Coach', icon: 'circle' },
  { id: 'gpt-3', label: 'Speaking Helper', icon: 'circle' },
  { id: 'gpt-4', label: 'Explore GPTs', icon: 'cube' },
]

const projects = [
  { id: 'proj-new', label: 'New project', icon: 'folder' },
  { id: 'proj-1', label: 'Kommu', icon: 'folder' },
  { id: 'proj-2', label: 'Therapy', icon: 'folder' },
  { id: 'proj-3', label: '[Job] Portfolio', icon: 'folder' },
  { id: 'proj-4', label: '[Job] Interviews', icon: 'folder' },
  { id: 'proj-5', label: '[Job] Presentation', icon: 'folder' },
]

const initialChats = [
  { id: 'chat-1', label: 'Design feedback', createdAt: Date.now() - 1 * 3600000, archived: false, projectId: null },
  { id: 'chat-2', label: 'Project ideas', createdAt: Date.now() - 5 * 3600000, archived: false, projectId: null },
  { id: 'chat-3', label: 'Writing help', createdAt: Date.now() - 24 * 3600000, archived: false, projectId: null },
  { id: 'chat-4', label: 'Research notes', createdAt: Date.now() - 72 * 3600000, archived: false, projectId: null },
  { id: 'chat-5', label: 'Next steps', createdAt: Date.now() - 168 * 3600000, archived: false, projectId: null },
]

const actionButtons = [
  { id: 'copy', label: 'Copy' },
  { id: 'thumb-up', label: 'Good response' },
  { id: 'thumb-down', label: 'Bad response' },
  { id: 'share', label: 'Share' },
  { id: 'repeat', label: 'Try again...', sublabel: 'Used GPT-5.2' },
  { id: 'dots', label: 'More' },
]

const defaultChatState = {
  messages: [],
  queue: [],
  isThinking: false,
  queueingEnabled: true,
}

const RESPONSE_DELAY_MS = 12000

const chatThreads = {
  'chat-1': [
    {
      id: 'u1',
      role: 'user',
      content: 'Can you review this landing page hero for clarity and impact?',
    },
    {
      id: 'a1',
      role: 'assistant',
      title: 'Design feedback summary (hero section)',
      items: [
        {
          title: 'Value prop clarity',
          body: 'Lead with a tighter promise in the first line; keep the benefit and audience in one sentence.',
        },
        {
          title: 'Visual hierarchy',
          body: 'Increase headline size slightly and reduce the subhead width to create a cleaner reading path.',
        },
        {
          title: 'Primary action',
          body: 'Use one dominant CTA and move the secondary action to a text link to reduce choice friction.',
        },
        {
          title: 'Social proof',
          body: 'Add a single line of credibility (logos or stat) just below the buttons to boost trust.',
        },
      ],
      footer: 'If you share your target audience, I can tailor the copy and CTA wording.',
    },
  ],
  'chat-2': [
    {
      id: 'u1',
      role: 'user',
      content: 'Give me a few side project ideas for a product designer.',
    },
    {
      id: 'a1',
      role: 'assistant',
      title: 'Five project ideas tailored for a product designer',
      items: [
        {
          title: 'Onboarding teardown + redesign',
          body: 'Pick a popular app and redesign its onboarding for a specific persona.',
        },
        {
          title: 'Feature backlog cleanup',
          body: 'Turn a messy roadmap into a prioritized, user‑outcome focused plan.',
        },
        {
          title: 'UX audit mini‑case study',
          body: 'Run a heuristic audit and turn findings into 3 focused redesigns.',
        },
        {
          title: 'AI prompt playground',
          body: 'Design a small tool that helps users build and reuse effective prompts.',
        },
        {
          title: 'Feedback loop prototype',
          body: 'Design a lightweight feedback widget and its analytics summary.',
        },
      ],
      footer: 'Tell me which one you like and I can scope it into a 1‑week plan.',
    },
  ],
  'chat-3': [
    {
      id: 'u1',
      role: 'user',
      content: 'Rewrite this bio to be shorter and clearer.',
    },
    {
      id: 'a1',
      role: 'assistant',
      title: 'Short, clear bio options',
      items: [
        {
          title: 'Option A (direct)',
          body: 'Product designer focused on clear flows, fast feedback, and measurable outcomes.',
        },
        {
          title: 'Option B (collaborative)',
          body: 'Product designer who pairs research with rapid prototyping to ship thoughtful UX.',
        },
        {
          title: 'Option C (outcome‑oriented)',
          body: 'I design product experiences that reduce friction and improve activation and retention.',
        },
      ],
      footer: 'Share your target role and I’ll tune the tone.',
    },
  ],
  'chat-4': [
    {
      id: 'u1',
      role: 'user',
      content: 'Summarize key themes from these interviews.',
    },
    {
      id: 'a1',
      role: 'assistant',
      title: 'Interview synthesis: key themes',
      items: [
        {
          title: 'Decision anxiety',
          body: 'Users hesitate without clear defaults or guidance at key steps.',
        },
        {
          title: 'Trust signals matter',
          body: 'Security and legitimacy cues strongly influence willingness to proceed.',
        },
        {
          title: 'Time pressure',
          body: 'People prefer short flows and quick wins over complex setup.',
        },
        {
          title: 'Desire for personalization',
          body: 'Users want the product to “remember” their preferences.',
        },
      ],
      footer: 'Want a journey map or a set of prioritized opportunities?',
    },
  ],
  'chat-5': [
    {
      id: 'u1',
      role: 'user',
      content: 'What should I do next after user testing?',
    },
    {
      id: 'a1',
      role: 'assistant',
      title: 'Suggested next steps',
      items: [
        {
          title: 'Cluster issues by severity',
          body: 'Group findings into critical, moderate, and minor to focus effort.',
        },
        {
          title: 'Define the top 3 fixes',
          body: 'Pick the smallest set of changes that improve task success.',
        },
        {
          title: 'Prototype the changes',
          body: 'Update the flow and validate quickly with 2–3 users.',
        },
        {
          title: 'Document learnings',
          body: 'Capture patterns, quotes, and the decisions you made.',
        },
      ],
      footer: 'If you share the test goals, I can help prioritize fixes.',
    },
  ],
}

const getMainChatResponse = (userMessage, priorMessages = []) => {
  const m = userMessage.toLowerCase()
  const priorText = priorMessages
    .map((msg) =>
      [msg.content, msg.title, ...(msg.items || []).map((i) => `${i.title} ${i.body}`), msg.footer]
        .filter(Boolean)
        .join(' ')
    )
    .join(' ')
    .toLowerCase()

  const wantsExample = m.includes('examp') || m.includes('show me') || m.includes('for instance')
  const wantsHow = m.includes('how')
  const assistantCount = priorMessages.filter((msg) => msg.role === 'assistant').length

  const aboutLanding = priorText.includes('landing') || priorText.includes('hero') || priorText.includes('above the fold') || priorText.includes('cta')
  const aboutPortfolio = priorText.includes('portfolio') || priorText.includes('case study')
  const aboutInterview = priorText.includes('interview') || priorText.includes('hiring')
  const aboutOnboarding = priorText.includes('onboard') || priorText.includes('activation') || priorText.includes('time-to-value')
  const aboutResearch = priorText.includes('research') || priorText.includes('user test') || priorText.includes('synthesis')
  const aboutWriting = priorText.includes('copy') || priorText.includes('bio') || priorText.includes('headline') || priorText.includes('value prop')
  const aboutDesignSystem = priorText.includes('design system') || priorText.includes('component') || priorText.includes('token')

  if (aboutLanding) {
    if (wantsExample)
      return {
        title: 'Landing page examples — what makes them work',
        items: [
          { title: 'Stripe', body: 'One headline ("Payments infrastructure for the internet"), one supporting line naming the audience, one CTA. The visual is product UI — not stock photography of people smiling. Every element earns its presence. Nothing competes for the primary action.' },
          { title: 'Linear', body: 'Leads with a bold product claim ("The issue tracker you\'ll actually enjoy using"), backed by a 90-second demo video above the fold. Social proof is a recognizable logo strip immediately below the CTA — exactly where doubt peaks.' },
          { title: 'What to avoid', body: 'Five nav links, a rotating hero carousel, three equally weighted CTAs, and a "Schedule a demo" form requiring 7 fields. Each one of those is a decision the user has to make before they\'ve decided if they care. Strip decisions down before adding anything.' },
        ],
        footer: 'Share your current hero copy and I\'ll give you a specific rewrite.',
      }
    if (wantsHow)
      return {
        title: 'How to audit your landing page',
        items: [
          { title: 'The 5-second test', body: 'Show the page to someone unfamiliar with the product. After 5 seconds, ask: what does this do, and who is it for? If they can\'t answer confidently, the value prop isn\'t working. No heuristic replaces this test.' },
          { title: 'The squint test', body: 'Blur your eyes and look at the page. Can you still identify one dominant focal point? If everything looks equally weighted at low resolution, the hierarchy isn\'t doing its job.' },
          { title: 'The mobile check', body: 'Open the page at 390px. Is the CTA above the fold? Is the headline the largest element? Is anything competing for attention at the same visual weight? Most of your traffic lands here first.' },
          { title: 'The label-cover test', body: 'Cover every button label. Can you still tell which is the primary action from its size, color, and position alone? If not, the hierarchy is carried entirely by text — and that\'s fragile.' },
        ],
        footer: 'Run these tests and share what breaks. I can help prioritize what to fix first.',
      }
    if (assistantCount >= 1)
      return {
        title: 'Going deeper on conversion',
        items: [
          { title: 'Conversion is a trust problem more than a copy problem', body: 'Most underperforming pages fail because users arrive skeptical and nothing resolves that skepticism fast enough. Every element needs to be working to reduce doubt — not just explain the product. Audit your page for trust signals, not just clarity.' },
          { title: 'Above the fold is a promise; below is the proof', body: 'Structure the page as an argument. The hero makes a bold claim. Everything below it exists to prove that claim — testimonials, feature details, case study snippets. If a section below the fold doesn\'t map directly to a user objection, it\'s probably not earning its space.' },
          { title: 'Optimize for the hesitant user', body: 'The enthusiastic user converts regardless. Design for the person who\'s interested but not convinced. What specific doubt do they have at each scroll point, and what\'s the shortest path to resolving it? That\'s your page architecture.' },
        ],
        footer: 'What specific section are you working on? I can give more targeted feedback.',
      }
  }

  if (aboutPortfolio) {
    if (wantsExample)
      return {
        title: 'Portfolio examples — what strong case studies do differently',
        items: [
          { title: 'Open with stakes, not timeline', body: '"Users were abandoning checkout at 68% — we had 6 weeks to fix it before launch." That sentence has a problem, a constraint, and implies a story. Compare to: "I redesigned the checkout flow in Q3." One is a case study; the other is a resume entry.' },
          { title: 'Annotate the decision, not the screen', body: '"I chose a two-step checkout over a single-page form because testing showed users trusted sequential flows for high-value purchases. Completion rate increased 22%." That annotation does more work than the screen itself. Show the decision, the reason, the outcome.' },
          { title: 'End with what you\'d do differently', body: 'One honest paragraph about what the project taught you or what you\'d change given more time. This is the most underused section in portfolios and one of the most persuasive — it signals the kind of reflection that\'s hard to fake.' },
        ],
        footer: 'Share a case study link and I\'ll review the structure specifically.',
      }
    if (assistantCount >= 1)
      return {
        title: 'Portfolio strategy — what hiring managers notice',
        items: [
          { title: 'Three strong projects beats ten average ones', body: 'A portfolio with 10 case studies signals someone who hasn\'t edited. Three deeply documented projects — real problem, real constraints, measurable outcome — signals a designer who knows what quality looks like.' },
          { title: 'The first 30 seconds determine the rest', body: 'Hiring managers decide whether to go deeper in under 30 seconds of scanning. Your home page needs to communicate your level and specialty before they click anything. A clear positioning line does this faster than any project thumbnail.' },
          { title: 'Process without outcomes is just documentation', body: '"We ran 12 interviews" means nothing unless it led to a specific insight that changed the design. Connect every process step to a decision. Otherwise, cut it.' },
        ],
        footer: 'Tell me what role you\'re targeting and I can calibrate the feedback for that audience.',
      }
  }

  if (aboutInterview) {
    if (assistantCount >= 1)
      return {
        title: 'Interview prep — going deeper',
        items: [
          { title: 'The hardest question to answer well', body: '"Tell me about a time you disagreed with a stakeholder." Most people either make themselves look like a pushover ("I ultimately deferred to their judgment") or unnecessarily combative ("I knew I was right"). The best answer shows you advocated for the user\'s need with data, stayed collaborative, and let the outcome — not the argument — speak.' },
          { title: 'What a design critique reveals', body: 'Interviewers giving you a product to critique aren\'t testing if you can find problems — they\'re testing how you think under pressure. Structure: acknowledge what\'s working first, then identify one or two high-impact issues, frame each as a hypothesis ("I\'d want to validate whether users..."), and suggest a directional fix.' },
          { title: 'The question that changes how they see you', body: '"What\'s the hardest design problem the team is working on right now?" It signals you\'re already thinking about contributing, not just about getting the job. Listen to the answer — it tells you more about the team culture than any glassdoor review.' },
        ],
        footer: 'Tell me which company or role and I can give more specific prep.',
      }
  }

  if (aboutOnboarding) {
    if (wantsExample)
      return {
        title: 'Onboarding examples — value-first vs. setup-first',
        items: [
          { title: 'Figma (value-first)', body: 'New users land in a template gallery, not a blank canvas. First action: pick a starting point. They\'re in the editor within 30 seconds, making real things. Account setup — teams, billing — comes after they\'ve already seen the product work.' },
          { title: 'The common mistake (setup-first)', body: 'A 6-step onboarding form before showing anything. Name your workspace. Invite teammates. Choose a plan. Connect your calendar. Users complete it dutifully and arrive at an empty dashboard with no context. Most churn here — before the aha moment.' },
          { title: 'The rule', body: 'Every onboarding step should shorten time-to-value. If a step doesn\'t directly move the user toward their first win, cut it or defer it. Map your flow and mark which steps contribute to the aha moment — everything else is administrative overhead.' },
        ],
        footer: 'Share your current onboarding flow and I can identify the highest-leverage step to cut or improve.',
      }
  }

  if (aboutResearch) {
    if (wantsExample)
      return {
        title: 'Research in practice — what good synthesis looks like',
        items: [
          { title: 'Observation vs. interpretation', body: 'Observation: "User clicked Cancel on the payment screen after hovering on the total for 8 seconds." Interpretation: "User was surprised by the final price." These are different. The first is a fact; the second is a hypothesis. Design from the hypothesis — but don\'t confuse it for the observation.' },
          { title: 'Affinity mapping without anchoring', body: 'After 8 interviews, you have ~300 raw observations. Cluster them without naming the clusters first. Naming too early causes confirmation bias — you\'ll find the themes you expected. Let clusters stabilize, then name. The most useful insight usually comes from a cluster you didn\'t predict.' },
          { title: 'From insight to opportunity', body: 'Insight: "Users are uncertain about cost until the final step." Opportunity: "How might we help users understand their total cost earlier, so they can commit with confidence?" That reframe is what makes a finding actionable for the design team.' },
        ],
        footer: 'Tell me what phase you\'re in and I can help you structure the next step.',
      }
  }

  if (aboutWriting) {
    if (wantsExample)
      return {
        title: 'Copy examples — before and after',
        items: [
          { title: 'Value prop rewrite', body: 'Before: "Empowering teams to collaborate more effectively with AI-powered tools." After: "Cut your weekly meeting prep time in half." Same product. One commits to a specific outcome for a specific person; the other says everything and nothing.' },
          { title: 'Error message rewrite', body: 'Before: "An error has occurred. Please try again." After: "We couldn\'t save your changes — check your connection and try again. Your work is safe." The second tells the user what happened, what to do, and reassures them. One sentence of context eliminates a support ticket.' },
          { title: 'CTA rewrite', body: 'Before: "Submit." After: "Get my free audit." The first describes what the user does (an action); the second describes what they get (the outcome). CTA copy that names the outcome consistently outperforms action-based copy.' },
        ],
        footer: 'Paste the copy you\'re working on and I\'ll give you a specific rewrite with notes.',
      }
  }

  if (aboutDesignSystem) {
    if (assistantCount >= 1)
      return {
        title: 'Design systems — the hard problems',
        items: [
          { title: 'The adoption problem', body: 'A system with 200 components at 20% adoption is worse than one with 20 components at 90% adoption. Track which components are being used in production and which are being bypassed. Bypasses are the most valuable signal — they reveal either a gap in the system or a component that doesn\'t work for real needs.' },
          { title: 'The documentation problem', body: 'Most component docs show how to use the component but not why it was built that way. The most valuable documentation explains the constraint that led to the current design. That context prevents future designers from reopening resolved decisions.' },
          { title: 'The governance problem', body: 'A design system that changes without notice destroys team trust. Distinguish breaking changes (rename, removed prop, behavior shift) from non-breaking ones (new variant, bug fix). Breaking changes need migration paths and communication — not just a commit message.' },
        ],
        footer: 'Tell me where your system is today and what\'s breaking down — I can help prioritize.',
      }
  }

  // Generic thoughtful follow-ups
  if (wantsExample)
    return {
      title: 'A concrete example',
      items: [
        { title: 'The setup', body: 'A product team sees high drop-off at the step where users configure their first project. The instinct: redesign the UI. The more useful first move: watch 5 users attempt that step and write down exactly what they do — without designing anything yet.' },
        { title: 'What they find', body: 'Users don\'t struggle with the UI. They stall because they don\'t know what to name the project. It\'s a conceptual blocker, not an interaction problem. The fix isn\'t better microcopy — it\'s a set of starter templates with pre-filled names. What looked like a UI problem was an onboarding strategy problem.' },
        { title: 'The principle', body: 'Observation first, interpretation second, solution third. The presenting symptom is rarely the root cause. Most of the time, the fastest path to a good solution is slowing down long enough to correctly name the problem.' },
      ],
      footer: 'Share your specific situation and I can give you an example directly relevant to what you\'re working on.',
    }

  if (wantsHow)
    return {
      title: 'A practical approach',
      items: [
        { title: 'Start with the user\'s goal at this exact moment', body: 'Not their overall goal — the immediate one. A user on a settings screen isn\'t trying to "configure the product," they\'re trying to complete one specific task without breaking something. The narrower you define the moment, the more useful your design decisions become.' },
        { title: 'Map friction before you design', body: 'Walk the current experience and mark every place the user has to make a decision, wait, or feel uncertain. You don\'t need to solve all of them — but knowing where they are prevents you from optimizing the wrong step.' },
        { title: 'Ship the smallest thing that tests your assumption', body: 'Match fidelity to the question you\'re answering. If you\'re validating a flow, a rough prototype is enough. If you\'re testing conversion impact, you need a live test. Don\'t build at high fidelity before you know what you\'re validating.' },
      ],
      footer: 'Tell me more about what you\'re trying to do and I can make this more specific.',
    }

  if (assistantCount >= 1)
    return {
      title: 'Building on the conversation',
      items: [
        { title: 'The underlying pattern', body: 'Most of what we\'ve been discussing comes down to the same thing: good design reduces the number of questions a user has to answer. Every element, every step, every piece of copy is either resolving uncertainty or creating it. The goal is to close the loop before doubt has a chance to form.' },
        { title: 'Where this breaks in practice', body: 'Teams get this right in the design phase and lose it in implementation. A clear hierarchy in Figma becomes diluted when engineering adds edge-case buttons. A tight onboarding flow acquires three more steps over 18 months of stakeholder requests. The principles need to be as explicit as the design — otherwise they erode.' },
        { title: 'A practical check', body: 'Take your current design and ask: if I removed every element that isn\'t essential to the user\'s goal at this moment, what would remain? The gap between that and what\'s currently there is your highest-leverage improvement opportunity.' },
      ],
      footer: 'What specific decision are you trying to make right now? I can give more targeted advice.',
    }

  return {
    content: `Good question. The key is to start from the user's goal at that exact moment in the flow — not their overall goal, but the immediate one. Once you\'ve named it precisely, every element on the screen either serves that goal or doesn\'t. The ones that don\'t are your best candidates to cut, move, or simplify.`,
  }
}

const getBranchResponse = (seed, userMessage, priorMessages = []) => {
  const s = seed.toLowerCase()
  const m = userMessage.toLowerCase()
  const assistantTurn = priorMessages.filter((msg) => msg.role === 'assistant').length
  const isFollowUp = assistantTurn > 0

  const wantsMore = m.includes('more') || m.includes('explain') || m.includes('elaborate') || m.includes('tell me')
  const wantsHow = m.includes('how')
  const wantsExample = m.includes('examp') || m.includes('show me') || m.includes('for instance') || m.includes('like what')

  if (s.includes('primary action') || s.includes('cta') || s.includes('dominant')) {
    if (wantsExample)
      return `**Before**\nTwo equally weighted buttons — "Sign up" and "Learn more" — side by side. Users pause, compare options, and conversion drops.\n\n**After**\n"Sign up" becomes a filled high-contrast button. "Learn more" becomes a plain text link below it. The visual weight gap communicates hierarchy before the user reads a single word.\n\n**Another example**\nA SaaS pricing page with three plans. The middle plan gets a filled button; the other two get ghost buttons. Users immediately read it as the recommended option — no label needed.`
    if (wantsHow)
      return `**Step 1 — Name the action first**\nBefore opening Figma, write down the one thing you most want users to do on this screen. If you can't name it, the design won't be able to either.\n\n**Step 2 — Give it the strongest treatment**\nFilled button, high contrast, placed along the natural eye path. Don't split the weight with a second button.\n\n**Step 3 — Demote everything else**\nSecondary actions become ghost buttons or text links. If you feel pressure to add a second filled button, that's usually a signal the value prop needs work — not the UI.`
    if (isFollowUp)
      return `To add another angle — it's worth auditing your current screens by covering the labels and asking: can I still tell what the main action is? If the answer is no, the visual hierarchy isn't doing its job. The button style alone shouldn't carry all the weight; placement, whitespace, and proximity to the most relevant content all contribute.`
    return `A primary action is the single most important thing you want users to do on a given screen. The core principle: limit yourself to one. When two buttons share equal visual weight, users stall — that friction quietly kills conversion.\n\nBest practice: filled, high-contrast button for the primary action; ghost button or text link for anything secondary. The hierarchy should be readable at a glance, without reading the labels.`
  }

  if (s.includes('value prop') || s.includes('headline') || s.includes('tighter promise') || s.includes('benefit')) {
    if (wantsExample)
      return `**Before**\n"Empowering teams to work smarter with AI-powered workflows." Vague, feature-focused, no audience.\n\n**After**\n"Cut meeting prep time in half — for ops teams." Same product. Specific outcome, specific audience. That's a value prop.\n\n**Why it works**\nThe second version commits to a claim a user can immediately agree or disagree with. That friction is good — it means you're talking to the right person.`
    if (isFollowUp)
      return `A useful test: show your headline to someone unfamiliar with the product and ask "what do you think this does, and who is it for?" If they can't answer confidently in 5 seconds, it needs tightening. The goal is immediate recognition, not clever phrasing.`
    return `A strong value prop answers three questions in one sentence: what you do, who it's for, and why it matters. Keep the headline under 10 words, then use a single supporting line to add specificity. Avoid abstract words like "seamless" or "powerful" — they're placeholders that signal you haven't committed to a real position yet.`
  }

  if (s.includes('visual hierarchy') || s.includes('reading path') || s.includes('headline size')) {
    if (wantsExample)
      return `**The broken version**\nAbove the fold: nav bar, hero image, badge, headline, subhead, two CTAs, a scrolling ticker. Everything competes. There's no clear first step for the eye.\n\n**The fixed version**\nThree elements above the fold only. Headline at the largest size, one supporting line at medium weight, one high-contrast CTA. Everything else moves below the fold.\n\n**The principle**\nThe eye needs a clear entry point. If everything is prominent, nothing is.`
    if (isFollowUp)
      return `Another way to think about it: visual hierarchy is an argument. Your headline is the thesis, the subhead is the evidence, the CTA is the conclusion. If any part of that argument is weak or out of order, the user loses the thread and bounces. Reading the page should feel inevitable, not effortful.`
    return `Visual hierarchy is about controlling where the eye goes and in what order. The classic structure: one dominant element (headline), one supporting element (subhead or image), one action (CTA). Every additional element competes for attention and dilutes the path.\n\nSize, contrast, and whitespace are your main tools — not color alone. Reducing the subhead width, as mentioned, creates a tighter reading column that naturally draws the eye down to the CTA.`
  }

  if (s.includes('social proof') || s.includes('credibility') || s.includes('logos') || s.includes('trust')) {
    if (wantsExample)
      return `**Below the hero CTA**\n"Trusted by 8,000+ product teams." One line, no design needed. Catches doubt right where it peaks.\n\n**Logo strip after the value prop**\nRecognizable brand logos, no names. Instant credibility without asking the user to read anything.\n\n**Near pricing**\nA short quote with a real name and headshot. People are most skeptical right before committing — this is where a human voice has the most leverage.\n\n**What to avoid**\nA dedicated "Testimonials" section at the bottom. By that point, the user has already decided.`
    if (isFollowUp)
      return `One thing worth noting: specificity matters a lot with social proof. "Thousands of users" reads as filler. "4,200 teams switched from spreadsheets in the last 6 months" reads as evidence. The more concrete the claim, the more credible it feels — even if the number is smaller.`
    return `Social proof works by reducing uncertainty — people use others' behavior as a signal when they're unsure. In order of effectiveness: customer logos (instant recognition), specific stats ("used by 10,000+ teams"), short testimonials with a real name and photo, and star ratings.\n\nPlacement matters a lot. Just below the CTA is ideal — that's where doubt peaks and a trust signal has the most leverage.`
  }

  if (s.includes('decision') || s.includes('anxiety') || s.includes('hesitat') || s.includes('defaults')) {
    if (wantsExample)
      return `**The problem**\nA settings page with 12 toggles, all set to "off." The user freezes — is it safe to turn these on? What's the right combination? They leave without configuring anything.\n\n**The fix**\nPre-set sensible defaults. Add a single line: "These are our recommended settings — adjust anytime." The product made the judgment call so the user doesn't have to.\n\n**Why it works**\nAnxiety drops when the stakes feel low and the decision feels reversible. Defaults communicate confidence. Micro-copy communicates safety.`
    if (isFollowUp)
      return `The deeper principle: every decision you force on users is trust you're asking them to spend. Users are more willing to make decisions when (a) the stakes feel low, (b) the options are clear, and (c) they know they can undo it. Micro-copy like "You can change this later" is worth more than most UI polish.`
    return `Decision anxiety usually comes from too many options, unclear defaults, or fear of making the wrong choice. The fix: reduce options, highlight a recommended default, and use reassuring micro-copy ("You can change this later").\n\nFor higher-stakes decisions, progressive disclosure helps — show the simple choice first and let users opt into complexity only if they need it.`
  }

  if (s.includes('onboarding') || s.includes('activation')) {
    if (wantsExample)
      return `**Figma — value first**\nNew users land in a template gallery, not a blank canvas. First action: "pick a starting point." They reach the editor feeling oriented. Account setup (teammates, billing) comes after they've already seen the product work.\n\n**The common mistake**\nGating the product behind a 6-step setup form. Users complete it dutifully but haven't seen anything real yet — so they churn before the aha moment ever arrives.\n\n**The pattern**\nShow value → earn trust → then ask for setup. Not the other way around.`
    if (isFollowUp)
      return `A useful metric to design toward: time-to-value. How long from sign-up to the first moment the user thinks "oh, this is actually useful"? Every onboarding step that doesn't shorten that time is costing you activation rate. Map your current flow and mark which steps directly contribute to the aha moment — cut or defer the rest.`
    return `The most common onboarding mistake is front-loading setup before users see any value. Flip it: get users to the "aha moment" as fast as possible, then ask for what you need.\n\nEach onboarding screen should have exactly one job. If a step doesn't directly move the user toward their first win, cut it or defer it.`
  }

  if (s.includes('feedback') || s.includes('prototype') || s.includes('user testing') || s.includes('test')) {
    if (wantsExample)
      return `**Observation (what you saw)**\n4 of 5 users paused at the payment screen and didn't complete the flow.\n\n**Interpretation (what it might mean)**\nThey're confused by the pricing. Or the form has too much friction. Or the total cost was unexpected.\n\n**Why the difference matters**\nEach interpretation leads to a different fix. Keeping them separate prevents you from designing for the wrong problem.\n\n**Next step**\nPrioritize that drop-off point first — it's high-impact and high-frequency. Then run a follow-up to find out which interpretation is right.`
    if (isFollowUp)
      return `One framework that helps: for each finding, write it in the form "I observed [behavior] when [context]." Don't jump to "users don't understand X" — that's already an interpretation. Keeping observation and interpretation separate leads to better solutions and avoids designing for the wrong problem.`
    return `After user testing, the most important step is separating observations from interpretations. Write down exactly what you saw before asking why. This keeps the problem space open and prevents premature solutions.\n\nFrom there, prioritize by impact × frequency — fix what broke the most critical flows for the most users first, before addressing edge cases.`
  }

  if (s.includes('personalization') || s.includes('remember') || s.includes('preferences')) {
    if (wantsExample)
      return `**Remember the last state**\nA dashboard that restores the exact filters a user had set. They come back and it's already their view — no reconfiguring. No ML needed, just stored state.\n\n**Surface recent items**\nThe three most recently used templates appear at the top of the list. The user doesn't scroll or search — the product anticipated their next move based on the last one.\n\n**Adjust defaults from early behavior**\nA writing tool that notices you always switch to dark mode and sets it as your default after the first session. One less thing to configure — and it feels like the product is paying attention.`
    if (isFollowUp)
      return `The key distinction: personalization isn't about showing users what an algorithm thinks they want — it's about reducing the effort of coming back. The most effective version is often just memory: remember where they left off, what they configured last time, what they searched for. That alone makes the product feel like it knows them.`
    return `Personalization doesn't have to be complex to feel meaningful. Start with the smallest signals: remember the last state, surface recently used items, or adjust defaults based on early behavior. Users notice when a product "gets" them — and that feeling builds retention more reliably than most features.`
  }

  if (s.includes('time pressure') || s.includes('short flows') || s.includes('quick wins')) {
    if (isFollowUp)
      return `A practical way to apply this: count the clicks between intent and completion. "I want to do X" → how many steps until X is done? If it's more than 3–4, ask which steps are essential vs. administrative. Administrative steps (confirmation dialogs, success screens, redirects) are often where time gets wasted without the user getting value.`
    return `Time pressure as a design constraint is actually useful — it forces you to strip flows down to what's essential. Ask: what is the minimum number of steps to get the user to value? Every additional step is a drop-off risk. Short flows also build trust early, which makes users more willing to invest time later.`
  }

  if (wantsExample || wantsHow) {
    const preview = seed.length > 50 ? `${seed.slice(0, 50)}…` : seed
    return `Good example to think through. With "${preview}", the practical version looks like this: start by identifying the user's goal at that exact moment in the flow, then ask whether each element on screen serves that goal directly. Anything that doesn't is noise — move it, shrink it, or cut it. The best designs make the right action feel obvious without any instruction.`
  }

  if (isFollowUp) {
    return `Building on that — the deeper pattern here is that good design reduces the number of questions a user has to answer. Every element, every step, every piece of copy is either answering a question the user has or creating a new one they didn't. The goal is to close the loop before doubt has a chance to form. What specific part of your flow are you thinking about applying this to?`
  }

  if (wantsMore) {
    const preview = seed.length > 60 ? `${seed.slice(0, 60)}…` : seed
    return `Happy to go deeper. The key thing to understand about "${preview}" is that it's not just a design decision — it's a communication decision. It shapes how users interpret what matters and what to do next.\n\nWant me to focus on the rationale, how to implement it, or walk through a concrete example?`
  }

  return `To build on that — the underlying principle is about reducing cognitive load. Every element a user encounters is an implicit question they have to answer. Good design pre-answers as many of those questions as possible before the user consciously registers them.\n\nWant me to walk through a specific example, or dig into how to apply this to your current work?`
}

const getLandingResponse = (userMessage) => {
  const m = userMessage.toLowerCase()

  if (m.includes('landing') || m.includes('hero') || m.includes('above the fold')) {
    return {
      title: 'Landing page hero — review & recommendations',
      items: [
        { title: 'Value prop clarity', body: 'Your hero needs to answer one question in under 5 seconds: what is this, and why does it matter to me? Lead with the outcome the user gets, not the feature you built. A strong headline is under 10 words, names a specific audience, and commits to a specific benefit. Avoid abstract words like "seamless" or "powerful" — they signal you haven\'t made a real claim yet.' },
        { title: 'Visual hierarchy', body: 'The eye should travel in one clean path: headline → supporting line → CTA. Strip everything above the fold down to those three elements. If a badge, ticker, nav item, or secondary link is competing at the same visual weight, the hierarchy is broken. Reducing the subhead column width alone often creates a noticeably tighter reading path.' },
        { title: 'Primary CTA', body: 'One dominant action, one button style. Filled, high-contrast, placed directly below the supporting copy. Any secondary action should be a text link — not a ghost button at the same size. The visual weight difference communicates priority before the user reads a word. If you feel pressure to add a second filled button, that\'s usually a sign the value prop needs tightening, not that you need more options.' },
        { title: 'Social proof placement', body: 'Place one credibility signal immediately below the CTA — a stat ("trusted by 8,000+ teams"), a logo strip, or a 5-star rating line. That\'s where doubt peaks, and a trust signal there has the highest leverage. Avoid a dedicated testimonials section buried further down — by that point, the user has already decided.' },
        { title: 'Mobile check', body: 'Render the hero at 390px. If the headline wraps past three lines or the CTA drops below the fold, tighten the copy and reduce padding. Most users encounter this on their phone first, and a mobile hero that requires scrolling to find the CTA loses most of them before they ever read your value prop.' },
      ],
      footer: 'Share your current hero copy or a screenshot and I can give you specific rewrite and layout suggestions.',
    }
  }

  if (m.includes('portfolio') || m.includes('case study') || m.includes('project page')) {
    return {
      title: 'Portfolio review — what makes a case study land',
      items: [
        { title: 'Lead with the outcome, not the process', body: 'Most portfolio case studies open with "I was given a brief to redesign X." Hiring managers read dozens of these. Open instead with the result: what changed, what improved, and what you were responsible for. One strong outcome sentence in the first paragraph does more than three pages of process detail.' },
        { title: 'Show your thinking, not just your screens', body: 'The most common mistake: a gallery of polished final screens with no context for why decisions were made. Annotate the key design choices. "I moved the CTA above the fold because testing showed 60% of users never scrolled." That sentence is more persuasive than the screen itself.' },
        { title: 'Structure each case study the same way', body: 'Consistency reduces cognitive load for the reader. A reliable structure: problem (one sentence) → constraints → your approach → key decisions → outcome. Readers will skim — a predictable structure lets them find what they\'re looking for fast.' },
        { title: 'Cut the filler sections', body: '"My role," "Tools used," and "Timeline" sections are low-signal. Every hiring manager already assumes you used Figma and worked in a team. Use that space to show a specific challenge you solved, a constraint you navigated, or a decision you pushed back on.' },
        { title: 'End with what you\'d do differently', body: 'This is the most underused section in portfolios. A short "if I had more time, I\'d have..." paragraph signals maturity and self-awareness — two things that are hard to fake and very valuable to a hiring team.' },
      ],
      footer: 'If you share a link to your current portfolio I can give you specific, page-level feedback.',
    }
  }

  if (m.includes('interview') || m.includes('job') || m.includes('hiring') || m.includes('recruiter')) {
    return {
      title: 'Design interview prep — what actually matters',
      items: [
        { title: 'Know your three strongest stories cold', body: 'Most design interviews come down to three question types: a time you pushed back on a stakeholder, a time you made a decision with incomplete data, and a time your design failed and what you learned. Prepare one strong, specific story for each. Vague answers ("I collaborated with the team to align on direction") lose marks; specific ones with stakes and outcomes win.' },
        { title: 'Portfolio walkthrough: lead with context', body: 'When asked to walk through a case study, start with one sentence about the business problem — not the design process. Interviewers want to see that you understand why the work mattered before they care about how you did it. Then: problem → constraint → key decision → outcome. Keep each project to 5–7 minutes unless asked to go deeper.' },
        { title: 'Design critique: think out loud', body: 'When given a product to critique, the interviewer cares more about your reasoning than your conclusion. Start by asking who the user is and what the goal of the screen is. Then identify what\'s working before what isn\'t. Structure: "The hierarchy is doing X well. The place I\'d focus is Y, because Z." Never just list problems without showing you understand the tradeoffs.' },
        { title: 'Questions to ask them', body: 'The questions you ask at the end signal what you care about. Strong questions: "What does a successful first 6 months look like for this role?" "How does design currently influence product decisions here?" "What\'s the hardest design problem the team is working on right now?" Avoid questions answered on the website — it signals you didn\'t prepare.' },
        { title: 'What to do if you don\'t know', body: 'If asked something you\'re unsure about, don\'t bluff. Say "I don\'t have direct experience with that, but here\'s how I\'d approach it:" and think through it out loud. Interviewers routinely prefer a candidate who reasons well under uncertainty over one who gives a polished but hollow answer.' },
      ],
      footer: 'Tell me what role or company you\'re interviewing for and I can tailor this further.',
    }
  }

  if (m.includes('onboard') || m.includes('activation') || m.includes('first time') || m.includes('new user')) {
    return {
      title: 'Onboarding design — getting users to value fast',
      items: [
        { title: 'Design toward time-to-value, not completion rate', body: 'The goal of onboarding is not to get users through the flow — it\'s to get them to the moment they think "this is actually useful" as fast as possible. Every step that doesn\'t directly contribute to that moment is costing you activation rate. Map your current flow and mark which steps are essential vs. administrative. Cut or defer the rest.' },
        { title: 'Show before you ask', body: 'The most common onboarding mistake is front-loading setup before users see any value. Flip it: get users into the product doing a real thing first, then prompt for setup. Figma drops new users into a template gallery rather than a blank canvas or an account form. That single decision dramatically increases activation.' },
        { title: 'One job per screen', body: 'Each onboarding step should have exactly one goal. If a screen asks users to name their project, invite teammates, and choose a plan, it will underperform on all three. Strip each step to one decision, one input, one action. The completion rate per screen will go up and users will feel less overwhelmed.' },
        { title: 'Use defaults aggressively', body: 'Every choice you force on users during onboarding is friction. Pre-select the most common option, pre-fill what you can infer, and set sensible defaults. Add a note: "You can change this anytime." Users move faster when they don\'t have to make every decision from scratch on day one.' },
        { title: 'Design the empty state carefully', body: 'The first screen a user lands on after onboarding is usually empty. An empty dashboard with no data is demoralizing. Consider seeding it with sample data, a clear next action, or a short prompt. The goal is to make the product feel alive and ready to use — not like a blank canvas waiting to be filled.' },
      ],
      footer: 'Share your current onboarding flow and I can identify the highest-impact step to cut or improve.',
    }
  }

  if (m.includes('research') || m.includes('user interview') || m.includes('user test') || m.includes('insight')) {
    return {
      title: 'UX research — turning data into actionable design decisions',
      items: [
        { title: 'Separate observations from interpretations', body: 'The most common research mistake is mixing what happened with what it means. Write your findings in two columns: observation ("user paused for 12 seconds on the pricing page, then closed the tab") and interpretation ("user was uncertain about the value relative to cost"). Keeping them separate prevents premature solutions and keeps the problem space open.' },
        { title: 'Prioritize by impact × frequency', body: 'Not all findings are equal. A problem that affected one user in one context is very different from a pattern that showed up in 4 of 5 sessions. Build a simple 2x2: how many users experienced it, and how critical was the moment in the flow? Fix the high-frequency, high-criticality items first — everything else is iteration.' },
        { title: 'Cluster before you categorize', body: 'After interviews, resist the urge to jump to themes immediately. First, put every observation on its own sticky note. Then cluster by similarity without naming the cluster. Only after you\'ve grouped them should you name the pattern. Naming too early causes confirmation bias — you\'ll find the themes you expected rather than the ones that are actually there.' },
        { title: 'Turn insights into opportunity statements', body: 'A finding on its own doesn\'t drive design decisions. Translate each major insight into an opportunity: "Users hesitate at checkout because they can\'t predict the final cost" becomes "How might we help users understand total cost before they reach the payment step?" That framing is directly actionable for the design team.' },
        { title: 'Share findings as a story, not a spreadsheet', body: 'Research that sits in a Notion doc gets read once and forgotten. Present findings as a narrative: open with the user\'s goal, show where the journey breaks down, and close with the opportunity. One strong user quote placed at the right moment in a presentation does more to shift team priorities than a table of severity ratings.' },
      ],
      footer: 'Tell me what you\'re researching and what decisions the findings need to inform — I can help you design the study or analyze what you have.',
    }
  }

  if (m.includes('write') || m.includes('bio') || m.includes('copy') || m.includes('rewrite') || m.includes('text')) {
    return {
      title: 'Writing & copy — principles for clear, effective communication',
      items: [
        { title: 'Lead with the reader\'s goal, not yours', body: 'Most weak copy starts with what the product does. Strong copy starts with what the reader wants. "We built a tool that streamlines collaboration" is about you. "Finish your design review in half the time" is about them. The switch in subject alone usually improves clarity and response rate.' },
        { title: 'Cut every word that isn\'t doing work', body: 'After a first draft, go sentence by sentence and ask: what does this word add? "Really," "very," "actually," "in order to," "a wide variety of" — these add length without meaning. The target is the shortest version that conveys the full idea. Shorter copy also gets read; long copy gets skimmed.' },
        { title: 'Specificity beats superlatives', body: '"Best-in-class onboarding experience" means nothing. "New users complete their first project in under 8 minutes" means something. Replace every adjective that signals quality ("powerful," "seamless," "intuitive") with a specific, verifiable claim. If you can\'t find one, that\'s a sign the claim itself is weak.' },
        { title: 'Match tone to context', body: 'A LinkedIn bio, a product hero, and an error message require different tones — all of them should still sound like a person. Error messages especially: "Something went wrong" is cold and useless. "We couldn\'t save your work — try again or check your connection" is direct, helpful, and human. Tone is a design decision.' },
        { title: 'Read it out loud', body: 'If you trip over a sentence when reading it aloud, your users will too. This one test catches awkward phrasing, run-on sentences, and overly formal language faster than any other editing pass. If it doesn\'t sound like something a person would say, rewrite it until it does.' },
      ],
      footer: 'Paste the copy you\'re working on and I\'ll give you a specific rewrite with notes.',
    }
  }

  if (m.includes('design system') || m.includes('component') || m.includes('token') || m.includes('library')) {
    return {
      title: 'Design systems — building for scale without slowing down',
      items: [
        { title: 'Start with decisions, not components', body: 'Most design systems fail because they start by building a component library before establishing the decisions that should govern it. Define your spacing scale, type scale, and color system first. Components built on a shared decision layer are consistent by default. Components built ad hoc are consistent only by accident.' },
        { title: 'Name for intent, not appearance', body: 'A token named "blue-500" breaks as soon as brand colors change. A token named "color-action-primary" describes what the color does, not what it looks like — it survives a rebrand. The same principle applies to component names: "card" is fragile; "media-preview" is durable.' },
        { title: 'Document the decision, not just the output', body: 'Most component documentation shows how to use the component but not why it was built the way it was. The most valuable documentation explains the constraint or tradeoff that led to the current design: "This button doesn\'t have a size variant because usage data showed 94% of instances used the same size." That context prevents future designers from re-opening resolved decisions.' },
        { title: 'Version with intent', body: 'A design system that changes without notice destroys team trust. Every breaking change — a component rename, a prop removed, a behavior shift — should be communicated, with a migration path. Non-breaking changes (adding a new variant, fixing a bug) can ship continuously. The distinction matters for adoption.' },
        { title: 'Measure adoption, not completeness', body: 'A system with 200 components at 20% adoption is worse than a system with 20 components at 90% adoption. Track which components are actually being used in production, which are being bypassed, and why. The bypasses are the most valuable signal — they reveal either a gap in the system or a component that doesn\'t work for real product needs.' },
      ],
      footer: 'Tell me where your system is today and what\'s breaking down — I can help prioritize what to build or fix next.',
    }
  }

  // Generic fallback — still a real, long, useful response
  const preview = userMessage.length > 60 ? `${userMessage.slice(0, 60)}…` : userMessage
  return {
    title: `Here's how I'd think through: "${preview}"`,
    items: [
      { title: 'Define the user goal first', body: 'Before jumping to solutions, get specific about what the user is trying to accomplish at this exact moment. Not their broader goal — the immediate one. A user on a checkout screen isn\'t trying to "buy something," they\'re trying to confirm a specific set of choices without making a mistake they can\'t undo. The narrower you define the goal, the more useful your design decisions become.' },
      { title: 'Map the friction points', body: 'Walk the current experience step by step and ask: where does the user have to make a decision? Where do they have to wait? Where might they feel uncertain? Each of those is a potential friction point. You don\'t have to solve all of them — but you should know where they are before deciding which ones matter most.' },
      { title: 'Identify the one thing that moves the needle', body: 'Most design problems have one underlying cause that, if solved, resolves several surface-level symptoms. Find that lever. It\'s usually not the most visible problem — it\'s the one that\'s blocking progress at the earliest point in the flow. Fix that first; everything downstream becomes easier.' },
      { title: 'Prototype at the lowest fidelity that answers the question', body: 'A common mistake is spending time on visual polish before validating the core interaction. If the question is "will users understand this flow?", a paper sketch or a simple Figma prototype with placeholder text answers it just as well as a pixel-perfect design — and takes a fraction of the time. Match fidelity to the decision you\'re trying to make.' },
      { title: 'Ship small, measure, iterate', body: 'The most useful feedback comes from real usage, not from design reviews or stakeholder walkthroughs. Get something in front of actual users as fast as possible, with just enough fidelity to test the assumption you care about most. Treat the first version as a learning instrument, not a finished product.' },
    ],
    footer: 'Give me more context about your specific situation and I can give you more targeted advice.',
  }
}

const renderBranchContent = (content) =>
  content.split('\n\n').map((block, i) => {
    const labelMatch = block.match(/^\*\*(.+?)\*\*\n([\s\S]*)/)
    if (labelMatch) {
      return (
        <div key={i} className={i > 0 ? 'mt-3' : ''}>
          <p className="mb-0.5 font-semibold text-white">{labelMatch[1]}</p>
          <p className="text-[#c0c0c0]">{labelMatch[2]}</p>
        </div>
      )
    }
    return (
      <p key={i} className={`text-[#c0c0c0] ${i > 0 ? 'mt-3' : ''}`}>
        {block}
      </p>
    )
  })

const formatSelectionLabel = (text) => {
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= 80) return `"${trimmed}"`
  return `"${trimmed.slice(0, 80)}..."`
}

const getPreview = (chatId, chatStatesMap) => {
  const thread = chatThreads[chatId]
  if (thread) {
    const firstUser = thread.find((m) => m.role === 'user')
    if (firstUser) return firstUser.content
  }
  const state = chatStatesMap[chatId]
  if (state?.messages?.length > 0) {
    const firstUser = state.messages.find((m) => m.role === 'user')
    if (firstUser) return firstUser.content
  }
  return 'No messages yet'
}

const formatRelativeDate = (timestamp) => {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const Icon = ({ name, className }) => {
  const base = `w-4 h-4 ${className || ''}`
  switch (name) {
    case 'new-chat':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M14 4h6v6" />
          <path d="M20 4l-9 9" />
          <path d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
        </svg>
      )
    case 'plus':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )
    case 'search':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      )
    case 'image':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M6 16l4-4 3 3 3-3 2 2" />
        </svg>
      )
    case 'archive':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="4" width="16" height="5" rx="1" />
          <rect x="5" y="9" width="14" height="11" rx="1.5" />
          <path d="M9 12h6" />
        </svg>
      )
    case 'apps':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="5" width="6" height="6" rx="1" />
          <rect x="14" y="5" width="6" height="6" rx="1" />
          <rect x="4" y="13" width="6" height="6" rx="1" />
          <rect x="14" y="13" width="6" height="6" rx="1" />
        </svg>
      )
    case 'codex':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9 10l2.5 2L9 14" />
          <path d="M13 14h3" />
        </svg>
      )
    case 'circle':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="7" />
        </svg>
      )
    case 'cube':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" />
          <path d="M12 7l8 4M12 7L4 11" />
        </svg>
      )
    case 'folder':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 7h6l2 2h10v10a2 2 0 0 1-2 2H3z" />
        </svg>
      )
    case 'caret':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 9l6 6 6-6" />
        </svg>
      )
    case 'dots':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="6" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="18" cy="12" r="1.6" />
        </svg>
      )
    case 'group':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M4 19a5 5 0 0 1 10 0" />
          <path d="M14.5 19a4 4 0 0 1 6.5-2" />
        </svg>
      )
    case 'pin':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 3h8l-1.5 4.5 2.5 2.5-4.5 1.5-2 6-2-6L4 10l2.5-2.5L8 3z" />
          <path d="M12 17v4" />
        </svg>
      )
    case 'flag':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 3v18" />
          <path d="M5 4h10l-1.5 3 1.5 3H5" />
        </svg>
      )
    case 'trash':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 7h16" />
          <path d="M9 7V4h6v3" />
          <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
        </svg>
      )
    case 'chevron-right':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 6l6 6-6 6" />
        </svg>
      )
    case 'share':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 16V4" />
          <path d="M8 8l4-4 4 4" />
          <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
        </svg>
      )
    case 'menu':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 12h14M5 6h14M5 18h14" />
        </svg>
      )
    case 'mic':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v3" />
        </svg>
      )
    case 'send':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 12l18-9-5 18-4-7-9-2z" />
        </svg>
      )
    case 'voice':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 10v4" />
          <path d="M10 7v10" />
          <path d="M14 9v6" />
          <path d="M18 6v12" />
        </svg>
      )
    case 'x':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      )
    case 'reply':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 7H5v4" />
          <path d="M5 11c4.5 0 8.5-2 12-6" />
        </svg>
      )
    case 'branch':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="M6 8.5v7" />
          <path d="M8.5 6H14a4 4 0 0 1 4 4v5.5" />
        </svg>
      )
    case 'back':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      )
    case 'expand':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      )
    case 'stop':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <rect x="7" y="7" width="10" height="10" rx="2" />
        </svg>
      )
    case 'arrow-up':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5l-5 5M12 5l5 5" />
          <path d="M12 5v14" />
        </svg>
      )
    case 'copy':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="8.5" y="4" width="11" height="11" rx="3.8" />
          <rect x="4" y="8.5" width="11" height="11" rx="3.8" />
        </svg>
      )
    case 'thumb-up':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 11v8H4v-8h3zM9 11l4-7 3 2v5h4a2 2 0 0 1 2 2l-1 6a2 2 0 0 1-2 2H9z" />
        </svg>
      )
    case 'thumb-down':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 13v-8H4v8h3zM9 13l4 7 3-2v-5h4a2 2 0 0 0 2-2l-1-6a2 2 0 0 0-2-2H9z" />
        </svg>
      )
    case 'repeat':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 7h11a4 4 0 0 1 4 4v1" />
          <path d="M7 4l-3 3 3 3" />
          <path d="M20 17H9a4 4 0 0 1-4-4v-1" />
          <path d="M17 20l3-3-3-3" />
        </svg>
      )
    default:
      return <span className="block w-4 h-4" />
  }
}

const SidebarItem = ({ icon, label, active, onClick, muted }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
      active ? 'bg-[#2b2b2b] text-white' : muted ? 'text-[#bdbdbd]' : 'text-[#d6d6d6]'
    } hover:bg-[#2b2b2b]`}
  >
    <span className="text-[#9b9b9b]">
      <Icon name={icon} />
    </span>
    <span className="truncate">{label}</span>
  </button>
)

const SidebarSection = ({ title, children, action }) => (
  <div className="mt-4">
    <div className="flex items-center justify-between px-3 pb-2">
      <p className="text-xs uppercase tracking-wide text-[#7b7b7b]">
        {title}
      </p>
      {action || null}
    </div>
    <div className="space-y-1">{children}</div>
  </div>
)

const TopBar = ({
  title,
  onOpenBranches,
  branchCount,
  isBranchesActive,
  showBranches,
  showActions,
  menuOpen,
  setMenuOpen,
}) => {
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen, setMenuOpen])

  return (
    <div className="flex items-center justify-between px-8 pt-6">
      <div className="flex items-center gap-2 text-sm text-[#d9d9d9]">
        <span className="font-medium">{title}</span>
        <Icon name="caret" className="text-[#8d8d8d]" />
      </div>
      {showActions ? (
        <div className="relative flex items-center gap-4 text-[#b0b0b0]" ref={menuRef}>
          {showBranches ? (
            <button
              type="button"
              onClick={onOpenBranches}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                isBranchesActive
                  ? 'border-[#3a3a3a] bg-[#242424] text-white'
                  : 'border-[#2a2a2a] text-[#cfcfcf] hover:bg-[#2a2a2a]'
              }`}
            >
              <Icon name="branch" className="text-white/80" />
              <span>Branches</span>
            </button>
          ) : null}
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-[#2a2a2a] px-3 py-1.5 text-sm text-[#cfcfcf] transition hover:bg-[#2a2a2a]"
          >
            <Icon name="share" />
            <span>Share</span>
          </button>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-full border border-[#2a2a2a] p-2 text-[#cfcfcf] transition hover:bg-[#2a2a2a]"
          >
            <Icon name="dots" />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 text-sm text-[#e0e0e0] shadow-gpt-soft">
              <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#2a2a2a]">
                <Icon name="group" />
                <span>Start a group chat</span>
              </button>
              <button type="button" className="flex w-full items-center justify-between rounded-xl px-3 py-2 hover:bg-[#2a2a2a]">
                <span className="flex items-center gap-3">
                  <Icon name="folder" />
                  <span>Move to project</span>
                </span>
                <Icon name="chevron-right" className="text-[#8c8c8c]" />
              </button>
              <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#2a2a2a]">
                <Icon name="pin" />
                <span>Pin chat</span>
              </button>
              <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#2a2a2a]">
                <Icon name="archive" />
                <span>Archive</span>
              </button>
              <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#2a2a2a]">
                <Icon name="flag" />
                <span>Report</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-red-400 hover:bg-[#2a2a2a]"
              >
                <Icon name="trash" className="text-red-400" />
                <span>Delete</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

const ChatInput = ({
  placeholder,
  quote,
  onClearQuote,
  value,
  onChange,
  onSend,
  isThinking,
  onStop,
  inputRef,
  queue,
  queueingEnabled,
  queueMenuId,
  onToggleQueueMenu,
  onSendNow,
  onDeleteQueueItem,
  onEditQueueItem,
  onToggleQueueing,
}) => {
  const [internalValue, setInternalValue] = useState('')
  const inputValue = value ?? internalValue

  const handleChange = (nextValue) => {
    if (onChange) {
      onChange(nextValue)
    } else {
      setInternalValue(nextValue)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    if (onSend) {
      onSend(trimmed)
    }
    if (!onChange) {
      setInternalValue('')
    }
  }

  const canSend = inputValue.trim().length > 0

  const hasQueue = queue && queue.length > 0
  const showQueueSection = hasQueue || queueingEnabled === false

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-8">
      <form
        onSubmit={handleSubmit}
        className={`relative z-0 overflow-hidden border border-[#2a2a2a] bg-[#2b2b2b] shadow-gpt-soft ${
          quote || hasQueue ? 'rounded-[20px]' : 'rounded-full'
        }`}
      >
        {showQueueSection ? (
          <div className="border-b border-[#2a2a2a] bg-[#1f1f1f]">
            {!hasQueue && queueingEnabled === false ? (
              <div className="flex items-center justify-between px-5 py-3 text-xs text-[#cfcfcf]">
                <span>Queueing is off</span>
                <button
                  type="button"
                  onClick={onToggleQueueing}
                  className="rounded-full bg-[#2a2a2a] px-3 py-1 text-[11px] text-white hover:bg-[#333333]"
                >
                  Turn on
                </button>
              </div>
            ) : null}
            {hasQueue
              ? queue.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative flex items-center justify-between px-5 py-1.5 transition hover:bg-[#242424]"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Icon name="reply" className="h-4 w-4 shrink-0 text-[#6b6b6b]" />
                      <span className="min-w-0 flex-1 truncate text-sm text-[#cfcfcf]">{item.content}</span>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onSendNow(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9b9b9b] transition hover:bg-[#2a2a2a] hover:text-white"
                        aria-label="Send now"
                      >
                        <Icon name="arrow-up" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteQueueItem(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9b9b9b] transition hover:bg-[#2a2a2a] hover:text-white"
                        aria-label="Delete"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleQueueMenu(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9b9b9b] transition hover:bg-[#2a2a2a] hover:text-white"
                        aria-label="More options"
                      >
                        <Icon name="dots" className="h-4 w-4" />
                      </button>
                    </div>
                    {queueMenuId === item.id ? (
                      <div className="absolute right-2 top-[calc(100%+8px)] z-20 w-48 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 text-xs text-[#e0e0e0] shadow-gpt-soft">
                        <button
                          type="button"
                          onClick={() => onEditQueueItem(item.id)}
                          className="flex w-full items-center rounded-lg px-3 py-2 text-left hover:bg-[#2a2a2a]"
                        >
                          Edit message
                        </button>
                        <button
                          type="button"
                          onClick={onToggleQueueing}
                          className="flex w-full items-center rounded-lg px-3 py-2 text-left hover:bg-[#2a2a2a]"
                        >
                          {queueingEnabled ? 'Turn off queueing' : 'Turn on queueing'}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))
              : null}
          </div>
        ) : null}
        <div className={`${hasQueue ? 'px-3 pt-3 pb-3' : quote ? 'px-3 py-3' : 'px-4 py-3'}`}>
        {quote ? (
          <div className="mb-2 flex items-center justify-between rounded-xl bg-[#3a3a3a] px-3 py-2 text-sm text-[#d6d6d6]">
            <span className="flex min-w-0 items-center gap-2 text-[#e0e0e0]">
              <Icon name="reply" className="text-[#b5b5b5]" />
              <span className="truncate">{formatSelectionLabel(quote)}</span>
            </span>
            <button
              type="button"
              onClick={onClearQuote}
              className="ml-3 rounded-full p-1 text-[#9c9c9c] hover:text-white"
              aria-label="Clear selection"
            >
              <Icon name="x" />
            </button>
          </div>
        ) : null}
        <div className={`flex items-center gap-3 ${quote ? 'px-1' : ''}`}>
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#3a3a3a] text-white/90"
          >
            <Icon name="plus" />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(event) => handleChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-[#e8e8e8] placeholder:text-[#9b9b9b] focus:outline-none"
          />
          <button type="button" className="rounded-full p-2 text-[#9b9b9b] hover:text-white">
            <Icon name="mic" />
          </button>
          {isThinking && !canSend ? (
            <button
              type="button"
              onClick={onStop}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white"
            >
              <Icon name="stop" />
            </button>
          ) : canSend ? (
            <button
              type="submit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white"
            >
              <Icon name="arrow-up" />
            </button>
          ) : (
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white"
            >
              <Icon name="voice" />
            </button>
          )}
        </div>
        </div>
      </form>
    </div>
  )
}

const BranchInput = ({ placeholder, value, onChange, onSend, disabled }) => (
  <form
    onSubmit={(event) => {
      event.preventDefault()
      onSend()
    }}
    className="w-full rounded-full border border-[#2a2a2a] bg-[#2b2b2b] px-4 py-3 shadow-gpt-soft"
  >
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#3a3a3a] text-white/90"
      >
        <Icon name="plus" />
      </button>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent text-sm text-[#e8e8e8] placeholder:text-[#9b9b9b] focus:outline-none disabled:opacity-50"
      />
      <button type="button" className="rounded-full p-2 text-[#9b9b9b] hover:text-white">
        <Icon name="mic" />
      </button>
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white disabled:opacity-50"
      >
        <Icon name="voice" />
      </button>
    </div>
  </form>
)

const BranchPanel = ({
  open,
  view,
  branches,
  activeBranch,
  branchInput,
  onBranchInputChange,
  onSendBranchMessage,
  onClose,
  onBack,
  onOpenBranch,
}) => {
  if (!open) return null

  return (
    <aside className="fixed right-6 top-20 z-40 flex h-[calc(100vh-6rem)] w-80 flex-col rounded-2xl border border-[#2a2a2a] bg-[#1b1b1b] shadow-gpt-soft">
      <div className="flex items-center justify-between border-b border-[#2a2a2a] px-4 py-3 text-sm text-[#e0e0e0]">
        <div className="flex items-center gap-2">
          {view === 'active' ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full p-1 text-[#9c9c9c] hover:bg-[#2a2a2a] hover:text-white"
              aria-label="Back to history"
            >
              <Icon name="back" />
            </button>
          ) : null}
          <span className="font-medium">{view === 'active' ? 'Branch chat' : 'Branch chats'}</span>
          {view === 'history' && branches.length > 0 ? (
            <span className="rounded-full bg-[#2a2a2a] px-2 text-xs text-[#d0d0d0]">{branches.length}</span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-[#9c9c9c] hover:bg-[#2a2a2a] hover:text-white"
          aria-label="Close branches"
        >
          <Icon name="x" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-[#cfcfcf] scrollbar-thin">
        {view === 'history' ? (
          branches.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4 text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#d6d6d6]">No branches yet.</p>
                <p className="text-xs text-[#8f8f8f]">
                  Create one from a selection. Branch history is saved per chat.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => onOpenBranch(branch)}
                  className="flex w-full flex-col gap-1 rounded-xl border border-[#2a2a2a] bg-[#242424] px-3 py-3 text-left transition hover:bg-[#2b2b2b]"
                >
                  <div className="flex items-center justify-between text-xs text-[#9c9c9c]">
                    <span>Branch</span>
                    <span>{branch.time}</span>
                  </div>
                  <div className="text-sm text-white">{branch.title}</div>
                  <div className="text-xs text-[#b5b5b5]">{branch.snippet}</div>
                </button>
              ))}
            </div>
          )
        ) : (
            <div className="space-y-3">
              {activeBranch ? (
                <>
                  <div className="rounded-xl bg-[#2f2f2f] px-3 py-2 text-xs text-[#cfcfcf]">
                    Branching from: {formatSelectionLabel(activeBranch.seed)}
                  </div>
                  <div className="space-y-3">
                    {activeBranch.messages.length === 0 ? (
                      <p className="text-[#b7b7b7]">Start a focused branch conversation here.</p>
                    ) : (
                      activeBranch.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                              message.role === 'user'
                                ? 'bg-[#0b3f8f] text-white'
                                : 'bg-[#2a2a2a] text-[#e0e0e0]'
                            }`}
                          >
                            {message.role === 'assistant'
                              ? renderBranchContent(message.content)
                              : message.content}
                          </div>
                        </div>
                      ))
                    )}
                    {activeBranch.isThinking ? (
                      <div className="text-xs text-[#9c9c9c]">Thinking…</div>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl border border-dashed border-[#2a2a2a] px-3 py-4 text-center text-[#9c9c9c]">
                    No active branch yet. Create one from a selection.
                  </div>
                  <p className="text-[#b7b7b7]">Start a focused branch conversation here.</p>
                </>
              )}
          </div>
        )}
      </div>

      {view === 'active' ? (
        <div className="border-t border-[#2a2a2a] px-4 py-4">
          <BranchInput
            placeholder="Ask in branch"
            value={branchInput}
            onChange={onBranchInputChange}
            onSend={onSendBranchMessage}
            disabled={!activeBranch}
          />
        </div>
      ) : (
        <div className="border-t border-[#2a2a2a] px-4 py-3 text-xs text-[#9c9c9c]"> </div>
      )}
    </aside>
  )
}

const ChatHistoryRow = ({ chat, preview, isSelected, onToggle, onOpen, onDelete, onArchive }) => (
  <div className="group flex items-center gap-4 px-6 py-3 transition hover:bg-[#2b2b2b] border-b border-[#2a2a2a]/50">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={onToggle}
      className="h-4 w-4 shrink-0 cursor-pointer rounded border-[#3a3a3a] bg-transparent accent-[#1d4ed8]"
    />
    <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 flex-col text-left">
      <div className="flex items-center gap-2">
        <span className="truncate text-sm font-medium text-[#e5e5e5]">{chat.label}</span>
        {chat.archived ? (
          <span className="rounded bg-[#2a2a2a] px-1.5 py-0.5 text-[10px] text-[#8d8d8d]">Archived</span>
        ) : null}
      </div>
      <p className="mt-0.5 truncate text-xs text-[#8d8d8d]">{preview}</p>
    </button>
    <span className="shrink-0 w-20 text-right text-xs text-[#7b7b7b]">{formatRelativeDate(chat.createdAt)}</span>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onArchive}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[#9b9b9b] transition hover:bg-[#3a3a3a] hover:text-white"
      >
        <Icon name="archive" className="h-3.5 w-3.5" />
        <span>{chat.archived ? 'Unarchive' : 'Archive'}</span>
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-red-400 transition hover:bg-[#3a3a3a] hover:text-red-300"
      >
        <Icon name="trash" className="h-3.5 w-3.5" />
        <span>Delete</span>
      </button>
    </div>
  </div>
)

const ChatHistoryToolbar = ({ count, onDelete, onArchive, onMoveToProject, onClear, projects }) => {
  const [showProjects, setShowProjects] = useState(false)
  return (
    <div className="sticky bottom-6 z-30 mx-auto flex items-center gap-3 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-5 py-3 shadow-gpt-soft">
      <span className="text-sm text-[#cfcfcf]">{count} selected</span>
      <div className="h-4 w-px bg-[#2a2a2a]" />
      <button
        type="button"
        onClick={onArchive}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[#cfcfcf] hover:bg-[#2a2a2a]"
      >
        <Icon name="archive" className="h-4 w-4" />
        <span>Archive</span>
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowProjects((p) => !p)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[#cfcfcf] hover:bg-[#2a2a2a]"
        >
          <Icon name="folder" className="h-4 w-4" />
          <span>Move to project</span>
        </button>
        {showProjects ? (
          <div className="absolute bottom-full left-0 mb-2 w-52 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 text-sm text-[#e0e0e0] shadow-gpt-soft">
            {projects
              .filter((p) => p.id !== 'proj-new')
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onMoveToProject(p.id)
                    setShowProjects(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-[#2a2a2a]"
                >
                  <Icon name="folder" className="h-4 w-4 text-[#9b9b9b]" />
                  <span>{p.label}</span>
                </button>
              ))}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-[#2a2a2a]"
      >
        <Icon name="trash" className="h-4 w-4 text-red-400" />
        <span>Delete</span>
      </button>
      <div className="h-4 w-px bg-[#2a2a2a]" />
      <button type="button" onClick={onClear} className="text-sm text-[#8d8d8d] hover:text-white">
        Cancel
      </button>
    </div>
  )
}

const ChatHistoryView = ({
  chats,
  chatStatesMap,
  search,
  onSearchChange,
  sortBy,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onOpenChat,
  onDeleteChats,
  onArchiveChats,
  onMoveToProject,
  onClearSelection,
  projectsList,
}) => {
  const selectAllRef = useRef(null)

  const filtered = useMemo(() => {
    let result = chats
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter((c) => {
        const titleMatch = c.label.toLowerCase().includes(term)
        const preview = getPreview(c.id, chatStatesMap)
        return titleMatch || preview.toLowerCase().includes(term)
      })
    }
    if (sortBy === 'date') {
      result = [...result].sort((a, b) => b.createdAt - a.createdAt)
    } else {
      result = [...result].sort((a, b) => a.label.localeCompare(b.label))
    }
    return result
  }, [chats, chatStatesMap, search, sortBy])

  const visibleSelectedCount = filtered.filter((c) => selectedIds.has(c.id)).length
  const allSelected = filtered.length > 0 && visibleSelectedCount === filtered.length
  const someSelected = visibleSelectedCount > 0 && !allSelected

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="px-8 pt-2 pb-4">
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b7b7b]" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2b2b2b] py-2.5 pl-10 pr-4 text-sm text-[#e8e8e8] placeholder:text-[#7b7b7b] focus:border-[#3a3a3a] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-[#2a2a2a] px-6 py-2 text-xs text-[#8d8d8d]">
        <input
          ref={selectAllRef}
          type="checkbox"
          checked={allSelected}
          onChange={() => onSelectAll(filtered)}
          className="h-4 w-4 shrink-0 cursor-pointer rounded border-[#3a3a3a] bg-transparent accent-[#1d4ed8]"
        />
        <span className="flex-1">Title</span>
        <span className="w-20 text-right">Date</span>
        <span className="w-[72px]" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
            <Icon name={search ? 'search' : 'new-chat'} className="h-10 w-10 text-[#4a4a4a] mb-4" />
            <h3 className="text-lg font-medium text-[#e5e5e5]">
              {search ? 'No matching chats' : 'No chats yet'}
            </h3>
            <p className="mt-1 text-sm text-[#8d8d8d]">
              {search ? 'Try a different search term.' : 'Start a new conversation to see it here.'}
            </p>
          </div>
        ) : (
          filtered.map((chat) => (
            <ChatHistoryRow
              key={chat.id}
              chat={chat}
              preview={getPreview(chat.id, chatStatesMap)}
              isSelected={selectedIds.has(chat.id)}
              onToggle={() => onToggleSelect(chat.id)}
              onOpen={() => onOpenChat(chat.id)}
              onDelete={() => onDeleteChats([chat.id])}
              onArchive={() => onArchiveChats([chat.id])}
            />
          ))
        )}
      </div>

      {visibleSelectedCount > 0 ? (
        <ChatHistoryToolbar
          count={visibleSelectedCount}
          onDelete={() => onDeleteChats([...selectedIds])}
          onArchive={() => onArchiveChats([...selectedIds])}
          onMoveToProject={(projectId) => onMoveToProject([...selectedIds], projectId)}
          onClear={onClearSelection}
          projects={projectsList}
        />
      ) : null}
    </div>
  )
}

export default function App() {
  const [activeChatId, setActiveChatId] = useState(null)
  const [selection, setSelection] = useState(null)
  const [quote, setQuote] = useState('')
  const [branches, setBranches] = useState([])
  const [activeBranchId, setActiveBranchId] = useState(null)
  const [branchInput, setBranchInput] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredAction, setHoveredAction] = useState(null)
  const [chatStates, setChatStates] = useState({})
  const [chatInput, setChatInput] = useState('')
  const [queueMenuId, setQueueMenuId] = useState(null)
  const [isBranchPanelOpen, setIsBranchPanelOpen] = useState(false)
  const [branchView, setBranchView] = useState('history')
  const [chatList, setChatList] = useState(initialChats)
  const [historyView, setHistoryView] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const [historySortBy, setHistorySortBy] = useState('date')
  const [historySelectedIds, setHistorySelectedIds] = useState(new Set())
  const chatContainerRef = useRef(null)
  const mainInputRef = useRef(null)
  const mainTimersRef = useRef({})
  const getSelectableAncestor = (node) => {
    if (!node) return null
    const element = node.nodeType === 1 ? node : node.parentElement
    if (!element) return null
    return element.closest('[data-selectable="assistant"]')
  }

  const activeChatLabel = useMemo(() => {
    const match = chatList.find((chat) => chat.id === activeChatId)
    return match?.label || 'ChatGPT 5.2'
  }, [activeChatId, chatList])

  const currentMessages = useMemo(() => {
    if (!activeChatId) return []
    return chatThreads[activeChatId] || []
  }, [activeChatId])

  const activeChatState = useMemo(() => {
    if (!activeChatId) return defaultChatState
    return chatStates[activeChatId] || defaultChatState
  }, [chatStates, activeChatId])

  const combinedMessages = useMemo(() => {
    if (!activeChatId) return []
    return [...currentMessages, ...activeChatState.messages]
  }, [currentMessages, activeChatState, activeChatId])

  const turns = useMemo(() => {
    const result = []
    let current = null

    combinedMessages.forEach((message) => {
      if (message.role === 'user') {
        if (current) result.push(current)
        current = { id: message.id, user: message, assistant: null }
        return
      }

      if (!current) {
        result.push({ id: message.id, user: null, assistant: message })
        return
      }

      if (!current.assistant) {
        current.assistant = message
        result.push(current)
        current = null
        return
      }

      result.push(current)
      current = { id: message.id, user: null, assistant: message }
    })

    if (current) result.push(current)
    return result
  }, [combinedMessages])

  const activeBranch = useMemo(
    () => branches.find((branch) => branch.id === activeBranchId) || null,
    [branches, activeBranchId]
  )

  const updateChatState = (chatId, updater) => {
    setChatStates((prev) => {
      const current = prev[chatId] || defaultChatState
      const updated = updater(current)
      return { ...prev, [chatId]: updated }
    })
  }

  const clearChatTimer = (chatId) => {
    const timer = mainTimersRef.current[chatId]
    if (timer) {
      window.clearTimeout(timer)
      delete mainTimersRef.current[chatId]
    }
  }

  const handleSelection = () => {
    const selectionObj = window.getSelection()
    if (!selectionObj || selectionObj.isCollapsed) {
      setSelection(null)
      return
    }
    const text = selectionObj.toString().trim()
    if (!text) {
      setSelection(null)
      return
    }
    const anchorNode = selectionObj.anchorNode
    if (chatContainerRef.current && anchorNode && !chatContainerRef.current.contains(anchorNode)) {
      setSelection(null)
      return
    }
    const assistantAnchor = getSelectableAncestor(selectionObj.anchorNode)
    const assistantFocus = getSelectableAncestor(selectionObj.focusNode)
    if (!assistantAnchor || !assistantFocus || assistantAnchor !== assistantFocus) {
      setSelection(null)
      return
    }
    const range = selectionObj.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    if (!rect || rect.width === 0) {
      setSelection(null)
      return
    }
    setSelection({ text, rect })
  }

  const handleAsk = () => {
    if (!selection?.text) return
    setQuote(selection.text)
    setSelection(null)
    const selectionObj = window.getSelection()
    if (selectionObj) selectionObj.removeAllRanges()
  }

  const handleCreateBranch = () => {
    if (!selection?.text) return
    const trimmed = selection.text.replace(/\s+/g, ' ').trim()
    const entry = {
      id: `branch-${Date.now()}`,
      title: trimmed.length > 40 ? `${trimmed.slice(0, 40)}...` : trimmed,
      snippet: formatSelectionLabel(trimmed),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      seed: trimmed,
      messages: [],
      isThinking: false,
    }
    setBranches((prev) => [entry, ...prev])
    setActiveBranchId(entry.id)
    setIsBranchPanelOpen(true)
    setBranchView('active')
    setSelection(null)
    const selectionObj = window.getSelection()
    if (selectionObj) selectionObj.removeAllRanges()
  }

  const sendBranchMessage = () => {
    if (!activeBranch || !branchInput.trim()) return
    const content = branchInput.trim()
    const branchId = activeBranch.id
    const seed = activeBranch.seed
    const priorMessages = activeBranch.messages
    setBranchInput('')
    setBranches((prev) =>
      prev.map((branch) =>
        branch.id === branchId
          ? {
              ...branch,
              messages: [
                ...branch.messages,
                { id: `msg-${Date.now()}`, role: 'user', content },
              ],
              isThinking: true,
            }
          : branch
      )
    )

    window.setTimeout(() => {
      const response = getBranchResponse(seed, content, priorMessages)
      setBranches((prev) =>
        prev.map((branch) =>
          branch.id === branchId
            ? {
                ...branch,
                messages: [
                  ...branch.messages,
                  { id: `msg-${Date.now()}-a`, role: 'assistant', content: response },
                ],
                isThinking: false,
              }
            : branch
        )
      )
    }, 700)
  }

  const handleLandingSubmit = (content) => {
    const trimmed = content.trim()
    if (!trimmed) return
    const words = trimmed.split(/\s+/)
    const label = words.slice(0, 5).join(' ') + (words.length > 5 ? '…' : '')
    const newChat = {
      id: `chat-${Date.now()}`,
      label,
      createdAt: Date.now(),
      archived: false,
      projectId: null,
    }
    setChatList((prev) => [newChat, ...prev])
    setActiveChatId(newChat.id)
    setChatStates((prev) => ({
      ...prev,
      [newChat.id]: {
        ...defaultChatState,
        messages: [{ id: `msg-${Date.now()}`, role: 'user', content: trimmed }],
        isThinking: true,
      },
    }))
    const chatId = newChat.id
    mainTimersRef.current[chatId] = window.setTimeout(() => {
      setChatStates((prev) => {
        const current = prev[chatId] || defaultChatState
        return {
          ...prev,
          [chatId]: {
            ...current,
            messages: [
              ...current.messages,
              {
                id: `msg-${Date.now()}-a`,
                role: 'assistant',
                ...getLandingResponse(trimmed),
              },
            ],
            isThinking: false,
          },
        }
      })
    }, 12000)
  }

  const sendMainMessage = (content) => {
    if (!activeChatId) return
    const trimmed = content.trim()
    if (!trimmed) return
    let queued = false

    updateChatState(activeChatId, (state) => {
      if (state.isThinking) {
        if (state.queueingEnabled) {
          queued = true
          return {
            ...state,
            queue: [...state.queue, { id: `queue-${Date.now()}`, content: trimmed }],
          }
        }
        clearChatTimer(activeChatId)
        return {
          ...state,
          isThinking: true,
          messages: [...state.messages, { id: `msg-${Date.now()}`, role: 'user', content: trimmed }],
          queue: state.queue,
        }
      }

      return {
        ...state,
        messages: [...state.messages, { id: `msg-${Date.now()}`, role: 'user', content: trimmed }],
        isThinking: true,
      }
    })

    setChatInput('')

    if (queued) return

    const scheduleResponse = (message) => {
      clearChatTimer(activeChatId)
      mainTimersRef.current[activeChatId] = window.setTimeout(() => {
        let nextContent = null
        updateChatState(activeChatId, (state) => {
          const allPrior = [...(chatThreads[activeChatId] || []), ...state.messages]
          const reply = {
            id: `msg-${Date.now()}-a`,
            role: "assistant",
            ...getMainChatResponse(message, allPrior),
          }

          if (state.queueingEnabled && state.queue.length > 0) {
            const [nextItem, ...rest] = state.queue
            nextContent = nextItem.content
            return {
              ...state,
              messages: [
                ...state.messages,
                reply,
                { id: `msg-${Date.now()}-q`, role: 'user', content: nextItem.content },
              ],
              isThinking: true,
              queue: rest,
            }
          }

          return {
            ...state,
            messages: [...state.messages, reply],
            isThinking: false,
          }
        })

        if (nextContent) {
          scheduleResponse(nextContent)
        }
      }, RESPONSE_DELAY_MS)
    }

    scheduleResponse(trimmed)
  }

  const stopMainThinking = () => {
    if (!activeChatId) return
    clearChatTimer(activeChatId)
    updateChatState(activeChatId, (state) => ({ ...state, isThinking: false }))
  }

  const sendQueuedNow = (id) => {
    if (!activeChatId) return
    const item = activeChatState.queue.find((q) => q.id === id)
    if (!item) return
    const content = item.content

    clearChatTimer(activeChatId)
    updateChatState(activeChatId, (state) => ({
      ...state,
      queue: state.queue.filter((q) => q.id !== id),
      messages: [...state.messages, { id: `msg-${Date.now()}`, role: 'user', content }],
      isThinking: true,
    }))

    const chatId = activeChatId
    mainTimersRef.current[chatId] = window.setTimeout(() => {
      let nextContent = null
      updateChatState(chatId, (state) => {
        const allPrior = [...(chatThreads[chatId] || []), ...state.messages]
        const reply = {
          id: `msg-${Date.now()}-a`,
          role: "assistant",
          ...getMainChatResponse(content, allPrior),
        }
        if (state.queueingEnabled && state.queue.length > 0) {
          const [nextItem, ...rest] = state.queue
          nextContent = nextItem.content
          return {
            ...state,
            messages: [
              ...state.messages,
              reply,
              { id: `msg-${Date.now()}-q`, role: 'user', content: nextItem.content },
            ],
            isThinking: true,
            queue: rest,
          }
        }
        return { ...state, messages: [...state.messages, reply], isThinking: false }
      })
      if (nextContent) {
        sendMainMessage(nextContent)
      }
    }, RESPONSE_DELAY_MS)
  }

  const deleteQueued = (id) => {
    if (!activeChatId) return
    updateChatState(activeChatId, (state) => ({
      ...state,
      queue: state.queue.filter((q) => q.id !== id),
    }))
    setQueueMenuId(null)
  }

  const editQueued = (id) => {
    if (!activeChatId) return
    const item = activeChatState.queue.find((q) => q.id === id)
    if (!item) return
    updateChatState(activeChatId, (state) => ({
      ...state,
      queue: state.queue.filter((q) => q.id !== id),
    }))
    setChatInput(item.content)
    setQueueMenuId(null)
    window.setTimeout(() => {
      mainInputRef.current?.focus()
    }, 0)
  }

  const toggleQueueing = () => {
    if (!activeChatId) return
    updateChatState(activeChatId, (state) => ({
      ...state,
      queueingEnabled: !state.queueingEnabled,
    }))
    setQueueMenuId(null)
  }

  const openHistoryView = () => {
    setHistoryView(true)
    setHistorySelectedIds(new Set())
    setHistorySearch('')
    setIsBranchPanelOpen(false)
  }

  const closeHistoryView = () => {
    setHistoryView(false)
    setHistorySelectedIds(new Set())
  }

  const toggleHistorySelect = (chatId) => {
    setHistorySelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(chatId)) next.delete(chatId)
      else next.add(chatId)
      return next
    })
  }

  const selectAllVisible = (visibleChats) => {
    const allVisibleIds = visibleChats.map((c) => c.id)
    const allSelected = allVisibleIds.every((id) => historySelectedIds.has(id))
    if (allSelected) {
      setHistorySelectedIds(new Set())
    } else {
      setHistorySelectedIds(new Set(allVisibleIds))
    }
  }

  const deleteChats = (ids) => {
    const idSet = new Set(ids)
    setChatList((prev) => prev.filter((c) => !idSet.has(c.id)))
    setChatStates((prev) => {
      const next = { ...prev }
      ids.forEach((id) => delete next[id])
      return next
    })
    if (ids.includes(activeChatId)) {
      setActiveChatId(null)
    }
    setHistorySelectedIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }

  const archiveChats = (ids) => {
    const idSet = new Set(ids)
    setChatList((prev) => prev.map((c) => (idSet.has(c.id) ? { ...c, archived: !c.archived } : c)))
    if (ids.includes(activeChatId)) {
      setActiveChatId(null)
    }
    setHistorySelectedIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }

  const moveChatsToProject = (ids, projectId) => {
    const idSet = new Set(ids)
    setChatList((prev) => prev.map((c) => (idSet.has(c.id) ? { ...c, projectId } : c)))
    setHistorySelectedIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }

  useEffect(() => {
    if (!activeBranchId) return
    setBranchInput('')
  }, [activeBranchId])

  useEffect(() => {
    if (!activeChatId) {
      setIsMenuOpen(false)
    }
  }, [activeChatId])

  useEffect(() => {
    if (!activeChatId) return
    setChatInput('')
    setQueueMenuId(null)
  }, [activeChatId])

  useEffect(() => {
    if (!chatContainerRef.current) return
    const el = chatContainerRef.current
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight
    }
    scrollToBottom()
    window.requestAnimationFrame(scrollToBottom)
  }, [turns, activeChatId])

  return (
    <div className="h-screen bg-gpt-bg text-gpt-text">
      {historyView ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-gpt-bg">
          <div className="flex items-center justify-between px-8 pt-6 pb-2">
            <h2 className="text-lg font-medium text-white">Chat History</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setHistorySortBy('date')}
                  className={`rounded-lg px-3 py-1 text-xs transition ${
                    historySortBy === 'date' ? 'bg-[#2b2b2b] text-white' : 'text-[#8d8d8d] hover:text-white'
                  }`}
                >
                  Newest
                </button>
                <button
                  type="button"
                  onClick={() => setHistorySortBy('name')}
                  className={`rounded-lg px-3 py-1 text-xs transition ${
                    historySortBy === 'name' ? 'bg-[#2b2b2b] text-white' : 'text-[#8d8d8d] hover:text-white'
                  }`}
                >
                  A–Z
                </button>
              </div>
              <button
                type="button"
                onClick={closeHistoryView}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#9c9c9c] transition hover:bg-[#2a2a2a] hover:text-white"
                aria-label="Close"
              >
                <Icon name="x" />
              </button>
            </div>
          </div>
          <ChatHistoryView
            chats={chatList}
            chatStatesMap={chatStates}
            search={historySearch}
            onSearchChange={setHistorySearch}
            sortBy={historySortBy}
            selectedIds={historySelectedIds}
            onToggleSelect={toggleHistorySelect}
            onSelectAll={selectAllVisible}
            onOpenChat={(chatId) => {
              setActiveChatId(chatId)
              closeHistoryView()
            }}
            onDeleteChats={deleteChats}
            onArchiveChats={archiveChats}
            onMoveToProject={moveChatsToProject}
            onClearSelection={() => setHistorySelectedIds(new Set())}
            projectsList={projects}
          />
        </div>
      ) : null}
      <div className="flex h-full">
        <aside className="flex h-screen w-72 flex-col bg-gpt-panel">
          <div className="px-3 pt-5">
            <div className="flex items-center gap-2 px-2 pb-4 text-white">
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-black">
                <img
                  src={gptLogo}
                  alt="ChatGPT"
                  className="h-6 w-6 object-contain"
                />
              </div>
            </div>
            <div className="space-y-1">
              {sidebarTop.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => {
                    if (item.id === 'new') {
                      setActiveChatId(null)
                      setIsBranchPanelOpen(false)
                      setBranchView('history')
                      setActiveBranchId(null)
                    }
                  }}
                  muted={false}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
            <div className="mt-4 space-y-1">
              {sidebarScrollExtras.map((item) => (
                <SidebarItem key={item.id} icon={item.icon} label={item.label} muted={false} />
              ))}
            </div>
            <SidebarSection title="GPTs">
              {gptItems.map((item) => (
                <SidebarItem key={item.id} icon={item.icon} label={item.label} muted />
              ))}
            </SidebarSection>
            <SidebarSection title="Projects">
              {projects.map((item) => (
                <SidebarItem key={item.id} icon={item.icon} label={item.label} muted />
              ))}
              <button type="button" className="mt-1 flex items-center gap-2 px-3 py-2 text-sm text-[#a6a6a6]">
                <span className="text-lg">...</span>
                <span>See more</span>
              </button>
            </SidebarSection>
            <SidebarSection
              title="Your chats"
              action={
                <div className="group/tip relative">
                  <button
                    type="button"
                    onClick={openHistoryView}
                    className="rounded-md p-1 text-[#7b7b7b] transition hover:bg-[#2b2b2b] hover:text-white"
                    aria-label="View all chats"
                  >
                    <Icon name="expand" className="h-3.5 w-3.5" />
                  </button>
                  <div className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/90 px-3 py-1.5 text-[11px] text-white opacity-0 shadow-gpt-soft transition group-hover/tip:opacity-100">
                    View all chats
                  </div>
                </div>
              }
            >
              {chatList
                .filter((c) => !c.archived)
                .map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => {
                      setActiveChatId(chat.id)
                      closeHistoryView()
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-[#2b2b2b] ${
                      activeChatId === chat.id && !historyView ? 'bg-[#2b2b2b] text-white' : 'text-[#cfcfcf]'
                    }`}
                  >
                    <span className="truncate">{chat.label}</span>
                  </button>
                ))}
            </SidebarSection>
          </div>

          <div className="px-3 pb-4 pt-3 text-sm text-[#c9c9c9]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2b2b2b]">
                <span className="text-xs font-semibold">SH</span>
              </div>
              <div className="leading-tight">
                <div className="font-medium">Sue Hwang</div>
                <div className="text-xs text-[#8d8d8d]">Plus</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
          <TopBar
            title={activeChatId ? activeChatLabel : 'ChatGPT 5.2'}
            onOpenBranches={() => {
              if (isBranchPanelOpen && branchView === 'history') {
                setIsBranchPanelOpen(false)
              } else {
                setIsBranchPanelOpen(true)
                setBranchView('history')
              }
            }}
            branchCount={branches.length}
            isBranchesActive={isBranchPanelOpen && branchView === 'history'}
            showBranches={Boolean(activeChatId)}
            showActions={Boolean(activeChatId)}
            menuOpen={isMenuOpen}
            setMenuOpen={setIsMenuOpen}
          />

          {!activeChatId ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6">
              <h1 className="text-3xl font-medium text-white">Hey, Sue. Ready to dive in?</h1>
              <div className="mt-10 w-full">
                <ChatInput placeholder="Ask anything" onSend={handleLandingSubmit} />
              </div>
            </div>
          ) : (
            <div className="relative flex flex-1 min-h-0 flex-col">
              <BranchPanel
                open={isBranchPanelOpen}
                view={branchView}
                branches={branches}
                activeBranch={activeBranch}
                branchInput={branchInput}
                onBranchInputChange={setBranchInput}
                onSendBranchMessage={sendBranchMessage}
                onClose={() => setIsBranchPanelOpen(false)}
                onBack={() => setBranchView('history')}
                onOpenBranch={(branch) => {
                  setActiveBranchId(branch.id)
                  setIsBranchPanelOpen(true)
                  setBranchView('active')
                }}
              />
              <div
                ref={chatContainerRef}
                onMouseUp={handleSelection}
                className={`selection-highlight flex-1 min-h-0 overflow-y-auto px-8 pb-40 pt-6 scrollbar-thin ${
                  isBranchPanelOpen ? 'pr-[22rem]' : ''
                }`}
              >
                <div className="mx-auto flex max-w-3xl flex-col gap-10 pb-8">
                  {turns.map((turn) => (
                      <div key={turn.id} className="space-y-6">
                        {turn.user ? (
                          <div className="flex justify-end">
                            <div className="max-w-xl rounded-2xl bg-[#0b3f8f] px-4 py-3 text-sm text-white shadow-gpt-soft">
                              <p className="leading-relaxed">{turn.user.content}</p>
                            </div>
                          </div>
                        ) : null}

                        {turn.assistant ? (
                          <div
                            className="text-sm leading-relaxed text-[#e5e5e5]"
                            data-selectable="assistant"
                          >
                            {turn.assistant.items ? (
                              <>
                                <p className="text-base font-semibold text-white">{turn.assistant.title}</p>
                                <div className="mt-4 space-y-4 text-[#d6d6d6]">
                                  {turn.assistant.items.map((item, index) => (
                                    <div key={item.title} className="space-y-1">
                                      <p className="font-semibold text-white">
                                        {index + 1}. {item.title}
                                      </p>
                                      <p className="text-[#b5b5b5]">{item.body}</p>
                                    </div>
                                  ))}
                                </div>
                                <p className="mt-5 text-[#b5b5b5]">{turn.assistant.footer}</p>
                              </>
                            ) : (
                              <p className="text-[#d6d6d6]">{turn.assistant.content}</p>
                            )}

                            <div className="mt-6 flex items-center gap-2 text-[#8f8f8f]">
                              {actionButtons.map((action) => {
                                const hoverKey = `${turn.id}-${action.id}`
                                return (
                                  <div key={action.id} className="relative">
                                    <button
                                      type="button"
                                      onMouseEnter={() => setHoveredAction(hoverKey)}
                                      onMouseLeave={() => setHoveredAction(null)}
                                      className="flex h-9 w-9 items-center justify-center rounded-xl text-[#c8c8c8] transition hover:bg-[#2a2a2a] hover:text-white"
                                    >
                                      <Icon name={action.id} className="h-5 w-5" />
                                    </button>
                                    {hoveredAction === hoverKey ? (
                                      <div
                                        className={`pointer-events-none absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 bg-black/90 px-4 py-2 text-xs font-semibold text-white shadow-gpt-soft ${
                                          action.sublabel ? 'rounded-2xl' : 'rounded-full'
                                        }`}
                                      >
                                        <div className={action.sublabel ? 'text-left' : 'text-center'}>
                                          {action.label}
                                          {action.sublabel ? (
                                            <div className="mt-1 text-[11px] font-medium text-white/70">
                                              {action.sublabel}
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  {activeChatState.isThinking ? (
                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center justify-center w-7 h-7">
                        <div className="w-3 h-3 rounded-full bg-white animate-gpt-breathe" />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 z-10"
                style={{ background: 'linear-gradient(to top, #1f1f1f 40%, transparent)' }}
              />
              <div
                className="pointer-events-none fixed bottom-6 z-20 flex justify-center"
                style={{
                  left: '18rem',
                  right: isBranchPanelOpen ? 'calc(1.5rem + 20rem + 1.5rem)' : '1.5rem',
                }}
              >
                <div className="pointer-events-auto w-full max-w-3xl">
                  <ChatInput
                    placeholder="Ask anything"
                    quote={quote}
                    onClearQuote={() => setQuote('')}
                    value={chatInput}
                    onChange={setChatInput}
                    onSend={sendMainMessage}
                    isThinking={activeChatState.isThinking}
                    onStop={stopMainThinking}
                    inputRef={mainInputRef}
                    queue={activeChatState.queue}
                    queueingEnabled={activeChatState.queueingEnabled}
                    queueMenuId={queueMenuId}
                    onToggleQueueMenu={(id) => setQueueMenuId((prev) => (prev === id ? null : id))}
                    onSendNow={sendQueuedNow}
                    onDeleteQueueItem={deleteQueued}
                    onEditQueueItem={editQueued}
                    onToggleQueueing={toggleQueueing}
                  />
                </div>
              </div>
            </div>
          )}

          {selection ? (
            <div
              style={{
                top: Math.max(16, selection.rect.top - 104),
                left: selection.rect.left + selection.rect.width / 2,
              }}
              className="fixed z-50 -translate-x-1/2"
            >
              <div className="rounded-[22px] border border-[#2a2a2a] bg-[#1f1f1f] p-2 shadow-gpt-soft">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleAsk}
                    className="rounded-full bg-[#1f1f1f] px-5 py-2 text-sm text-white transition hover:bg-[#2a2a2a]"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 7a3 3 0 0 0-3 3v3h3v4H5v-7a5 5 0 0 1 5-5h1v2H9z" />
                        <path d="M19 7a3 3 0 0 0-3 3v3h3v4h-4v-7a5 5 0 0 1 5-5h1v2h-2z" />
                      </svg>
                      <span>Ask ChatGPT</span>
                    </span>
                  </button>
                  <div className="h-px w-full bg-white/5" />
                  <button
                    type="button"
                    onClick={handleCreateBranch}
                    className="rounded-full bg-[#1f1f1f] px-5 py-2 text-sm text-white transition hover:bg-[#2a2a2a]"
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="branch" className="text-white/80" />
                    <span>Create Branch</span>
                  </span>
                </button>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
