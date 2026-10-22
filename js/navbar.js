async function loadNavbar() {
  const mount = document.querySelector('#site-nav');

  if (!mount) return;

  try {
    const response = await fetch('/navbar.html');

    if (!response.ok) {
      throw new Error(`Nie udało się wczytać navbara: ${response.status}`);
    }

    mount.innerHTML = await response.text();
    initializeNavbar(mount);
  } catch (error) {
    console.error(error);
  }
}

function initializeNavbar(mount) {
  const menuBtn = mount.querySelector('#menuBtn');
  const mobileMenu = mount.querySelector('#mobileMenu');
  const desktopMenu = mount.querySelector('#desktopMenu');
  const mobileMenuItems = mount.querySelector('#mobileMenuItems');

  if (!menuBtn || !mobileMenu || !desktopMenu || !mobileMenuItems) return;

  mobileMenuItems.replaceChildren(...[...desktopMenu.children].map((group) => {
    const accordion = document.createElement('div');
    const button = document.createElement('button');
    const panel = document.createElement('div');
    const title = group.querySelector(':scope > a').cloneNode(true);

    title.querySelector('span')?.remove();

    accordion.className = 'mobile-accordion';
    button.className = 'w-full flex items-center justify-between py-3 font-mono text-[11px] uppercase tracking-widest text-ink/90 border-b border-ink/10';
    button.append(title.textContent.trim(), Object.assign(document.createElement('span'), {
      className: 'text-[10px] transition-transform duration-200',
      textContent: '▾',
    }));
    panel.className = 'hidden pl-4 pb-2 space-y-1';

    group.querySelectorAll(':scope > div a').forEach((link) => {
      const mobileLink = link.cloneNode(true);
      mobileLink.className = 'block py-2 text-xs text-ink/75 hover:text-crimson';
      panel.append(mobileLink);
    });

    accordion.append(button, panel);
    return accordion;
  }));

  const accordionButtons = mobileMenuItems.querySelectorAll('.mobile-accordion button');

  function setMenu(open) {
    mobileMenu.classList.toggle('hidden', !open);
    menuBtn.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }

  menuBtn.addEventListener('click', () => {
    setMenu(mobileMenu.classList.contains('hidden'));
  });

  accordionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.nextElementSibling;
      const shouldOpen = panel.classList.contains('hidden');

      accordionButtons.forEach((item) => {
        item.nextElementSibling.classList.add('hidden');
        item.querySelector('span').style.transform = '';
      });

      if (shouldOpen) {
        panel.classList.remove('hidden');
        button.querySelector('span').style.transform = 'rotate(180deg)';
      }
    });
  });

  mobileMenuItems.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });
}

loadNavbar();
