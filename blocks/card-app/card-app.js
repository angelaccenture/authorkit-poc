export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    row.classList.add('card-app-item');
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells[0]) cells[0].classList.add('card-app-icon');
    if (cells[1]) cells[1].classList.add('card-app-content');
  });
}
