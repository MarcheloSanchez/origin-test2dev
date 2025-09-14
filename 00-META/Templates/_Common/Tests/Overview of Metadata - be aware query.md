---
tags:
  - 🗺️MOC
Created: 2025-08-13
created: 
modified: 
related:
  - "[[My PKM Metadata]]"
type:
  - moc
title: 👁️Overview of Metadata🏁🚦
status: 📥inbox
---
What it does specifically ? Only show metadata all or empty? 

Quite take it ez this query. S
```dataviewjs-BEAWARE
const pagelimit = 5;
const metadataMap = {};

dv.pages().forEach(page => {
	Object.keys(page).forEach(metadata => {
		if (metadata === 'file') return;
		metadata = metadata.toLowerCase().replaceAll(" ", "-")
		if (!metadataMap[metadata]) {
			metadataMap[metadata] = []
		}
		if (!metadataMap[metadata].some(l => l.path === page.file.link.path)) {
			metadataMap[metadata].push(page.file.link);
		}
	})
})

dv.table(["meta data", "page count", `pages (first ${pagelimit})`], Object.keys(metadataMap).sort().map(key => [key, metadataMap[key].length, dv.array(metadataMap[key]).limit(pagelimit)]))
```