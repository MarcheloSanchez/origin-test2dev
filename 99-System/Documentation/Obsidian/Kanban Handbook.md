# Quick Setup Guide: KANBAN Board for Obsidian PKM

## Step 1: Install the KANBAN Plugin

1. Open Obsidian Settings (⚙️)
2. Go to **Community Plugins**
3. Turn off **Restricted Mode** (if enabled)
4. Click **Browse** and search for "Kanban"
5. Install **Kanban** by mgmeyers
6. Enable the plugin

## Step 2: Create Your First Board

### Method 1: Using the Command Palette
1. Press `Ctrl+P` (or `Cmd+P` on Mac)
2. Type "Kanban: Create new board"
3. Select the command and choose location

### Method 2: Right-click Method
1. Right-click on any folder in the file explorer
2. Select "New Kanban board"
3. Name your board (e.g., "PKM Workflow")

## Step 3: Configure Your Board Structure

### Basic PKM Structure
```
📥 Inbox → 🔄 Processing → 🔍 Research → ✍️ Development → 👀 Review → 📚 Archive
```

### Setup Instructions:
1. Click "Add list" to create columns
2. Name each column according to your workflow
3. Set up WIP limits (recommended: 3-5 cards per active column)
4. Configure board settings (click ⚙️ icon)

## Step 4: Essential Board Settings

### Access Board Settings
- Click the three-dot menu (⋮) in the top-right
- Select "Open board settings"

### Recommended Settings:
- ✅ **Display card checkbox**: Enable for task completion
- ✅ **New line trigger**: Set to "Shift+Enter"
- ✅ **Prepend new cards**: Add new cards at the top
- ✅ **Card template**: Set up consistent card format
- ✅ **Date format**: Choose your preferred format

## Step 5: Apply Custom CSS Styling

### Install CSS Snippet
1. Go to **Settings** → **Appearance** → **CSS snippets**
2. Click the folder icon to open snippets folder
3. Copy the `obsidian_kanban_custom.css` file into this folder
4. Refresh the CSS snippets list
5. Enable the "obsidian_kanban_custom" snippet

### CSS Features Included:
- 🎨 Light/dark theme support
- 🌈 Color-coded columns for PKM workflow
- 📱 Mobile-responsive design
- ⚡ Smooth animations and transitions
- 🎯 Priority indicators for important cards
- ♿ Accessibility enhancements

## Step 6: Create Card Templates

### Basic Card Template
```markdown
# [Card Title]

## Status: 
- [ ] Task 1
- [ ] Task 2

## Priority: [High/Medium/Low]
## Due Date: [[YYYY-MM-DD]]
## Tags: [[tag1]] [[tag2]]

### Notes:
Brief description and key points

### Links:
- [[Related Note 1]]
- [[Related Note 2]]
```

### Apply Template to Board
1. Open board settings
2. Go to "Note template" section
3. Paste your template or link to template note
4. Save settings

## Step 7: Optimize Your Workflow

### Daily Workflow
1. **Morning**: Review inbox, prioritize cards
2. **During work**: Move cards through workflow
3. **Evening**: Update progress, archive completed items

### Weekly Maintenance
1. Review and optimize board structure
2. Update card templates as needed
3. Archive old completed cards
4. Analyze workflow bottlenecks

### Best Practices
- 📝 Keep card titles concise and actionable
- 🔗 Link related cards and notes
- 🏷️ Use consistent tagging system
- ⏰ Set realistic deadlines
- 📊 Monitor WIP limits

## Step 8: Advanced Features

### Priority System
Use tags to indicate priority:
- `#high-priority` → Red border
- `#medium-priority` → Yellow border  
- `#low-priority` → Green border

### Cross-Board Linking
Link cards across different boards:
```markdown
Related: [[Board Name#Card Title]]
Dependencies: [[Project Board#Task]]
```

### Automation with Templater
Install Templater plugin for advanced automation:
```javascript
// Auto-generate card with current date
2025-07-12

// Auto-populate with current project
Documentation
```

## Step 9: Mobile Optimization

### Mobile-Friendly Tips
1. Use shorter card titles
2. Minimize complex formatting
3. Essential information first
4. Touch-friendly button sizes

### Sync Across Devices
- Use **Obsidian Sync** (paid) for seamless sync
- Or sync vault folder via cloud storage (free)

## Step 10: Troubleshooting

### Common Issues & Solutions

**Cards not moving between columns:**
- Check WIP limits aren't exceeded
- Verify drag-and-drop is enabled
- Restart Obsidian if necessary

**Board not displaying correctly:**
- Disable/re-enable CSS snippets
- Check for CSS conflicts
- Update Kanban plugin

**Performance issues:**
- Reduce number of cards per board
- Archive completed items regularly
- Optimize vault size

**Mobile display problems:**
- Check responsive CSS is enabled
- Reduce card complexity
- Use simplified board structure

## Quick Reference

### Keyboard Shortcuts
- `Ctrl+P` → Command palette
- `Ctrl+N` → New card
- `Enter` → Edit card
- `Escape` → Cancel edit
- `Tab` → Move between cards

### Board Navigation
- **Drag & Drop**: Move cards between columns
- **Right-click**: Access card menu
- **Double-click**: Edit card content
- **Shift+Click**: Select multiple cards

### CSS Variables for Customization
```css
--kanban-col-inbox: 255, 107, 107;     /* Red */
--kanban-col-process: 76, 175, 80;     /* Green */
--kanban-col-research: 33, 150, 243;   /* Blue */
--kanban-col-develop: 255, 193, 7;     /* Yellow */
--kanban-col-review: 156, 39, 176;     /* Purple */
--kanban-col-archive: 96, 125, 139;    /* Grey */
```

## Next Steps

1. **Start Simple**: Begin with basic 3-column structure
2. **Iterate**: Add complexity as you understand your workflow
3. **Customize**: Modify CSS and templates to match your needs
4. **Integrate**: Connect with other PKM tools and methods
5. **Optimize**: Regularly review and improve your system

## Resources & Links

- [Obsidian Kanban Plugin Documentation](https://github.com/mgmeyers/obsidian-kanban)
- [Obsidian Community Forum](https://forum.obsidian.md/)
- [PKM Best Practices](https://www.dsebastien.net/personal-knowledge-management/)
- [Kanban Method Guide](https://kanban.university/kanban-guide/)
https://kanban.university/wp-content/uploads/2023/04/The-Official-Kanban-Guide_Glossary.pdf

- [[Kanban Process - Without settings]]
- [[KANBAN PKM TEST]]
- [[KANBAN test]]
- [[pkm-kanban-templates]]
- [[Universal Kanban Settings Package - Ready for Copy]]
- [[Template, Cards for  Kanban]]
- [[Template, Learning Card for  Kanban]]
- [[Template, Content Cards for Kanban]]
- [[KANBAN ]]
---

**Remember**: The best PKM system is the one you actually use consistently. Start with this basic setup and adapt it to your specific needs and workflow preferences.