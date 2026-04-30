/**
 * 自定义 JavaScript 增强功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动到锚点
    smoothScrollToAnchor();
    
    // 代码块复制成功提示
    codeCopySuccess();
    
    // 目录导航高亮
    highlightActiveNav();
    
    // 图片懒加载
    lazyLoadImages();
    
    // 表格响应式处理
    makeTablesResponsive();
    
    // 添加返回顶部按钮
    addBackToTopButton();
    
    // 搜索框增强
    enhanceSearch();
});

/**
 * 平滑滚动到锚点
 */
function smoothScrollToAnchor() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 代码块复制成功提示
 */
function codeCopySuccess() {
    document.addEventListener('copy', function(e) {
        const target = e.target;
        if (target.tagName === 'CODE' || target.closest('pre')) {
            showToast('代码已复制到剪贴板');
        }
    });
}

/**
 * 显示提示消息
 */
function showToast(message, type = 'success') {
    // 移除之前的提示
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新提示
    const toast = document.createElement('div');
    toast.className = `custom-toast custom-toast--${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // 3秒后自动消失
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 目录导航高亮
 */
function highlightActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.md-nav__link');
    
    window.addEventListener('scroll', function() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('md-nav__link--active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('md-nav__link--active');
            }
        });
    });
}

/**
 * 图片懒加载
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * 表格响应式处理
 */
function makeTablesResponsive() {
    document.querySelectorAll('table').forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        wrapper.style.cssText = `
            overflow-x: auto;
            border-radius: 12px;
            margin: 16px 0;
        `;
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
}

/**
 * 添加返回顶部按钮
 */
function addBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
}

/**
 * 搜索框增强
 */
function enhanceSearch() {
    const searchInput = document.querySelector('input.md-search-query');
    
    if (searchInput) {
        // 聚焦时添加动画效果
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    }
}

/**
 * 代码块行号点击跳转
 */
function addLineNumberClick() {
    document.querySelectorAll('.linenos a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lineNumber = this.textContent.trim();
            const codeLine = this.closest('table').querySelector(`.code .lineno-${lineNumber}`);
            
            if (codeLine) {
                codeLine.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                codeLine.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                setTimeout(() => {
                    codeLine.style.backgroundColor = '';
                }, 2000);
            }
        });
    });
}

// 页面加载完成后执行额外初始化
setTimeout(() => {
    addLineNumberClick();
}, 1000);
