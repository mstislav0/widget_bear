# Bear Widget

An interactive animated bear that lives on your webpage. It walks toward your cursor, jumps onto buttons and links, looks at you, waves when idle, and says something when clicked.

## Files

| File | Description |
|---|---|
| `bear-widget.js` | Self-contained Web Component — no dependencies |
| `demo.html` | Interactive demo page showing all behaviors |

## Usage

Add two lines to any HTML page:

```html
<script src="bear-widget.js"></script>
<bear-widget></bear-widget>
```

That's it. The bear appears in the bottom-right corner and starts interacting with the page.

## Behaviors

- **Walks** toward the mouse cursor across the page
- **Jumps onto** buttons and links when hovering near them
- **Looks** at the cursor (head rotation follows mouse)
- **Waves** when idle (no movement for a few seconds)
- **Squashes & stretches** on landing for a bouncy feel
- **Says something** when clicked (speech bubble)
- **Turns its back** when climbing up to elevated elements

## Customization

The widget is a native Web Component (`<bear-widget>`). No build tools or npm required — just drop the script tag in and it works.

## Browser Support

Works in all modern browsers that support Web Components (Custom Elements + Shadow DOM).
