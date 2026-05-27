# POC2: Code Navigator - Living Documentation Platform

## 🎯 Value Proposition

A platform that acts as a **living understanding layer** between developers and AI coding agents. It uses structured diagrams and models as a source of truth to help developers quickly comprehend, validate, and stay aligned with AI-generated code — across both architecture and implementation levels.

**In short:** The platform helps devs know the code. Especially junior devs.

---

## 🎬 Demo Script (2 minutes)

### **Setup Context** (5 seconds)
*"As a junior developer joining the aiboard project, I need to understand the codebase quickly..."*

### **Act 1: Login & Select Project** (10 seconds)
1. **Open landing page** - Clean hero with "Continue with GitHub" button
2. **Click "Continue with GitHub"** - Fake OAuth flow (just animation)
3. **See project list** - Show 2-3 repos, click "aiboard"
4. **Transition** - Loading animation (1 sec) → Code Navigator

### **Act 2: Top-Down Architecture Exploration** (45 seconds)
*"Let me show you how we explore from system level down to code..."*

1. **C4 Context View** (15 sec)
   - "Start at the highest level - the system context"
   - Show: Aider Web App, Agent Runner, MongoDB, APIs
   - **Click "Aider Web App"** → Zoom to Container view

2. **C4 Container View** (15 sec)
   - "See the major deployable units"
   - Show: Web Application, Static Assets
   - Right panel updates showing container-level flow
   - **Click "Web Application (src)"** → Zoom to Component view

3. **Layer Architecture View** (15 sec)
   - "Here's our 4-layer architecture"
   - Show: l1_ui, l2_controllers, l3_model, l4_infra
   - Highlight relationships between layers
   - **Click "l2_controllers"** → Show classes in that layer

### **Act 3: Code-Level Exploration** (40 seconds)
*"Now let's drill into actual code..."*

1. **Class Diagram View** (20 sec)
   - Static view switches to class diagram
   - Show: UserController, BoardController, TaskController
   - Highlight methods and relationships
   - **Click "UserController"** → Focus on that class
   - **Click "createUser()" method** → Sequence diagram animates

2. **Sequence Diagram Auto-Update** (20 sec)
   - Right panel shows sequence flow
   - "Watch the execution flow for createUser()"
   - Show: User → Controller → Model → Infrastructure → Database
   - Highlight each step with animation
   - "See exactly how the layers interact"

### **Act 4: Synchronized Navigation** (25 seconds)
*"Everything stays in sync as you navigate..."*

1. **Click folder tree** - Select `src/l2_controllers/UserController.ts`
2. **Both panels update simultaneously**
   - Static view: Class diagram for UserController
   - Dynamic view: Available sequences
3. **Use breadcrumb** - Click "l2_controllers" to zoom out
4. **Click "Zoom Out"** - Go back to layer view → Container → Context

### **Closing** (5 seconds)
*"No stale documentation. No context switching. Just living, interactive code understanding."*

**Total Demo Time: ~2:05 minutes**

---

## 🎨 Dashboard Layout Design

### **Chosen: Option 3 - Dual-View Synchronized Explorer**

