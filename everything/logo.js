document.addEventListener('DOMContentLoaded', () => {
  // const logo = `
  //   <div class="logo">
  //     <a href="/">
  //       <img src="/assets/logo.png" alt="logo" />
  //     </a>
  //   </div>
  // `;
  const logo = document.createElement('div');
  logo.classList.add('logo');
  const img = document.createElement('img');
  img.src = '/assets/logo.png';
  img.alt = 'logo';
  const a = document.createElement('a');
  a.href = '/';
  a.appendChild(img);
  logo.appendChild(a);
  document.body.appendChild(logo);
});
