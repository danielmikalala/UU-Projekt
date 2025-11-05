import React from "react";
import DeleteButton from "./DeleteButton";

export default function UserDeletion() {
    return (
        <div>
            <h2>Uživatel</h2>
            <DeleteButton onClick={() => alert("Smazáno!")} />
        </div>
    );
}
