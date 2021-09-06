function getConfig(dok, px) {
    //var mainWindow = new Window("dialog", px.projectName + " – " + px.version, undefined, { resizeable: true });
	var doc = activeDocument;
    var mainWindow = new Window("dialog", px.projectName , undefined, { resizeable: true });
	var filepath = doc.path;
    filePanel = mainWindow.add("Panel", undefined, "File Panel");
    filePanel.alignment = ["fill", "fill"];
    filePanel.margins = [10, 20, 10, 10];
    filePanel.alignChildren = ["left", "top"];
	var folderPath = filePanel.add("edittext", undefined, doc.path + '/'); 	
	folderPath.preferredSize.width = 200;
	var controlGroup = mainWindow.add("group");
    controlGroup.orientation = "row";
    controlGroup.alignment = "fill";
    controlGroup.alignChildren = ["right", "center"];
    controlGroup.orientation = "row";
    controlGroup.alignment = "fill";
	
    with (controlGroup) {
        //var goToWebsite = controlGroup.add("button", undefined, "by grefel");
        //var divider = controlGroup.add("panel");
        //divider.alignment = "fill";
		var closeButton = controlGroup.add("button", undefined, "Cancel");
        var folderButton = controlGroup.add("button", undefined, "Select");
        var okButton = controlGroup.add("button", undefined, "Convert");
    }
	
	folderButton.onClick = function () {
		alert (filepath);
		var myDefault = new Folder (filepath);
		alert (myDefault);
		var myFolder = myDefault.selectDlg("Select a folder to process",'',true);
		folderPath.text = myFolder;
    }
	
	okButton.onClick = function () {
		imgConvert(folderPath.text.toString());
		alert ('Done!');
	}
	
	closeButton.onClick = function () {
		mainWindow.close();

	}
	
	mainWindow.center();
    var res = mainWindow.show();
    if (res === 1) {
        return true;
    }
    else {
        return false;
    }
}

function readJson(path) {
    var currentLine;
    var jsonStuff = [];
    fileInput = new File(path);
    fileInput.open("r");
        while(!fileInput.eof) {
                currentLine = fileInput.readln();
                jsonStuff.push(currentLine);
            }
        fileInput.close();
        jsonStuff = jsonStuff.join("");
        var parsedJson = JSON.parse(jsonStuff);        
        return parsedJson;
}
function hideAllLayers(doc){
	for(var i=0;i<doc.layers.length;i++){
		curLayer = doc.layers[i];
		curLayer.visible = false;
		if(curLayer.typename =='LayerSet'){
			hideAllLayers(curLayer)
		}
	}
}
function dfs(expPath,doc) {
	for(var i=0;i<doc.layers.length;i++){
		curLayer = doc.layers[i];
		if(curLayer.typename =='LayerSet'){
			curLayer.visible = true;
			var f = new Folder(expPath + curLayer.name);
				if ( ! f.exists ) {
					f.create()					
				}
				dfs(expPath+ curLayer.name +'\\',curLayer)
			}
		else {
			curLayer.visible = true;
			var opts, file;
			opts = new ExportOptionsSaveForWeb();
			opts.format = SaveDocumentType.PNG;
			opts.PNG8 = false;
			opts.quality = 100;
			pngFile = new File(expPath  + curLayer.name + '.png');
			app.activeDocument.exportDocument(pngFile, ExportType.SAVEFORWEB, opts);
			curLayer.visible = false;
		}
	}
}



function imgConvert(expPath){
	var doc = activeDocument;
	dfs (expPath,doc);
	
}

start();

function start() {
    var px = {
        projectName: "Png Exporter",
        processText: true,
        clearParagraphStyle: "[All]",
        clearCharacterStyle: "[All]",
        processTables: false,
        clearTableStyle: "[All]",
        processObjects: false,
        clearObjectStyle: "[All]",
    }


    var dok = '';
    if (!getConfig(dok, px)) {
        // User cancelled
        return;
    }
}