```
┌───────────────────────────────────────────────────────────────────────────┐
│  [Logo] Code Navigator                                  [🔍] [⚙️] [👤]    │
│  📍 aiboard / src / l2_controllers / UserController.ts                    │
├─────────────────┬──────────────────────────────┬──────────────────────────┤
│                 │                              │                          │
│   📂 EXPLORER   │   📐 STATIC VIEW             │   🎬 DYNAMIC VIEW        │
│   (20% width)   │   (40% width)                │   (40% width)            │
│                 │                              │                          │
│ ┌─────────────┐ │ ┌──────────────────────────┐ │ ┌──────────────────────┐│
│ │ Search...   │ │ │ [C4] [Class] [Deps]      │ │ │ [Sequence] [Flow]    ││
│ └─────────────┘ │ └──────────────────────────┘ │ └──────────────────────┘│
│                 │                              │                          │
│ 📁 src/         │     ┌────────────────┐       │      User → Controller  │
│   📂 l1_ui/     │     │                │       │      Controller → Model │
│   📂 l2_ctrl/ ★ │     │   DIAGRAM      │       │      Model → Infra      │
│     📄 User...  │     │   RENDERING    │       │      Infra → Database   │
│     📄 Board... │     │   AREA         │       │      Database → Infra   │
│     📄 Task...  │     │                │       │      Infra → Model      │
│   📂 l3_model/  │     │                │       │      Model → Controller │
│   📂 l4_infra/  │     │                │       │      Controller → User  │
│                 │     └────────────────┘       │                          │
│ 🎯 CONTEXT      │                              │                          │
│ ├─ File:        │     [Zoom Controls]          │  [Method Selector ▼]     │
│ │  UserCtrl    │     [⬆️ Zoom Out]            │  └─ createUser()        │
│ └─ Method:      │                              │  └─ updateUser()        │
│    createUser() │                              │  └─ deleteUser()        │
│                 │                              │                          │
│ [Sync: ON] 🟢   │  💡 Click elements to drill  │  ⏯️ [Playback speed]    │
└─────────────────┴──────────────────────────────┴──────────────────────────┘
```

---

## 📐 Layout Specifications

### **Top Navigation Bar** (60px height)
- **Left:** Logo + "Code Navigator" title
- **Center:** Breadcrumb navigation (interactive)
  - `aiboard` → `src` → `l2_controllers` → `UserController.ts`
  - Each part clickable to zoom out
- **Right:** 
  - Search icon (magnifying glass)
  - Settings icon (gear)
  - User avatar with dropdown

### **Left Panel: Explorer** (20% width, 300px min)

**Top Section:**
- Search input field (filters files)
- "Sync Mode" toggle switch with indicator

**Folder Tree:**
- Expandable/collapsible folders
- File type icons (📄 .ts, 📘 .tsx, 📗 .js, etc.)
- Current file highlighted with star ★
- Hover shows file path tooltip

**Bottom Section: Context Card**
- Shows current selection context
- File name
- Current method/class
- Visual indicator for sync status

### **Middle Panel: Static View** (40% width, flexible)

**Tab Bar:**
- [C4] [Class Diagram] [Dependencies]
- Active tab highlighted
- Badge counts (e.g., "3 layers", "12 classes")

**Diagram Area:**
- Full SVG rendering space
- Mermaid.js for diagrams
- Click-to-zoom interactions
- Hover tooltips on elements

**Bottom Toolbar:**
- Zoom controls: [- 🔍 +] [Fit] [Reset]
- "Zoom Out" breadcrumb buttons
- Export button (PNG/SVG)
- Fullscreen toggle

### **Right Panel: Dynamic View** (40% width, flexible)

**Tab Bar:**
- [Sequence Diagram] [Flow Chart] [Timeline]
- Active tab highlighted

**Controls:**
- Method/Function selector dropdown
- "Auto-sync with selection" checkbox
- Playback controls (for animation)

**Diagram Area:**
- Sequence diagram rendering
- Animated flow on method selection
- Step-by-step execution view
- Color-coded layers

**Info Panel (collapsible):**
- Method signature
- Parameters
- Return type
- Brief description

---

## 🎨 Design System

### **Colors**
- **Background:** `#0F1419` (dark) / `#FFFFFF` (light)
- **Panel BG:** `#1A1F2E` (dark) / `#F8F9FA` (light)
- **Accent:** `#3B82F6` (blue for interactions)
- **Success:** `#10B981` (sync indicator)
- **Text Primary:** `#E5E7EB` (dark) / `#1F2937` (light)
- **Text Secondary:** `#9CA3AF`
- **Borders:** `#374151` (dark) / `#E5E7EB` (light)

