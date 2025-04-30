import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

document.title = "Damask Shop - Вейп магазин";

// Set meta description
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Каталог вейп-продукции Damask Shop с информацией о наличии товаров в магазинах.';
document.head.appendChild(metaDescription);

// Create link for favicon
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyLDJDMTAuMjIsMiA4LjUsMi40IDcuMDQsMy4xNUM3LjIxLDMuNTQgNy41LDQuMTIgNy43NCw0LjY4QzgsNS4yNyA4LjE5LDUuNzMgOC4yNCw2QzguNSw3LjU4IDguNSw5LjUgOCwxMS4zNkM3LjgyLDExLjk3IDcuNSwxMi43NCA3LjIxLDEzLjVDNi43MiwxNC44OSA2LjI2LDE2LjI2IDYuMjYsMTdDNi4yNiwxOC4zIDYuNTgsMTkuNDUgNy40NywyMC4yOEM4LjM3LDIxLjExIDkuNzYsMjEuNTggMTIsMjEuNThDMTQuMjQsMjEuNTggMTUuNjMsMjEuMTEgMTYuNTMsMjAuMjhDMTcuNDIsMTkuNDUgMTcuNzQsMTguMyAxNy43NCwxN0MxNy43NCwxNi4yNiAxNy4yOCwxNC44OSAxNi43OSwxMy41QzE2LjUsMTIuNzQgMTYuMTgsMTEuOTcgMTYsMTEuMzZDMTUuNSw5LjUgMTUuNSw3LjU4IDE1Ljc2LDZDMTUuODEsNS43MyAxNiw1LjI3IDE2LjI1LDQuNjhDMTYuNSw0LjEyIDE2Ljc5LDMuNTQgMTYuOTYsMy4xNUMxNS41LDIuNCAxMy43OCwyIDEyLDJaIiBmaWxsPSIjRkY1NzIyIi8+PC9zdmc+';
document.head.appendChild(favicon);

root.render(<App />);
