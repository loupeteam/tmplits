
PROGRAM _INIT
	
	// initialize output tmplits
	tmplit.Led := TRUE;
	tmplit.NumericOutput := 123;
	tmplit.TextOutput := 'test';
	
	f.in.filedevice := 'USER'; 
	
END_PROGRAM

PROGRAM _CYCLIC
	
	tmplit;
	
	// directoryBrowser, directoryBrowserWindow
	finder(f,ADR(DirectoryBuf),SIZEOF(Directory));
	f.in.refresh := FALSE;
	IF f.out.done THEN
		brsmemcpy(ADR(Directory),ADR(DirectoryBuf), SIZEOF(Directory));
	END_IF
	 
END_PROGRAM

