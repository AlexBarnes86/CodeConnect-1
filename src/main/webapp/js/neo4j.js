//TODO refactor this file
getProjectNames = function(callback){
	var data = {
			"query":"MATCH (up:Project) RETURN DISTINCT up.name ORDER BY up.name",
			"params" : {
				}
			};
		$.ajax({
			type: "POST",
			url: "http://rcdn6-vm97-107:7474/db/data/cypher/",
			headers: {"Accept": "application/json",
					 "Content-Type":"application/json"},
			data: JSON.stringify(data),
			cache: false,
			dataType:"json",
			success: function(data){
				callback(data);
			},
			error:function(xhr,err,msg){
				console.log("Failed POST Query");
				console.log(xhr);
				console.log(err);
				console.log(msg);
			}
		});
}

getProjectGroups = function(projectName, callback){
	var data = {
			"query":"MATCH (up:Project {name:{projectName}}) RETURN up.group",
			"params" : {
				"projectName":projectName
				}
			};
		$.ajax({
			type: "POST",
			url: "http://rcdn6-vm97-107:7474/db/data/cypher/",
			headers: {"Accept": "application/json",
					 "Content-Type":"application/json"},
			data: JSON.stringify(data),
			cache: false,
			dataType:"json",
			success: function(data){
				callback(data, projectName);
			},
			error:function(xhr,err,msg){
				console.log("Failed POST Query");
				console.log(xhr);
				console.log(err);
				console.log(msg);
			}
		});
}

getProjectVersions = function( projectName, projectGroup, callback ){
	var data = {
		"query":"MATCH (up:Project {name:{projectName}, group:{projectGroup}}) RETURN up.version",
		"params" : {
				"projectName" : projectName,
				"projectGroup" : projectGroup
			}
		};
	$.ajax({
		type: "POST",
		url: "http://rcdn6-vm97-107:7474/db/data/cypher/",
		headers: {"Accept": "application/json",
				 "Content-Type":"application/json"},
		data: JSON.stringify(data),
		cache: false,
		dataType:"json",
		success: function(data){
			callback(data, projectName, projectGroup);
		},
		error:function(xhr,err,msg){
			console.log("Failed POST Query");
			console.log(xhr);
			console.log(err);
			console.log(msg);
		}
	});
}

isProjectOutdated = function( projectName, projectGroup, projectVersion, callback ){
	var data = {
		"query":"MATCH (up:Project {name:{projectName}, group:{projectGroup}}) RETURN up.version",
		"params" : {
				"projectName" : projectName,
				"projectGroup" : projectGroup
			}
		};
	$.ajax({
		type: "POST",
		url: "http://rcdn6-vm97-107:7474/db/data/cypher/",
		headers: {"Accept": "application/json",
				 "Content-Type":"application/json"},
		data: JSON.stringify(data),
		cache: false,
		dataType:"json",
		success: function(data){
			function compareVersionStrings(one, two){
				if (one == two) return 0;
				var onearr = one.replace(/[^.\-0-9]/g,"").split(/[-.]/);
				var twoarr = two.replace(/[^.\-0-9]/g,"").split(/[-.]/);
				for(var i = 0; i < onearr.length; i++){
					if(Number(onearr[i]) < Number(twoarr[i]))
						return -1;
					if(Number(onearr[i]) > Number(twoarr[i]))
						return 1;
				}
				return 0;
			};
			var outdated = false;
			for (var x = 0; x<data.data.length; x++){
				if(compareVersionStrings(projectVersion, data.data[x][0]) < 0){
					outdated = true;
				}
			}
			callback(outdated, projectName, projectGroup, projectVersion);
		},
		error:function(xhr,err,msg){
			console.log("Failed POST Query");
			console.log(xhr);
			console.log(err);
			console.log(msg);
		}
	});
}

getProjectData = function( projectName, projectGroup, projectVersion, callback){
	var data = {}
	if (!projectVersion){
		data = {
				"query":"MATCH (up:Project {name:{projectName}, group:{projectGroup}})<-[rel]-(down) RETURN down.name, down.group, down.version, type(rel)",
				"params" : {
					"projectName" : projectName,
					"projectGroup" : projectGroup
				}
			};
	}else{
		data = {
				"query":"MATCH (up:Project {name:{projectName}, group:{projectGroup}, version:{projectVersion}})<-[rel]-(down) RETURN down.name, down.group, down.version, type(rel)",
				"params" : {
					"projectName" : projectName,
					"projectGroup" : projectGroup,
					"projectVersion" : projectVersion
				}
			};
	}
	$.ajax({
		type: "POST",
		url: "http://rcdn6-vm97-107:7474/db/data/cypher/",
		headers: {"Accept": "application/json",
				 "Content-Type":"application/json"},
		data: JSON.stringify(data),
		cache: false,
		dataType:"json",
		success: function(json) {
			callback(json, projectName, projectGroup, projectVersion);
		},
		error:function(xhr,err,msg){
			console.log("Failed POST Query");
			console.log(xhr);
			console.log(err);
			console.log(msg);
		}
	});
}