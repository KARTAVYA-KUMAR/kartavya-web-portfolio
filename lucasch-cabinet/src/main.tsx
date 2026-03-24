import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import About from "./app/pages/about/index";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <div className="flex flex-col w-screen h-screen relative overflow-hidden bg-transparent max-h-screen">
            <div className="flex flex-1 flex-col">
                <About />
            </div>
        </div>
    </StrictMode>
);

// Tunnel absolute native smooth scrolling upwards out of the nested iframe
window.addEventListener("wheel", (e) => {
    window.parent.postMessage({ type: "iframe-scroll", deltaY: e.deltaY }, "*");
}, { passive: true });

// Optional mobile touch tunneling
let startY = 0;
window.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
}, { passive: true });
window.addEventListener("touchmove", (e) => {
    // Determine target validity to prevent stalling physical cabinet file dragging natively
    const target = e.target as HTMLElement;
    const isDraggingFile = target.closest('.file-card') || target.closest('.file-tab-wrapper');

    if (!isDraggingFile) {
        const deltaY = startY - e.touches[0].clientY;
        startY = e.touches[0].clientY;
        window.parent.postMessage({ type: "iframe-scroll", deltaY }, "*");
    }
}, { passive: true });

// Tunnel mouse movement parameters explicitly targeting Parent Grid Crosshairs reliably
window.addEventListener("mousemove", (e) => {
    window.parent.postMessage({ type: "iframe-mousemove", clientX: e.clientX, clientY: e.clientY }, "*");
}, { passive: true });

window.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget) {
        window.parent.postMessage({ type: "iframe-mouseout" }, "*");
    }
});
