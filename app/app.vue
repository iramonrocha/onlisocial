<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.m-2 {
  margin: 16px !important;
}

.app {
  font-family: sans-serif;
  background-color: #FFF;
  min-height: 100vh;
  color: #111827;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

::selection {
  background: rgba(30, 116, 253, 0.3);
}

.card {
  background: #fff;
  padding: 30px;
  width: 400px;
  border-radius: 12px;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 10px;
  background: #2a5298;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mensagem {
  margin-top: 10px;
}

.erro {
  color: #e74c3c;
  margin-bottom: 10px;
}

.sucesso {
  color: #2ecc71;
  margin-bottom: 10px;
}
</style>