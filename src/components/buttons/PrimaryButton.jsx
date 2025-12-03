import React from "react";

export default function PrimaryButton({
  onClick,
  children,
  type = "button",
  className = "",
  icon = null,
  variant = "dark",
}) {
  const variantClass =
    variant === "light"
      ? "primary-button primary-button--light"
      : "primary-button";
  const hasText =
    children !== undefined && children !== null && children !== "";
  const hasIcon = !!icon;

  const gapClass = hasIcon && hasText ? "gap-2" : "gap-0";
  const sizeClass =
    hasIcon && !hasText
      ? "w-9 h-9 p-0 justify-center" //icon button
      : "px-3 py-2";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${variantClass} ${gapClass} ${sizeClass} ${className}`}
    >
      {hasIcon ? <span className="inline-flex">{icon}</span> : null}
      {hasText ? <span>{children}</span> : null}
    </button>
  );
}
