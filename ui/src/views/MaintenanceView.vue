<template>
  <div class="maintenance-wrapper">
    <div class="maintenance-container">
      <div class="maintenance-icon">
        🔧
      </div>
      <h1>Wartungsmodus</h1>
      <p class="maintenance-message">
        Wir führen gerade Wartungsarbeiten durch, um Ihnen ein besseres Spielerlebnis zu bieten.
      </p>
      <p class="maintenance-submessage">
        Bitte versuchen Sie es in Kürze erneut.
      </p>
      <div class="maintenance-spinner">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Maintenance mode page
</script>

<style scoped>
.maintenance-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.maintenance-container {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.maintenance-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

h1 {
  color: #333;
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: 700;
}

.maintenance-message {
  color: #666;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 10px;
}

.maintenance-submessage {
  color: #999;
  font-size: 16px;
  margin-bottom: 40px;
}

.maintenance-spinner {
  display: flex;
  justify-content: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
