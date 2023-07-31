/* Automation Studio generated header file */
/* Do not edit ! */
/* finder 0.00.1 */

#ifndef _FINDER_
#define _FINDER_
#ifdef __cplusplus
extern "C" 
{
#endif
#ifndef _finder_VERSION
#define _finder_VERSION 0.00.1
#endif

#include <bur/plctypes.h>

#ifndef _BUR_PUBLIC
#define _BUR_PUBLIC
#endif
#ifdef _SG3
		#include "FileIO.h"
		#include "stringext.h"
#endif
#ifdef _SG4
		#include "FileIO.h"
		#include "stringext.h"
#endif
#ifdef _SGC
		#include "FileIO.h"
		#include "stringext.h"
#endif


/* Datatypes and datatypes of function blocks */
typedef struct finderIn_typ
{	plcstring filedevice[81];
	plcstring cwd[241];
	plcbit refresh;
} finderIn_typ;

typedef struct finderOut_typ
{	plcbit done;
	plcbit updating;
	unsigned long status;
} finderOut_typ;

typedef struct finderInternal_typ
{	plcstring path[241];
	plcstring cwd[241];
	signed short state;
	unsigned long ident;
	struct DirOpen directoryOpen;
	struct DirReadEx directoryRead;
	struct DirClose directoryClose;
	struct fiDIR_READ_EX_DATA dirData;
	unsigned long* obj;
	plcbit comma;
} finderInternal_typ;

typedef struct finder_typ
{	struct finderIn_typ in;
	struct finderOut_typ out;
	struct finderInternal_typ internal;
} finder_typ;



/* Prototyping of functions and function blocks */
_BUR_PUBLIC unsigned char finder(struct finder_typ* in, unsigned long pBuf, unsigned long sBuf);


#ifdef __cplusplus
};
#endif
#endif /* _FINDER_ */

