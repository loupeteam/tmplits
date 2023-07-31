// This program serves variables to web applications via WebSockets and
// a JSON interface

PROGRAM _INIT
  
    // pCache is required
	jsonWebSocketServer_0.pCacheArray := ADR(jsonCache);
	jsonWebSocketServer_0.maxClients := MAX_CLIENTS;
	
	// Note: ServerIP, ServerPort, BufferSize, and MaxIterations are optional and not set
	jsonWebSocketServer_0.BufferSize := 200000;

	// Call jsonWebSocketServer once in the INIT routine to allocate internal memory
	jsonWebSocketServer_0();

END_PROGRAM

PROGRAM _CYCLIC

	// Call jsonWebSocketServer cyclically to serve variables
	jsonWebSocketServer_0();

END_PROGRAM