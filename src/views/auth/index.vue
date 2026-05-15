<template>
  <div
    class="relative grid min-h-dvh overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 lg:grid-cols-[1fr_480px]"
  >
    <!-- Decorative elements -->
    <div
      class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[length:48px_48px]"
    />
    <div
      class="pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]"
    />
    <div
      class="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[100px]"
    />

    <!-- Left: Branding panel -->
    <section
      class="relative z-10 hidden h-full flex-col justify-between px-16 py-16 lg:flex"
    >
      <div>
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20"
          >
            A
          </div>
          <span class="text-lg font-semibold text-slate-900">Admin</span>
        </div>
      </div>

      <div class="max-w-md">
        <h1
          class="text-[40px] font-bold leading-[1.15] tracking-tight text-slate-900"
        >
          高效管理
          <span class="text-blue-600">后台系统</span>
        </h1>
        <p class="mt-4 text-base leading-relaxed text-slate-500">
          一站式管理平台，涵盖用户、权限、数据看板等功能模块，助力团队高效协作。
        </p>
      </div>

      <div class="flex items-center gap-6 text-sm text-slate-400">
        <span>&copy; 2026 Admin</span>
        <span class="h-3 w-px bg-slate-200" />
        <span>Vue 3 &middot; TypeScript &middot; Tailwind CSS</span>
      </div>
    </section>

    <!-- Right: Login form panel -->
    <section
      class="relative z-10 flex min-h-dvh items-center justify-center px-5 py-8 lg:min-h-full lg:bg-white lg:shadow-[-8px_0_40px_rgba(0,0,0,0.04)]"
    >
      <div class="w-full max-w-100">
        <router-view />
      </div>
    </section>
  </div>
</template>
