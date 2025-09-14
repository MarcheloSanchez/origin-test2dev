<%*  

  

// Quick Tag Script pro Alt+T  

  

const predefinedTags = [  

  

"#📥inbox", "#🔄active", "#⏳waiting", "#🎯priority-high", "#✅completed",  

  

"#📦archived", "#💡idea", "#⚗️experiment", " [[💼work]]", "#🏠home", "#🗺️map ", "#🔥on", "#♻️ongoing", "#🌊simmering ", "#💤sleeping", "#🚀project", "#📚source",  

  

"#👤contact", "#🤝meeting", "#🧹tidy", "#🚤boat", "#🌱develop", "#❔question"  

  

];  

  

  

  

const selectedTag = await tp.system.suggester(  

  

predefinedTags.map(tag => tag.replace("#", "")),  

  

predefinedTags  

  

);  

  

  

  

if (selectedTag) {  

  

// Vloží tag na pozici kurzoru  

  

return selectedTag + " ";  

  

}  

  

%>