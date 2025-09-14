<%*
const weekStart = moment().startOf('week').format('YYYY-MM-DD');
const weekEnd = moment().endOf('week').format('YYYY-MM-DD');
%>
[[status/📦archived]] 
# **Week**: "<% weekStart %> to <% weekEnd %>"


**# <%moment(tp.file.title).startOf('isoWeek').format("MMM DD")%> - <%moment(tp.file.title).endOf('isoWeek').format("MMM DD")%>

[[<% tp.date.now("YYYY-MM") %> | Plán na tento měsíc]] 

[[Calendar/Notes/Weekly/<%moment(tp.file.title).subtract(1,'week').format("gggg-[W]ww")%> |  Předchozí týden]] ⏪⏩ [[Calendar/Notes/Weekly/<%moment(tp.file.title).add(1,'week').format("gggg-[W]ww")%> | Příští týden]]

---
- [[Calendar/Notes/Daily/<%moment(tp.file.title).startOf('isoWeek').add(0,'day').format("YYYY-MM-DD")%> |Pondělí]]
- [[Calendar/Notes/Daily/<%moment(tp.file.title).startOf('isoWeek').add(1,'day').format("YYYY-MM-DD")%> |Úterý]]
- [[Calendar/Notes/Daily/<%moment(tp.file.title).startOf('isoWeek').add(2,'day').format("YYYY-MM-DD")%> |Středa]]
- [[Calendar/Notes/Daily/<%moment(tp.file.title).startOf('isoWeek').add(3,'day').format("YYYY-MM-DD")%> |Čtvrtek]]
- [[Calendar/Notes/Daily/<%moment(tp.file.title).startOf('isoWeek').add(4,'day').format("YYYY-MM-DD")%> |Pátek]]
- [[Calendar/Notes/Daily/<%moment(tp.file.title).startOf('isoWeek').add(5,'day').format("YYYY-MM-DD")%> |Sobota]]
- [[Calendar/Notes/Daily/<%moment(tp.file.title).startOf('isoWeek').add(6,'day').format("YYYY-MM-DD")%> |Neděle]]

---

⬆️:: [[03-PERIODIC]] [[My/Journal/Weekly]] 

## Weekly Review
- Learning:
- Focus:

**What was worth remembering about this week?**
* 

**What could I have done better this week?**
* 

**What can't I get off my mind, what is bugging me?**
* 

**What did I achieve this week?** 
* 

**What do I want to achieve next week?** 
* 

