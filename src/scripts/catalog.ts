import type { Product } from '../types';

export function initCatalog(products: Product[]) {
  let activeCategory = 'todos';
  let searchQuery = '';

  function applyFilters() {
    const cards = document.querySelectorAll<HTMLElement>('.product-card');
    let visibleCount = 0;

    cards.forEach((card) => {
      let categories: string[] = [];
      try {
        categories = JSON.parse(card.getAttribute('data-category') || '[]');
      } catch {
        categories = [card.getAttribute('data-category') || ''];
      }
      const name = card.getAttribute('data-name') || '';
      const desc = card.getAttribute('data-desc') || '';
      const tag = card.getAttribute('data-tag') || '';

      const matchCategory =
        activeCategory === 'todos' ||
        categories.some(
          (c) =>
            c.toLowerCase() === activeCategory.toLowerCase() ||
            (activeCategory === 'chocolates/doces' && c.toLowerCase() === 'chocolates')
        );

      const matchSearch =
        searchQuery === '' ||
        name.includes(searchQuery) ||
        desc.includes(searchQuery) ||
        tag.includes(searchQuery) ||
        categories.some((c) => c.toLowerCase().includes(searchQuery));

      if (matchCategory && matchSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const countEl = document.getElementById('productsCount');
    if (countEl) {
      countEl.innerHTML =
        '<span>' +
        visibleCount +
        '</span> produto' +
        (visibleCount !== 1 ? 's' : '') +
        ' encontrado' +
        (visibleCount !== 1 ? 's' : '');
    }

    const noResults = document.getElementById('noResults');
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Category button clicks
  document.querySelectorAll<HTMLButtonElement>('.category-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.category-btn').forEach((b) => b.classList.remove('active'));
      this.classList.add('active');
      activeCategory = this.dataset.category || 'todos';
      searchQuery = '';
      const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
      if (searchInput) searchInput.value = '';
      applyFilters();
    });
  });

  // Search events
  const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener('focus', function () {
      const todosBtn = document.querySelector<HTMLButtonElement>('.category-btn[data-category="todos"]');
      if (todosBtn && activeCategory !== 'todos') {
        document.querySelectorAll('.category-btn').forEach((b) => b.classList.remove('active'));
        todosBtn.classList.add('active');
        activeCategory = 'todos';
        applyFilters();
      }
    });

    searchInput.addEventListener('input', function (e) {
      searchQuery = ((e.target as HTMLInputElement).value || '').toLowerCase().trim();
      applyFilters();
    });
  }

  // Mobile nav toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  // Modal functions
  function openModal(id: number) {
    const product = products.find((p) => p.id === id) || products.find((p) => p.id === 3);
    if (!product) return;

    const overlay = document.getElementById('productModal');
    const modalImg = document.getElementById('modalImg') as HTMLImageElement | null;
    const modalTag = document.getElementById('modalTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const modalUnit = document.getElementById('modalUnit');
    const modalWhatsapp = document.getElementById('modalWhatsapp') as HTMLAnchorElement | null;

    if (modalImg) {
      modalImg.src = product.image.startsWith('/') ? product.image : '/' + product.image;
      modalImg.alt = product.name;
    }
    if (modalTag) {
      modalTag.textContent = product.tag;
      modalTag.className = 'modal-tag ' + product.tagClass;
    }
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalDesc) modalDesc.textContent = product.desc;
    if (modalPrice) modalPrice.textContent = product.price.toFixed(2).replace('.', ',');
    if (modalUnit) modalUnit.textContent = '/ ' + product.unit;

    if (modalWhatsapp) {
      const waMsg = encodeURIComponent(
        'Olá! Tenho interesse no produto: ' +
          product.name +
          ' - R$ ' +
          product.price.toFixed(2).replace('.', ',') +
          '/' +
          product.unit
      );
      modalWhatsapp.href = 'https://wa.me/5541987106153?text=' + waMsg;
    }

    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    const overlay = document.getElementById('productModal');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Modal triggers via event delegation
  document.addEventListener('click', function (e) {
    const btn = (e.target as Element).closest<HTMLButtonElement>('.product-btn');
    if (btn && btn.getAttribute('data-product-id')) {
      openModal(Number(btn.getAttribute('data-product-id')));
    }
  });

  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', closeModal);

  const productModal = document.getElementById('productModal');
  if (productModal) {
    productModal.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
}
