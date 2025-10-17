export function customCursor(inputClass, cursorClass) {
    const inputs = document.querySelectorAll(inputClass);

    inputs.forEach(input => {
        const wrapper = input.closest('.input-wrapper');
        const caret = wrapper.querySelector(cursorClass);

        if (!caret) return;

        function updateCaret() {
            // text before caret
            const text = input.value.substring(0, input.selectionStart);

            // measure width of that text
            const span = document.createElement("span");
            span.style.visibility = "hidden";
            span.style.position = "absolute";
            span.style.whiteSpace = "pre";
            span.style.font = window.getComputedStyle(input).font;
            span.textContent = text;
            document.body.appendChild(span);

            const textWidth = span.offsetWidth;
            document.body.removeChild(span);

            // input padding
            const inputStyle = window.getComputedStyle(input);
            const paddingLeft = parseInt(inputStyle.paddingLeft, 20);

            // account for scroll inside input
            const scrollOffset = input.scrollLeft;

            // final caret position
            caret.style.left = (paddingLeft + textWidth - scrollOffset) + "px";
        }

        input.addEventListener("focus", () => {
            caret.style.display = "inline-block";
            updateCaret();
        });

        input.addEventListener("blur", () => {
            caret.style.display = "none";
        });

        ["input", "click", "keyup", "keydown", "scroll"].forEach(evt => {
            input.addEventListener(evt, updateCaret);
        });
    });
}