****

## dots
type: atomic
status: 🔄active
in: [[MOC – Dots]]
up: [[MOC – Psychology]]  # or [[MOC – Ideas]] temporarily
see_also: []
maturity: 🌱seedling

## MOCs
type: moc
status: 🔄active
in: [[MOC – MOCs]]
up: [[MOC – Work Skills]]  # broader map, if any
coverage_areas: []
completeness: draft|partial|comprehensive
review_freq: quarterly
review_last:
review_next:
see_also: []

## Efforts
type: project
status: 🔄active
in: [[MOC – Efforts]]
up: [[MOC – 3D Printing]]
priority: high|medium|low

# Definitions
- **`in:`** _collection hub_ → “Where does this note live in the system?”  
    Values are **links to hub notes** (not folders):  
    `in: [[MOC – Dots]] | [[MOC – Efforts]] | [[MOC – Sources]] | [[MOC – MOCs]] | [[MOC – Journal]] | [[MOC – Archive]]`.  
    This gives you a consistent “home” jump across the vault, matching your top-level structure.
    
- **`up:`** _nearest topical parent_ → “What is the parent idea/map this develops?”  
    Usually a **topic MOC** (e.g., `up: [[MOC – Psychology]]`) or a **more general Dot** if you’re refining a concept.
    

**Decision tree (fast, no overthinking)**

1. **If the note is atomic (Dot):**
    
    - `in: [[MOC – Dots]]` (collection hub)
        
    - `up: [[MOC – {Topic}]]` if obvious; otherwise `up: [[MOC – Ideas]]` (temporary until processed)
        
2. **If the note is a MOC:**
    
    - `in: [[MOC – MOCs]]`
        
    - `up:` link to a **broader MOC** (e.g., “Communication” MOC might have `up: [[MOC – Work Skills]]`)
        
3. **If the note is an Effort/Project:**
    
    - `in: [[MOC – Efforts]]`
        
    - `up:` the **Outcome/Domain MOC** it serves (e.g., `[[MOC – 3D Printing]]`)
        
4. **If the note is a Source:**
    
    - `in: [[MOC – Sources]]`
        
    - `up:` the **Topic MOC** consuming it (so insights cluster upwards)
        

This yields a simple tri-graph: **in = home hub**, **up = parent**, **see_also = lateral**.