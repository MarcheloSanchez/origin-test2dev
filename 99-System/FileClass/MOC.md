---
limit: 20
mapWithTag: true
icon: map-pinned
tagNames:
  - 🗺️map
filesPaths:
  - 01-MOCs
bookmarksGroups:
excludes:
extends: Base
savedViews: []
favoriteView:
fieldsOrder:
  - jOSmag
  - b0QBq3
  - R1vCko
  - y61mL4
version: "2.17"
fields:
  - name: coverage_areas
    type: Input
    options: {}
    path: ""
    id: y61mL4
  - name: last_review
    type: Date
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: R1vCko
  - name: review_frequency
    type: Input
    options: {}
    path: ""
    id: b0QBq3
  - name: completeness
    type: Select
    options:
      sourceType: ValuesListNotePath
      valuesList: {}
      valuesListNotePath: 99-System/CIS/CIS_COMPLETENESS.md
    path: ""
    id: jOSmag
---
