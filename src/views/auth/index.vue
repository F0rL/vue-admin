<template>
  <div
    class="relative grid h-full min-h-full overflow-hidden bg-[linear-gradient(135deg,#f4f7fb_0%,#eef3f8_48%,#f8fafc_100%)] lg:grid-cols-[minmax(0,1.12fr)_minmax(420px,520px)]"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[length:32px_32px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.42),transparent_88%)]"
    ></div>
    <div
      class="pointer-events-none absolute left-[-10%] top-[10%] h-[38rem] w-[38rem] rounded-full bg-[rgba(30,64,175,0.14)] blur-[90px]"
    ></div>
    <div
      class="pointer-events-none absolute bottom-[-18%] right-[-8%] h-[32rem] w-[32rem] rounded-full bg-[rgba(8,145,178,0.12)] blur-[90px]"
    ></div>

    <section
      class="relative z-10 hidden h-full flex-col justify-center px-12 py-10 lg:flex xl:px-16"
    >
      <h1
        class="mt-7 max-w-[12ch] text-4xl font-bold leading-tight tracking-[-0.03em] text-slate-900 xl:text-5xl"
      >
        现代化后台管理系统登录入口
      </h1>
      <p class="mt-5 max-w-[620px] text-[17px] leading-8 text-slate-600">
        基于 Vue 3、TypeScript、Pinia 与 Tailwind CSS
        构建，页面风格参考主流后台管理系统，强调清晰、稳定与可扩展。
      </p>

      <div class="mt-10 grid max-w-[640px] gap-4">
        <div
          class="rounded-[22px] border border-slate-200/70 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur"
        >
          <span
            class="mb-2.5 inline-block text-xs font-bold uppercase tracking-[0.08em] text-teal-700"
          >
            统一体验
          </span>
          <strong class="block text-lg font-bold text-slate-900">
            登录、权限、路由组织保持一致
          </strong>
          <p class="mt-2 text-sm leading-7 text-slate-500">
            适合作为后台模板后续继续扩展工作台、系统管理、数据看板等能力。
          </p>
        </div>
        <div
          class="rounded-[22px] border border-slate-200/70 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur"
        >
          <span
            class="mb-2.5 inline-block text-xs font-bold uppercase tracking-[0.08em] text-teal-700"
          >
            快速接入
          </span>
          <strong class="block text-lg font-bold text-slate-900">
            Element Plus + 按需引入
          </strong>
          <p class="mt-2 text-sm leading-7 text-slate-500">
            减少样式和组件重复建设，后续表单、表格、弹窗都可直接复用。
          </p>
        </div>
      </div>
    </section>

    <section
      class="relative z-10 flex min-h-full items-center justify-center px-4 py-4 sm:px-6 lg:px-8"
    >
      <div class="w-full max-w-[460px]">
        <router-view />
      </div>
    </section>
  </div>
</template>
