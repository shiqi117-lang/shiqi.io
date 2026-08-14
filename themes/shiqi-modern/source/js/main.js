(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const progress = document.querySelector('.reading-progress span');

  const updateThemeLabel = () => {
    if (themeButton) themeButton.setAttribute('aria-label', root.dataset.theme === 'dark' ? '切换浅色模式' : '切换深色模式');
  };

  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('color-theme', root.dataset.theme);
    updateThemeLabel();
  });
  updateThemeLabel();

  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  document.querySelectorAll('.article-content figure.highlight, .article-content pre').forEach(block => {
    if (block.closest('figure.highlight') && block.tagName === 'PRE') return;
    const button = document.createElement('button');
    button.className = 'copy-code';
    button.type = 'button';
    button.textContent = '复制';
    button.addEventListener('click', async () => {
      const code = block.querySelector('.code') || block.querySelector('code') || block;
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = '已复制';
        setTimeout(() => { button.textContent = '复制'; }, 1600);
      } catch (_) {
        button.textContent = '复制失败';
      }
    });
    block.appendChild(button);
  });
})();
