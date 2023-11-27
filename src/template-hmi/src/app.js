/*
 * File: app.js
 * Copyright (c) 2023 Loupe
 * https://loupe.team
 * 
 * This file is part of tmplits, licensed under the MIT License.
 * 
 */

machine = new LUX.Machine({
    port: 8000,
    ipAddress: '127.0.0.1',
    maxReconnectCount: 5000
  });  
  setInterval(LUX.updateHMI,30)
