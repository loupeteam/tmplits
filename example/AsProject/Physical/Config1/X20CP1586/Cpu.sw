<?xml version="1.0" encoding="utf-8"?>
<?AutomationStudio FileVersion="4.9"?>
<SwConfiguration CpuAddress="SL1" xmlns="http://br-automation.co.at/AS/SwConfiguration">
  <TaskClass Name="Cyclic#1">
    <Task Name="FirstInitP" Source="Infrastructure.FirstInitProg.prg" Memory="UserROM" Language="ANSIC" Debugging="true" />
    <Task Name="tmplitTest" Source="tmplitTest.prg" Memory="UserROM" Language="IEC" Debugging="true" />
  </TaskClass>
  <TaskClass Name="Cyclic#2" />
  <TaskClass Name="Cyclic#3" />
  <TaskClass Name="Cyclic#4" />
  <TaskClass Name="Cyclic#5" />
  <TaskClass Name="Cyclic#6" />
  <TaskClass Name="Cyclic#7" />
  <TaskClass Name="Cyclic#8">
    <Task Name="RevInfo" Source="Infrastructure.RevInfo.RevInfo.prg" Memory="UserROM" Language="IEC" Debugging="true" />
    <Task Name="ErrorProg" Source="Diagnostics.ErrorProg.prg" Memory="UserROM" Language="IEC" Debugging="true" />
    <Task Name="LuxProg" Source="Lux.LuxProg.prg" Memory="UserROM" Language="IEC" Debugging="true" />
  </TaskClass>
  <Libraries>
    <LibraryObject Name="sys_lib" Source="Libraries.AS.sys_lib.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="runtime" Source="Libraries.AS.runtime.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="standard" Source="Libraries.AS.standard.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="FileIO" Source="Libraries.AS.FileIO.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsHttp" Source="Libraries.AS.AsHttp.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsTCP" Source="Libraries.AS.AsTCP.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsGuard" Source="Libraries.AS.AsGuard.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="ArEventLog" Source="Libraries.AS.ArEventLog.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsArLog" Source="Libraries.AS.AsArLog.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsBrStr" Source="Libraries.AS.AsBrStr.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="omjson" Source="Libraries.Loupe.omjson.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="vartools" Source="Libraries.Loupe.vartools.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="databuffer" Source="Libraries.Loupe.databuffer.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="tcpcomm" Source="Libraries.Loupe.tcpcomm.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="websocket" Source="Libraries.Loupe.websocket.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="persist" Source="Libraries.Loupe.persist.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="csvfilelib" Source="Libraries.Loupe.csvfilelib.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="fiowrap" Source="Libraries.Loupe.fiowrap.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="errorlib" Source="Libraries.Loupe.errorlib.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="hmitools" Source="Libraries.Loupe.hmitools.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="ringbuflib" Source="Libraries.Loupe.ringbuflib.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="logthat" Source="Libraries.Loupe.logthat.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="finder" Source="Libraries.Loupe.finder.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="stringext" Source="Libraries.Loupe.stringext.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="astime" Source="Libraries.AS.astime.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsBrWStr" Source="Libraries.AS.AsBrWStr.lby" Memory="UserROM" Language="binary" Debugging="true" />
  </Libraries>
</SwConfiguration>