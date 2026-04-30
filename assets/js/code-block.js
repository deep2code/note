document.addEventListener('DOMContentLoaded', function() {
  // 为所有代码块添加折叠功能
  document.querySelectorAll('div.highlight').forEach(function(block) {
    // 获取语言信息
    let lang = 'code';
    const langElement = block.querySelector('span.language');
    if (langElement) {
      lang = langElement.textContent.trim();
    } else {
      // 尝试从class中提取语言
      const classList = block.className.split(' ');
      for (const cls of classList) {
        if (cls.startsWith('language-')) {
          lang = cls.replace('language-', '');
          break;
        }
      }
    }

    // 创建包装器
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    // 创建头部
    const header = document.createElement('div');
    header.className = 'code-block-header';
    header.innerHTML = `
      <span class="code-lang">${lang}</span>
      <span class="toggle-icon">▶</span>
    `;

    // 创建内容容器
    const content = document.createElement('div');
    content.className = 'code-block-content';

    // 重新组织DOM结构
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(header);
    wrapper.appendChild(content);
    content.appendChild(block);

    // 添加点击事件
    header.addEventListener('click', function() {
      header.classList.toggle('collapsed');
      content.classList.toggle('collapsed');
      const icon = header.querySelector('.toggle-icon');
      icon.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
    });

    // 默认展开
    content.classList.remove('collapsed');
    header.classList.remove('collapsed');
    header.querySelector('.toggle-icon').textContent = '▼';
  });
});