### **Typography**
- **Headings:** Inter, 600 weight
- **Body:** Inter, 400 weight
- **Code:** JetBrains Mono, 400 weight
- **Sizes:** 14px base, 12px small, 16px large

### **Spacing**
- Base unit: 4px
- Panel padding: 16px (4 units)
- Element gaps: 12px (3 units)
- Section margins: 24px (6 units)

### **Shadows**
- Panels: `0 4px 6px rgba(0, 0, 0, 0.1)`
- Hover cards: `0 8px 16px rgba(0, 0, 0, 0.15)`
- Active elements: `0 0 0 3px rgba(59, 130, 246, 0.3)`

---

## 🔧 Technical Implementation Notes

### **Reference Project**
The **aiboard** project has been copied to `poc2/aiboard/` folder for reference when creating mock data and structure.

**Key Reference Points:**
- **Folder structure:** Use actual aiboard structure in explorer
- **Layer architecture:** l1_ui, l2_controllers, l3_model, l4_infra
- **File names:** Real file names from aiboard project
- **Class/Method names:** Extract from actual code files

### **Mock Data Strategy**
1. **C4 Diagrams:** Hardcoded strings (from POC1 learnings)
2. **Class Diagrams:** Generate from aiboard file structure
3. **Sequence Diagrams:** Predefined for key methods (createUser, etc.)
4. **File Tree:** Mirror actual aiboard structure
5. **Breadcrumbs:** Derive from current view state

### **State Management**
```typescript
interface NavigatorState {
  currentLevel: 'context' | 'container' | 'component' | 'class' | 'method';
  selectedProject: string;
  selectedFolder: string;
  selectedFile: string;
  selectedClass: string;
  selectedMethod: string;
  syncEnabled: boolean;
}
```

### **Navigation Logic**
- **Top-down:** C4 Context → Container → Component → Class → Method
- **Bottom-up:** File tree click → Update both panels
- **Zoom out:** Breadcrumb click → Move up hierarchy
- **Sync:** Any interaction updates all three panels

---

## 📁 Project Structure

```
poc2/
├── aiboard/                  # Reference project (copied)
│   └── [actual aiboard code]
│
└── code-navigator/           # POC2 application (to be created)
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx              # Landing page
    │   │   ├── login/                # Fake GitHub OAuth
    │   │   ├── projects/             # Project selection
    │   │   └── navigator/            # Main dashboard
    │   ├── components/
    │   │   ├── Explorer.tsx          # Left panel
    │   │   ├── StaticView.tsx        # Middle panel
    │   │   ├── DynamicView.tsx       # Right panel
    │   │   ├── MermaidDiagram.tsx    # Reuse from POC1
    │   │   └── Breadcrumb.tsx        # Navigation
    │   ├── data/
    │   │   ├── c4-diagrams.ts        # Hardcoded C4
    │   │   ├── class-diagrams.ts     # Generated from aiboard
    │   │   ├── sequence-diagrams.ts  # Key flows
    │   │   └── file-tree.ts          # aiboard structure
    │   └── lib/
    │       ├── navigation.ts         # State management
    │       └── utils.ts              # Helpers
    └── public/
        └── assets/
```

---

## ✅ Next Steps

1. **Setup Next.js project** in `poc2/code-navigator/`
2. **Create mock data** from aiboard reference
3. **Build component structure** (3-panel layout)
4. **Implement navigation logic** (zoom in/out, sync)
5. **Polish animations** (loading, transitions, diagram updates)
6. **Test demo flow** (2-minute walkthrough)
7. **Deploy** for testing with devs

---

## 🎯 Success Criteria

**The demo is successful if:**
- ✅ Developers say "Wow, this would help me onboard faster"
- ✅ Navigation feels intuitive (no explanation needed)
- ✅ Diagrams update smoothly (no lag or confusion)
- ✅ UI feels polished (production-ready aesthetic)
- ✅ Demo completes in under 2.5 minutes
- ✅ At least one "how does this work?" question about the sync feature

---

*Last updated: May 28, 2026*