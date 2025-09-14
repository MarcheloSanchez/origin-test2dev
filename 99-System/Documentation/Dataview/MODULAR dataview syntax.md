---
up: "[[🏡Home]]"
related:
  - "[[Dataview syntax]]"
  - "[[Dataview MOC]]"
created: 2025-04-16
tags:
  - 🛜IT
  - 💯cheatsheet
---

⬆️:: [[🏡Home]]

# Syntax

> [!multi-column] 
> 
> > [!attention] > ### **Dataview Query Types**
> > 
> > - `list`
> > - `table`
> > - `task`
> > - `calendar`
> 
> > [!abstract] > ### **Sorting**
> > - `sort`
> > - `asc`
> > - `desc`
> > 
> > Example
> > sort file.name asc
> 
> ---
> 
> > [!abstract] > ### **Grouping**
> > - `group by`
> 

> [!multi-column] 
> 
> > [!NOTE] > ### **Fields**
> > 
> > - `file.name`
> > - `file.path`
> > - `file.link`
> > - `file.folder`
> > - `file.cday`
> > - `file.mday`
> > - `file.etag`
> > - `file.tasks`
> > - `file.size`
> > - `file.ext`
> > - `file.tags`
> 
> ---
> 
> > [!NOTE] > ### **Filters and Conditions**
> > 
> > - `from`
> > - `where`
> > - `contains`
> > - `regexmatch`
> > - `startswith`
> > - `endswith`
> > - `!contains`
> > - `!regexmatch`
> > - `and`
> > - `or`
> > - `not`
> > - `in`
> 

---


---

> [!multi-column] 
> 
> > [!anchor] > ### **Formatting and Aggregations**
> > - `limit`
> > - `flatten`
> > - `map`
> > - `reduce`
> > - `length`
> > - `sum`
> > - `count`
> > - `average`
> > - `min`
> > - `max`
> > - `join`
> > - `filter`
> 
> ---
> 
> > [!calendar] > ### **Date Functions**
> > - `date(today)`
> > - `date(tomorrow)`
> > - `date(yesterday)`
> > - `date(now)`
> > - `date(week)`
> > - `date(month)`
> > - `date(year)`
> > - `dateadd`
> > - `datefrom`
> > - `dateto`

---

> [!multi-column] 
> > [!abstract] > ### **Operators**
> > - =
> > - `!=`
> > - `<`
> > - `>`
> > - `<=`
> > - `>=`
> 
> ---
> 
> > [!activity] > ### **Dynamic Values**
> > - `rows`
> > - `this.file`
> > - `this.file.link`
> > - `this.file.tags`
> 
> >[!award] > ### **Tags and Metadata**
> > - `tags`
> > - `metadata`

