import React from "react";
import { Trash2 } from "lucide-react";

/**
 * Komponenta, která zobrazuje pouze ikonu koše (bez textu).
 * Lze připojit onClick handler a použít např. jako malé delete tlačítko.
 */
export default function DeleteButton({ onClick, disabled = false, size = 20 }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="text-red-600 hover:text-red-700 disabled:opacity-50"
            aria-label="Smazat"
        >
            <Trash2 width={size} height={size} />
        </button>
    );
}
