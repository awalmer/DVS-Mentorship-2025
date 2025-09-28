// Create the dialog element and append it directly to the body once
const dialog = document.createElement('div');
dialog.id = 'dialog';
document.body.appendChild(dialog);

const circles = document.querySelectorAll('.tooltip-circle');

circles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    const svg = circle.ownerSVGElement;
    const point = svg.createSVGPoint();

    point.x = +circle.getAttribute('cx');
    point.y = +circle.getAttribute('cy');

    // Convert to screen coordinates
    const screenPoint = point.matrixTransform(svg.getScreenCTM());

    // Add scroll offsets to convert viewport coords to document coords
    const left = screenPoint.x + window.scrollX + 10;  // 10px offset to right
    const top = screenPoint.y + window.scrollY - 10;   // 10px offset upward

    // Example: split tooltip text into title and body for demonstration
    const tooltipText = circle.getAttribute('data-tooltip') || "";

    // Replace literal "\n" strings with actual newlines
    const processedText = tooltipText.replace(/\\n/g, '\n');

    const lines = processedText.split('\n');
    const title = lines[0];
    const body = lines.slice(1).join('<br>');

    // Use innerHTML to allow bold title & multiline
    dialog.innerHTML = `
      <div class="dialog-title">${title}</div>
      <div class="dialog-body">${body}</div>
    `;

    dialog.style.left = `${left}px`;
    dialog.style.top = `${top}px`;
    dialog.style.display = 'block';
  });

  circle.addEventListener('mouseleave', () => {
    dialog.style.display = 'none';
  });
});
