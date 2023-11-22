(*
* File: ErrorProgCyclic.st
* Copyright (c) 2023 Loupe
* https://loupe.team
* 
* This file is part of ErrorProg, licensed under the MIT License.
*)


PROGRAM _CYCLIC

ErrorCollectorFn_HMI_Cyclic( gErrorCollectorHMI, gErrorCollector );

ErrorCollectorFn_Cyclic( gErrorCollector );

END_PROGRAM
