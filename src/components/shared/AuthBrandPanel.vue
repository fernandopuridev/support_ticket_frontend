<template>
  <aside class="auth-panel auth-panel-brand">
    <div class="brand-content">
      <p class="eyebrow eyebrow-dark">Portal de atendimento</p>
      <h2>Bem vindo ao nosso suporte técnico</h2>
      <p class="support-copy">
        Receba a ajuda dos nossos atendentes para tirar suas dúvidas e resolver
        qualquer problema relacionado às suas viagens
      </p>
    </div>
  </aside>
</template>

<style scoped>
.auth-panel-brand {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.04) 0, rgba(255, 255, 255, 0.04) 18%, transparent 18%, transparent 100%),
    radial-gradient(circle at 100% 100%, rgba(255, 255, 255, 0.03) 0, rgba(255, 255, 255, 0.03) 14%, transparent 14%, transparent 100%),
    linear-gradient(180deg, #1f2b3f 0%, #202d42 100%);
  color: #fff;
}

.auth-panel-brand::before,
.auth-panel-brand::after {
  content: "";
  position: absolute;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.auth-panel-brand::before {
  width: 34rem;
  height: 34rem;
  top: -8rem;
  left: -10rem;
}

.auth-panel-brand::after {
  width: 28rem;
  height: 28rem;
  right: -10rem;
  bottom: -9rem;
}

.brand-content {
  position: relative;
  z-index: 1;
  min-height: 100%;
  display: grid;
  align-content: center;
  gap: 1.25rem;
  padding: 3rem 4rem;
}

.eyebrow-dark {
  color: rgba(255, 255, 255, 0.62);
}

.eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  max-width: 30rem;
  font-size: clamp(2.5rem, 3vw, 4rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.support-copy {
  margin: 0;
  max-width: 34rem;
  color: rgba(223, 232, 242, 0.74);
  font-size: 1.02rem;
  line-height: 1.6;
}

@media (max-width: 980px) {
  .auth-panel-brand {
    min-height: 18rem;
  }

  .brand-content {
    padding: 2rem;
  }
}
</style>