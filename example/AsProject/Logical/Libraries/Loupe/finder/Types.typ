
TYPE
	finder_typ : 	STRUCT 
		in : finderIn_typ;
		out : finderOut_typ;
		internal : finderInternal_typ;
	END_STRUCT;
	finderIn_typ : 	STRUCT 
		filedevice : STRING[80];
		cwd : STRING[240];
		refresh : BOOL;
	END_STRUCT;
	finderOut_typ : 	STRUCT 
		done : BOOL;
		updating : BOOL;
		status : UDINT;
	END_STRUCT;
	finderInternal_typ : 	STRUCT 
		path : STRING[240];
		cwd : STRING[240];
		state : INT;
		ident : UDINT;
		directoryOpen : DirOpen;
		directoryRead : DirReadEx;
		directoryClose : DirClose;
		dirData : fiDIR_READ_EX_DATA;
		obj : REFERENCE TO UDINT;
		comma : BOOL;
	END_STRUCT;
END_TYPE
