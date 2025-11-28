import React from "react";
import { useParams } from "react-router-dom";
import GoBackButton from "../components/buttons/GoBackButton.jsx";

export default function DetailPage() {
    const { id } = useParams();

    return (
        <div>
            <GoBackButton />
            <h1>detail of {id}</h1>
        </div>
    );
}
