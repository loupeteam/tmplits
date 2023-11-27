(*
* File: ErrorProgInit.st
* Copyright (c) 2023 Loupe
* https://loupe.team
* 
* This file is part of ErrorProg, licensed under the MIT License.
*)

PROGRAM _INIT

(* gErrorCollector is initialized in FirstInitProg - Init only if it hasn't already been *)
	IF NOT gErrorCollector.Internal.Initialized THEN
		ErrorCollectorFn_Init(gErrorCollector);
	END_IF
(* Sources are added to gErrorCollector in the source program. *)

END_PROGRAM
