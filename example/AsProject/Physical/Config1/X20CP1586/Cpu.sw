<?xml version="1.0" encoding="utf-8"?>
<?AutomationStudio FileVersion="4.9"?>
<SwConfiguration CpuAddress="SL1" xmlns="http://br-automation.co.at/AS/SwConfiguration">
  <TaskClass Name="Cyclic#1">
    <Task Name="widgetTest" Source="widgetTest.prg" Memory="UserROM" Language="IEC" Debugging="true" />
  </TaskClass>
  <TaskClass Name="Cyclic#2" />
  <TaskClass Name="Cyclic#3" />
  <TaskClass Name="Cyclic#4" />
  <TaskClass Name="Cyclic#5" />
  <TaskClass Name="Cyclic#6" />
  <TaskClass Name="Cyclic#7" />
  <TaskClass Name="Cyclic#8">
    <Task Name="webHMIProg" Source="webHMI.webHMIProg.prg" Memory="UserROM" Language="IEC" Debugging="true" />
  </TaskClass>
  <Libraries>
    <LibraryObject Name="omjson" Source="Libraries.Loupe.omjson.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="vartools" Source="Libraries.Loupe.vartools.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="stringext" Source="Libraries.Loupe.stringext.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="databuffer" Source="Libraries.Loupe.databuffer.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="tcpcomm" Source="Libraries.Loupe.tcpcomm.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="bodyguard" Source="Libraries.Loupe.bodyguard.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="persist" Source="Libraries.Loupe.persist.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="csvfilelib" Source="Libraries.Loupe.csvfilelib.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="fiowrap" Source="Libraries.Loupe.fiowrap.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="hmitools" Source="Libraries.Loupe.hmitools.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="ringbuflib" Source="Libraries.Loupe.ringbuflib.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="logthat" Source="Libraries.Loupe.logthat.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="errorlib" Source="Libraries.Loupe.errorlib.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="finder" Source="Libraries.Loupe.finder.lby" Memory="UserROM" Language="Binary" Debugging="true" />
    <LibraryObject Name="sys_lib" Source="Libraries.sys_lib.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="runtime" Source="Libraries.runtime.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="standard" Source="Libraries.standard.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="FileIO" Source="Libraries.FileIO.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsHttp" Source="Libraries.AsHttp.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsTCP" Source="Libraries.AsTCP.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsGuard" Source="Libraries.AsGuard.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="ArEventLog" Source="Libraries.ArEventLog.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsArLog" Source="Libraries.AsArLog.lby" Memory="UserROM" Language="binary" Debugging="true" />
    <LibraryObject Name="AsBrStr" Source="Libraries.AsBrStr.lby" Memory="UserROM" Language="binary" Debugging="true" />
  </Libraries>
</SwConfiguration>