
PROGRAM _INIT
	
	// initialize output widgets
	widget.Led := TRUE;
	widget.NumericOutput := 123;
	widget.TextOutput := 'test';
	
	f.in.filedevice := 'USER'; 
	
END_PROGRAM

PROGRAM _CYCLIC
	
	widget;
	
	// directoryBrowser, directoryBrowserWindow
	finder(f,ADR(DirectoryBuf),SIZEOF(Directory));
	IF f.out.done THEN
		brsmemcpy(ADR(Directory),ADR(DirectoryBuf), SIZEOF(Directory));
	END_IF
	 
END_PROGRAM

